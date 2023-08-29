package backend

import (
	"context" //#nosec:G505 // used for non-sensitive cache key generation.
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	"dagger.io/dagger"

	"github.com/michenriksen/gokiburi/ci/ciutil"
)

const (
	containerBaseImage = "golang:1.21.0-alpine3.18"
	golangciInstallURL = "https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh"
)

var apks = []string{"ca-certificates", "curl", "gcc", "musl-dev", "shadow"}

var gosecExcludes = []string{
	"G104", // Errors unhandled.
	"G304", // Potential file inclusion via variable.
	"G307", // Deferring a method which returns an error.
	"G505", // Import blocklist: crypto/sha1.
}

func Build(ctx context.Context, client *dagger.Client, _ []string) {
	appName := ciutil.EnvWithDefault("APP_NAME", "gokiburi")
	version := ciutil.MustEnv("VERSION")
	osys := ciutil.EnvWithDefault("OS", runtime.GOOS)
	arch := ciutil.EnvWithDefault("ARCH", runtime.GOARCH)
	commit := strings.TrimSpace(ciutil.RunHostCmd(ctx, "git rev-parse HEAD"))
	buildTime := time.Now().UTC().Format(time.RFC3339)
	goVersion := runtime.Version()
	osArch := osys + "/" + arch
	pkg := strings.TrimSpace(ciutil.RunHostCmd(ctx, "go list -m")) + "/internal/gokiburi"

	binName := appName
	if osys == "windows" {
		binName += ".exe"
	}

	gopath := os.Getenv("GOPATH")
	if gopath == "" {
		ciutil.PrintWarning("WARNING: GOPATH environment variable is not set\n")
	}

	asmflags := "all=-trimpath=" + gopath
	gcflags := "all=-trimpath=" + gopath
	ldflags := "-s -w"

	if dbg := os.Getenv("DBG"); dbg != "" {
		ciutil.PrintStatus("using debug-friendly build flags\n")

		gcflags = "all=-N -l"
		asmflags = ""
		ldflags = ""
	}

	container := makeContainer(ctx, client).
		WithEnvVariable("GOOS", osys).
		WithEnvVariable("GOARCH", arch)

	ciutil.PrintStatus("building %s v%s for %s to %s ", appName, version, osArch, filepath.Join("bin", binName))

	build := container.WithExec([]string{
		"go", "build",
		"-gcflags", gcflags,
		"-asmflags", asmflags,
		"-ldflags",
		"-X " + pkg + ".buildVersion=" + version + " " +
			"-X " + pkg + ".buildCommit=" + commit + " " +
			"-X " + pkg + ".buildTime=" + buildTime + " " +
			"-X " + pkg + ".buildGoVersion=" + goVersion + " " +
			"-X " + pkg + ".buildOSArch=" + osArch + " " +
			ldflags,
		"-o", filepath.Join("bin", binName),
		"main.go",
	})

	_, err := build.Stdout(ctx)
	if err != nil {
		ciutil.PrintFatal("FAIL\n\n%s", err.Error())
	}

	ciutil.PrintSuccess("DONE\n")

	ciutil.PrintStatus("exporting binary bin/ ")

	output := client.Directory().WithDirectory("bin", build.Directory("bin"))

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
	excludes := strings.Join(gosecExcludes, ",")
	steps := []*ciutil.Step{
		ciutil.NewStep("linting with go vet", "go vet ./..."),
		ciutil.NewStep("linting with golangci-lint", "golangci-lint run ./..."),
		ciutil.NewStep("verifying module cache integrity", "go mod verify"),
		ciutil.NewStep("auditing dependencies with govulncheck", "govulncheck ./..."),
		ciutil.NewStep("auditing files with gosec", "gosec -quiet -exclude "+excludes+" ./..."),
		ciutil.NewStep("running tests", "go test -shuffle on ./..."),
		ciutil.NewStep("building binary (verification only)", "go build -o /dev/null ./..."),
	}

	ciutil.RunSteps(ctx, container, steps...)
}

func Audit(ctx context.Context, client *dagger.Client, _ []string) {
	container := makeContainer(ctx, client)
	excludes := strings.Join(gosecExcludes, ",")
	steps := []*ciutil.Step{
		ciutil.NewStep("verifying module cache integrity", "go mod verify"),
		ciutil.NewStep("auditing dependencies with govulncheck", "govulncheck ./..."),
		ciutil.NewStep("auditing files with gosec", "gosec -quiet -exclude "+excludes+" ./..."),
	}

	ciutil.RunSteps(ctx, container, steps...)
}

func Test(ctx context.Context, client *dagger.Client, _ []string) {
	out, err := makeContainer(ctx, client).
		WithEnvVariable("CGO_ENABLED", "1").
		WithExec([]string{"go", "test", "-shuffle", "on", "-cover", "-covermode", "atomic", "-race", "./..."}).
		Stdout(ctx)
	if err != nil {
		panic(err)
	}

	fmt.Println(out)
}

func Lint(ctx context.Context, client *dagger.Client, _ []string) {
	container := makeContainer(ctx, client)
	steps := []*ciutil.Step{
		ciutil.NewStep("running go vet", "go vet ./..."),
		ciutil.NewStep("running golangci-lint", "golangci-lint run ./..."),
	}

	ciutil.RunSteps(ctx, container, steps...)
}

func makeContainer(ctx context.Context, client *dagger.Client) *dagger.Container {
	goCache := client.CacheVolume(ciutil.CacheKeyFromFile("go.sum", "gokiburi-ci-gomod-cache"))

	container := client.Container().
		From(containerBaseImage).
		WithEnvVariable("CGO_ENABLED", "0").
		WithEnvVariable("GO111MODULE", "on").
		WithEnvVariable("GOCACHE", "/tmp/.cache/go/cache").
		WithEnvVariable("GOMODCACHE", "/tmp/.cache/go/modcache").
		WithEnvVariable("GOFLAGS", os.Getenv("GOFLAGS")).
		WithEnvVariable("HTTP_PROXY", os.Getenv("HTTP_PROXY")).
		WithEnvVariable("HTTPS_PROXY", os.Getenv("HTTPS_PROXY")).
		WithMountedCache("/tmp/.cache/go", goCache).
		WithDirectory("/src", client.Host().Directory(".")).

		// Create dummy web UI build directory.
		WithExec([]string{"mkdir", "-p", "/src/web/app/build"}).
		WithExec([]string{"touch", "/src/web/app/build/dummy.txt"}).

		// Install base APK packages.
		WithExec(append([]string{"apk", "add", "--no-cache"}, apks...)).

		// Download and install golangci-lint.
		WithExec([]string{"curl", "-sSfL", "-o", "/tmp/golangci-install.sh", golangciInstallURL}).
		WithExec([]string{"chmod", "+x", "/tmp/golangci-install.sh"}).
		WithExec([]string{"/tmp/golangci-install.sh", "-b", "/usr/local/bin"}).
		WithExec([]string{"rm", "/tmp/golangci-install.sh"}).

		// Install govulncheck for dependency scanning and gosec for vulnerability scanning.
		WithExec([]string{"go", "install", "golang.org/x/vuln/cmd/govulncheck@latest"}).
		WithExec([]string{"go", "install", "github.com/securego/gosec/v2/cmd/gosec@latest"}).
		WithWorkdir("/src").
		WithExec([]string{"go", "mod", "tidy"})

	ciutil.PrintStatus("initializing backend container ")

	_, err := container.Stdout(ctx)
	if err != nil {
		ciutil.PrintFatal("FAIL\n\n%s", err.Error())
	}

	ciutil.PrintSuccess("DONE\n")

	return container
}
