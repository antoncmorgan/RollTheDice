#!/bin/bash

docker build ./app/ -t rollthedice:latest
docker-compose up -d
