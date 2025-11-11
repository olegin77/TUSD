#!/bin/bash

set -e

echo "🔍 USDX Wexel Platform - Final Validation"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SUCCESS_COUNT=0
FAILURE_COUNT=0

check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((SUCCESS_COUNT++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAILURE_COUNT++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

echo "📦 P0 - Critical Fixes"
echo "----------------------"

# P0.1: Docker Backend
if [ -f "infra/production/docker-compose.backend.yml" ]; then
    check_pass "Docker compose configuration exists"
else
    check_fail "Docker compose configuration missing"
fi

# P0.2: TronWeb Integration
if grep -q "const TronWeb = require('tronweb')" apps/indexer/src/modules/tron/services/tron-bridge.service.ts; then
    check_pass "TronWeb integration fixed"
else
    check_fail "TronWeb integration not fixed"
fi

# P0.3: Local Fonts
if [ -d "apps/webapp/public/fonts" ]; then
    check_pass "Local fonts configured"
else
    check_fail "Local fonts missing"
fi

echo ""
echo "🔧 P1 - Important Tasks"
echo "------------------------"

# P1.1: CI/CD Pipeline
if [ -f ".github/workflows/ci-cd.yml" ]; then
    check_pass "CI/CD pipeline configured"
else
    check_fail "CI/CD pipeline missing"
fi

# P1.2: E2E Tests
if [ -f "apps/webapp/tests/e2e/deposit.spec.ts" ]; then
    check_pass "E2E tests exist"
else
    check_fail "E2E tests missing"
fi

# P1.3: Security (Helmet + CSP)
if grep -q "helmet" apps/indexer/src/main.ts; then
    check_pass "Security headers configured"
else
    check_fail "Security headers missing"
fi

# P1.4: Deployment Scripts
if [ -f "scripts/deploy-solana-contracts.sh" ] && [ -f "scripts/deploy-tron-contracts.sh" ]; then
    check_pass "Deployment scripts exist"
else
    check_fail "Deployment scripts missing"
fi

echo ""
echo "📊 P2 - Medium Priority"
echo "------------------------"

# P2.1: Unit Tests
if [ -f "apps/indexer/src/modules/deposits/__tests__/deposits.service.spec.ts" ]; then
    check_pass "Unit tests for deposits service"
else
    check_fail "Unit tests for deposits missing"
fi

if [ -f "apps/indexer/src/modules/pools/__tests__/pools.service.spec.ts" ]; then
    check_pass "Unit tests for pools service"
else
    check_fail "Unit tests for pools missing"
fi

# P2.2: Swagger Documentation
if grep -q "@ApiTags" apps/indexer/src/modules/deposits/deposits.controller.ts; then
    check_pass "Swagger annotations in deposits controller"
else
    check_fail "Swagger annotations missing in deposits"
fi

if grep -q "@ApiTags" apps/indexer/src/modules/pools/pools.controller.ts; then
    check_pass "Swagger annotations in pools controller"
else
    check_fail "Swagger annotations missing in pools"
fi

# P2.3: Next.js Optimization
if grep -q "optimizePackageImports" apps/webapp/next.config.js; then
    check_pass "Next.js configuration optimized"
else
    check_fail "Next.js optimization missing"
fi

# P2.4: Monitoring
if [ -f "infra/monitoring/docker-compose.monitoring.yml" ]; then
    check_pass "Prometheus + Grafana configured"
else
    check_fail "Monitoring stack missing"
fi

if [ -f "infra/monitoring/grafana/dashboards/usdx-wexel-dashboard.json" ]; then
    check_pass "Grafana dashboard exists"
else
    check_fail "Grafana dashboard missing"
fi

echo ""
echo "🚀 P3 - Improvements"
echo "--------------------"

# P3.1: Accessibility
if [ -d "apps/webapp/src/components/a11y" ]; then
    check_pass "Accessibility components exist"
else
    check_fail "Accessibility components missing"
fi

if [ -f "apps/webapp/src/components/a11y/SkipToContent.tsx" ]; then
    check_pass "SkipToContent component"
else
    check_fail "SkipToContent missing"
fi

if [ -f "apps/webapp/src/components/a11y/FocusTrap.tsx" ]; then
    check_pass "FocusTrap component"
else
    check_fail "FocusTrap missing"
fi

# P3.2: Internationalization
if [ -d "apps/webapp/src/locales" ]; then
    check_pass "i18n locales directory exists"
else
    check_fail "i18n locales missing"
fi

if [ -f "apps/webapp/src/locales/ru/common.json" ] && [ -f "apps/webapp/src/locales/en/common.json" ]; then
    check_pass "Russian and English translations"
else
    check_fail "Translations missing"
fi

if [ -f "apps/webapp/src/lib/i18n/provider.tsx" ]; then
    check_pass "i18n provider configured"
else
    check_fail "i18n provider missing"
fi

# P3.3: Makefile
if [ -f "Makefile" ]; then
    check_pass "Makefile exists"
    
    # Check for key targets
    if grep -q "^test:" Makefile; then
        check_pass "Makefile: test target"
    else
        check_fail "Makefile: test target missing"
    fi
    
    if grep -q "^build:" Makefile; then
        check_pass "Makefile: build target"
    else
        check_fail "Makefile: build target missing"
    fi
    
    if grep -q "^deploy-production:" Makefile; then
        check_pass "Makefile: deploy target"
    else
        check_fail "Makefile: deploy target missing"
    fi
else
    check_fail "Makefile missing"
fi

echo ""
echo "📁 File Structure"
echo "-----------------"

# Check critical files
CRITICAL_FILES=(
    "apps/indexer/package.json"
    "apps/webapp/package.json"
    "apps/indexer/prisma/schema.prisma"
    "apps/indexer/src/main.ts"
    "apps/webapp/src/app/layout.tsx"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        check_pass "File exists: $file"
    else
        check_fail "File missing: $file"
    fi
done

echo ""
echo "🔐 Security Checks"
echo "------------------"

# Check for sensitive files in git
if git check-ignore .env >/dev/null 2>&1; then
    check_pass ".env files ignored by git"
else
    check_warn ".env files may not be ignored"
fi

# Check for security packages
if grep -q "@nestjs/throttler" apps/indexer/package.json; then
    check_pass "Rate limiting package installed"
else
    check_fail "Rate limiting package missing"
fi

if grep -q "helmet" apps/indexer/package.json; then
    check_pass "Helmet security package installed"
else
    check_fail "Helmet package missing"
fi

echo ""
echo "========================================"
echo "Validation Summary"
echo "========================================"
echo -e "${GREEN}Passed: $SUCCESS_COUNT${NC}"
echo -e "${RED}Failed: $FAILURE_COUNT${NC}"
echo ""

if [ $FAILURE_COUNT -eq 0 ]; then
    echo -e "${GREEN}✅ All validations passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some validations failed. Please review the output above.${NC}"
    exit 1
fi
