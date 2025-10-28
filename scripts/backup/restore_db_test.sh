#!/bin/bash
# PostgreSQL and Redis Restore Test Script for USDX/Wexel Platform
# This script performs a test restore to verify backup integrity

set -euo pipefail

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/var/backups/usdx-wexel}"
TEST_DB_NAME="${TEST_DB_NAME:-usdx_wexel_restore_test}"
TEST_REDIS_PORT="${TEST_REDIS_PORT:-6380}"

# Database configuration
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_USER="${POSTGRES_USER:-usdx}"
DB_PASSWORD="${POSTGRES_PASSWORD:-usdxpassword}"

# Redis configuration
REDIS_HOST="${REDIS_HOST:-localhost}"
REDIS_PORT="${REDIS_PORT:-6379}"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
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

log_step() {
    echo -e "${BLUE}[STEP]${NC} $(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Find latest backup files
find_latest_backup() {
    log_info "Searching for latest backup files..."
    
    # Find latest PostgreSQL backup
    PG_BACKUP=$(find "$BACKUP_DIR/postgres" -name "*.sql.gz" -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -f2- -d" ")
    PG_CUSTOM_BACKUP=$(find "$BACKUP_DIR/postgres" -name "*.dump.gz" -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -f2- -d" ")
    
    # Find latest Redis backup
    REDIS_BACKUP=$(find "$BACKUP_DIR/redis" -name "*.tar.gz" -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -f2- -d" ")
    
    if [ -z "$PG_BACKUP" ]; then
        log_error "No PostgreSQL backup found in $BACKUP_DIR/postgres"
        return 1
    fi
    
    if [ -z "$REDIS_BACKUP" ]; then
        log_error "No Redis backup found in $BACKUP_DIR/redis"
        return 1
    fi
    
    log_info "Found PostgreSQL backup: $PG_BACKUP"
    log_info "Found PostgreSQL custom backup: $PG_CUSTOM_BACKUP"
    log_info "Found Redis backup: $REDIS_BACKUP"
}

# Test PostgreSQL restore
test_postgres_restore() {
    log_step "Testing PostgreSQL restore..."
    
    export PGPASSWORD="$DB_PASSWORD"
    
    # Drop test database if exists
    log_info "Dropping existing test database (if any)..."
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres \
        -c "DROP DATABASE IF EXISTS $TEST_DB_NAME;" 2>/dev/null || true
    
    # Create test database
    log_info "Creating test database: $TEST_DB_NAME"
    if ! psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres \
        -c "CREATE DATABASE $TEST_DB_NAME;"; then
        log_error "Failed to create test database"
        return 1
    fi
    
    # Restore from SQL backup
    log_info "Restoring from SQL backup..."
    local start_time=$(date +%s)
    
    if gunzip -c "$PG_BACKUP" | psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$TEST_DB_NAME" \
        > /tmp/restore_test_${TEST_DB_NAME}.log 2>&1; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))
        log_info "PostgreSQL restore completed in ${duration}s"
    else
        log_error "PostgreSQL restore failed. Check /tmp/restore_test_${TEST_DB_NAME}.log"
        return 1
    fi
    
    # Verify restored data
    log_info "Verifying restored data..."
    
    # Check table count
    local table_count=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$TEST_DB_NAME" \
        -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | xargs)
    
    log_info "Restored tables count: $table_count"
    
    if [ "$table_count" -gt 0 ]; then
        log_info "✓ PostgreSQL restore verification passed"
        
        # Get sample data from key tables
        log_info "Sample data from restored database:"
        
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$TEST_DB_NAME" \
            -c "SELECT 'pools' as table_name, COUNT(*) as count FROM pools UNION ALL
                SELECT 'wexels', COUNT(*) FROM wexels UNION ALL
                SELECT 'users', COUNT(*) FROM users UNION ALL
                SELECT 'listings', COUNT(*) FROM listings;" 2>/dev/null || \
            log_warn "Could not fetch sample data (tables may not exist yet)"
    else
        log_error "✗ PostgreSQL restore verification failed - no tables found"
        return 1
    fi
    
    unset PGPASSWORD
    
    # Test custom format restore (parallel)
    if [ -n "$PG_CUSTOM_BACKUP" ] && [ -f "$PG_CUSTOM_BACKUP" ]; then
        log_info "Testing parallel restore from custom format..."
        
        local test_db2="${TEST_DB_NAME}_custom"
        export PGPASSWORD="$DB_PASSWORD"
        
        # Drop and create test database
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres \
            -c "DROP DATABASE IF EXISTS $test_db2;" 2>/dev/null || true
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres \
            -c "CREATE DATABASE $test_db2;" 2>/dev/null
        
        # Restore using pg_restore with parallel jobs
        local temp_file="/tmp/restore_custom_${test_db2}.dump"
        gunzip -c "$PG_CUSTOM_BACKUP" > "$temp_file"
        
        if pg_restore -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$test_db2" \
            --jobs=4 --verbose "$temp_file" 2>&1 | tail -n 20; then
            log_info "✓ Parallel restore from custom format succeeded"
        else
            log_warn "Parallel restore had warnings (may be normal)"
        fi
        
        rm -f "$temp_file"
        
        # Cleanup test database
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres \
            -c "DROP DATABASE IF EXISTS $test_db2;" 2>/dev/null || true
        
        unset PGPASSWORD
    fi
    
    return 0
}

# Test Redis restore
test_redis_restore() {
    log_step "Testing Redis restore..."
    
    # Extract Redis backup
    log_info "Extracting Redis backup..."
    local temp_dir="/tmp/redis_restore_test_$$"
    mkdir -p "$temp_dir"
    
    if ! tar -xzf "$REDIS_BACKUP" -C "$temp_dir"; then
        log_error "Failed to extract Redis backup"
        rm -rf "$temp_dir"
        return 1
    fi
    
    # Find the dump file
    local dump_file=$(find "$temp_dir" -name "dump.rdb.gz" | head -n1)
    
    if [ -z "$dump_file" ]; then
        log_error "dump.rdb.gz not found in backup"
        rm -rf "$temp_dir"
        return 1
    fi
    
    log_info "Found Redis dump: $dump_file"
    
    # Decompress dump
    gunzip "$dump_file"
    dump_file="${dump_file%.gz}"
    
    log_info "Redis dump decompressed: $dump_file"
    
    # Start a test Redis instance
    log_info "Starting test Redis instance on port $TEST_REDIS_PORT..."
    
    local redis_data_dir="/tmp/redis_test_data_$$"
    mkdir -p "$redis_data_dir"
    cp "$dump_file" "$redis_data_dir/dump.rdb"
    
    # Start Redis in background
    redis-server --port "$TEST_REDIS_PORT" --dir "$redis_data_dir" \
        --daemonize yes --loglevel warning 2>/dev/null
    
    sleep 2
    
    # Verify test Redis is running
    if ! redis-cli -p "$TEST_REDIS_PORT" PING > /dev/null 2>&1; then
        log_error "Failed to start test Redis instance"
        rm -rf "$temp_dir" "$redis_data_dir"
        return 1
    fi
    
    log_info "Test Redis instance started successfully"
    
    # Check restored data
    log_info "Verifying restored Redis data..."
    
    local key_count=$(redis-cli -p "$TEST_REDIS_PORT" DBSIZE | grep -o '[0-9]*' || echo "0")
    log_info "Restored Redis keys count: $key_count"
    
    if [ "$key_count" -gt 0 ]; then
        log_info "✓ Redis restore verification passed"
        
        # Sample some keys
        log_info "Sample Redis keys:"
        redis-cli -p "$TEST_REDIS_PORT" --scan | head -n 10 | while read key; do
            local type=$(redis-cli -p "$TEST_REDIS_PORT" TYPE "$key")
            echo "  - $key ($type)"
        done
    else
        log_warn "No keys found in restored Redis (may be expected if backup was empty)"
    fi
    
    # Shutdown test Redis
    log_info "Shutting down test Redis instance..."
    redis-cli -p "$TEST_REDIS_PORT" SHUTDOWN NOSAVE 2>/dev/null || true
    
    # Cleanup
    rm -rf "$temp_dir" "$redis_data_dir"
    
    return 0
}

# Cleanup test database
cleanup_test_database() {
    log_info "Cleaning up test database..."
    
    export PGPASSWORD="$DB_PASSWORD"
    
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres \
        -c "DROP DATABASE IF EXISTS $TEST_DB_NAME;" 2>/dev/null || \
        log_warn "Could not drop test database (may not exist)"
    
    unset PGPASSWORD
}

# Generate restore report
generate_report() {
    local pg_result=$1
    local redis_result=$2
    
    log_info "=== Restore Test Report ==="
    echo ""
    echo "Timestamp: $(date -Iseconds)"
    echo "PostgreSQL Backup: $(basename "$PG_BACKUP")"
    echo "Redis Backup: $(basename "$REDIS_BACKUP")"
    echo ""
    
    if [ $pg_result -eq 0 ]; then
        echo -e "${GREEN}✓ PostgreSQL Restore: PASSED${NC}"
    else
        echo -e "${RED}✗ PostgreSQL Restore: FAILED${NC}"
    fi
    
    if [ $redis_result -eq 0 ]; then
        echo -e "${GREEN}✓ Redis Restore: PASSED${NC}"
    else
        echo -e "${RED}✗ Redis Restore: FAILED${NC}"
    fi
    
    echo ""
    
    if [ $pg_result -eq 0 ] && [ $redis_result -eq 0 ]; then
        echo -e "${GREEN}=== All Restore Tests PASSED ===${NC}"
        return 0
    else
        echo -e "${RED}=== Some Restore Tests FAILED ===${NC}"
        return 1
    fi
}

# Main restore test process
main() {
    log_info "=== Starting USDX/Wexel Restore Test ==="
    
    local start_time=$(date +%s)
    
    # Find backups
    if ! find_latest_backup; then
        log_error "Cannot proceed without backup files"
        return 1
    fi
    
    # Test restores
    local pg_result=0
    local redis_result=0
    
    test_postgres_restore || pg_result=$?
    test_redis_restore || redis_result=$?
    
    # Cleanup
    cleanup_test_database
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    log_info "Test completed in ${duration}s"
    
    # Generate report
    generate_report $pg_result $redis_result
}

# Handle cleanup on exit
trap cleanup_test_database EXIT

# Run main process
main "$@"
