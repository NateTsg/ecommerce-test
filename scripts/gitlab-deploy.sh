# !/bin/bash

export NODE_ENV=production

# Load Gitlab SSH Keys
eval `ssh-agent -s`
ssh-add ~/.ssh/gitlab

# Pull Repository
git pull origin master

# Build Docker Images
docker-compose up -d --build --force-recreate
