#!/bin/bash

# Docker Hub Push Script
# Usage: ./push-to-dockerhub.sh <dockerhub-username>

set -e

# Check if Docker Hub username is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide your Docker Hub username"
    echo "Usage: $0 <dockerhub-username>"
    exit 1
fi

DOCKER_USERNAME=$1
IMAGE_NAME="${DOCKER_USERNAME}/taskmind"
TAG="latest"

echo "🐳 Building Docker image for linux/amd64..."
docker build --platform linux/amd64 -t ${IMAGE_NAME}:${TAG} --build-arg BUILDKIT_INLINE_CACHE=1 .

echo "🏷️  Tagging image..."
docker tag ${IMAGE_NAME}:${TAG} ${IMAGE_NAME}:${TAG}

echo "🔐 Logging into Docker Hub..."
docker login

echo "📤 Pushing image to Docker Hub..."
docker push ${IMAGE_NAME}:${TAG}

echo "✅ Successfully pushed ${IMAGE_NAME}:${TAG} to Docker Hub!"
echo ""
echo "📋 Your image is now available at:"
echo "   https://hub.docker.com/r/${IMAGE_NAME}"
echo ""
echo "🚀 To run from Docker Hub:"
echo "   docker run -p 8080:80 ${IMAGE_NAME}:${TAG}"
