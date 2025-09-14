# Multi-stage Dockerfile for Gemini Server (Node.js + TypeScript)

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

# Development stage for TypeScript compilation
FROM node:20-alpine AS dev-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci --legacy-peer-deps

# Copy TypeScript config and source files
COPY tsconfig.json ./
COPY server.ts ./

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production --legacy-peer-deps && npm cache clean --force

# Copy built JavaScript files from dev-builder stage
COPY --from=dev-builder /app/dist ./dist

# Copy any static files if needed
COPY --from=dev-builder /app/package.json ./

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

# Start the application
CMD ["npm", "run", "start:prod"]
