#!/bin/bash

# We need to recreate .env files before building containers, otherwise Docker
# Compose will error, 'cause these files are listed in the "env_file" property
# of each service in docker-compose YML files.
#
# Details: As we never commit .env files to the repo we need some way to access # these files in CI pipeline. To do this, we copy the contents of each .env
# file into secrets and/or variables on GitHub website. Than, when this script
# runs in CI pipeline, inside the GitHub Runner container, we recreate the dir
# structure and .env files and echo the contents of each variable in these
# files. So we end up with the same .env files as we have locally. Now when we
# build Docker images, Docker Compose picks up .env files, as they're mentioned
# in docker-compose YML files and after building images, all env vars defined
# inside .env files are available inside app's containers when they run, while
# the GitHub Runner container is destroyed at the end of the CI job.
#
# TIP If you've update your local .env files, you also need to update variables
# and/or secrets on GitHub website: opy-paste the contents of each .env file
# and update the resposective env vars at https://github.com/andreyponomarevru/livestreamer/settings/secrets/actions

set -eu -p pipefail

printf '\nCreate .env files for each service ********************************\n'

API_ROOT_DIR="./api/docker"
mkdir -p "$API_ROOT_DIR"
echo "$API_COMMON_ENV" >>"$API_ROOT_DIR/.api.common.env"
echo "$API_DEV_ENV" >>"$API_ROOT_DIR/.api.dev.env"
echo "$API_PROD_ENV" >>"$API_ROOT_DIR/.api.prod.env"
echo "$API_TEST_ENV" >>"$API_ROOT_DIR/.api.test.env"

POSTGRES_ROOT_DIR="./postgres/docker"
mkdir -p "$POSTGRES_ROOT_DIR"
echo "$POSTGRES_COMMON_ENV" >>"$POSTGRES_ROOT_DIR/.postgres.common.env"
echo "$POSTGRES_DEV_ENV" >>"$POSTGRES_ROOT_DIR/.postgres.dev.env"
echo "$POSTGRES_PROD_ENV" >>"$POSTGRES_ROOT_DIR/.postgres.prod.env"
echo "$POSTGRES_TEST_ENV" >>"$POSTGRES_ROOT_DIR/.postgres.test.env"
