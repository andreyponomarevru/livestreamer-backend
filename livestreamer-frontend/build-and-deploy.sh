#!/bin/bash

set -eu



# TODO: run this script on changes in /client dir of the repo 

docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build

echo "Built successfully."

rsync \
  --archive \
  --rsh=ssh \
  --verbose \
  --progress \
  ./client/dist/* "achilles@85.143.217.174:/var/www/live.andreyponomarev.ru/html/"

echo
