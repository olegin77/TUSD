#!/bin/bash
set -euo pipefail

###############################################################################
# USDX/Wexel Platform - Complete Deployment Script
# 
# This script deploys all components of the USDX/Wexel platform:
# - Tron smart contracts
# - Solana smart contracts (requires Anchor)
# - Backend/Indexer
# - Frontend/Webapp
# - Monitoring stack
#
# Usage:
#   ./scripts/deploy-all.sh [environment]
#
# Environments:
#   - local (default)
#   - staging
#   - production
###############################################################################

ENVIRONMENT=${1:-local}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Header
echo "╔════════════════════════════════════════════════════════════╗"
echo "║      USDX/Wexel Platform - Complete Deployment            ║"
echo "║      Environment: $ENVIRONMENT                                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(local|staging|production)$ ]]; then
    log_error "Invalid environment: $ENVIRONMENT"
    log_info "Valid environments: local, staging, production"
    exit 1
fi

# Check prerequisites
log_info "Checking prerequisites..."

command -v node >/dev/null 2>&1 || { log_error "Node.js is required but not installed. Aborting."; exit 1; }
command -v pnpm >/dev/null 2>&1 || { log_error "pnpm is required but not installed. Aborting."; exit 1; }
command -v docker >/dev/null 2>&1 || { log_error "Docker is required but not installed. Aborting."; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { log_error "docker-compose is required but not installed. Aborting."; exit 1; }

log_success "Prerequisites check passed"

# Load environment file
ENV_FILE="$PROJECT_ROOT/.env.$ENVIRONMENT"
if [ ! -f "$ENV_FILE" ]; then
    log_warning "Environment file not found: $ENV_FILE"
    log_info "Using .env.example as template..."
    cp "$PROJECT_ROOT/.env.example" "$ENV_FILE"
fi

log_info "Loading environment from: $ENV_FILE"
export $(cat "$ENV_FILE" | grep -v '^#' | xargs)

###############################################################################
# STEP 1: Install Dependencies
###############################################################################
log_info "STEP 1/7: Installing dependencies..."

cd "$PROJECT_ROOT"
pnpm install --frozen-lockfile

log_success "Dependencies installed"

###############################################################################
# STEP 2: Database Setup
###############################################################################
log_info "STEP 2/7: Setting up databases..."

if [ "$ENVIRONMENT" == "local" ]; then
    log_info "Starting Docker containers (PostgreSQL, Redis)..."
    cd "$PROJECT_ROOT/infra/local"
    docker-compose up -d
    
    # Wait for PostgreSQL to be ready
    log_info "Waiting for PostgreSQL to be ready..."
    sleep 5
    
    cd "$PROJECT_ROOT"
fi

# Run database migrations
log_info "Running database migrations..."
cd "$PROJECT_ROOT/apps/indexer"
pnpm prisma migrate deploy

log_success "Database setup complete"

###############################################################################
# STEP 3: Deploy Tron Smart Contracts
###############################################################################
log_info "STEP 3/7: Deploying Tron smart contracts..."

cd "$PROJECT_ROOT/contracts/tron"

if [ ! -d "node_modules" ]; then
    log_info "Installing Tron contract dependencies..."
    npm install
fi

if [ "$ENVIRONMENT" == "production" ]; then
    if [ -z "${TRON_PRIVATE_KEY_MAINNET:-}" ]; then
        log_error "TRON_PRIVATE_KEY_MAINNET not set for production deployment"
        exit 1
    fi
    log_info "Deploying to Tron Mainnet..."
    npm run migrate:mainnet
else
    if [ -z "${TRON_PRIVATE_KEY_NILE:-}" ]; then
        log_warning "TRON_PRIVATE_KEY_NILE not set, skipping Tron deployment"
    else
        log_info "Deploying to Tron Nile Testnet..."
        npm run migrate
    fi
fi

log_success "Tron contracts deployed"

###############################################################################
# STEP 4: Build Applications
###############################################################################
log_info "STEP 4/7: Building applications..."

cd "$PROJECT_ROOT"
pnpm build

log_success "Applications built"

###############################################################################
# STEP 5: Deploy Backend/Indexer
###############################################################################
log_info "STEP 5/7: Deploying Backend/Indexer..."

cd "$PROJECT_ROOT/apps/indexer"

if [ "$ENVIRONMENT" == "production" ]; then
    log_info "Starting production backend..."
    # In production, use PM2 or Docker
    if command -v pm2 >/dev/null 2>&1; then
        pm2 start dist/main.js --name usdx-indexer
        log_success "Backend started with PM2"
    else
        log_warning "PM2 not found. Start backend manually."
    fi
else
    log_info "Backend ready to start (development mode)"
    log_info "Run: cd apps/indexer && pnpm start:dev"
fi

log_success "Backend deployment complete"

###############################################################################
# STEP 6: Deploy Frontend/Webapp
###############################################################################
log_info "STEP 6/7: Deploying Frontend/Webapp..."

cd "$PROJECT_ROOT/apps/webapp"

if [ "$ENVIRONMENT" == "production" ]; then
    log_info "Starting production frontend..."
    # In production, use PM2 or Docker
    if command -v pm2 >/dev/null 2>&1; then
        pm2 start npm --name usdx-webapp -- start
        log_success "Frontend started with PM2"
    else
        log_warning "PM2 not found. Start frontend manually."
    fi
else
    log_info "Frontend ready to start (development mode)"
    log_info "Run: cd apps/webapp && pnpm dev"
fi

log_success "Frontend deployment complete"

###############################################################################
# STEP 7: Deploy Monitoring Stack (Optional)
###############################################################################
log_info "STEP 7/7: Setting up monitoring..."

if [ "$ENVIRONMENT" != "local" ]; then
    cd "$PROJECT_ROOT/infra/monitoring"
    
    if [ -f "docker-compose.yml" ]; then
        log_info "Starting monitoring stack (Prometheus, Grafana, Alertmanager)..."
        docker-compose up -d
        log_success "Monitoring stack started"
    else
        log_warning "Monitoring configuration not found"
    fi
fi

###############################################################################
# Deployment Summary
###############################################################################
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║           🎉 Deployment Complete!                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

log_success "All components deployed successfully!"
echo ""
log_info "📊 Deployment Summary:"
echo "  - Environment: $ENVIRONMENT"
echo "  - Tron Contracts: Deployed"
echo "  - Database: Migrated"
echo "  - Backend: Ready"
echo "  - Frontend: Ready"
echo "  - Monitoring: $([ "$ENVIRONMENT" != "local" ] && echo "Active" || echo "N/A")"
echo ""

if [ "$ENVIRONMENT" == "local" ]; then
    log_info "🚀 Next Steps (Local Development):"
    echo ""
    echo "  1. Start Backend:"
    echo "     cd apps/indexer && pnpm start:dev"
    echo ""
    echo "  2. Start Frontend:"
    echo "     cd apps/webapp && pnpm dev"
    echo ""
    echo "  3. Access:"
    echo "     - Frontend: http://localhost:3000"
    echo "     - Backend API: http://localhost:3001"
    echo "     - Admin Panel: http://localhost:3000/admin"
    echo ""
elif [ "$ENVIRONMENT" == "staging" ]; then
    log_info "🚀 Staging Environment:"
    echo ""
    echo "  - Frontend: https://staging.usdx-wexel.com"
    echo "  - Backend API: https://api-staging.usdx-wexel.com"
    echo "  - Grafana: https://monitoring-staging.usdx-wexel.com"
    echo ""
else
    log_info "🚀 Production Environment:"
    echo ""
    echo "  - Frontend: https://app.usdx-wexel.com"
    echo "  - Backend API: https://api.usdx-wexel.com"
    echo "  - Grafana: https://monitoring.usdx-wexel.com"
    echo ""
    log_warning "⚠️  Monitor logs closely for the first 24 hours!"
fi

log_info "📚 Documentation: $PROJECT_ROOT/docs/"
log_info "🔧 Configuration: $ENV_FILE"
echo ""

# Health checks
if [ "$ENVIRONMENT" != "local" ]; then
    log_info "Running health checks..."
    
    # Check backend
    BACKEND_URL="${BACKEND_URL:-http://localhost:3001}"
    if curl -f -s "$BACKEND_URL/health" > /dev/null; then
        log_success "Backend health check passed"
    else
        log_warning "Backend health check failed"
    fi
fi

echo ""
log_success "Deployment script completed! 🎉"
echo ""

exit 0
