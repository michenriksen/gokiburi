#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

if ! command -v "docker" >/dev/null 2>&1; then
    echo "docker is not installed. https://docs.docker.com/desktop/"
    exit 1
fi

daggerContainer=$(docker container list --all --filter 'name=^dagger-engine-*' --format '{{.Names}}')
daggerImage=$(docker image list --all --filter=reference='registry.dagger.io/engine' --format '{{.ID}}')

if [ "$daggerContainer" != "" ]; then
    echo -n "stopping dagger engine container: $daggerContainer "
    docker container stop "$daggerContainer" >/dev/null
    echo "SUCCESS"

    echo -n "removing dagger engine container: $daggerContainer "
    docker container rm --volumes "$daggerContainer" >/dev/null
    echo "SUCCESS"
else
    echo "dagger engine container not found"
fi

if [ "$daggerImage" != "" ]; then
    echo -n "removing dagger engine image: $daggerImage "
    docker image rm "$daggerImage" >/dev/null
    echo "SUCCESS"
else
    echo "dagger engine image not found"
fi
