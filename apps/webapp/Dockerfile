# ==========================================
# USDX/Wexel Frontend WebApp - Dockerfile
# Standalone Node.js Mode
# ==========================================

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

# Build standalone server from workspace root
RUN cd apps/webapp && pnpm build

# Stage 2: Runtime with Node.js
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone server
COPY --from=builder --chown=nextjs:nodejs /app/apps/webapp/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/webapp/.next/static ./apps/webapp/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/webapp/public ./apps/webapp/public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "apps/webapp/server.js"]
