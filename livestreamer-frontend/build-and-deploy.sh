#!/bin/bash

set -eu



USERNAME="$VPS_USER_SIMPLECLOUD"
VPS_IP="$VPS_IP_SIMPLECLOUD"
VPS_PROJECT_DIR=""/var/www/live.andreyponomarev.ru/html/



echo "1. Build project."
echo

docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build

echo

echo "2. Upload to server."
echo 

rsync \
  --archive \
  --rsh=ssh \
  --verbose \
  --progress \
  ./client/dist/* "$USERNAME@$VPS_IP:$VPS_PROJECT_DIR"

echo
