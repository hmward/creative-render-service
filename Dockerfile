FROM node:8.7.0-alpine

# Copy current working dir to container
RUN mkdir -p /src
COPY . /src/app
WORKDIR /src/app

# Install python2
RUN apk add --no-cache --virtual .gyp \
  bash \
  python \
  make \
  g++

# Rebuild node-sass for current system
RUN npm rebuild node-sass --force

# Sets the default ENV
ARG ENV=development

# Install node modules
RUN npm install

# Run postinstall in specified mode
RUN ENV=${ENV} bash ./scripts/postinstall.sh

# Remove .gyp
RUN apk del .gyp

# Run application from pre-built scripts
CMD npm run start:build
EXPOSE 8889