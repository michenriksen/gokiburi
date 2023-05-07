package server_test

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/charmbracelet/log"
	"github.com/stretchr/testify/require"
	"golang.org/x/net/websocket"

	"github.com/michenriksen/gokiburi/internal/pkg/runner"
	"github.com/michenriksen/gokiburi/internal/pkg/server"
	"github.com/michenriksen/gokiburi/internal/pkg/state"
)

type wsMsg struct {
	Kind string `json:"kind"`
	Data any    `json:"data"`
}

type wsInitMsg struct {
	Kind string            `json:"kind"`
	Data map[string]string `json:"data,omitempty"`
}

var (
	port           int
	rootDir        string
	out            *strings.Builder
	serverInstance *server.Server
)

const (
	httpTimeout = 2 * time.Second
	cmdTimeout  = 2 * time.Second
	wsTimeout   = 2 * time.Second
)

// TestMain bootstraps the components needed for the tests.
//
// It starts the server on a random available port and shuts it down after the
// tests have run. It also sets up the logger to write to a buffer instead of
// stdout, and makes a temporary directory for the server to use as its root
// directory.
func TestMain(m *testing.M) {
	var err error

	out = &strings.Builder{}

	ctx, cancel := context.WithCancel(context.Background())

	rootDir, err = os.MkdirTemp("", "gokiburi-server-test")
	if err != nil {
		panic(err)
	}

	logger := log.New(bufio.NewWriter(out))

	port = availablePort()
	serverInstance = server.New(ctx, rootDir, server.WithLogger(logger))

	go serverInstance.Serve("127.0.0.1", port)
	time.Sleep(1 * time.Second)

	code := m.Run()

	cancel()
	serverInstance.Close()

	os.Exit(code)
}

func TestServerWebsocketInitMsg(t *testing.T) {
	reset(t)

	_, msg := doWebsocket(t)

	require.Equal(t, "init", msg.Kind)
	require.Equal(t, "init", msg.Data["state"])
	require.Equal(t, rootDir, msg.Data["root"])
}

func TestServerWebsocketNewState(t *testing.T) {
	reset(t)

	ws, _ := doWebsocket(t)
	serverInstance.SetState(state.Running)
	msg := waitForMessage(t, ws)

	require.Equal(t, "state", msg.Kind)
	require.Equal(t, "running", msg.Data)
}

func TestServerWebsocketNewResult(t *testing.T) {
	reset(t)

	ws, _ := doWebsocket(t)
	serverInstance.AddResult(&runner.Result{UUID: "deadbeef", Pass: true, Tests: 1})
	msg := waitForMessage(t, ws)

	require.Equal(t, "result", msg.Kind)

	result, ok := msg.Data.(map[string]any)
	require.True(t, ok)

	require.Equal(t, "deadbeef", result["uuid"])
}

func TestServerWebsocketResultError(t *testing.T) {
	reset(t)

	ws, _ := doWebsocket(t)
	serverInstance.AddResult(&runner.Result{UUID: "deadbeef", Error: "warp core breach"})
	msg := waitForMessage(t, ws)

	require.Equal(t, "resultError", msg.Kind)

	result, ok := msg.Data.(map[string]any)
	require.True(t, ok)

	require.Equal(t, "deadbeef", result["uuid"])
	require.Equal(t, "warp core breach", result["error"])
}

func TestServerWebsocketResultEmpty(t *testing.T) {
	reset(t)

	ws, _ := doWebsocket(t)
	serverInstance.AddResult(&runner.Result{UUID: "deadbeef", Tests: 0})
	msg := waitForMessage(t, ws)

	require.Equal(t, "resultEmpty", msg.Kind)

	result, ok := msg.Data.(map[string]any)
	require.True(t, ok)

	require.Equal(t, "deadbeef", result["uuid"])
}

func TestServerWebsocketNewNotification(t *testing.T) {
	reset(t)

	ws, _ := doWebsocket(t)
	serverInstance.SendNotification("error", "warp core breach")
	msg := waitForMessage(t, ws)

	require.Equal(t, "notification", msg.Kind)

	notification, ok := msg.Data.(map[string]any)
	require.True(t, ok)

	require.Equal(t, "error", notification["type"])
	require.Equal(t, "warp core breach", notification["body"])
}

func TestServerAPI_Run(t *testing.T) {
	reset(t)

	req := newRequest(t, http.MethodPost, "/api/run", strings.NewReader(`{"package":"./..."}`))
	req.Header.Add("Content-Type", "application/json")
	resp := doRequest(t, req)
	cmd := waitForCmd(t)

	require.Equal(t, http.StatusAccepted, resp.StatusCode)
	require.NotNil(t, cmd)

	require.Equal(t, server.RunTests, cmd.Instruction)
	require.Equal(t, "./...", cmd.Data)
}

func TestServerAPI_Run_InvalidPackage(t *testing.T) {
	reset(t)

	req := newRequest(t, http.MethodPost, "/api/run", strings.NewReader(`{"package":"this is not a package"}`))
	req.Header.Add("Content-Type", "application/json")
	resp := doRequest(t, req)

	require.Equal(t, http.StatusUnprocessableEntity, resp.StatusCode)
}

func TestServerAPI_Pause(t *testing.T) {
	reset(t)

	serverInstance.SetState(state.Ready)

	resp := doRequest(t, newRequest(t, http.MethodPut, "/api/state/pause", nil))
	cmd := waitForCmd(t)

	require.Equal(t, http.StatusAccepted, resp.StatusCode)
	require.NotNil(t, cmd)

	require.Equal(t, server.Pause, cmd.Instruction)
	require.Empty(t, cmd.Data)
}

func TestServerAPI_Pause_StateAlreadyPaused(t *testing.T) {
	reset(t)

	serverInstance.SetState(state.Paused)

	resp := doRequest(t, newRequest(t, http.MethodPut, "/api/state/pause", nil))

	require.Equal(t, http.StatusForbidden, resp.StatusCode)
}

func TestServerAPI_Pause_StateRunning(t *testing.T) {
	reset(t)

	serverInstance.SetState(state.Running)

	resp := doRequest(t, newRequest(t, http.MethodPut, "/api/state/pause", nil))

	require.Equal(t, http.StatusForbidden, resp.StatusCode)
}

func TestServerAPI_Resume(t *testing.T) {
	reset(t)

	serverInstance.SetState(state.Paused)

	resp := doRequest(t, newRequest(t, http.MethodPut, "/api/state/resume", nil))
	cmd := waitForCmd(t)

	require.Equal(t, http.StatusAccepted, resp.StatusCode)
	require.NotNil(t, cmd)

	require.Equal(t, server.Resume, cmd.Instruction)
	require.Empty(t, cmd.Data)
}

func TestServerAPI_Resume_StateRunning(t *testing.T) {
	reset(t)

	serverInstance.SetState(state.Running)

	resp := doRequest(t, newRequest(t, http.MethodPut, "/api/state/resume", nil))

	require.Equal(t, http.StatusForbidden, resp.StatusCode)
}

func availablePort() int {
	listener, err := net.Listen("tcp", "localhost:0")
	if err != nil {
		panic(err)
	}
	defer listener.Close()

	return listener.Addr().(*net.TCPAddr).Port
}

func newRequest(t *testing.T, method, path string, body io.Reader) *http.Request {
	t.Helper()

	ctx, cancel := context.WithTimeout(context.Background(), httpTimeout)
	t.Cleanup(cancel)

	req, err := http.NewRequest(method, fmt.Sprintf("http://127.0.0.1:%d%s", port, path), body)
	if err != nil {
		t.Fatalf("error making new %s request to %s: %v", method, path, err)
	}

	return req.WithContext(ctx)
}

func doRequest(t *testing.T, req *http.Request) *http.Response {
	t.Helper()

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("error performing %s request to %s: %v", req.Method, req.URL.Path, err)
	}

	t.Cleanup(func() { resp.Body.Close() })

	return resp
}

func doWebsocket(t *testing.T) (*websocket.Conn, wsInitMsg) {
	t.Helper()

	ws, err := websocket.Dial(fmt.Sprintf("ws://127.0.0.1:%d/ws", port), "", "http://127.0.0.1/")
	require.NoError(t, err)

	t.Cleanup(func() {
		ws.Close()
	})

	ws.SetDeadline(time.Now().Add(wsTimeout))

	var rawMsg []byte
	require.NoError(t, websocket.Message.Receive(ws, &rawMsg))

	var msg wsInitMsg
	require.NoError(t, json.Unmarshal(rawMsg, &msg))

	require.Equal(t, "init", msg.Kind, "expected first websocket message to be of kind 'init'")

	return ws, msg
}

func waitForCmd(t *testing.T) *server.Command {
	t.Helper()

	select {
	case cmd := <-serverInstance.Commands:
		return cmd
	case <-time.After(cmdTimeout):
		t.Fatalf("expected server to emit a command within %s", cmdTimeout)
		return nil
	}
}

func waitForMessage(t *testing.T, ws *websocket.Conn) wsMsg {
	t.Helper()

	ws.SetDeadline(time.Now().Add(wsTimeout))

	var rawMsg []byte
	require.NoError(t, websocket.Message.Receive(ws, &rawMsg))

	var msg wsMsg
	require.NoError(t, json.Unmarshal(rawMsg, &msg))

	return msg
}

func reset(t *testing.T) {
	t.Helper()
	serverInstance.Reset()
}
