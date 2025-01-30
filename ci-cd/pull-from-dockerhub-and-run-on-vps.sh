#!/bin/bash

# SCRIPT IS NOT TESTED

set -eu -p pipefail

readonly VPS_APP_DIR_PATH="/home/$VPS_SSH_USERNAME/test"

printf "\n1. Set up app onv VPS ******************************************** \n"

# SSH into VPS > Recreate project structure required by "docker-compose.prod.yml" > Log out of VPS.

# I think we don't need , Compose shouldn't build images, so no need for this. If its true, remove this commented out block.
#ssh "$VPS_SSH_USERNAME@$VPS_SSH_HOST" "\
#  mkdir -p '/home/\$USERNAME/test/api/docker' \
#           '/home/\$USERNAME/test/postgres/docker' | \
#           '/home/\$PUSERNAME/test/redis' \
#  exit"

# Copy files to VPS
rsync \
  --progress \
  --archive \
  --rsh=ssh \
  ./docker-compose.prod.yml "$VPS_SSH_USERNAMER@$VPS_SSH_HOST:$VPS_APP_DIR_PATH/"

rsync \
  --progress \
  --archive \
  --rsh=ssh \
  ./ci-cd/start-app.sh "$VPS_SSH_USERNAMER@$VPS_SSH_HOST:$VPS_APP_DIR_PATH/"

# Uncomment this, it should be executed
#ssh \
#  "$VPS_SSH_USERNAME@$VPS_SSH_HOST" \
#  "cd $VPS_APP_DIR_PATH && ./start-app.sh && exit"
