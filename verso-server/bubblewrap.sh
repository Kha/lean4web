#!/usr/bin/env bash

ulimit -t 120

# Resolve symlinks                                                                                                       
INPUT_DIR="$(realpath "$1")"
shift
WORK_DIR="$(realpath "$1")"
shift
OUTPUT_DIR="$(realpath "$1")"
shift

LEAN_ROOT="$(cd $INPUT_DIR && lean --print-prefix)"

GIT_PATH=$(dirname $(realpath $(which git)))
DIRNAME_PATH=$(dirname $(realpath $(which dirname)))
echo "git path $GIT_PATH"
echo "dirname path $DIRNAME_PATH"
echo "lean root $LEAN_ROOT"

exec bwrap \
    --ro-bind /nix /nix \
    \
    --dev /dev	\
    --tmpfs /tmp \
    --proc /proc \
    \
    --clearenv \
    --setenv PATH "$GIT_PATH:$DIRNAME_PATH" \
    \
    --overlay-src "$INPUT_DIR" \
    --overlay "$OUTPUT_DIR" "$WORK_DIR" /project \
    \
    --unshare-all  \
    --die-with-parent \
    --chdir /project \
    $LEAN_ROOT/bin/lake --old --keep-toolchain exe mkdoc
