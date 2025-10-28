#!/bin/bash
# PostgreSQL and Redis Backup Script for USDX/Wexel Platform
# This script creates timestamped backups of PostgreSQL database and Redis data

set -euo pipefail

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/var/backups/usdx-wexel}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Database configuration (from environment or defaults)
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${POSTGRES_DB:-usdx_wexel}"
DB_USER="${POSTGRES_USER:-usdx}"
DB_PASSWORD="${POSTGRES_PASSWORD:-usdxpassword}"

# Redis configuration
REDIS_HOST="${REDIS_HOST:-localhost}"
REDIS_PORT="${REDIS_PORT:-6379}"

# Notification settings
NOTIFICATION_ENABLED="${NOTIFICATION_ENABLED:-false}"
NOTIFICATION_URL="${NOTIFICATION_URL:-}"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Send notification
send_notification() {
    local status=$1
    local message=$2
    
    if [ "$NOTIFICATION_ENABLED" = "true" ] && [ -n "$NOTIFICATION_URL" ]; then
        curl -X POST "$NOTIFICATION_URL" \
            -H "Content-Type: application/json" \
            -d "{\"status\":\"$status\",\"message\":\"$message\",\"timestamp\":\"$(date -Iseconds)\"}" \
            2>/dev/null || true
    fi
}

# Create backup directory structure
create_backup_dirs() {
    log_info "Creating backup directories..."
    mkdir -p "$BACKUP_DIR"/{postgres,redis,logs}
    chmod 700 "$BACKUP_DIR"
}

# Backup PostgreSQL database
backup_postgres() {
    log_info "Starting PostgreSQL backup..."
    
    local pg_backup_file="$BACKUP_DIR/postgres/usdx_wexel_${TIMESTAMP}.sql.gz"
    local pg_custom_file="$BACKUP_DIR/postgres/usdx_wexel_${TIMESTAMP}.dump"
    
    export PGPASSWORD="$DB_PASSWORD"
    
    # SQL dump (compressed)
    if pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
        --verbose --no-owner --no-acl | gzip > "$pg_backup_file" 2>&1; then
        log_info "PostgreSQL SQL backup completed: $pg_backup_file"
        
        # Get backup size
        local size=$(du -h "$pg_backup_file" | cut -f1)
        log_info "Backup size: $size"
    else
        log_error "PostgreSQL SQL backup failed"
        send_notification "error" "PostgreSQL SQL backup failed"
        return 1
    fi
    
    # Custom format dump (for parallel restore)
    if pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
        --format=custom --verbose --no-owner --no-acl \
        --file="$pg_custom_file" 2>&1; then
        log_info "PostgreSQL custom format backup completed: $pg_custom_file"
        
        # Compress custom format
        gzip "$pg_custom_file"
        log_info "Custom format compressed: ${pg_custom_file}.gz"
    else
        log_error "PostgreSQL custom format backup failed"
        send_notification "error" "PostgreSQL custom format backup failed"
        return 1
    fi
    
    unset PGPASSWORD
    
    # Create metadata file
    cat > "$BACKUP_DIR/postgres/usdx_wexel_${TIMESTAMP}.meta" <<EOF
{
  "timestamp": "$(date -Iseconds)",
  "database": "$DB_NAME",
  "host": "$DB_HOST",
  "port": $DB_PORT,
  "version": "$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -t -c 'SELECT version();' 2>/dev/null | head -n1 | xargs)",
  "backup_files": [
    "$(basename "$pg_backup_file")",
    "$(basename "${pg_custom_file}.gz")"
  ]
}
EOF
    
    log_info "PostgreSQL backup completed successfully"
    return 0
}

# Backup Redis data
backup_redis() {
    log_info "Starting Redis backup..."
    
    local redis_backup_dir="$BACKUP_DIR/redis/redis_${TIMESTAMP}"
    mkdir -p "$redis_backup_dir"
    
    # Trigger Redis BGSAVE
    if redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" BGSAVE > /dev/null 2>&1; then
        log_info "Redis BGSAVE triggered"
        
        # Wait for BGSAVE to complete
        local max_wait=60
        local waited=0
        while [ $waited -lt $max_wait ]; do
            local status=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" LASTSAVE 2>/dev/null || echo "0")
            sleep 2
            waited=$((waited + 2))
            
            local new_status=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" LASTSAVE 2>/dev/null || echo "0")
            if [ "$new_status" != "$status" ]; then
                log_info "Redis BGSAVE completed"
                break
            fi
        done
        
        if [ $waited -ge $max_wait ]; then
            log_warn "Redis BGSAVE timeout, backup may be incomplete"
        fi
    else
        log_warn "Redis BGSAVE failed, attempting to copy dump.rdb directly"
    fi
    
    # Find and copy Redis dump file
    local redis_dump_path="/var/lib/redis/dump.rdb"
    if [ ! -f "$redis_dump_path" ]; then
        redis_dump_path="/data/dump.rdb"
    fi
    
    if [ -f "$redis_dump_path" ]; then
        cp "$redis_dump_path" "$redis_backup_dir/dump.rdb"
        gzip "$redis_backup_dir/dump.rdb"
        log_info "Redis dump copied and compressed: $redis_backup_dir/dump.rdb.gz"
    else
        log_error "Redis dump.rdb not found at expected locations"
        send_notification "error" "Redis dump.rdb not found"
        return 1
    fi
    
    # Export all Redis keys as backup (JSON format)
    log_info "Exporting Redis keys..."
    redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" --scan | while read key; do
        redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" DUMP "$key" | \
            base64 > "$redis_backup_dir/${key//\//_}.dump"
    done 2>/dev/null || log_warn "Redis key export had some errors"
    
    # Compress all dump files
    tar -czf "$redis_backup_dir.tar.gz" -C "$BACKUP_DIR/redis" "redis_${TIMESTAMP}"
    rm -rf "$redis_backup_dir"
    
    log_info "Redis backup completed: $redis_backup_dir.tar.gz"
    return 0
}

# Clean old backups
cleanup_old_backups() {
    log_info "Cleaning up backups older than $RETENTION_DAYS days..."
    
    local deleted_count=0
    
    # Clean PostgreSQL backups
    find "$BACKUP_DIR/postgres" -type f -mtime +$RETENTION_DAYS -delete && \
        deleted_count=$((deleted_count + $(find "$BACKUP_DIR/postgres" -type f -mtime +$RETENTION_DAYS | wc -l)))
    
    # Clean Redis backups
    find "$BACKUP_DIR/redis" -type f -mtime +$RETENTION_DAYS -delete && \
        deleted_count=$((deleted_count + $(find "$BACKUP_DIR/redis" -type f -mtime +$RETENTION_DAYS | wc -l)))
    
    log_info "Cleaned up $deleted_count old backup files"
}

# Verify backup integrity
verify_backup() {
    log_info "Verifying backup integrity..."
    
    local pg_backup_file="$BACKUP_DIR/postgres/usdx_wexel_${TIMESTAMP}.sql.gz"
    
    # Test PostgreSQL backup can be read
    if gunzip -t "$pg_backup_file" 2>/dev/null; then
        log_info "PostgreSQL backup integrity verified"
    else
        log_error "PostgreSQL backup is corrupted"
        send_notification "error" "PostgreSQL backup integrity check failed"
        return 1
    fi
    
    # Test Redis backup can be read
    local redis_backup_file="$BACKUP_DIR/redis/redis_${TIMESTAMP}.tar.gz"
    if tar -tzf "$redis_backup_file" > /dev/null 2>&1; then
        log_info "Redis backup integrity verified"
    else
        log_error "Redis backup is corrupted"
        send_notification "error" "Redis backup integrity check failed"
        return 1
    fi
    
    return 0
}

# Main backup process
main() {
    log_info "=== Starting USDX/Wexel Backup Process ==="
    log_info "Timestamp: $TIMESTAMP"
    log_info "Backup directory: $BACKUP_DIR"
    
    local start_time=$(date +%s)
    
    # Create directories
    create_backup_dirs
    
    # Perform backups
    local pg_result=0
    local redis_result=0
    
    backup_postgres || pg_result=$?
    backup_redis || redis_result=$?
    
    # Verify backups
    if [ $pg_result -eq 0 ] && [ $redis_result -eq 0 ]; then
        verify_backup || log_warn "Backup verification had issues"
    fi
    
    # Cleanup old backups
    cleanup_old_backups
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    log_info "=== Backup Process Completed in ${duration}s ==="
    
    if [ $pg_result -eq 0 ] && [ $redis_result -eq 0 ]; then
        log_info "All backups completed successfully"
        send_notification "success" "Backup completed successfully in ${duration}s"
        return 0
    else
        log_error "Some backups failed (PostgreSQL: $pg_result, Redis: $redis_result)"
        send_notification "error" "Backup completed with errors"
        return 1
    fi
}

# Run main process
main "$@"
