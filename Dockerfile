FROM node:18.17.1

WORKDIR /home/node/app

RUN mkdir -p /home/node/app/node_modules
RUN chown -R node:node /home/node/app

USER node

COPY .npmrc .
COPY package*.json .
RUN npm ci

COPY tsconfig*.json .
