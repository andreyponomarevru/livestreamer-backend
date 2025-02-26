#!/bin/bash

set -eu -p pipefail

DOCKER_COMPOSE_FILE_PATH="./docker-compose.test.yml"

printf '\nRun integration tests *********************************************\n'

docker compose --file "$DOCKER_COMPOSE_FILE_PATH" up \
  --build \
  --detach

docker exec api-test bash -c "npm run test:int"

docker compose --file "$DOCKER_COMPOSE_FILE_PATH" down
