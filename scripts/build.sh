#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

if [ "${OS:-}" = "" ]; then
    echo "OS must be set"
    exit 1
fi
if [ "${ARCH:-}" = "" ]; then
    echo "ARCH must be set"
    exit 1
fi
if [ "${VERSION:-}" = "" ]; then
    echo "VERSION must be set"
    exit 1
fi

export CGO_ENABLED=0
export GOARCH="$ARCH"
export GOOS="$OS"
export GO111MODULE=on

if [[ "${DBG:-}" == 1 ]]; then
    # Debugging - disable optimizations and inlining.
    gogcflags="all=-N -l"
    goasmflags=""
    goldflags=""
else
    # Not debugging - trim paths, disable symbols and DWARF.
    goasmflags="all=-trimpath=$(go env GOPATH)"
    gogcflags="all=-trimpath=$(go env GOPATH)"
    goldflags="-s -w"
fi

buildcommit=${BUILD_COMMIT:-$(git rev-parse HEAD)}
buildtime=${BUILD_TIME:-$(date -u +"%Y-%m-%dT%H:%M:%SZ")}
buildgoversion=${BUILD_GO_VERSION:-$(go version | awk '{print $3}')}
buildosarch="$OS/$ARCH"

gokiburipkg="$(go list -m)/internal/gokiburi"

echo -n "building $BIN v$VERSION for $OS/$ARCH: "
ERRS=$(go build -gcflags="$gogcflags" -asmflags="$goasmflags" -ldflags "-X $gokiburipkg.buildVersion=$VERSION -X $gokiburipkg.buildCommit=$buildcommit -X $gokiburipkg.buildTime=$buildtime -X $gokiburipkg.buildGoVersion=$buildgoversion -X $gokiburipkg.buildOSArch=$buildosarch $goldflags" -o "bin/$BIN$BIN_EXTENSION" main.go || true)
if [ "$ERRS" != "" ]; then
    echo "FAIL"
    echo "$ERRS"
    echo
    exit 1
fi
echo "SUCCESS"
