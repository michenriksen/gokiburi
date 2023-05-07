package watcher_test

import (
	"testing"

	"github.com/stretchr/testify/require"

	"github.com/michenriksen/gokiburi/internal/pkg/watcher"
)

func TestOp_String(t *testing.T) {
	tt := map[watcher.Op]string{
		watcher.Create: "CREATE",
		watcher.Write:  "WRITE",
		watcher.Delete: "DELETE",
	}

	for tc, want := range tt {
		t.Run(want, func(t *testing.T) {
			require.Equal(t, want, tc.String())
		})
	}
}

func TestEventBatch_Paths(t *testing.T) {
	e := &watcher.EventBatch{
		Events: map[string]watcher.Op{
			"main.go":                  watcher.Create,
			"cmd/root/command.go":      watcher.Write,
			"cmd/root/command_test.go": watcher.Create,
			"warpcore/warpcore_old.go": watcher.Delete,
		},
	}

	paths := e.Paths()

	require.Len(t, paths, 4)
	require.Contains(t, paths, "main.go")
	require.Contains(t, paths, "cmd/root/command.go")
	require.Contains(t, paths, "cmd/root/command_test.go")
	require.Contains(t, paths, "warpcore/warpcore_old.go")
}
