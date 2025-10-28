# Production Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the USDX/Wexel platform to production.

**Prerequisites:**
- Production infrastructure provisioned
- Domain names configured
- SSL certificates obtained
- All secrets generated
- Team trained on procedures

---

## Pre-Deployment Setup

### 1. Provision Infrastructure

#### Option A: DigitalOcean

```bash
# Create Droplet (8GB RAM, 4 vCPUs minimum)
doctl compute droplet create usdx-prod \
  --image ubuntu-22-04-x64 \
  --size s-4vcpu-8gb \
  --region nyc3 \
  --ssh-keys YOUR_SSH_KEY_ID

# Create Managed Database (PostgreSQL)
doctl databases create usdx-db \
  --engine pg \
  --version 16 \
  --size db-s-2vcpu-4gb \
  --region nyc3 \
  --num-nodes 1

# Create Managed Redis
doctl databases create usdx-redis \
  --engine redis \
  --version 7 \
  --size db-s-1vcpu-1gb \
  --region nyc3

# Create Spaces bucket for backups
doctl compute space create usdx-backups --region nyc3
```

#### Option B: AWS

```bash
# Use terraform/cloudformation (see infra/aws/)
terraform init
terraform plan -var-file=production.tfvars
terraform apply -var-file=production.tfvars
```

### 2. Configure DNS

```bash
# A records
app.usdx-wexel.com    -> YOUR_SERVER_IP
api.usdx-wexel.com    -> YOUR_SERVER_IP
admin.usdx-wexel.com  -> YOUR_SERVER_IP

# CNAME for www (optional)
www.usdx-wexel.com    -> app.usdx-wexel.com
```

### 3. Obtain SSL Certificates

```bash
# Using Let's Encrypt with certbot
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot certonly --nginx \
  -d app.usdx-wexel.com \
  -d api.usdx-wexel.com \
  -d admin.usdx-wexel.com \
  --email admin@usdx-wexel.com \
  --agree-tos \
  --no-eff-email

# Setup auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### 4. Setup Server

```bash
# SSH to server
ssh root@YOUR_SERVER_IP

# Update system
apt-get update && apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl enable docker
systemctl start docker

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create application directory
mkdir -p /opt/usdx-wexel
cd /opt/usdx-wexel

# Create data directories
mkdir -p /var/lib/usdx-wexel/{postgres,redis}
mkdir -p /var/backups/usdx-wexel/{postgres,redis,logs}
mkdir -p /var/log/usdx-wexel

# Set permissions
chmod 700 /var/lib/usdx-wexel
chmod 700 /var/backups/usdx-wexel
```

---

## Smart Contract Deployment

### Solana Contracts

```bash
# 1. Build contracts
cd contracts/solana/solana-contracts
anchor build

# 2. Generate keypairs for program IDs (if not done)
solana-keygen new -o target/deploy/pool-keypair.json
solana-keygen new -o target/deploy/wexel-nft-keypair.json
# ... (repeat for all programs)

# 3. Deploy to mainnet-beta
anchor deploy --provider.cluster mainnet

# 4. Save program IDs
solana program show target/deploy/pool-keypair.json
# Record all program IDs for .env file

# 5. Initialize programs
anchor run initialize-mainnet

# 6. Configure initial pools
anchor run configure-pools

# 7. Set admin addresses
anchor run set-admin --admin YOUR_MULTISIG_ADDRESS

# 8. Verify deployment
anchor run verify-deployment
```

### Tron Contracts

```bash
# 1. Build contracts
cd contracts/tron
npm run compile

# 2. Deploy to mainnet
tronbox migrate --network mainnet

# 3. Verify on Tronscan
npm run verify DepositVault DEPLOYED_ADDRESS
npm run verify PriceFeed DEPLOYED_ADDRESS

# 4. Initialize contracts
npm run initialize

# 5. Set admin addresses
npm run set-admin YOUR_MULTISIG_ADDRESS

# 6. Record deployed addresses for .env
```

---

## Application Deployment

### 1. Prepare Environment

```bash
cd /opt/usdx-wexel

# Clone repository
git clone https://github.com/your-org/usdx-wexel.git .
git checkout v1.0.0  # Use specific tag/version

# Copy production files
cp infra/production/docker-compose.yml .
cp infra/production/.env.production.template .env
mkdir -p nginx/conf.d nginx/ssl
cp infra/production/nginx/nginx.conf nginx/
cp infra/production/nginx/conf.d/usdx-wexel.conf nginx/conf.d/

# Copy SSL certificates
cp /etc/letsencrypt/live/usdx-wexel.com/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/usdx-wexel.com/privkey.pem nginx/ssl/
```

### 2. Configure Environment

```bash
# Edit .env with all production values
nano .env

# CRITICAL: Set all passwords and secrets!
# - POSTGRES_PASSWORD
# - REDIS_PASSWORD
# - JWT_SECRET
# - ADMIN_JWT_SECRET
# - All program IDs
# - All API keys
# - Notification URLs

# Validate configuration
./scripts/validate_env.sh production
```

### 3. Build Images

```bash
# Build backend/indexer
cd apps/indexer
docker build -t usdx-indexer:1.0.0 -f Dockerfile.prod .

# Build frontend
cd ../webapp
docker build -t usdx-webapp:1.0.0 -f Dockerfile.prod .

# Or use docker-compose build
cd /opt/usdx-wexel
docker-compose build
```

### 4. Database Setup

```bash
# Run migrations
docker-compose run --rm indexer npm run migrate

# Seed initial data
docker-compose run --rm indexer npm run seed

# Verify database
docker-compose run --rm indexer npm run db:verify
```

### 5. Start Services

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Verify health
curl http://localhost:3001/health
curl http://localhost:3000/
```

### 6. Configure Nginx

```bash
# Test nginx configuration
docker-compose exec nginx nginx -t

# Reload nginx
docker-compose exec nginx nginx -s reload

# Verify HTTPS
curl https://app.usdx-wexel.com
curl https://api.usdx-wexel.com/health
```

### 7. Setup Backups

```bash
# Copy backup scripts
cp -r scripts/backup /opt/usdx-wexel/scripts/

# Setup backup automation
cd /opt/usdx-wexel/scripts/backup
./setup_backup_cron.sh

# Configure backup.conf
nano backup.conf

# Test backup
./backup_db.sh

# Test restore
./restore_db_test.sh

# Add to cron
crontab -e
# Add: 0 2 * * * /opt/usdx-wexel/scripts/backup/backup_cron.sh
```

### 8. Setup Monitoring

```bash
# Start monitoring stack
cd /opt/usdx-wexel/infra/monitoring
docker-compose up -d

# Access Grafana
# http://YOUR_SERVER_IP:3002
# Default: admin/admin (CHANGE THIS!)

# Configure alerting
# Edit infra/monitoring/alertmanager/config.yml
# Add Slack webhook, PagerDuty, etc.

# Reload Alertmanager
docker-compose exec alertmanager kill -HUP 1
```

---

## Post-Deployment Verification

### 1. Health Checks

```bash
# API health
curl https://api.usdx-wexel.com/health

# Expected response:
# {"status":"ok","timestamp":"2024-12-28T...","version":"1.0.0"}

# Frontend health
curl https://app.usdx-wexel.com/

# Database connectivity
docker-compose exec indexer npm run db:ping

# Redis connectivity
docker-compose exec indexer npm run redis:ping

# Blockchain connectivity
docker-compose exec indexer npm run blockchain:verify
```

### 2. Functional Tests

```bash
# Run smoke tests
docker-compose exec indexer npm run test:smoke

# Test wallet connection (manual)
# 1. Open https://app.usdx-wexel.com
# 2. Connect Phantom wallet
# 3. Verify connection successful

# Test API endpoints
./scripts/test_api_endpoints.sh https://api.usdx-wexel.com

# Test admin panel
# 1. Open https://admin.usdx-wexel.com
# 2. Login with admin credentials
# 3. Verify dashboard loads
```

### 3. Performance Tests

```bash
# Load test API (use k6 or similar)
k6 run scripts/load_test.js

# Check response times
curl -w "@curl-format.txt" -s https://api.usdx-wexel.com/api/v1/pools

# Monitor metrics
# Access Grafana: http://YOUR_SERVER_IP:3002
# Check dashboards: API Response Times, Database Performance
```

### 4. Security Checks

```bash
# SSL certificate validity
openssl s_client -connect app.usdx-wexel.com:443 -servername app.usdx-wexel.com

# Security headers
curl -I https://app.usdx-wexel.com | grep -i security

# HTTPS enforcement
curl -I http://app.usdx-wexel.com  # Should redirect to HTTPS

# Rate limiting
for i in {1..50}; do curl https://api.usdx-wexel.com/api/v1/pools; done
# Should see 429 (Too Many Requests) after limit
```

---

## Monitoring & Maintenance

### Daily Checks

```bash
# Check service status
docker-compose ps

# Check logs for errors
docker-compose logs --tail=100 indexer | grep ERROR
docker-compose logs --tail=100 webapp | grep ERROR

# Check disk space
df -h

# Check backup age
find /var/backups/usdx-wexel/postgres -name "*.sql.gz" -mtime -1

# Check alerts
# Review Grafana/Alertmanager
```

### Weekly Tasks

```bash
# Run restore test
/opt/usdx-wexel/scripts/backup/restore_db_test.sh

# Review metrics
# Check Grafana dashboards for anomalies

# Update dependencies (staging first!)
# docker-compose pull
# docker-compose up -d
```

### Monthly Tasks

```bash
# Rotate logs
docker-compose logs --no-color > /var/log/usdx-wexel/archive-$(date +%Y%m).log
docker-compose restart

# Review and clean old backups
find /var/backups/usdx-wexel -type f -mtime +90 -delete

# Security updates
apt-get update && apt-get upgrade -y

# SSL certificate check
certbot certificates
```

---

## Rollback Procedure

### Quick Rollback

```bash
cd /opt/usdx-wexel

# 1. Stop services
docker-compose down

# 2. Checkout previous version
git fetch --tags
git checkout v0.9.0  # Previous stable version

# 3. Rebuild (if needed)
docker-compose build

# 4. Rollback database (if needed)
# Restore from backup BEFORE the problematic deployment
gunzip -c /var/backups/usdx-wexel/postgres/usdx_wexel_TIMESTAMP.sql.gz | \
  docker-compose exec -T db psql -U usdx -d usdx_wexel

# 5. Start services
docker-compose up -d

# 6. Verify
curl https://api.usdx-wexel.com/health

# 7. Monitor
docker-compose logs -f
```

---

## Troubleshooting

### Service Won't Start

```bash
# Check logs
docker-compose logs indexer

# Check configuration
docker-compose config

# Validate environment
env | grep -E 'POSTGRES|REDIS|SOLANA|TRON'

# Test database connection
docker-compose exec db psql -U usdx -d usdx_wexel -c "SELECT 1;"

# Test Redis connection
docker-compose exec redis redis-cli -a $REDIS_PASSWORD PING
```

### High CPU/Memory Usage

```bash
# Check resource usage
docker stats

# Restart services
docker-compose restart indexer webapp

# Scale services (if using swarm/k8s)
docker-compose up -d --scale indexer=2

# Check for memory leaks
docker-compose exec indexer npm run heapdump
```

### Database Issues

```bash
# Check connections
docker-compose exec db psql -U usdx -d usdx_wexel \
  -c "SELECT * FROM pg_stat_activity;"

# Vacuum database
docker-compose exec db vacuumdb -U usdx -d usdx_wexel --analyze

# Check disk space
docker-compose exec db df -h

# Restart database
docker-compose restart db
```

---

## Support Contacts

- **DevOps Lead**: devops@usdx-wexel.com
- **Security Lead**: security@usdx-wexel.com
- **On-Call**: Use PagerDuty escalation
- **Infrastructure Support**: support@digitalocean.com (or your provider)

---

## Related Documentation

- [Deployment Readiness Checklist](../DEPLOYMENT_READINESS.md)
- [Configuration Management](./CONFIGURATION_MANAGEMENT.md)
- [Backup & Restore](./BACKUP_RESTORE.md)
- [Monitoring Guide](../MONITORING.md)
- [Runbooks](./runbooks/)

---

**Version**: 1.0  
**Last Updated**: 2024-12-28  
**Next Review**: 2025-03-28
