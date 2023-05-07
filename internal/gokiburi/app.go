package gokiburi

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"time"

	"github.com/charmbracelet/log"

	"github.com/michenriksen/gokiburi/internal/pkg/config"
	"github.com/michenriksen/gokiburi/internal/pkg/coverparser"
	"github.com/michenriksen/gokiburi/internal/pkg/runner"
	"github.com/michenriksen/gokiburi/internal/pkg/server"
	"github.com/michenriksen/gokiburi/internal/pkg/state"
	"github.com/michenriksen/gokiburi/internal/pkg/watcher"
)

const (
	logKeyPath = "path"
	logKeyOp   = "op"
	logKeyErr  = "error"
)

// Option configures an [App].
type Option func(*App)

// App for gokiburi.
//
// Acts as the central point of the application.
type App struct {
	ctx       context.Context
	ctxCancel context.CancelFunc
	state     state.State
	dir       string
	config    *config.Config
	stdout    io.Writer
	stderr    io.Writer
	stdin     io.Reader
	logger    *log.Logger
	watcher   *watcher.Watcher
	runner    *runner.Runner
	server    *server.Server
	parser    *coverparser.Parser
}

// New App returns a new app.
//
// Call [App.Init] to further initialize the application.
func New(opts ...Option) *App {
	ctx, cancel := context.WithCancel(context.Background())

	app := &App{
		ctx:       ctx,
		ctxCancel: cancel,
		state:     state.Init,
		stdout:    os.Stdout,
		stderr:    os.Stderr,
		stdin:     os.Stdin,
	}

	for _, opt := range opts {
		opt(app)
	}

	return app
}

// Init application with configuration, root directory, and initializer functions.
func (a *App) Init(cfg *config.Config, dir string, inits ...Initializer) error {
	a.config = cfg
	a.dir = dir

	for _, initFunc := range inits {
		if err := initFunc(a); err != nil {
			return fmt.Errorf("initializing app: %w", err)
		}
	}

	return nil
}

func (a *App) Run() {
	a.logger.Info("starting gokiburi...", "version", Version())
	a.logger.Debug("debugging is enabled")

	a.watcher = watcher.New(a.ctx, a.dir,
		watcher.WithLogger(a.logger.WithPrefix("watcher")),
		watcher.WithSkipPaths(a.config.SkipPaths...),
	)
	a.runner = runner.New(a.ctx, a.dir,
		runner.WithLogger(a.logger.WithPrefix("runner")),
		runner.WithCovermode(a.config.Covermode),
		runner.WithShuffle(a.config.Shuffle),
		runner.WithRaceDetection(a.config.RaceDetection),
		runner.WithShort(a.config.Short),
		runner.WithTimeout(a.config.Timeout),
	)
	a.server = server.New(a.ctx, a.dir,
		server.WithLogger(a.logger.WithPrefix("server")),
	)
	a.parser = coverparser.New(a.ctx, a.dir,
		coverparser.WithLogger(a.logger.WithPrefix("coverparser")),
	)

	a.startServer()
	a.startWatcher()
	a.setState(state.Ready)

	for {
		select {
		case cmd, ok := <-a.server.Commands:
			if !ok {
				continue
			}

			a.handleCommand(cmd)
		case event, ok := <-a.watcher.Events:
			if !ok {
				continue
			}

			a.handleEvent(event)
		}
	}
}

func (a *App) Cancel() {
	a.stdout.Write([]byte("\r")) //nolint:errcheck // we don't care if this write fails.
	a.logger.Warn("caught interrupt; shutting down...")
	a.setState(state.Closing)

	a.ctxCancel()
	a.server.Close()

	time.Sleep(2 * time.Second)
}

func (a *App) handleCommand(cmd *server.Command) {
	switch cmd.Instruction {
	case server.Pause:
		a.logger.Info("pausing automatic test runs")
		a.setState(state.Paused)
	case server.Resume:
		a.logger.Info("resuming automatic test runs")
		a.setState(state.Ready)
	case server.RunTests:
		a.runTests(cmd.Data)
	}
}

func (a *App) handleEvent(event *watcher.EventBatch) {
	for path, op := range event.Events {
		a.logger.Debug("watcher event", logKeyPath, path, logKeyOp, op)
	}

	pkgMap := make(map[string]struct{})

	for _, path := range event.Paths() {
		if _, ok := pkgMap[path]; ok {
			continue
		}

		pkg, err := a.runner.PackageForFile(path)
		if err != nil {
			a.logger.Error("error determining package for file", logKeyErr, err)
			continue
		}

		pkgMap[pkg] = struct{}{}
	}

	pkgs := make([]string, 0, len(pkgMap))

	for pkg := range pkgMap {
		pkgs = append(pkgs, pkg)
	}

	a.runTests(pkgs...)
}

func (a *App) setState(s state.State) {
	a.state = s
	a.server.SetState(s)
}

func (a *App) startServer() {
	go func() {
		if err := a.server.Serve(a.config.ListenAddress, a.config.ListenPort); err != nil {
			if a.state != state.Closing {
				a.logger.Fatal("server error", logKeyErr, err)
			}
		}
	}()
}

func (a *App) startWatcher() {
	if err := a.watcher.Watch(); err != nil {
		a.logger.Fatal("error starting watcher", logKeyErr, err)
	}
}

func (a *App) runTests(pkgs ...string) { //nolint:revive // logic is easy enough to follow.
	if a.state != state.Ready {
		a.logger.Debug("skipping test run when state is not ready", "state", a.state)
		return
	}

	go func() {
		a.setState(state.Running)
		defer a.setState(state.Ready)

		result, err := a.runner.Run(pkgs...)
		if err != nil {
			a.logErrorAndNotify(err, "test runner failed with error")

			return
		}

		if result.Error != "" {
			a.logger.Info("skipping coverage report parsing for result with error")
			a.addResult(result)

			if err = result.Close(); err != nil {
				a.logger.Error("error closing test result", logKeyErr, err)
			}

			return
		}

		if result.Tests == 0 {
			a.logger.Info("skipping coverage report parsing for result with no tests")
			a.addResult(result)

			if err = result.Close(); err != nil {
				a.logger.Error("error closing test result", logKeyErr, err)
			}

			return
		}

		rdir := result.Dir()

		f, err := os.Open(filepath.Join(rdir, "coverprofile.out"))
		if err != nil {
			a.logErrorAndNotify(err, "failed to open coverage profile for test result")

			return
		}

		defer f.Close()

		report, err := a.parser.Parse(f)
		if err != nil {
			a.logErrorAndNotify(err, "coverage profile parser failed with error")

			return
		}

		data, err := json.Marshal(report)
		if err != nil {
			a.logErrorAndNotify(err, "failed to encode coverage report to JSON")

			return
		}

		if err := os.WriteFile(filepath.Join(rdir, "report.json"), data, 0o600); err != nil {
			a.logErrorAndNotify(err, "failed writing coverage report to file")

			return
		}

		a.addResult(result)
	}()
}

func (a *App) addResult(r *runner.Result) {
	if r == nil {
		return
	}

	a.server.AddResult(r)
}

func (a *App) logErrorAndNotify(err error, format string, args ...any) {
	msg := fmt.Sprintf(format, args...)

	a.logger.Error(msg, logKeyErr, err)
	a.server.SendNotification("error", msg)
}
