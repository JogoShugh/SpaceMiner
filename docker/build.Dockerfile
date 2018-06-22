FROM node:10-alpine
ARG NODE_ENV=production
RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN yarn && yarn bootstrap
RUN NODE_ENV=${NODE_ENV} yarn build
