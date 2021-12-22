#!/bin/bash

docker-compose up --build

echo "Built successfully."

cp -r ./client/dist ./

# TODO" on changes in /frontend dir of the repo build the image and push to dockerhub

# TODO ssh into server and copy dist folder to vps nginx volume dir

echo ""
