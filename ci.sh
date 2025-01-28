#!/bin/bash

set -eu -p pipefail

printf '\nEXECUTE CONTINUOUS INTEGRATION SCRIPT\n'
#printf "\nCURRENT ENVIRONMENT: %s\n" "${NODE_ENV}"

mkdir -p ./api/docker

echo "$API_COMMON_ENV"

echo "$API_COMMON_ENV" >>./api/docker/.api.common.env

cat ./api/docker/.api.common.env

echo "$API_DEV_ENV" >>./api/docker/.api.dev.env
echo "$API_PROD_ENV" >>./api/docker/.api.prod.env
echo "$API_TEST_ENV" >>./api/docker/.api.test.env

mkdir -p postgres/docker

echo "$POSTGRES_COMMON_ENV" >>./postgres/docker/.postgres.common.env
echo "$POSTGRES_DEV_ENV" >>./postgres/docker/.postgres.dev.env
echo "$POSTGRES_PROD_ENV" >>./postgres/docker/.postgres.prod.env
echo "$POSTGRES_TEST_ENV" >>./postgres/docker/.postgres.test.env

printf "\nBuild images and start all containers\n"

docker compose --file ./docker-compose.test.yml up --detach --build

printf "\nRun Unit Tests\n"
docker exec -it api-test bash -c "npm run test:unit"

printf "\nStop all containers\n"
docker compose --file ./docker-compose.test.yml down

# TODO: better options is to run all npm commands shown below directky in GitHub Acttion workflow file, that way you will be able to see each type of test failing separately nd continue executing next type of test

#if [[ "${NODE_ENV}" == "production" ]]; then
#printf "Run Unit Tests ...\n\n"
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
