#!/bin/bash

set -eu

ENVIRONMENT="$1"

echo -ne "\n##\n##\tRUNNING WITH ENVIRONMENT=\"${ENVIRONMENT}\"\n##\n\n"

if [ "${ENVIRONMENT}" == "test" ]
then
	docker-compose -f ./docker-compose/docker-compose.yml -f ./docker-compose/docker-compose.test.yml up
fi

if [ "${ENVIRONMENT}" == "dev" ]
then
  docker-compose -f ./docker-compose/docker-compose.yml -f ./docker-compose/docker-compose.dev.yml up
fi

if [ "${ENVIRONMENT}" == "prod" ]
then
	docker-compose -f ./docker-compose/docker-compose.yml up
else
  echo -ne "Invalid argument. Allowed values are: 'dev', 'test', 'prod'\n\n"
fi
