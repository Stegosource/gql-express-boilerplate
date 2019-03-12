#!/bin/bash

TAG=dev

FILE=./dockerization/Dockerfile
IMAGE=myImg
REPO=localhost

# Set the context to project root
cd ..

# Build docker
docker build -f $FILE --no-cache -t $IMAGE:$TAG .
# Tag docker
docker tag $IMAGE:$TAG $REPO/$IMAGE:$TAG
# Upload docker to secured repo
docker push $REPO/$IMAGE:$TAG
