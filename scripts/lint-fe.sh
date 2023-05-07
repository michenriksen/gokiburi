#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

(
  cd "$(dirname "${BASH_SOURCE[0]}")/../web/app"

  echo -n "running prettier: "
  ERRS=$(npx prettier --plugin-search-dir . --loglevel warn --check . 2>&1 || true)
  if [ "$ERRS" != "" ]; then
      echo "FAIL"
      echo "$ERRS"
      echo
      exit 1
  fi
  echo "PASS"

  echo -n "running eslint: "
  ERRS=$(npx eslint --quiet 2>&1 || true)
  if [ "$ERRS" != "" ]; then
      echo "FAIL"
      echo "$ERRS"
      echo
      exit 1
  fi
  echo "PASS"
)
