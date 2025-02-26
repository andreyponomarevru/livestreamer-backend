#!/bin/bash

set -eu -p pipefail

DOCKER_COMPOSE_FILE_PATH="./docker-compose.prod.yml"

printf '\nBuild images ******************************************************\n'
docker compose --file "$DOCKER_COMPOSE_FILE_PATH" build

printf '\nPush images to Docker Hub *****************************************\n'
docker compose --file "$DOCKER_COMPOSE_FILE_PATH" push --include-deps --quiet
