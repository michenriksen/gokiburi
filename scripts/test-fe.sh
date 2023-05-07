#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

(
  cd "$(dirname "${BASH_SOURCE[0]}")/../web/app"

  echo "running frontend tests:"
  npx vitest --run --silent --no-color
  echo
)
