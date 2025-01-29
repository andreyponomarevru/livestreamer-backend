#!/bin/bash

set -eu -p pipefail

DOCKER_COMPOSE_FILE_PATH="./docker-compose.test.yml"

printf '\nRun integration tests *********************************************\n'

# Build all images and starts up all containers
docker compose --file "$DOCKER_COMPOSE_FILE_PATH" up \
  --build \
  --detach

npm run test:int

docker compose --file "$DOCKER_COMPOSE_FILE_PATH" down
