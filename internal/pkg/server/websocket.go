package server

import (
	"os"
	"strings"
	"time"

	"github.com/labstack/echo/v4"
	"golang.org/x/net/websocket"
)

type clientMessage struct {
	Kind string `json:"kind"`
	Data any    `json:"data,omitempty"`
}

func newClientMessage(kind string, data any) *clientMessage {
	return &clientMessage{kind, data}
}

func (s *Server) websocketHandler(c echo.Context) error {
	c.Response().Header().Set("Content-Type", "application/json")

	websocket.Handler(func(ws *websocket.Conn) {
		s.logger.Debug("websocket client connected")

		s.wsMu.Lock()
		if s.wsConn != nil {
			s.logger.Debug("closing previous websocket connection")
			s.wsConn.Close()
		}

		s.wsConn = ws
		s.wsMu.Unlock()

		keepAliveTicker := time.NewTicker(30 * time.Second)

		defer func() {
			keepAliveTicker.Stop()
			s.logger.Debug("websocket client disconnected")
			s.wsMu.Lock()
			ws.Close()
			s.wsConn = nil
			s.wsMu.Unlock()
		}()

		if !s.sendInitClientMessage() {
			return
		}

		for {
			select {
			case <-s.ctx.Done():
				s.logger.Debug("main context closed, closing websocket connection")
				return
			case <-keepAliveTicker.C:
				if !s.sendClientMessage(newClientMessage("keepalive", nil)) {
					return
				}
			}
		}
	}).ServeHTTP(c.Response(), c.Request())

	return nil
}

func (s *Server) sendClientMessage(msg *clientMessage) (sent bool) {
	s.wsMu.Lock()
	defer s.wsMu.Unlock()

	if s.wsConn == nil {
		return false
	}

	if err := websocket.JSON.Send(s.wsConn, msg); err != nil {
		s.logger.Error("failed sending message to websocket client", logKeyError, err)
		return false
	}

	return true
}

func (s *Server) sendInitClientMessage() (sent bool) {
	root := s.root

	if home, err := os.UserHomeDir(); err == nil {
		if strings.HasPrefix(root, home) {
			root = "~" + root[len(home):]
		}
	}

	return s.sendClientMessage(newClientMessage("init", map[string]string{
		"state": s.state.String(),
		"root":  root,
	}))
}
