#!/usr/bin/env bash

# See ../MathlibDemo/build.sh
cd $(dirname $0)
curl -L https://raw.githubusercontent.com/leanprover-community/mathlib4/stable/lean-toolchain -o lean-toolchain
lake update -R
lake build
lake build Batteries
