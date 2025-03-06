#!/bin/bash

set -eu -p pipefail

DOCKER_COMPOSE_FILE_PATH="./docker-compose.test.yml"

printf '\nRun unit tests ****************************************************\n'

docker compose --file "$DOCKER_COMPOSE_FILE_PATH" up \
  --build \
  --detach \
  --no-deps \
  api

docker exec api-test bash -c "npm run test:unit -- --no-watchAll"
docker exec api-test bash -c "npm run test:coverage"

docker compose --file "$DOCKER_COMPOSE_FILE_PATH" down
