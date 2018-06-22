#!/usr/bin/env bash

docker build --build-args NODE_ENV=production --tag build-image -f docker/build.Dockerfile .
docker container rm build-container
docker create --name build-container build-image

rm -rf ./dist
mkdir ./dist
docker cp build-container:/app/apps ./dist
docker cp build-container:/app/packages ./dist


find ./dist -type d -name node_modules -exec rm -rf {} \;
find ./dist -type d -name src -exec rm -rf {} \;

cp package.json yarn.lock ./dist
