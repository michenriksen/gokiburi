package misc

import (
	"context"
	"os"
	"strings"

	"dagger.io/dagger"

	"github.com/michenriksen/gokiburi/ci/ciutil"
)

const (
	goToolingBaseImage   = "golang:alpine3.18"
	nodeToolingBaseImage = "node:current-alpine"
	syftDownloadURL      = "https://raw.githubusercontent.com/anchore/syft/main/install.sh"
)

var apks = []string{"ca-certificates", "curl", "gcc", "musl-dev", "shadow", "bash", "git"}

func LintGoreleaserConfig(ctx context.Context, client *dagger.Client, _ []string) {
	container := makeGoToolingContainer(ctx, client).
		WithDirectory("/src/.git", client.Host().Directory(".git")).
		WithFile("/src/.goreleaser.yaml", client.Host().Directory(".").File(".goreleaser.yaml")).
		WithWorkdir("/src")
	steps := []*ciutil.Step{
		ciutil.NewStep("installing GoReleaser", "go install github.com/goreleaser/goreleaser@latest"),
		ciutil.NewStep("linting GoReleaser configuration", "/go/bin/goreleaser check .goreleaser.yaml"),
	}

	ciutil.RunSteps(ctx, container, steps...)
}

func LintCommits(ctx context.Context, client *dagger.Client, args []string) {
	container := makeNodeToolingContainer(ctx, client).
		WithDirectory("/src/.git", client.Host().Directory(".git")).
		WithFile("/src/.commitlintrc.js", client.Host().Directory(".").File(".commitlintrc.js"))

	args = commitlintArgs(args)

	cmd := append([]string{"npx", "commitlint", "--config", ".commitlintrc.js"}, args...)

	ciutil.RunSteps(ctx, container, ciutil.NewStep("linting commit messages with commitlint", strings.Join(cmd, " ")))
}

func GenDepsCSV(ctx context.Context, client *dagger.Client, _ []string) {
	filename := "dependencies.csv"
	container := makeGoToolingContainer(ctx, client).
		WithDirectory("/src", client.Host().Directory("."), dagger.ContainerWithDirectoryOpts{
			Exclude: []string{filename},
		}).
		WithWorkdir("/src")

	ciutil.PrintStatus("generating CSV ")

	gen := container.WithExec([]string{"scripts/gen-deps-csv.sh"})

	_, err := gen.Stdout(ctx)
	if err != nil {
		ciutil.PrintFatal("FAIL\n\n%s", err.Error())
	}

	ciutil.PrintSuccess("DONE\n")

	ciutil.PrintStatus("exporting %s ", filename)

	output := client.Directory().WithFile(filename, gen.Directory("/src").File(filename))

	ok, err := output.Export(ctx, ".")
	if err != nil {
		ciutil.PrintFatal("FAIL\n\n%s", err.Error())
	}

	if !ok {
		ciutil.PrintFatal("FAIL\n\n%s", err.Error())
	}

	ciutil.PrintSuccess("DONE\n")
}

func GenSBOM(ctx context.Context, client *dagger.Client, _ []string) {
	filename := ciutil.EnvWithDefault("APP_NAME", "gokiburi") + ".spdx.sbom"
	container := makeGoToolingContainer(ctx, client).
		WithDirectory("/src", client.Host().Directory("."), dagger.ContainerWithDirectoryOpts{
			Exclude: []string{filename},
		}).
		WithWorkdir("/src")

	ciutil.PrintStatus("generating SBOM ")

	gen := container.WithExec([]string{
		"syft",
		"-o", "spdx-json",
		"--file", filename,
		"--exclude", "./build/*,./bin/*,./dist/*,./web/app/build/*",
		".",
	})

	_, err := gen.Stdout(ctx)
	if err != nil {
		ciutil.PrintFatal("FAIL\n\n%s", err.Error())
	}

	ciutil.PrintSuccess("DONE\n")

	ciutil.PrintStatus("exporting %s ", filename)

	output := client.Directory().WithFile(filename, gen.Directory("/src").File(filename))

	ok, err := output.Export(ctx, ".")
	if err != nil {
		ciutil.PrintFatal("FAIL\n\n%s", err.Error())
	}

	if !ok {
		ciutil.PrintFatal("FAIL\n\n%s", err.Error())
	}

	ciutil.PrintSuccess("DONE\n")
}

func makeGoToolingContainer(ctx context.Context, client *dagger.Client) *dagger.Container {
	cache := client.CacheVolume("goToolingCache")
	container := client.Container().
		From(goToolingBaseImage).
		WithEnvVariable("CGO_ENABLED", "0").
		WithEnvVariable("GO111MODULE", "on").
		WithEnvVariable("GOCACHE", "/tmp/.cache/go/cache").
		WithEnvVariable("GOMODCACHE", "/tmp/.cache/go/modcache").
		WithMountedCache("/tmp/.cache/go", cache).

		// Install APK packages.
		WithExec(append([]string{"apk", "add", "--no-cache"}, apks...)).

		// Install Syft for dependency analysis.
		WithExec([]string{"curl", "-sSfL", "-o", "/tmp/syft-install.sh", syftDownloadURL}).
		WithExec([]string{"chmod", "+x", "/tmp/syft-install.sh"}).
		WithExec([]string{"/tmp/syft-install.sh", "-b", "/usr/local/bin"}).
		WithExec([]string{"rm", "/tmp/syft-install.sh"})

	ciutil.PrintStatus("initializing go tooling container ")

	_, err := container.Stdout(ctx)
	if err != nil {
		ciutil.PrintFatal("FAIL\n\n%s", err.Error())
	}

	ciutil.PrintSuccess("DONE\n")

	return container
}

func makeNodeToolingContainer(ctx context.Context, client *dagger.Client) *dagger.Container {
	cache := client.CacheVolume("nodeToolingCache")
	container := client.Container().
		From(nodeToolingBaseImage).
		WithDirectory("/src", client.Host().Directory("./ci/misc/commitlint")).
		WithMountedCache("/src/node_modules", cache).

		// Install APK packages.
		WithExec(append([]string{"apk", "add", "--no-cache"}, apks...)).

		// Install commitlint for linting conventional commit messages.
		WithWorkdir("/src").
		WithExec([]string{"npm", "ci"})

	ciutil.PrintStatus("initializing node tooling container ")

	_, err := container.Stdout(ctx)
	if err != nil {
		ciutil.PrintFatal("FAIL\n\n%s", err.Error())
	}

	ciutil.PrintSuccess("DONE\n")

	return container
}

func commitlintArgs(args []string) []string {
	if len(args) != 0 {
		return args
	}

	from := os.Getenv("COMMITLINT_FROM")
	to := os.Getenv("COMMITLINT_TO")

	if from == "" && to == "" {
		return []string{"--to", "HEAD"}
	}

	if from != "" {
		args = append(args, "--from", from)
	}

	if to != "" {
		args = append(args, "--to", to)
	}

	return args
}
