#!/bin/sh
# Run cypress.io in container, see https://docs.cypress.io/examples/examples/docker
# Start the web server inside the container, to avoid mucking around with port forwarding and firewalls
# Runs noninteractively without any argument, or opens interactive UI with "ui" argument.
set -eu

# use the same image as in CI; to change it, change .gitlab-ci.yml
IMAGE=$(grep -o 'docker.io/.*' .gitlab-ci.yml)

RUNC=$(command -v podman || command -v docker) || {
    echo "ERROR: podman or docker is required" >&2
    exit 1
}

if [ "${1:-}" = "ui" ]; then
    exec $RUNC run -it --rm -v .:/source:z -w /source \
        -v /tmp/.X11-unix:/tmp/.X11-unix -e DISPLAY \
        --security-opt label=disable --entrypoint /bin/sh "$IMAGE" \
        -ec "python3 -m http.server 8000 & cypress open --project . --e2e"
else
    # noninteractive
    exec $RUNC run --rm -v .:/source:z -w /source \
        --entrypoint /bin/sh "$IMAGE" \
        -ec "python3 -m http.server 8000 & cypress run"
fi
