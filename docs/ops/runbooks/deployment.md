# Deployment Runbook

## Purpose

Step-by-step checklist for production deployments.

## Pre-Deployment (T-24h)

- [ ] Code freeze in effect
- [ ] All tests passing on staging
- [ ] Deployment approved by stakeholders
- [ ] Team notified of deployment window
- [ ] On-call engineer assigned
- [ ] Rollback plan reviewed

## Pre-Deployment (T-4h)

- [ ] Backup staging environment
- [ ] Final staging smoke tests
- [ ] Production database backup verified
- [ ] DNS TTL reduced to 60s (for quick rollback)
- [ ] Monitoring alerts configured
- [ ] Team on standby

## Deployment Window

### Step 1: Prepare (T-0:00)

```bash
cd /opt/usdx-wexel
git fetch --tags
git checkout v1.x.x  # Target version
```

- [ ] Code checked out
- [ ] Version confirmed

### Step 2: Build (T-0:05)

```bash
docker-compose build
```

- [ ] Images built successfully
- [ ] No build errors

### Step 3: Database Migration (T-0:10)

```bash
# Backup before migration
./scripts/backup/backup_db.sh

# Run migrations
docker-compose run --rm indexer npm run migrate

# Verify migration
docker-compose run --rm indexer npm run migrate:status
```

- [ ] Pre-migration backup completed
- [ ] Migrations applied successfully
- [ ] Database schema verified

### Step 4: Deploy Backend (T-0:20)

```bash
docker-compose up -d indexer
docker-compose logs -f indexer
```

- [ ] Service started
- [ ] Health check passing
- [ ] No error logs
- [ ] Database connectivity confirmed
- [ ] Blockchain indexer operational

### Step 5: Deploy Frontend (T-0:25)

```bash
docker-compose up -d webapp
docker-compose logs -f webapp
```

- [ ] Service started
- [ ] Health check passing
- [ ] No error logs

### Step 6: Update Nginx (T-0:30)

```bash
docker-compose exec nginx nginx -t
docker-compose exec nginx nginx -s reload
```

- [ ] Configuration valid
- [ ] Reload successful
- [ ] HTTPS accessible

## Post-Deployment Validation (T-0:35)

### Automated Checks

```bash
# Run smoke tests
./scripts/test_deployment.sh production
```

- [ ] API health check: ✅
- [ ] Frontend loading: ✅
- [ ] Database connectivity: ✅
- [ ] Redis connectivity: ✅
- [ ] Blockchain connectivity: ✅

### Manual Checks

- [ ] Open https://app.usdx-wexel.com
- [ ] Connect wallet (Phantom/TronLink)
- [ ] View pools page
- [ ] View dashboard (with test account)
- [ ] Check admin panel access
- [ ] Verify real-time updates (WebSocket)

### Performance Checks

- [ ] API response time < 500ms (p95)
- [ ] Frontend load time < 3s
- [ ] Database query time < 100ms (p95)
- [ ] No memory leaks (check metrics)

## Monitoring (T-0:45 to T+24h)

### First Hour

- [ ] Watch error logs continuously
- [ ] Monitor Grafana dashboards
- [ ] Check Alertmanager for alerts
- [ ] Verify business metrics updating

### First Day

- [ ] Review error rates (should be < 0.1%)
- [ ] Check user feedback channels
- [ ] Monitor system resources
- [ ] Verify backup schedule running

## Rollback Triggers

Rollback immediately if:

- 🚨 Error rate > 5%
- 🚨 API unavailable > 5 minutes
- 🚨 Data corruption detected
- 🚨 Security vulnerability discovered
- 🚨 User funds at risk

## Rollback Procedure

```bash
# 1. Alert team
./scripts/notify_rollback.sh

# 2. Stop services
docker-compose down

# 3. Checkout previous version
git checkout v1.x.x-prev

# 4. Restore database
gunzip -c /var/backups/.../backup.sql.gz | \
  docker-compose exec -T db psql -U usdx usdx_wexel

# 5. Start services
docker-compose up -d

# 6. Verify
./scripts/test_deployment.sh production
```

- [ ] Rollback completed
- [ ] Services healthy
- [ ] Team notified
- [ ] Post-mortem scheduled

## Sign-Off

- [ ] **Deployer**: Deployment completed successfully
- [ ] **DevOps Lead**: Infrastructure healthy
- [ ] **On-Call Engineer**: Monitoring in place
- [ ] **Product Owner**: Feature verification complete

---

**Deployment Time**: \_**\_  
**Deployed By**: \_\_**  
**Version**: \_**\_  
**Status**: ☐ Success ☐ Rolled Back  
**Notes**: \_\_**
