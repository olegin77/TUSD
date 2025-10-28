# USDX/Wexel Staging Deployment

This directory contains the configuration for the **staging environment** of the USDX/Wexel platform.

## 📋 Overview

The staging environment provides a production-like setup for testing and validation before mainnet deployment.

### Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Internet                          │
└─────────────────────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────────┐
│              Nginx (Reverse Proxy)                  │
│  - SSL Termination                                  │
│  - Rate Limiting                                    │
│  - Load Balancing                                   │
└─────────────────────────────────────────────────────┘
           │                           │
           ↓                           ↓
┌──────────────────────┐    ┌──────────────────────┐
│   Frontend (Next.js) │    │  Backend (NestJS)    │
│   - Port 3000        │    │  - Port 3001         │
│   - SSR/SSG          │    │  - REST API          │
│   - React            │    │  - WebSocket         │
└──────────────────────┘    └──────────────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    ↓                                   ↓
         ┌──────────────────────┐          ┌──────────────────────┐
         │  PostgreSQL DB       │          │  Redis Cache         │
         │  - Port 5432         │          │  - Port 6379         │
         │  - Data persistence  │          │  - Session store     │
         └──────────────────────┘          └──────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- `.env.staging` file configured (copy from `.env.staging.example`)
- Tron and Solana contract addresses deployed
- TronGrid API key

### 1. Configuration

1. Copy environment template:
```bash
cp ../../.env.staging.example ../../.env.staging
```

2. Edit `.env.staging` and set:
   - `POSTGRES_PASSWORD` - Strong database password
   - `REDIS_PASSWORD` - Strong Redis password
   - `JWT_SECRET` - Generate with `openssl rand -base64 64`
   - `ADMIN_JWT_SECRET` - Generate with `openssl rand -base64 64`
   - `TRON_GRID_API_KEY` - Your TronGrid API key
   - Contract addresses (after deployment)

3. (Optional) Configure SSL:
   - Place SSL certificates in `nginx/ssl/`
   - Uncomment SSL blocks in `nginx/nginx.conf`

### 2. Deployment

From the project root:

```bash
# Deploy all services
./scripts/deploy-all.sh staging

# Or manually:
cd infra/staging
docker-compose up -d
```

### 3. Verify Deployment

Check all services are running:
```bash
docker-compose ps
```

Expected output:
```
NAME                      STATUS
usdx-postgres-staging     Up (healthy)
usdx-redis-staging        Up (healthy)
usdx-indexer-staging      Up (healthy)
usdx-webapp-staging       Up (healthy)
usdx-nginx-staging        Up (healthy)
```

Health checks:
```bash
# Backend
curl http://localhost:3001/health

# Frontend
curl http://localhost:3000/api/health

# Nginx
curl http://localhost/health
```

## 📦 Services

### 1. PostgreSQL Database

**Container:** `usdx-postgres-staging`  
**Port:** 5432  
**Volume:** `postgres_data`

**Features:**
- Persistent data storage
- Performance tuning for staging workload
- Read-only monitoring user
- Automatic initialization script

**Access:**
```bash
docker exec -it usdx-postgres-staging psql -U usdx_user -d usdx_staging
```

### 2. Redis Cache

**Container:** `usdx-redis-staging`  
**Port:** 6379  
**Volume:** `redis_data`

**Features:**
- Session storage
- Rate limiting
- Caching layer
- 512MB memory limit with LRU eviction

**Access:**
```bash
docker exec -it usdx-redis-staging redis-cli -a $REDIS_PASSWORD
```

### 3. Backend/Indexer

**Container:** `usdx-indexer-staging`  
**Port:** 3001  
**Build:** `../../apps/indexer/Dockerfile`

**Features:**
- REST API endpoints
- GraphQL API
- Solana indexer
- Tron indexer
- Cross-chain bridge service

**Logs:**
```bash
docker logs -f usdx-indexer-staging
```

### 4. Frontend/Webapp

**Container:** `usdx-webapp-staging`  
**Port:** 3000  
**Build:** `../../apps/webapp/Dockerfile`

**Features:**
- Next.js SSR/SSG
- Wallet integrations (Solana, Tron)
- Real-time updates
- Responsive UI

**Logs:**
```bash
docker logs -f usdx-webapp-staging
```

### 5. Nginx Reverse Proxy

**Container:** `usdx-nginx-staging`  
**Ports:** 80, 443  
**Config:** `nginx/nginx.conf`

**Features:**
- SSL termination (optional)
- Rate limiting (API: 100 req/s, App: 50 req/s)
- Load balancing
- WebSocket support
- Static asset caching
- Security headers

**Logs:**
```bash
docker logs -f usdx-nginx-staging
```

## 🔧 Operations

### Start Services

```bash
docker-compose up -d
```

### Stop Services

```bash
docker-compose stop
```

### Restart a Service

```bash
docker-compose restart indexer
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f indexer

# Last 100 lines
docker-compose logs --tail=100 indexer
```

### Update a Service

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose build indexer
docker-compose up -d indexer
```

### Database Migrations

```bash
# Run migrations
docker exec -it usdx-indexer-staging pnpm prisma migrate deploy

# Check migration status
docker exec -it usdx-indexer-staging pnpm prisma migrate status
```

### Backup Database

```bash
# Backup to file
docker exec usdx-postgres-staging pg_dump -U usdx_user usdx_staging > backup_$(date +%Y%m%d_%H%M%S).sql

# Or use backup script
../../scripts/backup/backup-postgres.sh
```

### Restore Database

```bash
# Restore from file
cat backup.sql | docker exec -i usdx-postgres-staging psql -U usdx_user -d usdx_staging

# Or use restore script
../../scripts/backup/restore-postgres.sh backup.sql
```

## 📊 Monitoring

### Container Stats

```bash
docker stats
```

### Resource Usage

```bash
# Disk usage
docker system df

# Volume sizes
docker volume ls -q | xargs docker volume inspect | grep -A 2 Mountpoint
```

### Database Performance

```bash
# Active connections
docker exec usdx-postgres-staging psql -U usdx_user -d usdx_staging -c "SELECT count(*) FROM pg_stat_activity;"

# Slow queries (> 1s)
docker exec usdx-postgres-staging psql -U usdx_user -d usdx_staging -c "SELECT query, calls, total_time, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"
```

### Redis Stats

```bash
docker exec usdx-redis-staging redis-cli -a $REDIS_PASSWORD INFO stats
```

## 🔐 Security

### Secrets Management

**Never commit:**
- `.env.staging` file
- SSL private keys
- Database passwords
- API keys

**Use environment variables for:**
- All secrets and credentials
- Service configuration
- Feature flags

### Network Security

- All services in isolated network (`usdx-network`)
- Only Nginx exposed to internet (ports 80, 443)
- Internal services not accessible externally
- Rate limiting on all public endpoints

### Database Security

- Strong passwords (min 16 characters)
- Connection only from internal network
- Read-only monitoring user
- Regular backups

## 🐛 Troubleshooting

### Service Won't Start

1. Check logs:
```bash
docker-compose logs service_name
```

2. Check health:
```bash
docker inspect --format='{{json .State.Health}}' container_name
```

3. Verify configuration:
```bash
docker-compose config
```

### Database Connection Errors

1. Check database is healthy:
```bash
docker exec usdx-postgres-staging pg_isready
```

2. Verify credentials in `.env.staging`

3. Check network connectivity:
```bash
docker exec usdx-indexer-staging ping postgres
```

### High CPU/Memory Usage

1. Check resource limits:
```bash
docker stats --no-stream
```

2. Review application logs for errors

3. Consider scaling (add more containers)

### Port Conflicts

If ports are already in use, edit `docker-compose.yml` to use different ports:
```yaml
ports:
  - "8001:3001"  # Changed from 3001:3001
```

## 📚 Additional Resources

- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [PostgreSQL Performance Tuning](https://www.postgresql.org/docs/current/performance-tips.html)
- [Redis Best Practices](https://redis.io/docs/manual/admin/)

## 🆘 Support

For issues or questions:
1. Check logs first
2. Review this README
3. Consult main project documentation
4. Contact DevOps team

---

**Last Updated:** 2025-10-28  
**Environment:** Staging  
**Version:** 1.0.0
