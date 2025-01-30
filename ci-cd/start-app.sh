#!/bin/bash

# SCRIPT IS NOT TESTED

set -eu -p pipefail

printf "\n1. Pull images from Docker Hub and (re)starts app **************** \n"

docker-compose --file "./docker-compose.prod.yml" pull --include-deps

printf "\n2. Restart the container ******************************************\n"

docker-compose --file "./docker-compose.prod.yml" up \
  --no-build \
  --detach \
  --force-recreate

prtinf "\n2. Delete old images **********************************************\n"
docker image prune --force

printf "\nThe app has been successfully (re)started! ************************\n"
