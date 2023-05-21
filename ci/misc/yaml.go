package misc

import (
	"context"

	"dagger.io/dagger"

	"github.com/michenriksen/gokiburi/ci/ciutil"
)

const yamllintBaseContainerImage = "cytopia/yamllint"

func LintYAML(ctx context.Context, client *dagger.Client, _ []string) {
	container := makeYAMLLintContainer(ctx, client)
	steps := []*ciutil.Step{
		ciutil.NewStep("linting YAML files", "."),
	}

	ciutil.RunSteps(ctx, container, steps...)
}

func makeYAMLLintContainer(ctx context.Context, client *dagger.Client) *dagger.Container {
	container := client.Container().
		From(yamllintBaseContainerImage).
		WithDirectory("/src", client.Host().Directory("."), dagger.ContainerWithDirectoryOpts{
			Exclude: []string{"web/app/node_modules"},
		}).
		WithWorkdir("/src")

	ciutil.PrintStatus("initializing yamllint container ")

	_, err := container.Stdout(ctx)
	if err != nil {
		ciutil.PrintFatal("FAIL\n\n%s", err.Error())
	}

	ciutil.PrintSuccess("DONE\n")

	return container
}
