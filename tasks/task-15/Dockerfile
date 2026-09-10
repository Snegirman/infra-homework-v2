FROM node:24
WORKDIR /app
COPY package.json .
COPY service .
RUN npm i
EXPOSE 3000
CMD ["node", "server.js"]