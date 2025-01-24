ARG NODE_VERSION=22.13.1

# I keep everything in /home/node, 'cause otherwise there is a permissions error
# during build: by default in node image only the /home/node is owned by the
# node user. When you set another WORKDIR, it will ALWAYS be owned by
# the root, hence there will always be a permissions error during build.

FROM node:${NODE_VERSION}-alpine AS base
RUN apk add --upgrade --no-cache bash
USER node
WORKDIR /home/node
COPY --chown=node:node package*.json ./

#
# Development image
#

FROM base AS dev
USER node
ENV NODE_ENV dev
WORKDIR /home/node
# Download Bash package > install Bash (to be able to execute scripts) >
# > remove the downloaded package to free up space (Bash remains installed)
RUN npm ci --include=dev
# We copy the whole dir instead of only "./src" because otherwise directories
# with test files won't be included
COPY --chown=node:node . .
# TODO CMD yarn run migratesql up && yarn run serve:dev
RUN [ "bash", "/home/node/docker/start-app" ]

#
# Production image
#

# TODO This iamge should not contain any test files or testing libs like Jest, fakes and anything test-related

# Stage 1: compile TS to JS

FROM base AS js
USER node
WORKDIR /home/node
COPY --chown=node:node tsconfig*.json ./
# Install dependencies
RUN npm ci && npm cache clean --force
COPY --chown=node:node ./src ./src
RUN npm run build

# Stage 2: strip all things TypeScript from our image

FROM base AS prod_base
USER node
WORKDIR /home/node
COPY --chown=node:node --from=js /home/node/build ./
# Install only production dependencies
RUN npm ci --omit=dev

# Stage 3: copy only the required files from stages above). Creates final production image ready to be deployed

FROM node:lts-alpine AS prod
USER node
ENV NODE_ENV prod
WORKDIR /home/node
COPY --from=prod_base /home/node ./

CMD ["node", "index.js"]

#
# Test image
#

FROM base AS test
USER node
# Set NODE_ENV for bash script cause it won't see env vars set in docker-compose.test.yaml
ENV NODE_ENV test
WORKDIR /home/node
RUN npm ci --include=dev
COPY --chown=node:node . .
#CMD ["tail", "-f", "/dev/null"]
RUN [ "bash", "/home/node/docker/start-app" ]
