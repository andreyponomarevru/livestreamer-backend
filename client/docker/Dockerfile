FROM node:14

WORKDIR /client

COPY package*.json ./
RUN npm install

# Bundle app source 
COPY . .

CMD npm run serve
