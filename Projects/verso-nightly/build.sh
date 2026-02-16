#!/usr/bin/env bash

# See ../MathlibDemo/build.sh, this is the same principle but for verso/nightly-testing
cd $(dirname $0)
curl -L https://raw.githubusercontent.com/leanprover/verso/nightly-testing/lean-toolchain -o lean-toolchain
lake update -R
lake build
lake exe mkdoc --output /dev/null