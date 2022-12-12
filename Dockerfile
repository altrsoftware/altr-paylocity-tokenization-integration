FROM node:16.2.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY server.js .

RUN mkdir utils
COPY ./utils/* ./utils/

CMD ["node", "server.js"]