FROM node:alpine

WORKDIR /api

COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

CMD npm run serve
