package main

import (
	"context"
	"flag"
	"fmt"
	"os"
	"time"

	"dagger.io/dagger"

	"github.com/michenriksen/gokiburi/ci/backend"
	"github.com/michenriksen/gokiburi/ci/ciutil"
	"github.com/michenriksen/gokiburi/ci/collections"
	"github.com/michenriksen/gokiburi/ci/frontend"
	"github.com/michenriksen/gokiburi/ci/gha"
	"github.com/michenriksen/gokiburi/ci/misc"
)

type job struct {
	desc string
	run  func(ctx context.Context, client *dagger.Client, args []string)
}

type options struct {
	job     string
	jobArgs []string
	debug   bool
}

var jobs = map[string]*job{
	"build": {
		desc: "build binary to bin/",
		run:  collections.Build,
	},
	"verify-be": {
		desc: "lint, test, audit and verify backend can be built",
		run:  backend.Verify,
	},
	"audit-be": {
		desc: "scan backend for vulnerabilities and insecure dependencies",
		run:  backend.Audit,
	},
	"test-be": {
		desc: "run backend tests",
		run:  backend.Test,
	},
	"lint-be": {
		desc: "lint backend code with golangci-lint",
		run:  backend.Lint,
	},
	"verify-fe": {
		desc: "lint, test, audit, and verify frontend can be built",
		run:  frontend.Verify,
	},
	"audit-fe": {
		desc: "scan frontend for vulnerabilities and insecure dependencies",
		run:  frontend.Audit,
	},
	"test-fe": {
		desc: "run frontend tests",
		run:  frontend.Test,
	},
	"lint-fe": {
		desc: "lint frontend code with eslint",
		run:  frontend.Lint,
	},
	"build-fe": {
		desc: "build frontend for production to web/app/build",
		run:  frontend.Build,
	},
	"lint-gha": {
		desc: "lint GitHub Actions workflows with actionlint",
		run:  gha.Lint,
	},
	"audit-all": {
		desc: "audit backend and frontend for vulnerabilities and insecure dependencies",
		run:  collections.Audit,
	},
	"test-all": {
		desc: "run backend and frontend tests",
		run:  collections.Test,
	},
	"lint-all": {
		desc: "lint backend, frontend, and GitHub Actions",
		run:  collections.Lint,
	},
	"verify-all": {
		desc: "lint, test, audit, and verify backend and frontend can be built",
		run:  collections.Verify,
	},
	"lint-yaml": {
		desc: "lint all YAML files",
		run:  misc.LintYAML,
	},
	"lint-goreleaser": {
		desc: "lint goreleaser configuration",
		run:  misc.LintGoreleaserConfig,
	},
	"lint-commits": {
		desc: "lint commit messages",
		run:  misc.LintCommits,
	},
	"gen-deps-csv": {
		desc: "generate CSV of dependencies to dependencies.csv",
		run:  misc.GenDepsCSV,
	},
	"gen-sbom": {
		desc: "generate SBOM file to $APP_NAME.spdx.sbom",
		run:  misc.GenSBOM,
	},
}

var (
	client *dagger.Client
	err    error
)

func main() {
	start := time.Now()
	opts := parseOpts()
	ctx := context.Background()

	var clientOpts []dagger.ClientOpt

	if opts.debug {
		clientOpts = append(clientOpts, dagger.WithLogOutput(os.Stderr))
	}

	client, err = dagger.Connect(ctx, clientOpts...)
	if err != nil {
		panic(err)
	}
	defer client.Close()

	jobs[opts.job].run(ctx, client, opts.jobArgs)

	dur := time.Since(start)
	ciutil.PrintStatus("finished running %s in %s\n", opts.job, dur.Round(time.Second).String())
}

func parseOpts() *options {
	o := &options{}

	flag.StringVar(&o.job, "run", "", "job to run")
	flag.BoolVar(&o.debug, "debug", false, "print Dagger client output")

	flag.Parse()

	if o.job == "" {
		usage()
	}

	if _, ok := jobs[o.job]; !ok {
		fmt.Fprintf(os.Stderr, "unknown job: %s\n\n", o.job)
		usage()
	}

	o.jobArgs = flag.Args()

	return o
}

func usage() {
	fmt.Fprintf(os.Stderr, "Usage: go run ci/main.go -job <job> [-debug] [jobArgs]\n\n")
	fmt.Fprintf(os.Stderr, "Available jobs:\n")

	for name, job := range jobs {
		fmt.Fprintf(os.Stderr, "  %s: %s\n", name, job.desc)
	}

	fmt.Fprintf(os.Stderr, "\n")

	os.Exit(1) //nolint:revive // Not a library.
}
