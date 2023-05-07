#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

if ! command -v "syft" >/dev/null 2>&1; then
    echo "syft is not installed. https://github.com/anchore/syft/#installation"
    exit 1
fi

tempfile=$(mktemp)

echo -n "running syft: "
ERRS=$(syft --quiet -o template -t dependencies.csv.tmpl --file "$tempfile" --exclude "./build/*,./dist/*,./web/app/build/**/*" .)
if [ "$ERRS" != "" ]; then
    echo "FAIL"
    echo "$ERRS"
    echo
    exit 1
fi
echo "SUCCESS"

echo -n "sorting and de-duplicating CSV lines: "
(head -n 1 "$tempfile"; grep -v "^$" <(tail -n +2 "$tempfile") | sort) | uniq > "$tempfile.uniq" && mv "$tempfile.uniq" dependencies.csv
echo "SUCCESS"

rm "$tempfile"
