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

exec bwrap \
    --ro-bind /nix /nix \
    --ro-bind /run /run \
    --ro-bind "$LEAN_ROOT" /lean \
    \
    --dev /dev	\
    --tmpfs /tmp \
    --proc /proc \
    \
    --clearenv \
    --setenv PATH "$PATH" \
    \
    --overlay-src "$INPUT_DIR" \
    --overlay "$OUTPUT_DIR" "$WORK_DIR" /project \
    \
    --unshare-all  \
    --die-with-parent \
    --chdir /project \
    /lean/bin/lake --old --keep-toolchain exe mkdoc
