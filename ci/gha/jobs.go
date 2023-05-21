package gha

import (
	"context"

	"dagger.io/dagger"

	"github.com/michenriksen/gokiburi/ci/ciutil"
)

const baseContainerImage = "rhysd/actionlint"

func Lint(ctx context.Context, client *dagger.Client, _ []string) {
	container := makeContainer(ctx, client)
	steps := []*ciutil.Step{
		ciutil.NewStep("running actionlint", "actionlint"),
	}

	ciutil.RunSteps(ctx, container, steps...)
}

func makeContainer(ctx context.Context, client *dagger.Client) *dagger.Container {
	container := client.Container().
		From(baseContainerImage).
		WithDirectory("/src/.github", client.Host().Directory(".github")).
		WithWorkdir("/src").
		WithEntrypoint([]string{"echo"})

	ciutil.PrintStatus("initializing GitHub Actions container ")

	_, err := container.Stdout(ctx)
	if err != nil {
		ciutil.PrintFatal("FAIL\n\n%s", err.Error())
	}

	ciutil.PrintSuccess("DONE\n")

	return container
}
