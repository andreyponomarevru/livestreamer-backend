#!/bin/bash

set -eu -p pipefail

cd ./test/livestreamer-backend
git pull git@github.com:andreyponomarevru/livestreamer-backend.git

printf "\n1. Pull images from Docker Hub and (re)starts app **************** \n"

#docker-compose --file "./docker-compose.prod.yml" pull --include-deps

printf "\n2. Restart the container ******************************************\n"

#docker-compose --file "./docker-compose.prod.yml" up \
#  --no-build \
#  --detach \
#  --force-recreate

printf "\n2. Delete old images **********************************************\n"
#docker image prune --force

printf "\nThe app has been successfully (re)started! ************************\n"
