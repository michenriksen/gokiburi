package frontend

import (
	"context" //#nosec:G505 // used for non-sensitve cache key generation.
	"fmt"

	"dagger.io/dagger"

	"github.com/michenriksen/gokiburi/ci/ciutil"
)

const (
	baseContainerImage = "node:current-alpine"
	buildDest          = "/tmp/gokiburi-ci-build-fe"
)

var apks = []string{"ca-certificates", "curl", "gcc", "musl-dev", "shadow"}

func Build(ctx context.Context, client *dagger.Client, _ []string) {
	appName := ciutil.EnvWithDefault("APP_NAME", "gokiburi")
	version := ciutil.MustEnv("VERSION")

	container := makeContainer(ctx, client)

	ciutil.PrintStatus("building frontend for production ")

	build := container.
		WithEnvVariable("PUBLIC_APP_NAME", appName).
		WithEnvVariable("PUBLIC_APP_VERSION", version).
		WithExec([]string{"npx", "vite", "build"})

	_, err := build.Stdout(ctx)
	if err != nil {
		ciutil.PrintFatal("FAIL\n\n%s", err.Error())
	}

	ciutil.PrintSuccess("DONE\n")

	ciutil.PrintStatus("exporting build files to web/app/build ")

	output := client.Directory().
		WithDirectory("web/app/build", build.Directory("build"))

	ok, err := output.Export(ctx, ".")
	if err != nil {
		ciutil.PrintFatal("FAIL\n\n%s", err.Error())
	}

	if !ok {
		ciutil.PrintFatal("FAIL\n")
	}

	ciutil.PrintSuccess("DONE\n")
}

func Verify(ctx context.Context, client *dagger.Client, _ []string) {
	container := makeContainer(ctx, client)
	steps := []*ciutil.Step{
		ciutil.NewStep("linting with prettier", "npx prettier --plugin-search-dir . --loglevel warn --check ."),
		ciutil.NewStep("linting with eslint", "npx eslint"),
		ciutil.NewStep("auditing dependencies with npm audit", "npm audit"),
		ciutil.NewStep("running tests", "npx vitest --run"),
		ciutil.NewStep(
			"building for production (verification only)", "npx vite build --outDir /tmp/gokiburi-ci-verify-fe"),
		ciutil.NewStep("removing build artifacts", "rm -rf /tmp/gokiburi-ci-verify-fe"),
	}

	ciutil.RunSteps(ctx, container, steps...)
}

func Audit(ctx context.Context, client *dagger.Client, _ []string) {
	container := makeContainer(ctx, client)
	steps := []*ciutil.Step{
		ciutil.NewStep("auditing dependencies with npm audit", "npm audit"),
	}

	ciutil.RunSteps(ctx, container, steps...)
}

func Test(ctx context.Context, client *dagger.Client, _ []string) {
	out, err := makeContainer(ctx, client).
		WithExec([]string{"npx", "vitest", "--run"}).
		Stdout(ctx)
	if err != nil {
		ciutil.PrintFatal("FAIL\n\n%s", err.Error())
	}

	fmt.Println(out)
}

func Lint(ctx context.Context, client *dagger.Client, _ []string) {
	container := makeContainer(ctx, client)
	steps := []*ciutil.Step{
		ciutil.NewStep("running prettier", "npx prettier --plugin-search-dir . --loglevel warn --check ."),
		ciutil.NewStep("running eslint", "npx eslint"),
	}

	ciutil.RunSteps(ctx, container, steps...)
}

func makeContainer(ctx context.Context, client *dagger.Client) *dagger.Container {
	npmCache := client.CacheVolume(ciutil.CacheKeyFromFile("web/app/package-lock.json", "gokiburi-ci-npm-cache"))
	appName := ciutil.EnvWithDefault("APP_NAME", "gokiburi")
	version := ciutil.EnvWithDefault("VERSION", "0.0.0-dev")

	container := client.Container().
		From(baseContainerImage).
		WithEnvVariable("PUBLIC_APP_NAME", appName).
		WithEnvVariable("PUBLIC_APP_VERSION", version).
		WithMountedCache("/app/node_modules", npmCache).
		WithDirectory("/app", client.Host().Directory("web/app"), dagger.ContainerWithDirectoryOpts{
			Exclude: []string{"node_modules/", "build/"},
		}).

		// Install base APK packages.
		WithExec(append([]string{"apk", "add", "--no-cache"}, apks...)).

		// Install NPM dependencies.
		WithWorkdir("/app").
		WithExec([]string{"npm", "ci"})

	ciutil.PrintStatus("initializing frontend container ")

	_, err := container.Stdout(ctx)
	if err != nil {
		ciutil.PrintFatal("FAIL\n\n%s", err.Error())
	}

	ciutil.PrintSuccess("DONE\n")

	return container
}
