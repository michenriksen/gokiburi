package command_test

import (
	"context"
	"testing"

	"github.com/michenriksen/gokiburi/internal/pkg/command"

	"github.com/stretchr/testify/require"
)

func TestDefaultRunner(t *testing.T) {
	out, exitCode, err := command.DefaultRunner(context.Background(), ".", "echo", "Hello, World!")

	require.NoError(t, err)
	require.Equal(t, "Hello, World!\n", string(out))
	require.Equal(t, 0, exitCode)
}

func TestDefaultRunner_ExitCode(t *testing.T) {
	_, exitCode, err := command.DefaultRunner(context.Background(), ".", "false")

	require.NoError(t, err)
	require.Equal(t, 1, exitCode)
}

func TestDefaultRunner_NotFound(t *testing.T) {
	_, exitCode, err := command.DefaultRunner(context.Background(), ".", "5tgh52s7g7o")

	require.Error(t, err)
	require.Equal(t, -1, exitCode)
}
