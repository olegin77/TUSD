# Database Backup and Restore Procedures

## Overview

The USDX/Wexel platform includes comprehensive backup and restore scripts for PostgreSQL and Redis data. This document describes the backup strategy, restore procedures, and operational guidelines.

## Quick Start

```bash
# 1. Setup backup automation
cd /workspace/scripts/backup
./setup_backup_cron.sh

# 2. Edit configuration
nano backup.conf

# 3. Test backup manually
./backup_db.sh

# 4. Test restore
./restore_db_test.sh

# 5. Setup automated schedule (see setup output)
```

## Backup Strategy

### What Gets Backed Up

1. **PostgreSQL Database** (`usdx_wexel`)
   - Full database dump in SQL format (compressed with gzip)
   - Custom format dump (for parallel restore)
   - Schema and data for all tables:
     - pools, wexels, users, collateral, listings
     - deposits, transactions, events, etc.

2. **Redis Data**
   - RDB snapshot (dump.rdb)
   - Key exports for critical data
   - Session data, cache, real-time state

### Backup Schedule

**Recommended schedules:**

- **Production**: Daily at 2:00 AM (low traffic period)
- **Staging**: Daily at 3:00 AM
- **Development**: Weekly or manual

**Restore testing:**

- Weekly restore test (Sundays at 3:00 AM)
- After major deployments
- Before mainnet upgrades

### Retention Policy

- **Default**: 30 days retention
- **Production**: Minimum 30 days, recommended 90 days
- **Critical periods**: Keep backups before major updates indefinitely
- **Compliance**: Adjust based on regulatory requirements

## Backup Scripts

### 1. `backup_db.sh`

Main backup script that creates timestamped backups of PostgreSQL and Redis.

**Features:**

- Parallel backup of PostgreSQL and Redis
- Multiple PostgreSQL formats (SQL and custom)
- Compression (gzip)
- Integrity verification
- Automatic cleanup of old backups
- Notification support (webhook, Slack, email)
- Detailed logging

**Usage:**

```bash
# Manual backup with defaults
./backup_db.sh

# With custom configuration
BACKUP_DIR=/mnt/backups RETENTION_DAYS=60 ./backup_db.sh

# With notification
NOTIFICATION_ENABLED=true NOTIFICATION_URL=https://hooks.slack.com/... ./backup_db.sh
```

**Output:**

```
/var/backups/usdx-wexel/
├── postgres/
│   ├── usdx_wexel_20241228_020000.sql.gz      # SQL dump
│   ├── usdx_wexel_20241228_020000.dump.gz     # Custom format
│   └── usdx_wexel_20241228_020000.meta        # Metadata
├── redis/
│   └── redis_20241228_020000.tar.gz           # Redis data
└── logs/
    └── backup_202412.log                       # Monthly log
```

### 2. `restore_db_test.sh`

Restore testing script that verifies backup integrity without affecting production.

**Features:**

- Creates temporary test database
- Restores from latest backup
- Verifies data integrity
- Tests parallel restore (custom format)
- Comprehensive reporting
- Automatic cleanup

**Usage:**

```bash
# Test restore from latest backup
./restore_db_test.sh

# Test restore from specific backup
BACKUP_DIR=/mnt/old-backups ./restore_db_test.sh

# Custom test database name
TEST_DB_NAME=my_restore_test ./restore_db_test.sh
```

### 3. `setup_backup_cron.sh`

Setup script for automated backup scheduling.

**Usage:**

```bash
# Run setup
./setup_backup_cron.sh

# Follow printed instructions to configure cron or systemd
```

## Configuration

### backup.conf

Configuration file for backup scripts:

```bash
# Backup directory (ensure sufficient space)
BACKUP_DIR=/var/backups/usdx-wexel

# Retention policy (days)
RETENTION_DAYS=30

# Database configuration
DB_HOST=localhost
DB_PORT=5432
POSTGRES_DB=usdx_wexel
POSTGRES_USER=usdx
POSTGRES_PASSWORD=secure_password_here

# Redis configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Notifications
NOTIFICATION_ENABLED=true
NOTIFICATION_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Environment
ENVIRONMENT=production
```

### Environment Variables

All configuration can be overridden with environment variables:

```bash
export BACKUP_DIR=/custom/backup/path
export RETENTION_DAYS=90
export DB_HOST=db.example.com
export DB_PASSWORD=your_secure_password
export NOTIFICATION_ENABLED=true
export NOTIFICATION_URL=https://...
```

## Restore Procedures

### Full Production Restore

⚠️ **CAUTION**: Only perform production restore after thorough testing and with team coordination.

**Pre-restore checklist:**

1. ✅ Stop application servers
2. ✅ Notify team and stakeholders
3. ✅ Create backup of current state
4. ✅ Verify backup integrity
5. ✅ Review restore plan

**Restore steps:**

```bash
# 1. Stop applications
docker-compose down
# or
systemctl stop indexer webapp

# 2. Backup current database (just in case)
pg_dump -h localhost -U usdx usdx_wexel | gzip > /tmp/pre_restore_backup.sql.gz

# 3. Drop current database
psql -U usdx -d postgres -c "DROP DATABASE usdx_wexel;"

# 4. Create fresh database
psql -U usdx -d postgres -c "CREATE DATABASE usdx_wexel;"

# 5. Restore from backup (choose one method)

# Method A: SQL format (single-threaded)
gunzip -c /var/backups/usdx-wexel/postgres/usdx_wexel_TIMESTAMP.sql.gz | \
  psql -U usdx -d usdx_wexel

# Method B: Custom format (parallel, faster for large databases)
gunzip -c /var/backups/usdx-wexel/postgres/usdx_wexel_TIMESTAMP.dump.gz > /tmp/restore.dump
pg_restore -U usdx -d usdx_wexel --jobs=4 --verbose /tmp/restore.dump

# 6. Restore Redis
tar -xzf /var/backups/usdx-wexel/redis/redis_TIMESTAMP.tar.gz -C /tmp
gunzip /tmp/redis_TIMESTAMP/dump.rdb.gz
cp /tmp/redis_TIMESTAMP/dump.rdb /var/lib/redis/dump.rdb
chown redis:redis /var/lib/redis/dump.rdb
systemctl restart redis

# 7. Verify data
psql -U usdx -d usdx_wexel -c "SELECT COUNT(*) FROM pools;"
psql -U usdx -d usdx_wexel -c "SELECT COUNT(*) FROM wexels;"
redis-cli DBSIZE

# 8. Start applications
docker-compose up -d
# or
systemctl start indexer webapp

# 9. Verify application health
curl http://localhost:3001/health
```

### Partial Restore (Single Table)

To restore specific tables without full database restore:

```bash
# Extract specific table from backup
gunzip -c backup.sql.gz | grep -A 999999 "CREATE TABLE wexels" > wexels_only.sql

# Restore to separate schema for safety
psql -U usdx -d usdx_wexel -c "CREATE SCHEMA restore_temp;"
psql -U usdx -d usdx_wexel < wexels_only.sql

# Verify and merge data as needed
psql -U usdx -d usdx_wexel -c "SELECT * FROM restore_temp.wexels LIMIT 10;"
```

### Point-in-Time Recovery

For point-in-time recovery, PostgreSQL WAL archiving should be configured:

```sql
-- Enable WAL archiving in postgresql.conf
wal_level = replica
archive_mode = on
archive_command = 'cp %p /var/lib/postgresql/wal_archive/%f'
```

Then use `pg_basebackup` and `pg_waldump` for PITR.

## Monitoring and Alerting

### Backup Monitoring

Monitor backup health:

```bash
# Check last backup age
find /var/backups/usdx-wexel/postgres -name "*.sql.gz" -mtime -1

# Check backup size trend
du -sh /var/backups/usdx-wexel/postgres/* | tail -n 7

# Verify backup logs
tail -f /workspace/scripts/logs/backup_$(date +%Y%m).log
```

### Alerts to Configure

1. **Backup Failure**: Alert if backup script exits with error
2. **Backup Age**: Alert if latest backup is > 25 hours old
3. **Backup Size**: Alert if backup size deviates > 50% from average
4. **Disk Space**: Alert if backup volume < 20% free space
5. **Restore Test Failure**: Alert if weekly restore test fails

### Prometheus Metrics

Add to monitoring stack:

```yaml
# Example alert rule
- alert: BackupTooOld
  expr: time() - backup_last_success_timestamp > 86400
  labels:
    severity: critical
  annotations:
    summary: "Database backup is too old"
```

## Security Considerations

### Backup Security

1. **Encryption at Rest**

   ```bash
   # Encrypt backups with GPG
   gpg --symmetric --cipher-algo AES256 backup.sql.gz
   ```

2. **Access Control**

   ```bash
   # Restrict backup directory permissions
   chmod 700 /var/backups/usdx-wexel
   chown postgres:postgres /var/backups/usdx-wexel
   ```

3. **Credentials**
   - Use `.pgpass` file instead of passwords in scripts
   - Rotate backup access credentials regularly
   - Use separate backup user with read-only access

4. **Off-site Backups**

   ```bash
   # Sync to S3 (with encryption)
   aws s3 sync /var/backups/usdx-wexel s3://usdx-backups/ \
     --sse AES256 --delete

   # Sync to DigitalOcean Spaces
   s3cmd sync /var/backups/usdx-wexel/ s3://usdx-backups/ \
     --encrypt
   ```

### Compliance

For production environments:

- ✅ Encrypt backups at rest and in transit
- ✅ Store off-site (different geographic region)
- ✅ Test restore procedures quarterly
- ✅ Maintain backup logs for audit trail
- ✅ Document data retention policies
- ✅ Implement backup access logging

## Troubleshooting

### Common Issues

**1. Backup fails: "No space left on device"**

```bash
# Check disk space
df -h /var/backups

# Clean old backups manually
find /var/backups/usdx-wexel -mtime +30 -delete

# Or reduce retention
RETENTION_DAYS=14 ./backup_db.sh
```

**2. Restore fails: "role does not exist"**

```bash
# Create missing roles
psql -U postgres -c "CREATE ROLE usdx WITH LOGIN PASSWORD 'password';"

# Or restore with --no-owner flag
pg_restore --no-owner --role=usdx ...
```

**3. Redis restore: "MISCONF Redis is configured to save RDB snapshots"**

```bash
# Temporarily disable save
redis-cli CONFIG SET save ""

# Restore dump.rdb

# Re-enable save
redis-cli CONFIG SET save "900 1 300 10 60 10000"
```

**4. Backup is too slow**

```bash
# Use custom format with compression level 1 (faster)
pg_dump --format=custom --compress=1 ...

# Or use parallel dump (directory format)
pg_dump --format=directory --jobs=4 ...
```

## Disaster Recovery Plan

### RPO/RTO Targets

- **RPO** (Recovery Point Objective): 24 hours (daily backups)
- **RTO** (Recovery Time Objective): 4 hours (time to full restore)

### DR Procedure

1. **Incident Detection** (T+0)
   - Monitor alerts
   - Assess data loss severity
2. **Decision** (T+15min)
   - Determine if restore is needed
   - Identify restore point
   - Activate DR team

3. **Preparation** (T+30min)
   - Provision infrastructure
   - Download backups from off-site
   - Verify backup integrity

4. **Restore** (T+1h)
   - Execute restore procedures
   - Verify data integrity
   - Run smoke tests

5. **Application Start** (T+2h)
   - Start services
   - Verify connectivity
   - Run health checks

6. **Validation** (T+3h)
   - Test critical paths
   - Verify data consistency
   - Monitor for issues

7. **Communication** (T+4h)
   - Notify stakeholders
   - Update status page
   - Post-incident review

## Best Practices

1. ✅ **Automate Everything**: Use cron/systemd, not manual backups
2. ✅ **Test Regularly**: Weekly restore tests minimum
3. ✅ **Monitor Actively**: Set up alerts for failures
4. ✅ **Store Off-site**: Use S3, Spaces, or similar
5. ✅ **Encrypt Sensitive**: Encrypt production backups
6. ✅ **Document Everything**: Keep runbooks updated
7. ✅ **Version Control**: Track backup script changes in git
8. ✅ **Audit Regularly**: Review backup logs monthly
9. ✅ **Plan for Disasters**: Test full DR procedure quarterly
10. ✅ **Keep It Simple**: Simple backups are more reliable

## Maintenance

### Monthly Tasks

- [ ] Review backup logs for errors
- [ ] Check backup size trends
- [ ] Verify off-site sync status
- [ ] Review retention policy
- [ ] Update documentation

### Quarterly Tasks

- [ ] Full DR drill (production restore test)
- [ ] Review and update runbooks
- [ ] Audit backup security
- [ ] Performance tune backup process
- [ ] Capacity planning review

### Annual Tasks

- [ ] Backup strategy review
- [ ] Compliance audit
- [ ] Update disaster recovery plan
- [ ] Backup tool updates
- [ ] Team training refresh

## References

- [PostgreSQL Backup and Restore](https://www.postgresql.org/docs/current/backup.html)
- [Redis Persistence](https://redis.io/docs/management/persistence/)
- [Database Migrations Guide](./DATABASE_MIGRATIONS.md)
- [Configuration Management](./ops/CONFIGURATION_MANAGEMENT.md)
- [Monitoring Guide](./MONITORING.md)

## Support

For backup/restore issues:

1. Check logs: `/workspace/scripts/logs/`
2. Run restore test: `./restore_db_test.sh`
3. Review this document
4. Contact DevOps team
5. Escalate to infrastructure team if needed

---

**Last Updated**: 2024-12-28  
**Version**: 1.0  
**Owner**: DevOps Team
