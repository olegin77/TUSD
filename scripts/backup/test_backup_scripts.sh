#!/bin/bash
# Unit tests for backup scripts

set -euo pipefail

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_PASSED=0
TEST_FAILED=0

test_pass() {
    echo -e "${GREEN}✓${NC} $1"
    TEST_PASSED=$((TEST_PASSED + 1))
}

test_fail() {
    echo -e "${RED}✗${NC} $1"
    TEST_FAILED=$((TEST_FAILED + 1))
}

echo "=== Testing Backup Scripts ==="
echo ""

# Test 1: Check scripts exist
echo "Test 1: Script existence"
if [ -f "$SCRIPT_DIR/backup_db.sh" ]; then
    test_pass "backup_db.sh exists"
else
    test_fail "backup_db.sh not found"
fi

if [ -f "$SCRIPT_DIR/restore_db_test.sh" ]; then
    test_pass "restore_db_test.sh exists"
else
    test_fail "restore_db_test.sh not found"
fi

if [ -f "$SCRIPT_DIR/setup_backup_cron.sh" ]; then
    test_pass "setup_backup_cron.sh exists"
else
    test_fail "setup_backup_cron.sh not found"
fi

# Test 2: Check scripts are executable
echo ""
echo "Test 2: Script permissions"
if [ -x "$SCRIPT_DIR/backup_db.sh" ]; then
    test_pass "backup_db.sh is executable"
else
    test_fail "backup_db.sh is not executable"
fi

if [ -x "$SCRIPT_DIR/restore_db_test.sh" ]; then
    test_pass "restore_db_test.sh is executable"
else
    test_fail "restore_db_test.sh is not executable"
fi

if [ -x "$SCRIPT_DIR/setup_backup_cron.sh" ]; then
    test_pass "setup_backup_cron.sh is executable"
else
    test_fail "setup_backup_cron.sh is not executable"
fi

# Test 3: Syntax check
echo ""
echo "Test 3: Bash syntax validation"
if bash -n "$SCRIPT_DIR/backup_db.sh" 2>/dev/null; then
    test_pass "backup_db.sh syntax is valid"
else
    test_fail "backup_db.sh has syntax errors"
fi

if bash -n "$SCRIPT_DIR/restore_db_test.sh" 2>/dev/null; then
    test_pass "restore_db_test.sh syntax is valid"
else
    test_fail "restore_db_test.sh has syntax errors"
fi

if bash -n "$SCRIPT_DIR/setup_backup_cron.sh" 2>/dev/null; then
    test_pass "setup_backup_cron.sh syntax is valid"
else
    test_fail "setup_backup_cron.sh has syntax errors"
fi

# Test 4: Check required functions exist
echo ""
echo "Test 4: Function definitions"

if grep -q "^backup_postgres()" "$SCRIPT_DIR/backup_db.sh"; then
    test_pass "backup_postgres function defined"
else
    test_fail "backup_postgres function not found"
fi

if grep -q "^backup_redis()" "$SCRIPT_DIR/backup_db.sh"; then
    test_pass "backup_redis function defined"
else
    test_fail "backup_redis function not found"
fi

if grep -q "^test_postgres_restore()" "$SCRIPT_DIR/restore_db_test.sh"; then
    test_pass "test_postgres_restore function defined"
else
    test_fail "test_postgres_restore function not found"
fi

if grep -q "^test_redis_restore()" "$SCRIPT_DIR/restore_db_test.sh"; then
    test_pass "test_redis_restore function defined"
else
    test_fail "test_redis_restore function not found"
fi

# Test 5: Check error handling (set -e)
echo ""
echo "Test 5: Error handling"

if grep -q "set -euo pipefail" "$SCRIPT_DIR/backup_db.sh"; then
    test_pass "backup_db.sh has proper error handling"
else
    test_fail "backup_db.sh missing error handling"
fi

if grep -q "set -euo pipefail" "$SCRIPT_DIR/restore_db_test.sh"; then
    test_pass "restore_db_test.sh has proper error handling"
else
    test_fail "restore_db_test.sh missing error handling"
fi

# Test 6: Check logging functions
echo ""
echo "Test 6: Logging functions"

if grep -q "^log_info()" "$SCRIPT_DIR/backup_db.sh"; then
    test_pass "backup_db.sh has logging functions"
else
    test_fail "backup_db.sh missing logging functions"
fi

if grep -q "^log_error()" "$SCRIPT_DIR/backup_db.sh"; then
    test_pass "backup_db.sh has error logging"
else
    test_fail "backup_db.sh missing error logging"
fi

# Test 7: Check notification support
echo ""
echo "Test 7: Notification support"

if grep -q "send_notification" "$SCRIPT_DIR/backup_db.sh"; then
    test_pass "backup_db.sh has notification support"
else
    test_fail "backup_db.sh missing notification support"
fi

# Test 8: Check configuration variables
echo ""
echo "Test 8: Configuration variables"

required_vars=("BACKUP_DIR" "DB_HOST" "DB_PORT" "DB_NAME" "REDIS_HOST" "RETENTION_DAYS")
for var in "${required_vars[@]}"; do
    if grep -q "$var" "$SCRIPT_DIR/backup_db.sh"; then
        test_pass "backup_db.sh uses $var"
    else
        test_fail "backup_db.sh missing $var"
    fi
done

# Test 9: Check documentation exists
echo ""
echo "Test 9: Documentation"

if [ -f "$SCRIPT_DIR/../../docs/ops/BACKUP_RESTORE.md" ]; then
    test_pass "BACKUP_RESTORE.md documentation exists"
else
    test_fail "BACKUP_RESTORE.md documentation not found"
fi

# Test 10: Check for security best practices
echo ""
echo "Test 10: Security checks"

if grep -q "chmod 700" "$SCRIPT_DIR/backup_db.sh"; then
    test_pass "backup_db.sh sets secure permissions"
else
    test_fail "backup_db.sh missing secure permissions"
fi

if grep -q "unset PGPASSWORD" "$SCRIPT_DIR/backup_db.sh"; then
    test_pass "backup_db.sh cleans up passwords"
else
    test_fail "backup_db.sh doesn't clean up passwords"
fi

# Summary
echo ""
echo "=== Test Summary ==="
echo -e "${GREEN}Passed: $TEST_PASSED${NC}"
echo -e "${RED}Failed: $TEST_FAILED${NC}"
echo ""

if [ $TEST_FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed!${NC}"
    exit 1
fi
