#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

if [ "${APP_NAME:-}" = "" ]; then
    echo "APP_NAME must be set"
    exit 1
fi

if [ "${VERSION:-}" = "" ]; then
    echo "VERSION must be set"
    exit 1
fi

if [[ ${VERSION:0:1} == "v" ]]; then
    version="${VERSION:1}"
else
    version="$VERSION"
fi

(
  cd "$(dirname "${BASH_SOURCE[0]}")/../web/app"

  export PUBLIC_APP_NAME="$APP_NAME"
  export PUBLIC_APP_VERSION="$version"

  tmpfile=$(mktemp)
  exitstatus=""

  echo -n "building frontend: "
  npm run build > "$tmpfile" 2>&1 || exitstatus=$?
  if [ "$exitstatus" != "" ]; then
    echo "FAIL"
    cat "$tmpfile"
    exit 1
  fi
  echo "SUCCESS"
  rm "$tmpfile"
)
