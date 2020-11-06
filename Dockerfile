FROM node:alpine
WORKDIR /board
ADD package*.json ./
RUN npm install
ADD . .
CMD [ "node", "server.js" ]
