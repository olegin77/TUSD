# ==========================================
# USDX/Wexel Backend Indexer - Dockerfile
# ==========================================
# Multi-stage build for optimal size and security
# Node.js 20 + NestJS + Prisma + PostgreSQL

# Stage 1: Dependencies
FROM node:20-alpine AS deps

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.5.0 --activate

# Set working directory
WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY tsconfig.base.json ./

# Copy indexer package files
COPY apps/indexer/package.json ./apps/indexer/

# Install dependencies (frozen lockfile for reproducibility)
RUN pnpm install --frozen-lockfile --filter indexer...

# Stage 2: Builder
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.5.0 --activate

# Install openssl for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/indexer/node_modules ./apps/indexer/node_modules

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY tsconfig.base.json ./

# Copy indexer source code
COPY apps/indexer ./apps/indexer

# Generate Prisma client
WORKDIR /app/apps/indexer
RUN pnpm prisma:generate

# Build the application
RUN pnpm build

# Remove dev dependencies
RUN pnpm prune --prod

# Stage 3: Runner
FROM node:20-alpine AS runner

# Install openssl for Prisma and dumb-init for proper signal handling
RUN apk add --no-cache openssl dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

WORKDIR /app

# Set NODE_ENV
ENV NODE_ENV=production

# Copy built application from builder
COPY --from=builder --chown=nestjs:nodejs /app/apps/indexer/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/apps/indexer/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/indexer/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/apps/indexer/package.json ./

# Switch to non-root user
USER nestjs

# Expose API port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/main.js"]
