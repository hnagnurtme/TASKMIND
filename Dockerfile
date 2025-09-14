# Multi-platform Dockerfile for React + TypeScript
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install dependencies including dev dependencies for build
RUN npm ci --legacy-peer-deps
# Copy TypeScript and Vite config files first
COPY tsconfig*.json ./
COPY vite.config.ts ./

COPY . .

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
