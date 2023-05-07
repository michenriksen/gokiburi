#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

if ! command -v "semgrep" >/dev/null 2>&1; then
    echo "semgrep is not installed. See https://semgrep.dev/docs/getting-started/"
    exit 1
fi

if ! command -v "govulncheck" >/dev/null 2>&1; then
    echo "govulncheck is not installed. See https://pkg.go.dev/golang.org/x/vuln/cmd/govulncheck"
    exit 1
fi

semgrepgoexcluded=(
  "go.lang.security.audit.crypto.bad_imports.insecure-module-used"
  "go.lang.security.audit.crypto.use_of_weak_crypto.use-of-sha1"
)

# semgrepfeexcluded=()

semgrepgoargs=("--config" "p/golang")
semgrepfeargs=("--config" "p/typescript" "--exclude" "skeleton")

for rule in "${semgrepgoexcluded[@]}"; do
  semgrepgoargs+=("--exclude-rule" "$rule")
done

# for rule in "${semgrepfeexcluded[@]}"; do
#   semgrepfeargs+=("--exclude-rule" "$rule")
# done

tmpfile=$(mktemp)
exitstatus=""

if [[ -z "${1:-}" || "${1:-}" == "go" ]]; then
    echo -n "auditing go dependencies with govulncheck: "
    govulncheck ./... > "$tmpfile" 2>&1 || exitstatus=$?
    if [ "$exitstatus" != "" ]; then
        echo "FAIL"
        cat "$tmpfile"
        echo
        exit 1
    fi
    echo "PASS"
    rm "$tmpfile"

    echo -n "auditing go files with semgrep: "
    ERRS=$(semgrep scan --quiet "${semgrepgoargs[@]}" . 2>&1 || true)
    if [ "$ERRS" != "" ]; then
        echo "FAIL"
        echo "$ERRS"
        echo
        exit 1
    fi
    echo "PASS"
fi

if [[ -z "${1:-}" || "${1:-}" == "fe" ]]; then
    (
    cd web/app/src
    tmpfile=$(mktemp)
    echo -n "auditing frontend dependencies with npm audit: "
    npm audit > "$tmpfile" 2>&1 || exitstatus=$?
    if [ "$exitstatus" != "" ]; then
        echo "FAIL"
        echo "$ERRS"
        echo
        exit 1
    fi
    echo "PASS"
    rm "$tmpfile"
    )

    echo -n "auditing frontend files with semgrep: "
    ERRS=$(semgrep scan --quiet "${semgrepfeargs[@]}" web/app/src 2>&1 || true)
    if [ "$ERRS" != "" ]; then
        echo "FAIL"
        echo "$ERRS"
        echo
        exit 1
    fi
    echo "PASS"
fi

if [[ -z "${1:-}" || "${1:-}" == "gha" ]]; then
    echo -n "auditing GitHub Actions with semgrep: "
    ERRS=$(semgrep scan --quiet --config "p/github-actions" .github 2>&1 || true)
    if [ "$ERRS" != "" ]; then
        echo "FAIL"
        echo "$ERRS"
        echo
        exit 1
    fi
    echo "PASS"
fi
