FROM node:lts-alpine3.19

WORKDIR /usr/src/app

COPY package* .
COPY yarn* .

RUN yarn install

COPY . .

EXPOSE 7777

CMD ["node","dist/index.js"]
