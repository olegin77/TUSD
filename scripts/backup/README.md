# Backup Scripts

Comprehensive backup and restore scripts for USDX/Wexel PostgreSQL and Redis databases.

## Quick Start

```bash
# 1. Setup
./setup_backup_cron.sh

# 2. Configure
nano backup.conf

# 3. Test manually
./backup_db.sh

# 4. Test restore
./restore_db_test.sh

# 5. Run script tests
./test_backup_scripts.sh
```

## Scripts

### backup_db.sh
Main backup script - creates timestamped backups of PostgreSQL and Redis.

**Features:**
- ✅ PostgreSQL full backup (SQL + custom format)
- ✅ Redis RDB snapshot backup
- ✅ Automatic compression (gzip)
- ✅ Integrity verification
- ✅ Automatic cleanup (30-day retention)
- ✅ Notification support (webhook/Slack)
- ✅ Detailed logging

**Usage:**
```bash
./backup_db.sh
```

### restore_db_test.sh
Automated restore testing - verifies backup integrity without affecting production.

**Features:**
- ✅ Creates test database
- ✅ Restores from latest backup
- ✅ Verifies data integrity
- ✅ Tests parallel restore
- ✅ Automatic cleanup
- ✅ Detailed reporting

**Usage:**
```bash
./restore_db_test.sh
```

### setup_backup_cron.sh
Setup automated backup scheduling via cron or systemd.

**Usage:**
```bash
./setup_backup_cron.sh
# Follow printed instructions
```

### test_backup_scripts.sh
Unit tests for backup scripts.

**Usage:**
```bash
./test_backup_scripts.sh
```

## Configuration

Edit `backup.conf` or use environment variables:

```bash
export BACKUP_DIR=/var/backups/usdx-wexel
export RETENTION_DAYS=30
export DB_HOST=localhost
export DB_PORT=5432
export POSTGRES_DB=usdx_wexel
export POSTGRES_USER=usdx
export POSTGRES_PASSWORD=secure_password
export REDIS_HOST=localhost
export REDIS_PORT=6379
export NOTIFICATION_ENABLED=true
export NOTIFICATION_URL=https://hooks.slack.com/...
```

## Automated Schedule

### Using Cron

```bash
# Daily at 2:00 AM
0 2 * * * /workspace/scripts/backup/backup_cron.sh

# Weekly restore test (Sundays at 3:00 AM)
0 3 * * 0 /workspace/scripts/backup/restore_db_test.sh >> /workspace/scripts/logs/restore_test.log 2>&1
```

### Using Systemd

```bash
# Install timer
sudo cp /tmp/usdx-backup.service /etc/systemd/system/
sudo cp /tmp/usdx-backup.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable usdx-backup.timer
sudo systemctl start usdx-backup.timer

# Check status
sudo systemctl status usdx-backup.timer
```

## Output Structure

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

## Production Restore

⚠️ **CAUTION**: Only perform in emergencies with team coordination.

```bash
# 1. Stop services
docker-compose down

# 2. Restore PostgreSQL
gunzip -c backup.sql.gz | psql -U usdx -d usdx_wexel

# 3. Restore Redis
tar -xzf redis_backup.tar.gz
gunzip dump.rdb.gz
cp dump.rdb /var/lib/redis/
systemctl restart redis

# 4. Start services
docker-compose up -d

# 5. Verify
curl http://localhost:3001/health
```

## Monitoring

### Check Backup Health

```bash
# Last backup age
find /var/backups/usdx-wexel/postgres -name "*.sql.gz" -mtime -1

# Backup logs
tail -f /workspace/scripts/logs/backup_$(date +%Y%m).log

# Disk space
df -h /var/backups
```

### Alerts to Set Up

1. ❗ **Backup Failure**: Alert if backup exits with error
2. ⏰ **Backup Age**: Alert if latest backup > 25 hours old
3. 📊 **Backup Size**: Alert if size deviates > 50% from average
4. 💾 **Disk Space**: Alert if backup volume < 20% free
5. 🔄 **Restore Test**: Alert if weekly test fails

## Security

### Best Practices

1. ✅ **Encrypt backups** (GPG or S3 encryption)
2. ✅ **Restrict permissions** (chmod 700)
3. ✅ **Use .pgpass** (no passwords in scripts)
4. ✅ **Off-site storage** (S3, Spaces, etc.)
5. ✅ **Audit logs** (maintain backup access logs)

### Off-site Sync

```bash
# AWS S3
aws s3 sync /var/backups/usdx-wexel s3://usdx-backups/ --sse AES256

# DigitalOcean Spaces
s3cmd sync /var/backups/usdx-wexel/ s3://usdx-backups/ --encrypt
```

## Troubleshooting

### No space left on device
```bash
# Clean old backups
find /var/backups/usdx-wexel -mtime +30 -delete

# Or reduce retention
RETENTION_DAYS=14 ./backup_db.sh
```

### Restore fails: role does not exist
```bash
# Create role
psql -U postgres -c "CREATE ROLE usdx WITH LOGIN PASSWORD 'password';"

# Or use --no-owner
pg_restore --no-owner --role=usdx ...
```

### Backup too slow
```bash
# Use parallel dump
pg_dump --format=directory --jobs=4 ...
```

## Documentation

See [docs/ops/BACKUP_RESTORE.md](../../docs/ops/BACKUP_RESTORE.md) for:
- 📖 Complete procedures
- 🚨 Disaster recovery plan
- 📋 Maintenance checklists
- 🔒 Security guidelines
- 📊 RPO/RTO targets

## Testing

All scripts include comprehensive tests:

```bash
./test_backup_scripts.sh
```

**Test coverage:**
- ✅ Script existence and permissions
- ✅ Bash syntax validation
- ✅ Function definitions
- ✅ Error handling
- ✅ Logging functions
- ✅ Notification support
- ✅ Configuration variables
- ✅ Documentation
- ✅ Security best practices

## Support

Issues? Check:
1. Logs: `/workspace/scripts/logs/`
2. Run tests: `./test_backup_scripts.sh`
3. Documentation: `../../docs/ops/BACKUP_RESTORE.md`
4. Contact DevOps team

---

**Version**: 1.0  
**Last Updated**: 2024-12-28  
**Maintainer**: DevOps Team
