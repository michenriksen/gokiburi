package ciutil

import (
	"context"
	"crypto/sha1" //#nosec:G505 // used for non-sensitve cache key generation.
	"fmt"
	"os"
	"os/exec"
	"strings"

	"dagger.io/dagger"
)

type Step struct {
	desc string
	cmd  string
}

func NewStep(desc, cmd string) *Step {
	return &Step{desc: desc, cmd: cmd}
}

func (s *Step) cmdArgs() []string {
	return strings.Split(s.cmd, " ")
}

func RunSteps(ctx context.Context, container *dagger.Container, steps ...*Step) {
	for i, step := range steps {
		progress := fmt.Sprintf("%s[%d/%d]%s", cyan, i+1, len(steps), reset)

		PrintStatus("%s %s%s ", progress, bold, step.desc)

		container = container.WithExec(step.cmdArgs())

		_, err := container.Stdout(ctx)
		if err != nil {
			PrintFatal("FAIL\n\n%s", err.Error())
		}

		PrintSuccess("PASS\n")
	}
}

func RunHostCmd(ctx context.Context, cmd string) string {
	args := strings.Split(cmd, " ")
	cmd = args[0]
	args = args[1:]

	out, err := exec.CommandContext(ctx, cmd, args...).CombinedOutput() //#nosec:G204 // Only runs trusted commands.
	if err != nil {
		panic(fmt.Errorf("failed to run host command: %w", err))
	}

	return string(out)
}

func CacheKeyFromFile(name, prefix string) string {
	b, err := os.ReadFile(name)
	if err != nil {
		panic(err)
	}

	h := sha1.New() //#nosec:G401 // No need for a cryptographically secure hash here.
	h.Write(b)

	return fmt.Sprintf("%s-%x", prefix, h.Sum(nil))
}
