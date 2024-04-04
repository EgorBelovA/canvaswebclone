FROM node:20.11

WORKDIR /app
COPY package*.json ./

RUN npm install
COPY . .
# ADD ./public ./public
# ADD ./src ./src
# ADD ./webpack ./webpack