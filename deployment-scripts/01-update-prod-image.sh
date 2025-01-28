#!/bin/bash

# DO NOT RUN THIS SCRIPT, IT IS NOT FINISHED. For now, use it as a reference to issue the commands manually.

# DESCRIPTION
#     Update production image (first locally and then on Docker Hub)
#
# NOTES
#     Before running the script make sure you have file
#     "docker-hub-password.txt" containing a string with your Docker Hub
#     password in the same directory as this script

set -eu

# cd into root to get the project name from path
cd ..

PROJECT_NAME="$(basename "$PWD")"
read -p "Docker Hub username: " DOCKER_HUB_USERNAME

echo "================================"
echo "=== Update production images ==="
echo "================================"

echo

# TODO: add prompt
echo "1. Manually uncomment "build" instruction of each service in "docker-compose.prod.yml".\nWhen you're ready, press "y"."

echo

echo "2. Update production images"
docker-compose -f docker-compose.prod.yml build --no-cache
cd ./deployment-scripts

# TODO: add prompt
echo "3. Comment out "build" instruction of each service in "docker-compose.prod.yml" again.\nWhen you're ready, press "y"."

echo

echo "4. Log in to Docker Hub"
cat ./docker-hub-password.txt | docker login --username "$DOCKER_HUB_USERNAME" --password-stdin

echo

# TODO: Project name should be as follows: ponomarevandrey/livestreamer-backend_redis

echo "5. Push production image to Docker Hub"
docker push "$DOCKER_HUB_USERNAME/$PROJECT_NAME:latest" #db
docker push                                             # redis
docker push                                             # api

echo

echo "6. Log out of Docker Hub"
docker logout

echo

echo "Your local images related to this project:"
docker image ls | grep "$DOCKER_HUB_USERNAME/$PROJECT_NAME"

echo

echo "Production images has been updated successfully!"
