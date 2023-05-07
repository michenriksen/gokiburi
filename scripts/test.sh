#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

echo "running tests:"
go test -shuffle on -cover -covermode atomic -race "$@"
echo
