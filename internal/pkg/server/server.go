package server

import (
	"bytes"
	"context"
	"crypto/rand"
	"crypto/sha1" // #nosec:G505 // SHA1 is used for non-sensitive notification tags.
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"mime"
	"net"
	"net/http"
	"path"
	"strconv"
	"sync"
	"time"

	"github.com/charmbracelet/log"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"golang.org/x/net/websocket"

	"github.com/michenriksen/gokiburi/internal/pkg/runner"
	"github.com/michenriksen/gokiburi/internal/pkg/state"
	"github.com/michenriksen/gokiburi/web"
)

const (
	defaultMaxResults = 50

	logKeyUUID  = "uuid"
	logKeyError = "error"

	cspFmt = "default-src 'self' 'nonce-%s'; style-src 'self' 'unsafe-inline'; img-src 'self' data:"
)

// Option configures a [Server].
type Option func(*Server)

// Server for serving web UI and API.
type Server struct {
	Commands   chan *Command
	ctx        context.Context
	root       string
	router     *echo.Echo
	state      state.State
	logger     *log.Logger
	results    []*runner.Result
	resultsMu  sync.RWMutex
	wsConn     *websocket.Conn
	wsMu       sync.Mutex
	maxResults int
}

// New Server for serving web UI and API.
func New(ctx context.Context, rootDir string, opts ...Option) *Server {
	router := echo.New()
	router.HideBanner = true
	router.HidePort = true

	router.Use(middleware.Recover())
	router.Use(middleware.Secure())

	s := &Server{
		Commands:   make(chan *Command, 1),
		ctx:        ctx,
		root:       rootDir,
		router:     router,
		state:      state.Init,
		logger:     log.New(io.Discard),
		maxResults: defaultMaxResults,
	}

	for _, opt := range opts {
		opt(s)
	}

	return s
}

// Serve requests on host and port.
func (s *Server) Serve(host string, port int) error {
	if err := s.registerAPIHandlers(); err != nil {
		return fmt.Errorf("registering API handlers: %w", err)
	}

	if err := s.registerHandlers(); err != nil {
		return fmt.Errorf("registering static asset handler: %w", err)
	}

	address := net.JoinHostPort(host, strconv.Itoa(port))

	s.logger.Info(fmt.Sprintf("web server listening on %s", address), "url", "http://"+address+"/")

	if err := s.router.Start(address); err != nil {
		return fmt.Errorf("starting router on %s: %w", address, err)
	}

	return nil
}

// Close server.
func (s *Server) Close() error {
	s.logger.Info("shutting down")

	close(s.Commands)

	s.clearResults()

	if err := s.router.Shutdown(context.Background()); err != nil {
		return fmt.Errorf("closing router: %w", err)
	}

	return nil
}

// AddResult to be served via the API.
//
// Prepends the result to the internal result slice. Slice is trimmed if its
// length exceeds configured max results.
func (s *Server) AddResult(r *runner.Result) {
	if r.Error == "" && r.Tests == 0 {
		s.sendClientMessage(newClientMessage("resultEmpty", r))
		return
	}

	s.resultsMu.Lock()
	defer s.resultsMu.Unlock()

	// Prepend result to beginning of slice.
	s.results = append(s.results, nil)
	copy(s.results[1:], s.results)
	s.results[0] = r

	// Trim slice if length has become too big.
	if len(s.results) > s.maxResults {
		for i := s.maxResults; i < len(s.results); i++ {
			s.logger.Debug(fmt.Sprintf("closing and trimming old result at index %d", i), "uuid", s.results[i].UUID)
			s.results[i].Close()
		}

		s.results = s.results[0:s.maxResults]
	}

	s.sendClientMessage(newClientMessage("result", r))
}

// SetState for server.
func (s *Server) SetState(newState state.State) {
	s.state = newState
	s.sendClientMessage(newClientMessage("state", s.state))
}

// SendNotification to display as a toaster message in the web UI.
func (s *Server) SendNotification(kind, bodyFmt string, args ...any) {
	body := fmt.Sprintf(bodyFmt, args...)
	sha := sha1.New() //#nosec:G401 // We don't need a cryptographically secure hash notification tags.
	sha.Sum([]byte(time.Now().String()))
	sha.Sum([]byte(kind))
	sha.Sum([]byte(body))

	s.sendClientMessage(newClientMessage("notification", &notification{
		kind,
		body,
		base64.RawURLEncoding.EncodeToString(sha.Sum(nil)),
	}))
}

// Reset server to initial state.
//
// Sets the state to [state.Init], clears results, and closes all long poll
// subscriptions.
//
// Note: This is mainly used for testing purposes.
func (s *Server) Reset() {
	s.state = state.Init
	s.clearResults()
}

func (s *Server) getResults() []*runner.Result {
	s.resultsMu.RLock()
	defer s.resultsMu.RUnlock()

	c := make([]*runner.Result, len(s.results))
	copy(c, s.results)

	return c
}

func (s *Server) resultByUUID(uuid string) *runner.Result {
	for _, r := range s.getResults() {
		if r.UUID == uuid {
			return r
		}
	}

	return nil
}

func (s *Server) clearResults() {
	s.resultsMu.Lock()
	defer s.resultsMu.Unlock()

	for _, result := range s.results {
		result.Close()
	}

	s.logger.Info("cleared current test results")

	s.results = nil
}

func (s *Server) sendCommand(cmd *Command) {
	s.Commands <- cmd
}

func (*Server) indexHandler(c echo.Context) error {
	index, err := web.StaticAssetFS.ReadFile("app/build/index.html")
	if err != nil {
		return fmt.Errorf("reading index.html: %w", err)
	}

	nonce, err := genNonce()
	if err != nil {
		return fmt.Errorf("generating nonce: %w", err)
	}

	modified := bytes.ReplaceAll(index, []byte("<script"), []byte(`<script nonce="`+nonce+`"`))
	if len(modified) == len(index) {
		return fmt.Errorf("CSP nonce not injected into any script tags in index.html")
	}

	c.Response().Header().Add("Content-Security-Policy", cspWithNonce(nonce))

	return c.HTMLBlob(http.StatusOK, modified)
}

func (s *Server) staticOrIndexHandler(c echo.Context) error {
	reqPath := c.Request().URL.Path

	static, err := web.StaticAssetFS.Open(path.Join("app/build", reqPath))
	if err != nil {
		if errors.Is(err, fs.ErrNotExist) {
			return s.indexHandler(c)
		}

		return fmt.Errorf("opening static file: %w", err)
	}

	return c.Stream(http.StatusOK, mime.TypeByExtension(path.Ext(reqPath)), static)
}

func (s *Server) registerHandlers() error {
	s.router.GET("/", s.indexHandler)
	s.router.GET("/ws", s.websocketHandler)
	s.router.GET("/*", s.staticOrIndexHandler)

	return nil
}

func (s *Server) registerAPIHandlers() error {
	g := s.router.Group("/api")

	g.Use(apiHeaders())

	g.GET("/results", s.resultsHandler)
	g.GET("/results/:uuid/report", s.reportHandler)
	g.DELETE("/results", s.clearResultsHandler)
	g.PUT("/state/pause", s.pauseHandler)
	g.PUT("/state/resume", s.resumeHandler)
	g.POST("/run", s.runHandler)

	return nil
}

// WithLogger configures [Server] with a logger.
func WithLogger(logger *log.Logger) Option {
	return func(s *Server) {
		s.logger = logger
	}
}

func genNonce() (string, error) {
	b := make([]byte, 16)

	n, err := rand.Read(b)
	if err != nil {
		return "", fmt.Errorf("generating random bytes: %w", err)
	}

	if n != len(b) {
		return "", fmt.Errorf("generating random bytes: short read (expected %d, got %d)", len(b), n)
	}

	return base64.RawURLEncoding.EncodeToString(b), nil
}

func cspWithNonce(nonce string) string {
	return fmt.Sprintf(cspFmt, nonce)
}
