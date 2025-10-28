# 🚀 USDX/Wexel Platform - Deployment Guide

Complete guide for deploying the USDX/Wexel platform to production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Deployment Environments](#deployment-environments)
- [Deployment Script Usage](#deployment-script-usage)
- [Manual Deployment](#manual-deployment)
- [Post-Deployment](#post-deployment)
- [Monitoring](#monitoring)
- [Rollback](#rollback)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements

- **OS**: Ubuntu 20.04+ / Debian 11+ / RHEL 8+
- **CPU**: 4+ cores (recommended: 8+ cores)
- **RAM**: 8GB+ (recommended: 16GB+)
- **Disk**: 100GB+ SSD
- **Network**: Static IP, open ports 80, 443

### Software Requirements

```bash
# Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt-get install docker-compose-plugin

# Git
sudo apt-get install git

# jq (JSON processor)
sudo apt-get install jq

# Optional: PostgreSQL client (for manual operations)
sudo apt-get install postgresql-client
```

### Domain & SSL

- Domain name configured (e.g., `app.usdx-wexel.com`)
- SSL certificates (Let's Encrypt recommended)
- DNS A records pointing to your server

---

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-org/usdx-wexel.git
cd usdx-wexel
```

### 2. Configure Environment

```bash
# Copy and edit environment file
cp .env.production.example .env.production
nano .env.production

# Required: Update these critical variables
# - DATABASE_URL
# - JWT_SECRET (generate with: openssl rand -base64 64)
# - ADMIN_JWT_SECRET (different from JWT_SECRET)
# - SOLANA_POOL_PROGRAM_ID (from deployed contracts)
# - SOLANA_RPC_URL (use paid RPC for production)
```

### 3. Deploy Solana Contracts

```bash
cd contracts/solana/solana-contracts
anchor build
anchor deploy --provider.cluster mainnet

# Copy program IDs to .env.production
# SOLANA_POOL_PROGRAM_ID=<your-program-id>
# etc.
```

### 4. Run Deployment Script

```bash
# Full deployment with all checks
./deploy.sh --env production --tag v1.0.0

# Quick deployment (skip tests)
./deploy.sh --env production --skip-tests

# Staging deployment
./deploy.sh --env staging
```

---

## Deployment Environments

### Local Development

```bash
# Start local services
docker-compose -f infra/local/docker-compose.yml up -d

# Backend
cd apps/indexer
pnpm install
pnpm prisma:migrate:dev
pnpm start:dev

# Frontend
cd apps/webapp
pnpm install
pnpm dev
```

### Staging

```bash
# Configure staging environment
cp .env.staging.example .env.staging
nano .env.staging

# Deploy to staging (devnet)
./deploy.sh --env staging --tag staging
```

### Production

```bash
# Configure production environment
cp .env.production.example .env.production
nano .env.production

# Deploy to production (mainnet)
./deploy.sh --env production --tag v1.0.0
```

---

## Deployment Script Usage

### Basic Usage

```bash
./deploy.sh [OPTIONS]
```

### Options

| Option | Description | Example |
|--------|-------------|---------|
| `--env ENV` | Deployment environment | `--env production` |
| `--tag TAG` | Docker image tag | `--tag v1.0.0` |
| `--registry REGISTRY` | Docker registry URL | `--registry ghcr.io/org/` |
| `--skip-backup` | Skip database backup | `--skip-backup` |
| `--skip-tests` | Skip running tests | `--skip-tests` |
| `--skip-migrations` | Skip DB migrations | `--skip-migrations` |
| `--help` | Show help message | `--help` |

### Examples

```bash
# Production deployment with specific version
./deploy.sh --env production --tag v1.2.3

# Staging deployment without tests (faster)
./deploy.sh --env staging --skip-tests

# Deploy from custom registry
./deploy.sh --env production --registry ghcr.io/your-org/

# Quick hotfix deployment (skip backup and tests)
./deploy.sh --env production --tag hotfix-1 --skip-backup --skip-tests
```

### Environment Variables

Alternative to command-line options:

```bash
export DEPLOY_ENV=production
export DEPLOY_TAG=v1.0.0
export DOCKER_REGISTRY=ghcr.io/your-org/
export SKIP_TESTS=true

./deploy.sh
```

---

## Manual Deployment

If you prefer manual control or the script doesn't fit your workflow:

### Step 1: Build Images

```bash
# Backend
docker build -t usdx-wexel-indexer:v1.0.0 -f apps/indexer/Dockerfile .

# Frontend
docker build -t usdx-wexel-webapp:v1.0.0 \
  --build-arg NEXT_PUBLIC_API_URL=https://api.usdx-wexel.com \
  --build-arg NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com \
  -f apps/webapp/Dockerfile .
```

### Step 2: Run Database Migrations

```bash
docker run --rm \
  --network host \
  -e DATABASE_URL="$DATABASE_URL" \
  usdx-wexel-indexer:v1.0.0 \
  sh -c "cd /app && npx prisma migrate deploy"
```

### Step 3: Deploy Services

```bash
cd infra/production

# Export environment variables
export IMAGE_TAG=v1.0.0
export REGISTRY=""

# Start services
docker compose up -d

# View logs
docker compose logs -f
```

### Step 4: Verify Deployment

```bash
# Check service health
curl http://localhost:3001/health
curl http://localhost:3000/

# Check Docker containers
docker ps

# Check logs
docker logs usdx-indexer
docker logs usdx-webapp
```

---

## Post-Deployment

### 1. Health Checks

```bash
# Backend API
curl https://api.usdx-wexel.com/health

# Expected: {"status":"ok","timestamp":"..."}

# Frontend
curl https://app.usdx-wexel.com/

# Expected: HTML content
```

### 2. Database Verification

```bash
# Connect to database
docker exec -it usdx-db psql -U usdx -d usdx_wexel_prod

# Check tables
\dt

# Check pools
SELECT * FROM pools;

# Exit
\q
```

### 3. Indexer Status

```bash
# Check indexer status
curl https://api.usdx-wexel.com/api/v1/indexer/status

# Expected: {"status":"running","lastProcessedSlot":...}
```

### 4. SSL Certificate Setup

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d app.usdx-wexel.com -d api.usdx-wexel.com

# Auto-renewal (certbot handles this automatically)
sudo certbot renew --dry-run
```

### 5. Configure Monitoring

```bash
# Start monitoring stack
cd infra/monitoring
docker-compose up -d

# Access dashboards:
# - Grafana: http://your-server:3002 (admin/admin)
# - Prometheus: http://your-server:9090
# - Alertmanager: http://your-server:9093
```

---

## Monitoring

### Metrics Endpoints

- **Backend Metrics**: `https://api.usdx-wexel.com/metrics`
- **Indexer Status**: `https://api.usdx-wexel.com/api/v1/indexer/status`
- **Price Oracle Status**: `https://api.usdx-wexel.com/api/v1/oracles/health`

### Key Metrics to Monitor

1. **API Response Time** (target: <200ms p95)
2. **Database Connection Pool** (target: <80% utilization)
3. **Indexer Lag** (target: <5 seconds)
4. **Error Rate** (target: <0.1%)
5. **TVL (Total Value Locked)**
6. **Active Users**

### Alerts Configuration

See `infra/monitoring/prometheus/alerts.yml` for configured alerts.

### Logs

```bash
# View all service logs
cd infra/production
docker compose logs -f

# View specific service
docker logs -f usdx-indexer

# View with timestamps
docker logs -f --timestamps usdx-indexer

# Last 100 lines
docker logs --tail 100 usdx-indexer
```

---

## Rollback

### Automatic Rollback

The deployment script automatically creates backups and can rollback on failure.

### Manual Rollback

```bash
# 1. Stop current services
cd infra/production
docker compose down

# 2. Restore database backup
cd /workspace/backups
gunzip -c db_YYYYMMDD_HHMMSS.sql.gz | docker exec -i usdx-db psql -U usdx -d usdx_wexel_prod

# 3. Use previous image version
export IMAGE_TAG=v1.0.0  # Previous working version
docker compose up -d

# 4. Verify services
curl http://localhost:3001/health
```

### Rollback Checklist

- [ ] Notify team of rollback
- [ ] Stop current version
- [ ] Restore database if needed
- [ ] Deploy previous version
- [ ] Verify health checks
- [ ] Check critical user flows
- [ ] Update status page
- [ ] Document incident

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

```bash
# Check database is running
docker ps | grep postgres

# Check database logs
docker logs usdx-db

# Test connection
docker exec -it usdx-db psql -U usdx -d usdx_wexel_prod -c "SELECT 1;"

# Verify DATABASE_URL format
# postgresql://user:password@host:port/database
```

#### 2. Indexer Not Starting

```bash
# Check logs
docker logs usdx-indexer

# Common causes:
# - Missing SOLANA_POOL_PROGRAM_ID (check .env)
# - Invalid RPC URL (test: curl https://api.mainnet-beta.solana.com)
# - Database not migrated (run: pnpm prisma:migrate:deploy)

# Restart indexer
docker restart usdx-indexer
```

#### 3. Frontend 500 Error

```bash
# Check webapp logs
docker logs usdx-webapp

# Verify NEXT_PUBLIC_API_URL
docker exec usdx-webapp env | grep NEXT_PUBLIC

# Check backend API is accessible
curl http://indexer:3001/health

# Rebuild with correct env vars
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.usdx-wexel.com ...
```

#### 4. Out of Memory

```bash
# Check memory usage
docker stats

# Increase container limits in docker-compose.yml
# deploy:
#   resources:
#     limits:
#       memory: 4G

# Or increase system resources
```

#### 5. SSL Certificate Issues

```bash
# Check certificate
openssl s_client -connect app.usdx-wexel.com:443 -servername app.usdx-wexel.com

# Renew certificate
sudo certbot renew

# Check Nginx configuration
docker exec usdx-nginx nginx -t
```

### Debug Mode

```bash
# Enable debug logging
docker compose down
export LOG_LEVEL=debug
docker compose up -d

# View detailed logs
docker logs -f usdx-indexer
```

### Getting Help

1. Check logs: `docker compose logs`
2. Review documentation: `/workspace/docs/`
3. Check status page: https://status.usdx-wexel.com
4. Contact support: support@usdx-wexel.com

---

## Performance Optimization

### Database Optimization

```sql
-- Create indexes for better performance
CREATE INDEX CONCURRENTLY idx_wexels_owner ON wexels(owner_solana);
CREATE INDEX CONCURRENTLY idx_wexels_pool ON wexels(pool_id);
CREATE INDEX CONCURRENTLY idx_wexels_status ON wexels(is_collateralized);

-- Analyze tables
ANALYZE wexels;
ANALYZE pools;
ANALYZE collateral;
```

### Redis Configuration

```bash
# Increase max memory
# Edit docker-compose.yml:
command: >
  redis-server
  --maxmemory 4gb
  --maxmemory-policy allkeys-lru
```

### Solana RPC

For production, use a paid RPC provider:

- [Helius](https://helius.dev/)
- [QuickNode](https://www.quicknode.com/)
- [Triton](https://triton.one/)

Update `.env.production`:
```bash
SOLANA_RPC_URL=https://your-paid-rpc-url
SOLANA_WEBSOCKET_URL=wss://your-paid-rpc-url
```

---

## Security Checklist

- [ ] Strong passwords for all services
- [ ] JWT secrets are random and secure (min 64 chars)
- [ ] Database only accessible from localhost
- [ ] Firewall configured (UFW/iptables)
- [ ] SSL certificates installed and auto-renewing
- [ ] Secrets stored in environment variables (not in code)
- [ ] Admin multisig configured
- [ ] Rate limiting enabled
- [ ] CORS configured correctly
- [ ] Sentry/monitoring configured
- [ ] Backups scheduled and tested
- [ ] Logs retention policy set

---

## Maintenance

### Regular Tasks

**Daily:**
- Check service health
- Review error logs
- Monitor TVL and activity

**Weekly:**
- Review security alerts
- Check backup integrity
- Update dependencies if needed

**Monthly:**
- Rotate JWT secrets
- Review access logs
- Performance optimization
- Capacity planning

### Updating the Platform

```bash
# 1. Pull latest code
git fetch origin
git checkout v1.1.0

# 2. Build new images
docker build -t usdx-wexel-indexer:v1.1.0 -f apps/indexer/Dockerfile .
docker build -t usdx-wexel-webapp:v1.1.0 -f apps/webapp/Dockerfile .

# 3. Deploy with new version
./deploy.sh --env production --tag v1.1.0
```

---

## Support

- **Documentation**: `/workspace/docs/`
- **Runbooks**: `/workspace/docs/ops/runbooks/`
- **API Docs**: `https://api.usdx-wexel.com/docs`
- **Status Page**: `https://status.usdx-wexel.com`
- **Email**: `devops@usdx-wexel.com`

---

**Last Updated**: 2025-10-28  
**Version**: 1.0.0
