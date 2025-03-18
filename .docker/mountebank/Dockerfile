FROM node:alpine

ENV MOUNTEBANK_VERSION=2.9.1

RUN apk add --update nodejs-lts && \
  apk add --update npm
RUN npm install -g mountebank@${MOUNTEBANK_VERSION}

EXPOSE 2525 8081

ENTRYPOINT ["mb"]
