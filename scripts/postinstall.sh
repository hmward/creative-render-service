#!/usr/bin/env bash

set -o nounset -o errexit -o pipefail

deployment="${ENV:-development}"

echo "Building: ${deployment}..."

if [[ "${deployment}" = "production" ]]; then
  npm run build:prod
else
  npm run build
fi