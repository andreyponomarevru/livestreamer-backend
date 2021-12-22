#!/bin/bash

set -eu

echo -ne "\n##\n##\tRUNNING WITH ENVIRONMENT=\"${NODE_ENV}\"\n##\n\n"

#
#
# 

echo "Start app..."

if [ "${NODE_ENV}" == "test" ]
then
	npm run serve:test
fi

if [ "${NODE_ENV}" == "development" ]
then
  npm run serve:dev
fi

if [ "${NODE_ENV}" == "production" ]
then
	npm run build
else
  echo -ne "Invalid argument. Allowed values are: 'dev', 'test', 'prod'\n\n"
fi
