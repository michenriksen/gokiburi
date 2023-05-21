DBG_MAKEFILE ?=
ifeq ($(DBG_MAKEFILE),1)
    $(warning ***** starting Makefile for goal(s) "$(MAKECMDGOALS)")
    $(warning ***** $(shell date))
else
    MAKEFLAGS += -s
endif

APP_NAME ?= gokiburi

ifeq ($(VERSION),)
  # VERSION := $(shell git log -1 --format="%ad-%h" --date=format-local:"%Y%m%d%H%M%S" --abbrev=12)
  VERSION := $(shell svu --strip-prefix --pre-release=dev)
endif

DBG ?=

MAKEFLAGS += --no-builtin-rules
MAKEFLAGS += --warn-undefined-variables
.SUFFIXES:

OS := $(if $(GOOS),$(GOOS),$(shell go env GOOS))
ARCH := $(if $(GOARCH),$(GOARCH),$(shell go env GOARCH))

GOFLAGS ?=
HTTP_PROXY ?=
HTTPS_PROXY ?=

export APP_NAME
export VERSION
export DBG
export OS
export ARCH
export GOFLAGS
export HTTP_PROXY
export HTTPS_PROXY

build: # @HELP builds snapshot binary for $OS/$ARCH to ./bin
build:
	go run ci/main.go -run build

build-fe: # @HELP builds frontend to ./web/app/build
build-fe:
	go run ci/main.go -run build-fe

verify: # @HELP runs backend and frontend tests, lints, audits, and verification builds
verify:
	go run ci/main.go -run verify-all

verify-be: # @HELP runs backend tests, lints, audits, and verification build
verify-be:
	go run ci/main.go -run verify-be

verify-fe: # @HELP runs frontend tests, lints, audits, and verification build
verify-fe:
	go run ci/main.go -run verify-fe

version: # @HELP outputs the version string
version:
	echo $(VERSION)

version-next: # @HELP outputs the next version string based on commits
version-next:
	svu next

test: # @HELP runs backend and frontend tests
test:
	go run ci/main.go -run test-all

test-be: # @HELP runs backend tests
test-be:
	go run ci/main.go -run test-be

test-fe: # @HELP runs frontend tests
test-fe:
	go run ci/main.go -run test-fe

lint: # @HELP lints backend, frontend, and GitHub Actions code
lint:
	go run ci/main.go -run lint-all

lint-be: # @HELP lints backend code
lint-be:
	go run ci/main.go -run lint-be

lint-fe: # @HELP lints frontend code
lint-fe:
	go run ci/main.go -run lint-fe

lint-gha: # @HELP lints GitHub Actions
lint-gha:
	go run ci/main.go -run lint-gha

lint-yaml: # @HELP lints all YAML files
lint-yaml:
	go run ci/main.go -run lint-yaml

lint-goreleaser: # @HELP lints GoReleaser configuration
lint-goreleaser:
	go run ci/main.go -run lint-goreleaser

lint-commits: # @HELP lints commit messages
lint-commits:
	go run ci/main.go -run lint-commits

audit: # @HELP audits backend and frontend code for security issues
audit:
	go run ci/main.go -run audit-all

audit-be: # @HELP audits backend code for security issues
audit-be:
	go run ci/main.go -run audit-be

audit-fe: # @HELP audits frontend code for security issues
audit-fe:
	go run ci/main.go -run audit-fe

clean: # @HELP removes build artifacts
clean:
	rm -rf ./bin
	rm -rf ./dist
	rm -rf ./web/app/build
	rm -f ./dependencies.csv
	rm -f ./gokiburi.spdx.sbom

gen-deps-csv: # @HELP generates CSV of dependencies to ./dependencies.csv
gen-deps-csv:
	go run ci/main.go -run gen-deps-csv

gen-sbom: # @HELP generates SBOM file to ./$APP_NAME.spdx.sbom
gen-sbom:
	go run ci/main.go -run gen-sbom

help: # @HELP prints this message
help:
	echo "VARIABLES:"
	echo "  APP_NAME = $(APP_NAME)"
	echo "  VERSION = $(VERSION)"
	echo "  OS = $(OS)"
	echo "  ARCH = $(ARCH)"
	echo "  DBG = $(DBG)"
	echo "  GOFLAGS = $(GOFLAGS)"
	echo
	echo "TARGETS:"
	grep -E '^.*: *# *@HELP' $(MAKEFILE_LIST)     \
	    | awk '                                   \
	        BEGIN {FS = ": *# *@HELP"};           \
	        { printf "  %-30s %s\n", $$1, $$2 };  \
	    '
