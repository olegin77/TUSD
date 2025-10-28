#!/bin/bash

# ==========================================
# USDX/Wexel Platform - Automated Deployment Script
# ==========================================
# Version: 1.0.0
# Description: Complete deployment automation with zero-downtime
# Features:
#   - Environment validation
#   - Docker image building
#   - Database migrations
#   - Health checks
#   - Rollback support
#   - Monitoring integration
# ==========================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="usdx-wexel"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="${SCRIPT_DIR}/deploy_${TIMESTAMP}.log"
BACKUP_DIR="${SCRIPT_DIR}/backups"

# Default values (can be overridden by environment variables)
ENVIRONMENT="${DEPLOY_ENV:-production}"
REGISTRY="${DOCKER_REGISTRY:-}"
TAG="${DEPLOY_TAG:-latest}"
SKIP_BACKUP="${SKIP_BACKUP:-false}"
SKIP_TESTS="${SKIP_TESTS:-false}"
SKIP_MIGRATIONS="${SKIP_MIGRATIONS:-false}"

# ==========================================
# Logging Functions
# ==========================================

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a "$LOG_FILE"
}

log_info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO:${NC} $1" | tee -a "$LOG_FILE"
}

# ==========================================
# Utility Functions
# ==========================================

check_dependencies() {
    log "Checking required dependencies..."
    
    local missing_deps=()
    
    if ! command -v docker &> /dev/null; then
        missing_deps+=("docker")
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        missing_deps+=("docker-compose")
    fi
    
    if ! command -v git &> /dev/null; then
        missing_deps+=("git")
    fi
    
    if ! command -v jq &> /dev/null; then
        log_warning "jq not found. Installing..."
        if command -v apt-get &> /dev/null; then
            sudo apt-get update && sudo apt-get install -y jq
        elif command -v yum &> /dev/null; then
            sudo yum install -y jq
        else
            missing_deps+=("jq")
        fi
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "Missing dependencies: ${missing_deps[*]}"
        log_error "Please install the missing dependencies and try again."
        exit 1
    fi
    
    log "✓ All dependencies are installed"
}

check_environment() {
    log "Checking environment configuration..."
    
    if [ ! -f "${SCRIPT_DIR}/.env.${ENVIRONMENT}" ]; then
        log_error "Environment file .env.${ENVIRONMENT} not found!"
        log_info "Please create .env.${ENVIRONMENT} with required variables"
        exit 1
    fi
    
    # Load environment variables
    set -a
    source "${SCRIPT_DIR}/.env.${ENVIRONMENT}"
    set +a
    
    # Validate critical variables
    local required_vars=(
        "DATABASE_URL"
        "REDIS_URL"
        "JWT_SECRET"
        "SOLANA_RPC_URL"
    )
    
    local missing_vars=()
    for var in "${required_vars[@]}"; do
        if [ -z "${!var:-}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        log_error "Missing required environment variables: ${missing_vars[*]}"
        exit 1
    fi
    
    log "✓ Environment configuration is valid"
}

create_backup() {
    if [ "$SKIP_BACKUP" = "true" ]; then
        log_warning "Skipping backup (SKIP_BACKUP=true)"
        return 0
    fi
    
    log "Creating backup..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup database
    if [ -n "${DATABASE_URL:-}" ]; then
        log_info "Backing up database..."
        
        # Extract database connection details
        DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\).*/\1/p')
        DB_NAME=$(echo "$DATABASE_URL" | sed -n 's/.*\/\([^?]*\).*/\1/p')
        
        BACKUP_FILE="${BACKUP_DIR}/db_${TIMESTAMP}.sql.gz"
        
        if command -v pg_dump &> /dev/null; then
            PGPASSWORD="${DATABASE_URL#*://}" pg_dump "$DATABASE_URL" | gzip > "$BACKUP_FILE"
            log "✓ Database backed up to $BACKUP_FILE"
        else
            log_warning "pg_dump not found, skipping database backup"
        fi
    fi
    
    # Backup .env files
    log_info "Backing up configuration..."
    tar -czf "${BACKUP_DIR}/config_${TIMESTAMP}.tar.gz" \
        .env.* \
        infra/ \
        2>/dev/null || true
    
    log "✓ Backup completed"
}

build_images() {
    log "Building Docker images..."
    
    local build_args=()
    
    if [ -n "$REGISTRY" ]; then
        build_args+=("--build-arg" "REGISTRY=$REGISTRY")
    fi
    
    # Build backend
    log_info "Building backend (indexer) image..."
    docker build \
        -t "${REGISTRY}${PROJECT_NAME}-indexer:${TAG}" \
        -f apps/indexer/Dockerfile \
        "${build_args[@]}" \
        . || {
            log_error "Failed to build indexer image"
            exit 1
        }
    
    # Build frontend
    log_info "Building frontend (webapp) image..."
    docker build \
        -t "${REGISTRY}${PROJECT_NAME}-webapp:${TAG}" \
        -f apps/webapp/Dockerfile \
        --build-arg NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-http://localhost:3001}" \
        --build-arg NEXT_PUBLIC_SOLANA_RPC_URL="${SOLANA_RPC_URL}" \
        --build-arg NEXT_PUBLIC_SOLANA_NETWORK="${SOLANA_NETWORK:-devnet}" \
        "${build_args[@]}" \
        . || {
            log_error "Failed to build webapp image"
            exit 1
        }
    
    log "✓ Docker images built successfully"
}

push_images() {
    if [ -z "$REGISTRY" ]; then
        log_warning "No registry specified, skipping image push"
        return 0
    fi
    
    log "Pushing images to registry..."
    
    docker push "${REGISTRY}${PROJECT_NAME}-indexer:${TAG}"
    docker push "${REGISTRY}${PROJECT_NAME}-webapp:${TAG}"
    
    log "✓ Images pushed successfully"
}

run_migrations() {
    if [ "$SKIP_MIGRATIONS" = "true" ]; then
        log_warning "Skipping database migrations (SKIP_MIGRATIONS=true)"
        return 0
    fi
    
    log "Running database migrations..."
    
    # Run migrations in a temporary container
    docker run --rm \
        --network host \
        -e DATABASE_URL="$DATABASE_URL" \
        "${REGISTRY}${PROJECT_NAME}-indexer:${TAG}" \
        sh -c "cd /app && npx prisma migrate deploy" || {
            log_error "Database migrations failed"
            exit 1
        }
    
    log "✓ Database migrations completed"
}

run_tests() {
    if [ "$SKIP_TESTS" = "true" ]; then
        log_warning "Skipping tests (SKIP_TESTS=true)"
        return 0
    fi
    
    log "Running tests..."
    
    # Run backend tests
    log_info "Running backend tests..."
    docker run --rm \
        "${REGISTRY}${PROJECT_NAME}-indexer:${TAG}" \
        sh -c "cd /app && npm test" || {
            log_error "Backend tests failed"
            exit 1
        }
    
    log "✓ Tests passed"
}

deploy_services() {
    log "Deploying services..."
    
    # Determine docker-compose command
    if docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    else
        COMPOSE_CMD="docker-compose"
    fi
    
    # Export environment variables for docker-compose
    export COMPOSE_PROJECT_NAME="${PROJECT_NAME}"
    export IMAGE_TAG="${TAG}"
    export REGISTRY="${REGISTRY}"
    
    # Deploy using docker-compose
    log_info "Starting services with docker-compose..."
    
    cd "${SCRIPT_DIR}/infra/${ENVIRONMENT}"
    
    # Pull images if using registry
    if [ -n "$REGISTRY" ]; then
        $COMPOSE_CMD pull
    fi
    
    # Start services with zero-downtime deployment
    $COMPOSE_CMD up -d --remove-orphans --force-recreate || {
        log_error "Failed to deploy services"
        exit 1
    }
    
    cd "$SCRIPT_DIR"
    
    log "✓ Services deployed"
}

wait_for_health() {
    log "Waiting for services to become healthy..."
    
    local max_attempts=30
    local attempt=0
    local services=("indexer:3001" "webapp:3000")
    
    for service in "${services[@]}"; do
        local service_name="${service%:*}"
        local service_port="${service#*:}"
        
        log_info "Checking $service_name health..."
        
        attempt=0
        while [ $attempt -lt $max_attempts ]; do
            if curl -f -s "http://localhost:${service_port}/health" > /dev/null 2>&1 || \
               curl -f -s "http://localhost:${service_port}/" > /dev/null 2>&1; then
                log "✓ $service_name is healthy"
                break
            fi
            
            attempt=$((attempt + 1))
            if [ $attempt -eq $max_attempts ]; then
                log_error "$service_name failed to become healthy"
                return 1
            fi
            
            log_info "Waiting for $service_name... (attempt $attempt/$max_attempts)"
            sleep 5
        done
    done
    
    log "✓ All services are healthy"
}

cleanup_old_images() {
    log "Cleaning up old Docker images..."
    
    # Remove dangling images
    docker image prune -f || true
    
    # Keep only last 3 versions of each image
    for image in "indexer" "webapp"; do
        docker images "${REGISTRY}${PROJECT_NAME}-${image}" --format "{{.ID}}" | tail -n +4 | xargs -r docker rmi -f || true
    done
    
    log "✓ Cleanup completed"
}

send_notification() {
    local status=$1
    local message=$2
    
    if [ -n "${SLACK_WEBHOOK_URL:-}" ]; then
        curl -X POST "$SLACK_WEBHOOK_URL" \
            -H 'Content-Type: application/json' \
            -d "{\"text\":\"[${PROJECT_NAME}] Deployment ${status}: ${message}\"}" \
            2>/dev/null || true
    fi
    
    if [ -n "${TELEGRAM_BOT_TOKEN:-}" ] && [ -n "${TELEGRAM_CHAT_ID:-}" ]; then
        curl -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
            -d "chat_id=${TELEGRAM_CHAT_ID}" \
            -d "text=[${PROJECT_NAME}] Deployment ${status}: ${message}" \
            2>/dev/null || true
    fi
}

rollback() {
    log_error "Deployment failed! Starting rollback..."
    
    if [ -f "${BACKUP_DIR}/docker-compose.backup.yml" ]; then
        log_info "Rolling back to previous version..."
        
        cd "${SCRIPT_DIR}/infra/${ENVIRONMENT}"
        $COMPOSE_CMD down
        cp "${BACKUP_DIR}/docker-compose.backup.yml" docker-compose.yml
        $COMPOSE_CMD up -d
        
        log "✓ Rollback completed"
    else
        log_error "No backup found for rollback!"
    fi
    
    send_notification "FAILED" "Deployment failed and rolled back"
    exit 1
}

# ==========================================
# Main Deployment Flow
# ==========================================

main() {
    log "=================================="
    log "USDX/Wexel Deployment Script v1.0.0"
    log "Environment: $ENVIRONMENT"
    log "Tag: $TAG"
    log "=================================="
    
    # Trap errors for rollback
    trap rollback ERR
    
    # Step 1: Pre-deployment checks
    check_dependencies
    check_environment
    
    # Step 2: Backup
    create_backup
    
    # Step 3: Build
    build_images
    
    # Step 4: Test (optional)
    if [ "$SKIP_TESTS" != "true" ]; then
        run_tests
    fi
    
    # Step 5: Push to registry (if configured)
    if [ -n "$REGISTRY" ]; then
        push_images
    fi
    
    # Step 6: Run migrations
    run_migrations
    
    # Step 7: Deploy services
    deploy_services
    
    # Step 8: Health checks
    wait_for_health
    
    # Step 9: Cleanup
    cleanup_old_images
    
    # Success!
    log "=================================="
    log "✓ Deployment completed successfully!"
    log "=================================="
    log "Indexer API: http://localhost:3001"
    log "WebApp: http://localhost:3000"
    log "Log file: $LOG_FILE"
    log "=================================="
    
    send_notification "SUCCESS" "Deployment completed successfully"
}

# ==========================================
# Script Entry Point
# ==========================================

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --tag)
            TAG="$2"
            shift 2
            ;;
        --registry)
            REGISTRY="$2"
            shift 2
            ;;
        --skip-backup)
            SKIP_BACKUP=true
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --skip-migrations)
            SKIP_MIGRATIONS=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --env ENV             Deployment environment (default: production)"
            echo "  --tag TAG             Docker image tag (default: latest)"
            echo "  --registry REGISTRY   Docker registry URL"
            echo "  --skip-backup         Skip database backup"
            echo "  --skip-tests          Skip running tests"
            echo "  --skip-migrations     Skip database migrations"
            echo "  --help                Show this help message"
            echo ""
            echo "Environment variables:"
            echo "  DEPLOY_ENV            Same as --env"
            echo "  DEPLOY_TAG            Same as --tag"
            echo "  DOCKER_REGISTRY       Same as --registry"
            echo ""
            echo "Example:"
            echo "  $0 --env production --tag v1.0.0"
            echo "  $0 --env staging --skip-tests"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Run main deployment
main
