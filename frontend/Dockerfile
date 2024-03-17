FROM node:20.11-alpine as build
WORKDIR /usr/src/app
ADD *.json ./
RUN npm install
ADD ./public ./public
ADD ./src ./src
ADD ./webpack ./webpack