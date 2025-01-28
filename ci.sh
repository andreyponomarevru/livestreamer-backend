#!/bin/bash

set -eu -p pipefail

printf '\n*************************************\n'
printf '\nEXECUTE CONTINUOUS INTEGRATION SCRIPT\n'
printf '\n*************************************\n'

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

printf '\n*************************************\n'
printf '\nBuild images and start all containers\n'
printf '\n*************************************\n'

docker compose --file ./docker-compose.test.yml up --detach --build

printf '\n**************\n'
printf '\nRun Unit Tests\n'
printf '\n**************\n'

docker exec api-test bash -c "npm run test:unit"

printf '\n*******************\n'
printf '\nStop all containers\n'
printf '\n*******************\n'

docker compose --file ./docker-compose.test.yml down

#---------------------

# TODO: better options is to run all npm commands shown below directky in GitHub Acttion workflow file, that way you will be able to see each type of test failing separately nd continue executing next type of test

#npm run test:unit
#printf "\n\nRun Integration Tests ...\n\n"
#npm run test:int
#printf "\n\nRun E2E HTTP API Tests ...\n\n"
#npm run test:e2e-api
#printf "\n\nPrint test coverage ...\n\n"
#npm run test:coverage
#else
#printf "Invalid NODE_ENV. Only \"production\" NODE_ENV is allowed.\n\n"
#fi
