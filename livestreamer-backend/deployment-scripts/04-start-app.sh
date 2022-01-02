#!/bin/bash

set -eu 



# cd into root to get the project name from path
cd ..

PROJECT_NAME="$(basename "$PWD")"
read -p "Production server username (used to SSH into VPS): " PROD_SERVER_USER
read -p "Production server IP: " PROD_SERVER_IP
echo



echo "================="
echo "=== Start app ==="
echo "================="

echo

echo "1. SSH into VPS"
ssh \
  "$PROD_SERVER_USER@$PROD_SERVER_IP" \
  "cd "/home/$PROD_SERVER_USER/$PROJECT_NAME" && \
   echo && \
   echo "2. Build the image and start app in containers in detached mode" && \
   docker-compose up -d && \
   echo && \
   echo "3. Log out of VPS" &&
   exit"

echo

echo "Tha app has been started successfully!"

echo "Now update your Nginx config to make the app available to the world."
