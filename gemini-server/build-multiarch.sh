#!/bin/bash

# Multi-Architecture Docker Build Script for Gemini Server
# Builds and pushes images for multiple platforms (amd64, arm64)

set -e

# Check if Docker Hub username is provided
if [ -z "$1" ]; then
    echo "❌ Error: Please provide your Docker Hub username"
    echo "Usage: $0 <dockerhub-username> [tag]"
    exit 1
fi

DOCKER_USERNAME=$1
TAG=${2:-latest}
IMAGE_NAME="${DOCKER_USERNAME}/gemini-server"

echo "🔧 Setting up Docker buildx..."
# Remove existing builder if it exists but is corrupted
docker buildx rm multiarch-builder-gemini 2>/dev/null || true
# Create new builder
docker buildx create --use --name multiarch-builder-gemini

echo "🐳 Building multi-arch Gemini Server image for linux/amd64 and linux/arm64..."
echo "📦 Image: ${IMAGE_NAME}:${TAG}"
echo "🏗️  Platforms: linux/amd64, linux/arm64"
echo "⏱️  This may take several minutes..."
echo ""

# Build and push multi-arch image
docker buildx build \
    --platform linux/amd64,linux/arm64 \
    --tag ${IMAGE_NAME}:${TAG} \
    --push \
    --build-arg BUILDKIT_INLINE_CACHE=1 \
    --progress=plain \
    .

echo ""
echo "✅ Successfully built and pushed multi-arch Gemini Server image!"
echo "📋 Image details:"
echo "   Name: ${IMAGE_NAME}:${TAG}"
echo "   Platforms: linux/amd64, linux/arm64"
echo "   Docker Hub: https://hub.docker.com/r/${IMAGE_NAME}"
echo ""
echo "🚀 To run the image:"
echo "   docker run -p 4000:4000 -e GEMINI_API_KEY=your_api_key ${IMAGE_NAME}:${TAG}"
echo ""
echo "💡 The image now supports both Intel/AMD and Apple Silicon Macs!"
echo "⚠️  Don't forget to set your GEMINI_API_KEY environment variable!"