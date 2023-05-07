package watcher_test

import (
	"context"
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/stretchr/testify/require"

	"github.com/michenriksen/gokiburi/internal/pkg/watcher"
)

func TestWatcher_Watch(t *testing.T) {
	tmp := t.TempDir()

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
	defer cancel()

	w := watcher.New(ctx, tmp, watcher.WithBatchInterval(10*time.Millisecond))

	require.NoError(t, w.Watch())

	name := filepath.Join(tmp, "main.go")

	require.NoError(t, os.WriteFile(name, []byte("package main\n\n"), 0o644))

	event, ok := <-w.Events
	require.True(t, ok)

	requireEventContains(t, event, name, watcher.Create)

	f, err := os.OpenFile(name, os.O_APPEND|os.O_WRONLY, 0o644)
	require.NoError(t, err)

	_, err = f.WriteString("func main() {}")
	require.NoError(t, err)

	f.Close()

	event, ok = <-w.Events
	require.True(t, ok)

	requireEventContains(t, event, name, watcher.Write)

	require.NoError(t, os.Remove(name))

	event, ok = <-w.Events
	require.True(t, ok)

	requireEventContains(t, event, name, watcher.Delete)
}

func TestWatcher_Watch_NoGoFile(t *testing.T) {
	tmp := t.TempDir()
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
	defer cancel()

	w := watcher.New(ctx, tmp, watcher.WithBatchInterval(10*time.Millisecond))

	require.NoError(t, w.Watch())

	name := filepath.Join(tmp, "README.md")

	require.NoError(t, os.WriteFile(name, []byte("# README\n"), 0o644))

	for {
		select {
		case <-ctx.Done():
			return
		case event := <-w.Events:
			require.Fail(t, "did not expect file event, but received %v", event)
		}
	}
}

func TestWatcher_Watch_NewDir(t *testing.T) {
	tmp := t.TempDir()
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
	defer cancel()

	w := watcher.New(ctx, tmp, watcher.WithBatchInterval(10*time.Millisecond))

	require.NoError(t, w.Watch())

	require.NoError(t, os.MkdirAll(filepath.Join(tmp, "pkg", "warpcore"), 0o0764))

	name := filepath.Join(tmp, "pkg", "warpcore", "warpcore.go")

	time.Sleep(10 * time.Millisecond)

	require.NoError(t, os.WriteFile(name, []byte("package warpcore\n\n"), 0o644))

	time.Sleep(10 * time.Millisecond)

	event, ok := <-w.Events
	require.True(t, ok)

	requireEventContains(t, event, name, watcher.Create)
}

func requireEventContains(t *testing.T, e *watcher.EventBatch, path string, op watcher.Op) {
	t.Helper()

	require.NotNil(t, e)
	require.Contains(t, e.Events, path)
	require.Equal(t, op, e.Events[path])
}
