#!/bin/bash

set -eu -p pipefail

cd ./api
npm ci
npm run ci:lint
npm run ci:prettier
# Verify that there are no build errors
npm run build
