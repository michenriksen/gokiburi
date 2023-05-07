#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

if ! command -v "syft" >/dev/null 2>&1; then
    echo "syft is not installed. https://github.com/anchore/syft/#installation"
    exit 1
fi

echo -n "running syft: "
ERRS=$(syft --quiet -o spdx-json --file "$APP_NAME.spdx.sbom" --exclude "./build/*,./dist/*,./web/app/build/*" .)
if [ "$ERRS" != "" ]; then
    echo "FAIL"
    echo "$ERRS"
    echo
    exit 1
fi
echo "SUCCESS"
