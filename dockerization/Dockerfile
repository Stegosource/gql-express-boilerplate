FROM node:alpine

# RUN apk update && apk upgrade && \
# 	apk add --no-cache git
# Other packages: bash nano
RUN apk update && apk upgrade && \
  apk add --no-cache python make gcc g++

ARG env=production

ENV NODE_ENV=$env

# Create app directory
WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3000 3443

CMD ["npm","start"]
