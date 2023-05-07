DBG_MAKEFILE ?=
ifeq ($(DBG_MAKEFILE),1)
    $(warning ***** starting Makefile for goal(s) "$(MAKECMDGOALS)")
    $(warning ***** $(shell date))
else
    MAKEFLAGS += -s
endif

BIN ?= gokiburi

APP_NAME ?= $(BIN)

ifeq ($(VERSION),)
  VERSION := $(shell git log -1 --format="%ad-%h" --date=format-local:"%Y%m%d%H%M%S" --abbrev=12)
endif

DBG ?=

MAKEFLAGS += --no-builtin-rules
MAKEFLAGS += --warn-undefined-variables
.SUFFIXES:

OS := $(if $(GOOS),$(GOOS),$(shell go env GOOS))
ARCH := $(if $(GOARCH),$(GOARCH),$(shell go env GOARCH))

TAG := $(VERSION)__$(OS)_$(ARCH)

BIN_EXTENSION :=
ifeq ($(OS), windows)
  BIN_EXTENSION := .exe
endif

SHELL := /usr/bin/env bash -o errexit -o pipefail -o nounset

GOFLAGS ?=
HTTP_PROXY ?=
HTTPS_PROXY ?=

export BIN
export BIN_EXTENSION
export APP_NAME
export VERSION
export DBG
export OS
export ARCH
export GOFLAGS
export HTTP_PROXY
export HTTPS_PROXY

build: # @HELP builds binary to ./build directory for one platform ($OS/$ARCH)
build: build-fe
	scripts/build.sh

build-fe: # @HELP builds frontend, as defined in ./scripts/build-fe.sh
build-fe:
	scripts/build-fe.sh

version: # @HELP outputs the version string
version:
	echo $(VERSION)

version-next: # @HELP outputs the next version string based on commits.
version-next:
	svu next

test-all: # @HELP runs tests for Go and frontend
test-all: test test-fe

test: # @HELP runs tests, as defined in ./scripts/test.sh
test:
	scripts/test.sh ./...

test-fe: # @HELP runs frontend tests, as defined in ./scripts/test-fe.sh
test-fe:
	scripts/test-fe.sh

lint-all: # @HELP runs linting for Go and frontend
lint-all: lint lint-fe

lint: # @HELP runs linting, as defined in ./scripts/lint.sh
lint:
	scripts/lint.sh ./...

audit-all: # @HELP runs Go, frontend, and GitHub Actions security audits
audit-all:
	scripts/audit.sh

audit: # @HELP runs Go security audits, as defined in ./scripts/audit.sh
audit:
	scripts/audit.sh go

audit-fe: # @HELP runs frontend security audits, as defined in ./scripts/audit.sh
audit-fe:
	scripts/audit.sh fe

audit-gha: # @HELP runs GitHub Actions security audits, as defined in ./scripts/audit.sh
audit-gha:
	scripts/audit.sh gha

lint-fe: # @HELP runs frontend linting, as defined in ./scripts/lint-fe.sh
lint-fe:
	scripts/lint-fe.sh

clean: # @HELP removes build artifacts
clean:
	rm -rf ./bin
	rm -rf ./dist
	rm -rf ./web/app/build
	rm -f ./dependencies.csv
	rm -f ./gokiburi.spdx.sbom

dep-csv: # @HELP generates CVS of dependencies to ./dependencies.csv
dep-csv:
	scripts/dep-csv.sh

sbom: # @HELP generates SBOM file to ./gokiburi.spdx.sbom
sbom:
	scripts/sbom.sh

help: # @HELP prints this message
help:
	echo "VARIABLES:"
	echo "  BIN = $(BIN)"
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
