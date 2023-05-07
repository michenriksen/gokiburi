#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

if ! command -v "golangci-lint" >/dev/null 2>&1; then
    echo "golangci-lint is not installed. See https://golangci-lint.run/usage/install/#local-installation"
    exit 1
fi

echo -n "running go vet: "
ERRS=$(go vet "$@" 2>&1 || true)
if [ "$ERRS" != "" ]; then
    echo "FAIL"
    echo "$ERRS"
    echo
    exit 1
fi
echo "PASS"

echo -n "running golangci-lint: "
ERRS=$(golangci-lint run "$@" 2>&1 || true)
if [ "$ERRS" != "" ]; then
    echo "FAIL"
    echo "$ERRS"
    echo
    exit 1
fi
echo "PASS"
