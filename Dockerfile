# syntax=docker/dockerfile:1

# Multi-stage Dockerfile for respawn.io Astro blog
# Builds static site and serves with lightweight HTTP server

# =============================================================================
# Base stage - shared Node.js setup
# =============================================================================
FROM node:22-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.7.0 --activate

# Install bash for build scripts
RUN apk add --no-cache bash

WORKDIR /app

# =============================================================================
# Dependencies stage - install all dependencies
# =============================================================================
FROM base AS deps

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# =============================================================================
# Builder stage - build the application
# =============================================================================
FROM base AS builder

WORKDIR /app

# Install bash and Chromium for Puppeteer (used by mermaid-cli and og-images)
RUN apk add --no-cache bash chromium nss freetype harfbuzz ca-certificates ttf-freefont

# Tell Puppeteer to use system Chromium instead of downloading
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source files
COPY . .

# Build the Astro site (includes image copying)
ENV NODE_ENV=production

# Bust cache to ensure fresh build
ARG CACHEBUST=1

RUN pnpm run build

# =============================================================================
# Runner stage - production image with nginx
# =============================================================================
FROM nginx:alpine AS runner

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static site from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 3000

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
