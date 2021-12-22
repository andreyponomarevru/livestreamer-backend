FROM postgres:latest

WORKDIR /sql

# Copy SQL files executed by init script(s)
# It copied the _content_ of ./schema/ and ./seeds/ into respective dirs in image 
COPY ./schema/ ./schema
COPY ./seeds/ ./seeds
# Copy init script(s)
COPY ./docker-entrypoint-initdb.d /docker-entrypoint-initdb.d
