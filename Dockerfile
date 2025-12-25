# syntax=docker/dockerfile:1

# Multi-stage Dockerfile for respawn.io Next.js blog
# Uses standalone output for minimal image size

# =============================================================================
# Base stage - shared Node.js setup
# =============================================================================
FROM node:22-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.7.0 --activate

# Install libc6-compat for Next.js compatibility on Alpine
RUN apk add --no-cache libc6-compat

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

# Install Chromium for Puppeteer (used by mermaid-cli and og-images)
RUN apk add --no-cache chromium

# Tell Puppeteer to use system Chromium instead of downloading
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source files
COPY . .

# Copy images from content to public (build step)
RUN mkdir -p public && \
    find content/posts -name "*.png" -o -name "*.jpg" 2>/dev/null | while read file; do \
        dest="${file/content\/posts/public\/posts}"; \
        mkdir -p "$(dirname "$dest")"; \
        cp "$file" "$dest"; \
    done && \
    find content/daily -name "*.png" -o -name "*.jpg" 2>/dev/null | while read file; do \
        dest="${file/content\/daily/public\/daily}"; \
        mkdir -p "$(dirname "$dest")"; \
        cp "$file" "$dest"; \
    done

# Build contentlayer, generate OG images, then Next.js
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN pnpm run build:content && \
    pnpm run og-images && \
    pnpm exec next build && \
    pnpm run rss

# =============================================================================
# Runner stage - production image
# =============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy static files and standalone build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
