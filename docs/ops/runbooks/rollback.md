# Rollback Runbook

## Purpose

Procedures for rolling back failed deployments or recovering from incidents.

## When to Rollback

**Immediate rollback triggers:**

- 🚨 **Critical bugs** affecting core functionality
- 🚨 **Data corruption** or loss detected
- 🚨 **Security vulnerabilities** discovered
- 🚨 **Error rate** > 5% for more than 5 minutes
- 🚨 **Service unavailable** for > 10 minutes
- 🚨 **Performance degradation** > 50% from baseline
- 🚨 **User funds at risk**

**Consider rollback:**

- ⚠️ Error rate 1-5% sustained
- ⚠️ New critical bugs reported
- ⚠️ Unexpected behavior in production
- ⚠️ Resource exhaustion (memory, CPU, disk)
- ⚠️ External dependencies failing

---

## Quick Rollback Procedure

### Prerequisites

- [ ] Previous version identified (e.g., v1.0.2)
- [ ] Team notified
- [ ] Incident channel active
- [ ] Rollback decision approved

### Step 1: Alert & Prepare (T+0)

```bash
# Alert team
./scripts/notify_rollback.sh "Rolling back to v1.0.2 due to [reason]"

# Update status page
./scripts/update_status.sh investigating "Performing emergency rollback"

# Log into production server
ssh prod@production-server
cd /opt/usdx-wexel
```

**Checklist:**
- [ ] Team alerted
- [ ] Status page updated
- [ ] Logged into server
- [ ] Rollback version confirmed

### Step 2: Stop Services (T+2)

```bash
# Stop all application services
docker-compose stop webapp indexer nginx

# Leave database and redis running
```

**Checklist:**
- [ ] Application services stopped
- [ ] Database still running
- [ ] Redis still running

### Step 3: Rollback Application Code (T+5)

```bash
# Checkout previous version
git fetch --tags
git checkout v1.0.2  # Replace with actual version

# Verify version
git describe --tags
cat package.json | grep version
```

**Checklist:**
- [ ] Code rolled back to v1.0.2
- [ ] Version verified

### Step 4: Rollback Database (if needed) (T+8)

**⚠️ CAUTION: Only rollback database if schema changes caused issues**

```bash
# Find backup before problematic deployment
ls -lht /var/backups/usdx-wexel/postgres/ | head -20

# Choose appropriate backup
BACKUP_FILE="/var/backups/usdx-wexel/postgres/usdx_wexel_20241228_014500.sql.gz"

# Create safety backup of current state
docker-compose exec db pg_dump -U usdx usdx_wexel | \
  gzip > /tmp/pre_rollback_backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Stop indexer to prevent writes
docker-compose stop indexer

# Restore database
gunzip -c "$BACKUP_FILE" | \
  docker-compose exec -T db psql -U usdx -d postgres -c "
    SELECT pg_terminate_backend(pid) 
    FROM pg_stat_activity 
    WHERE datname = 'usdx_wexel' AND pid <> pg_backend_pid();
  "

gunzip -c "$BACKUP_FILE" | \
  docker-compose exec -T db psql -U usdx -d postgres -c "
    DROP DATABASE IF EXISTS usdx_wexel;
    CREATE DATABASE usdx_wexel OWNER usdx;
  "

gunzip -c "$BACKUP_FILE" | \
  docker-compose exec -T db psql -U usdx -d usdx_wexel

# Verify restore
docker-compose exec db psql -U usdx -d usdx_wexel -c "
  SELECT COUNT(*) FROM pools;
  SELECT COUNT(*) FROM wexels;
  SELECT COUNT(*) FROM users;
"
```

**Checklist:**
- [ ] Backup file identified
- [ ] Current state backed up
- [ ] Database restored
- [ ] Data verified

**Skip if:** No database changes in problematic deployment

### Step 5: Rebuild & Restart Services (T+15)

```bash
# Rebuild images (use cached layers)
docker-compose build

# Or pull previous images if tagged
# docker pull usdx-indexer:1.0.2
# docker pull usdx-webapp:1.0.2

# Start services
docker-compose up -d

# Watch logs
docker-compose logs -f
```

**Checklist:**
- [ ] Images rebuilt
- [ ] Services started
- [ ] No error logs
- [ ] Health checks passing

### Step 6: Verify Rollback (T+20)

```bash
# Check service status
docker-compose ps

# Health checks
curl https://api.usdx-wexel.com/health
curl https://app.usdx-wexel.com/

# Check version
curl https://api.usdx-wexel.com/health | jq .version
# Should show v1.0.2

# Run smoke tests
./scripts/test_deployment.sh production
```

**Manual verification:**
- [ ] Open https://app.usdx-wexel.com
- [ ] Connect wallet
- [ ] View dashboard
- [ ] Check pools page
- [ ] Verify critical functionality

**Metrics verification:**
- [ ] Error rate < 0.1%
- [ ] Response time < 500ms (p95)
- [ ] No alerts firing
- [ ] Business metrics updating

### Step 7: Monitor (T+30 to T+60)

```bash
# Watch Grafana dashboards
# http://monitoring.usdx-wexel.com:3002

# Watch error logs
docker-compose logs -f --tail=100 indexer | grep -i error

# Check alerts
# Review Alertmanager
```

**Monitoring checklist:**
- [ ] Error rates stable and low
- [ ] Response times normal
- [ ] Database performance normal
- [ ] Memory/CPU usage normal
- [ ] No new alerts

### Step 8: Communicate (T+30)

```bash
# Update status page
./scripts/update_status.sh resolved "Rollback completed. Services restored to v1.0.2"

# Notify users
./scripts/send_notification.sh all "Issue resolved. Services have been restored."

# Internal notification
./scripts/notify_team.sh "Rollback to v1.0.2 completed successfully. Monitoring ongoing."
```

**Communication checklist:**
- [ ] Status page updated (resolved)
- [ ] Users notified
- [ ] Team notified
- [ ] Stakeholders updated
- [ ] Post-mortem scheduled

---

## Rollback Scenarios

### Scenario 1: Application Bug (No DB Changes)

**Fastest rollback - Code only**

```bash
# 1. Stop services
docker-compose stop webapp indexer nginx

# 2. Rollback code
git checkout v1.0.2

# 3. Restart
docker-compose up -d

# Total time: ~5 minutes
```

### Scenario 2: Database Migration Issue

**Requires database rollback**

```bash
# 1. Stop services
docker-compose stop webapp indexer nginx

# 2. Rollback database
gunzip -c /var/backups/.../backup.sql.gz | \
  docker-compose exec -T db psql -U usdx usdx_wexel

# 3. Rollback code
git checkout v1.0.2

# 4. Restart
docker-compose up -d

# Total time: ~15-20 minutes
```

### Scenario 3: Infrastructure Issue

**May not require rollback**

```bash
# 1. Identify infrastructure problem
# - RPC node down?
# - Database issue?
# - Network problem?

# 2. Fix infrastructure
# Restart affected service or switch to backup

# 3. Verify
# May not need code rollback

# Total time: Variable
```

### Scenario 4: Security Incident

**Immediate action required**

```bash
# 1. PAUSE EVERYTHING
docker-compose stop webapp indexer nginx

# 2. Enable maintenance mode
# Update DNS to maintenance page

# 3. Assess damage
# Check for data breach, unauthorized access

# 4. Rollback and patch
git checkout v1.0.2
# Apply security patch
# Rotate all credentials

# 5. Restore after security review

# Total time: Hours to days
```

---

## Database Rollback Details

### Safe Database Rollback

**When migrations are reversible:**

```bash
# Check migration status
docker-compose run --rm indexer npm run migrate:status

# Rollback migrations
docker-compose run --rm indexer npm run migrate:down

# Or rollback to specific version
docker-compose run --rm indexer npm run migrate:down -- --to 20241220000000
```

### Emergency Database Restore

**When migrations are not reversible:**

```bash
# 1. Find latest backup BEFORE bad deployment
ls -lht /var/backups/usdx-wexel/postgres/

# 2. Stop all database writes
docker-compose stop indexer webapp

# 3. Create safety backup
docker-compose exec db pg_dump -U usdx usdx_wexel | gzip > /tmp/safety_backup.sql.gz

# 4. Drop and recreate database
docker-compose exec db psql -U postgres -c "
  SELECT pg_terminate_backend(pid) 
  FROM pg_stat_activity 
  WHERE datname = 'usdx_wexel';
  DROP DATABASE IF EXISTS usdx_wexel;
  CREATE DATABASE usdx_wexel OWNER usdx;
"

# 5. Restore from backup
gunzip -c /var/backups/.../backup.sql.gz | \
  docker-compose exec -T db psql -U usdx -d usdx_wexel

# 6. Verify data integrity
docker-compose exec db psql -U usdx -d usdx_wexel -c "
  SELECT 'pools' as table, COUNT(*) as count FROM pools
  UNION ALL
  SELECT 'wexels', COUNT(*) FROM wexels
  UNION ALL
  SELECT 'users', COUNT(*) FROM users;
"
```

---

## Post-Rollback Actions

### Immediate (T+1h)

- [ ] All services verified healthy
- [ ] Error rates normal
- [ ] User communications sent
- [ ] Incident timeline documented

### Short-term (T+24h)

- [ ] Root cause identified
- [ ] Post-mortem drafted
- [ ] Action items created
- [ ] Preventive measures planned

### Long-term (T+1week)

- [ ] Post-mortem published
- [ ] Action items in progress
- [ ] Process improvements implemented
- [ ] Team learnings shared

---

## Rollback Decision Matrix

| Condition | Action | Approver |
|-----------|--------|----------|
| P0 - Service down > 10 min | **Immediate rollback** | On-call engineer |
| P0 - Data at risk | **Immediate rollback** | On-call + Team lead |
| P1 - Error rate > 5% | **Rollback within 15 min** | On-call + Team lead |
| P1 - Critical feature broken | **Rollback or hotfix** | Team lead |
| P2 - Non-critical bug | **Hotfix or next release** | Product owner |

---

## Prevention

### Pre-Deployment

- ✅ Comprehensive testing on staging
- ✅ Database migration testing
- ✅ Rollback plan prepared
- ✅ Automated tests passing
- ✅ Code review completed
- ✅ Load testing performed

### During Deployment

- ✅ Deploy to staging first
- ✅ Gradual rollout (if possible)
- ✅ Monitor metrics closely
- ✅ Have rollback ready
- ✅ Team on standby

### Post-Deployment

- ✅ Monitor for 24-48 hours
- ✅ User feedback channels active
- ✅ Quick response to issues
- ✅ Regular backups verified

---

## Contacts

- **On-Call Engineer**: PagerDuty
- **Team Lead**: [contact]
- **DevOps Lead**: [contact]
- **Database Admin**: [contact]
- **Infrastructure Support**: [provider]

---

## Related Documentation

- [Deployment Guide](../DEPLOYMENT_GUIDE.md)
- [Incident Response](./incident_response.md)
- [Backup & Restore](../BACKUP_RESTORE.md)
- [Database Migrations](../../DATABASE_MIGRATIONS.md)

---

**Last Updated**: 2024-12-28  
**Next Review**: 2025-03-28  
**Owner**: DevOps Team
