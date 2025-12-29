# syntax=docker/dockerfile:1

# Multi-stage Dockerfile for respawn.io Astro blog
# Builds static site and serves with lightweight HTTP server

# =============================================================================
# Builder stage - build the application
# Uses Debian for Playwright compatibility (rehype-mermaid uses Playwright)
# =============================================================================
FROM node:25-slim AS builder

# Install pnpm globally
RUN npm i -g pnpm@10.7.0

WORKDIR /app

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Install Playwright browser and its system dependencies
RUN pnpm exec playwright install chromium --with-deps

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
