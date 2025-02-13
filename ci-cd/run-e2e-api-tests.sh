#!/bin/bash

set -eu -p pipefail

DOCKER_COMPOSE_FILE_PATH="./docker-compose.test.yml"

printf '\nRun E2E API tests *************************************************\n'

# Build all images and starts up all containers
docker compose --file "$DOCKER_COMPOSE_FILE_PATH" up \
  --build \
  --detach

docker exec api-test bash -c "npm run test:e2e-api"

docker compose --file "$DOCKER_COMPOSE_FILE_PATH" down
