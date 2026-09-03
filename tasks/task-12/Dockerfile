FROM node:22

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY server.js ./

EXPOSE 8080

CMD ["node", "server.js"]