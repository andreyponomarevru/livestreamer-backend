FROM postgres:latest AS base
WORKDIR /sql
# Copy SQL files executed by init script(s)
# It copies the _content_ of ./schema/ and ./seeds/ into respective dirs in image
COPY ./schema/ ./schema
COPY ./seeds/ ./seeds

#
# Development
#

FROM base AS development
WORKDIR /sql
# Copy init script(s)
# COPY ./docker-entrypoint-initdb.d /docker-entrypoint-initdb.d
COPY ./docker-entrypoint-initdb.d/init-test.sh /docker-entrypoint-initdb.d/init-test.sh

#
# Test
#

FROM base AS test
WORKDIR /sql
# Copy init script(s)
COPY ./docker-entrypoint-initdb.d/init-test.sh /docker-entrypoint-initdb.d/init-test.sh

#
# Production
#

FROM base AS production
WORKDIR /sql
# Copy init script(s)
COPY ./docker-entrypoint-initdb.d/init-prod.sh /docker-entrypoint-initdb.d/init-prod.sh
