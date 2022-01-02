#!/bin/bash

set -eu 



# cd into root to get the project name from path
cd ..

PROJECT_NAME="$(basename "$PWD")"
read -p "Production server username (used to SSH into VPS): " PROD_SERVER_USER
read -p "Production server IP: " PROD_SERVER_IP
echo

echo "============================="
echo "=== Set up project on VPS ==="
echo "============================="

echo

echo "1. SSH into VPS."
echo "2. Recreate project structure required by "docker-compose.prod.yml"."
echo "3. Log out of VPS."
ssh "$PROD_SERVER_USER@$PROD_SERVER_IP" "\
  mkdir -p "/home/$PROD_SERVER_USER/$PROJECT_NAME/api/docker" \
           "/home/$PROD_SERVER_USER/$PROJECT_NAME/postgres/docker" | \
  exit"

echo

echo "4. Copy the "docker-compose.yml" and "docker-compose.prod.yml" to VPS to "/home/$PROD_SERVER_USER/$PROJECT_NAME/""
rsync \
  --progress \
  --archive \
  --rsh=ssh \
  ./docker-compose.yml "$PROD_SERVER_USER@$PROD_SERVER_IP:/home/$PROD_SERVER_USER/$PROJECT_NAME/"

rsync \
  --progress \
  --archive \
  --rsh=ssh \
  ./docker-compose.prod.yml "$PROD_SERVER_USER@$PROD_SERVER_IP:/home/$PROD_SERVER_USER/$PROJECT_NAME/"
  
echo

echo "The project has been set up on VPS successfully!"
