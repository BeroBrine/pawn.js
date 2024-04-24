FROM node:latest

WORKDIR /usr/app/
COPY package* .

COPY yarn* .

RUN yarn set version stable
RUN yarn install

COPY . .

EXPOSE 7173

CMD ["npm","run","dev","--host"]
