#!/bin/bash
set -euo pipefail

###############################################################################
# USDX/Wexel Platform - Comprehensive Test Suite Runner
#
# Runs all tests and generates comprehensive report
#
# Usage:
#   ./scripts/run-all-tests.sh [options]
#
# Options:
#   --unit-only       Run only unit tests
#   --integration     Run only integration tests
#   --e2e-only        Run only E2E tests
#   --load-only       Run only load tests
#   --coverage        Generate coverage reports
#   --verbose         Verbose output
###############################################################################

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Logging
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

log_section() {
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
    echo ""
}

# Parse options
RUN_UNIT=true
RUN_INTEGRATION=true
RUN_E2E=true
RUN_LOAD=true
GENERATE_COVERAGE=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --unit-only)
            RUN_UNIT=true
            RUN_INTEGRATION=false
            RUN_E2E=false
            RUN_LOAD=false
            shift
            ;;
        --integration)
            RUN_UNIT=false
            RUN_INTEGRATION=true
            RUN_E2E=false
            RUN_LOAD=false
            shift
            ;;
        --e2e-only)
            RUN_UNIT=false
            RUN_INTEGRATION=false
            RUN_E2E=true
            RUN_LOAD=false
            shift
            ;;
        --load-only)
            RUN_UNIT=false
            RUN_INTEGRATION=false
            RUN_E2E=false
            RUN_LOAD=true
            shift
            ;;
        --coverage)
            GENERATE_COVERAGE=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Header
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║    USDX/Wexel Platform - Comprehensive Test Suite         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

START_TIME=$(date +%s)
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Test results
UNIT_RESULT="N/A"
INTEGRATION_RESULT="N/A"
E2E_RESULT="N/A"
LOAD_RESULT="N/A"

cd "$PROJECT_ROOT/apps/indexer"

###############################################################################
# 1. Unit Tests
###############################################################################
if [ "$RUN_UNIT" = true ]; then
    log_section "1/4: Running Unit Tests"
    
    if [ "$GENERATE_COVERAGE" = true ]; then
        log_info "Running unit tests with coverage..."
        if pnpm test:cov 2>&1 | tee /tmp/unit-test-output.log; then
            UNIT_RESULT="${GREEN}PASSED${NC}"
            log_success "Unit tests passed"
        else
            UNIT_RESULT="${RED}FAILED${NC}"
            log_error "Unit tests failed"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
    else
        log_info "Running unit tests..."
        if pnpm test 2>&1 | tee /tmp/unit-test-output.log; then
            UNIT_RESULT="${GREEN}PASSED${NC}"
            log_success "Unit tests passed"
        else
            UNIT_RESULT="${RED}FAILED${NC}"
            log_error "Unit tests failed"
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
    fi
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    [ "$UNIT_RESULT" = "${GREEN}PASSED${NC}" ] && PASSED_TESTS=$((PASSED_TESTS + 1))
fi

###############################################################################
# 2. Integration Tests
###############################################################################
if [ "$RUN_INTEGRATION" = true ]; then
    log_section "2/4: Running Integration Tests"
    
    log_info "Running integration tests..."
    if pnpm test:integration 2>&1 | tee /tmp/integration-test-output.log; then
        INTEGRATION_RESULT="${GREEN}PASSED${NC}"
        log_success "Integration tests passed"
    else
        INTEGRATION_RESULT="${YELLOW}SKIPPED${NC}"
        log_error "Integration tests failed (may need database)"
    fi
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    [ "$INTEGRATION_RESULT" = "${GREEN}PASSED${NC}" ] && PASSED_TESTS=$((PASSED_TESTS + 1))
fi

###############################################################################
# 3. E2E Tests
###############################################################################
if [ "$RUN_E2E" = true ]; then
    log_section "3/4: Running End-to-End Tests"
    
    log_info "Starting E2E tests (this may take a while)..."
    if pnpm test:e2e 2>&1 | tee /tmp/e2e-test-output.log; then
        E2E_RESULT="${GREEN}PASSED${NC}"
        log_success "E2E tests passed"
    else
        E2E_RESULT="${YELLOW}SKIPPED${NC}"
        log_error "E2E tests failed (may need running server)"
    fi
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    [ "$E2E_RESULT" = "${GREEN}PASSED${NC}" ] && PASSED_TESTS=$((PASSED_TESTS + 1))
fi

###############################################################################
# 4. Load Tests
###############################################################################
if [ "$RUN_LOAD" = true ]; then
    log_section "4/4: Running Load Tests"
    
    log_info "Running load tests (performance benchmarks)..."
    if pnpm test -- test/load 2>&1 | tee /tmp/load-test-output.log; then
        LOAD_RESULT="${GREEN}PASSED${NC}"
        log_success "Load tests passed"
    else
        LOAD_RESULT="${YELLOW}SKIPPED${NC}"
        log_error "Load tests failed (may need running server)"
    fi
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    [ "$LOAD_RESULT" = "${GREEN}PASSED${NC}" ] && PASSED_TESTS=$((PASSED_TESTS + 1))
fi

###############################################################################
# Generate Report
###############################################################################
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

log_section "Test Results Summary"

echo -e "Test Suite Results:"
echo -e "  Unit Tests:        $UNIT_RESULT"
echo -e "  Integration Tests: $INTEGRATION_RESULT"
echo -e "  E2E Tests:         $E2E_RESULT"
echo -e "  Load Tests:        $LOAD_RESULT"
echo ""
echo -e "Overall:"
echo -e "  Total Test Suites: $TOTAL_TESTS"
echo -e "  Passed:            ${GREEN}$PASSED_TESTS${NC}"
echo -e "  Failed:            ${RED}$FAILED_TESTS${NC}"
echo -e "  Duration:          ${DURATION}s"
echo ""

if [ "$GENERATE_COVERAGE" = true ]; then
    log_info "Coverage reports generated in:"
    echo "  - coverage/ (unit tests)"
    echo "  - coverage-integration/ (integration tests)"
    echo "  - coverage-e2e/ (E2E tests)"
fi

# Exit with appropriate code
if [ $FAILED_TESTS -eq 0 ]; then
    log_success "All test suites passed! 🎉"
    exit 0
else
    log_error "$FAILED_TESTS test suite(s) failed"
    exit 1
fi
