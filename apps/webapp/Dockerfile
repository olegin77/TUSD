# ==========================================
# USDX/Wexel Frontend WebApp - Dockerfile
# ==========================================
# Simplified single-stage build to fix dependency resolution

FROM node:20-alpine AS builder

# Install pnpm and required tools
RUN corepack enable && corepack prepare pnpm@9.5.0 --activate
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy all workspace files
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY tsconfig.base.json ./
COPY apps/webapp ./apps/webapp
COPY apps/indexer/package.json ./apps/indexer/

# Install ALL dependencies from workspace root
RUN pnpm install --frozen-lockfile --ignore-scripts

# Set build environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SOLANA_RPC_URL
ARG NEXT_PUBLIC_SOLANA_NETWORK
ARG NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SOLANA_RPC_URL=$NEXT_PUBLIC_SOLANA_RPC_URL
ENV NEXT_PUBLIC_SOLANA_NETWORK=$NEXT_PUBLIC_SOLANA_NETWORK
ENV NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=$NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
ENV NEXT_TELEMETRY_DISABLED=1

# Build from workspace root (where node_modules with axios exists)
RUN cd apps/webapp && pnpm build

# Stage 2: Runtime
FROM node:20-alpine AS runner

RUN apk add --no-cache dumb-init

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built application (public directory is optional)
COPY --from=builder --chown=nextjs:nodejs /app/apps/webapp/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/webapp/.next/static ./apps/webapp/.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)}).on('error', () => process.exit(1))"

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "apps/webapp/server.js"]
