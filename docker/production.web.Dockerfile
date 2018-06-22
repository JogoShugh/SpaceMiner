FROM node:10-alpine

EXPOSE 80

RUN mkdir -p /app

COPY ./dist /app
WORKDIR /app

# Production install
RUN NODE_ENV=production yarn && yarn bootstrap

WORKDIR /app/apps/web
ENV NODE_ENV=production
ENV WEB_PORT=80
CMD ["yarn", "start"]
