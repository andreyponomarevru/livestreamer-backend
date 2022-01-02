#!/bin/bash

set -eu 



# cd into root to get the project name from path
cd ..

PROJECT_NAME="$(basename "$PWD")"
read -p "Production server username (used to SSH into server): " PROD_SERVER_USER
read -p "Production server IP: " PROD_SERVER_IP
echo

echo "======================================================"
echo "=== Update project environment variables on server ==="
echo "======================================================"

echo

echo "Copy ".env" files from local machine to production server."
rsync \
  --progress \
  --archive \
  --rsh=ssh \
  ./api/docker/.prod.env \
  "$PROD_SERVER_USER@$PROD_SERVER_IP:/home/$PROD_SERVER_USER/$PROJECT_NAME/api/docker/"
rsync \
  --progress \
  --archive \
  --rsh=ssh \
  ./api/docker/.common.env \
  "$PROD_SERVER_USER@$PROD_SERVER_IP:/home/$PROD_SERVER_USER/$PROJECT_NAME/api/docker/"

rsync \
  --progress \
  --archive \
  --rsh=ssh \
  ./postgres/docker/.prod.env \
  "$PROD_SERVER_USER@$PROD_SERVER_IP:/home/$PROD_SERVER_USER/$PROJECT_NAME/postgres/docker/"
rsync \
  --progress \
  --archive \
  --rsh=ssh \
  ./postgres/docker/.common.env \
  "$PROD_SERVER_USER@$PROD_SERVER_IP:/home/$PROD_SERVER_USER/$PROJECT_NAME/postgres/docker/"

echo

echo "Project environment variables on production server has been updated successfully!"
