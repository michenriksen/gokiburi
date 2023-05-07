package command

import (
	"context"
	"errors"
	"os/exec"
)

// Runner function runs an external command.
//
// Command is executed in a content-aware fashion and with `dir` set as its
// working directory.
//
// Returns the combined output from stdout and stderr, exit code, or error
// if execution fails.
//
// If exit code indicates failure (anything other than 0), it is not treated
// as an execution error, and returned error will be nil.
type Runner func(ctx context.Context, dir, name string, args ...string) (out []byte, exitCode int, err error)

// DefaultRunner for running an external command.
//
// Uses the `os/exec` package to run the command.
var DefaultRunner = func(ctx context.Context, dir, name string, args ...string) (out []byte, exitCode int, err error) {
	cmd := exec.CommandContext(ctx, name, args...) //#nosec:G204 // no security risk.
	cmd.Dir = dir

	out, err = cmd.CombinedOutput()
	if err != nil {
		var exitError *exec.ExitError

		if errors.As(err, &exitError) {
			return out, cmd.ProcessState.ExitCode(), nil
		}

		return out, cmd.ProcessState.ExitCode(), err
	}

	return out, cmd.ProcessState.ExitCode(), nil
}
