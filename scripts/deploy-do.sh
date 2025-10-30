#!/bin/bash

# ==========================================
# USDX/Wexel - DigitalOcean Automated Deployment
# ==========================================
# Этот скрипт автоматически создает дроплет на DigitalOcean,
# настраивает сервер и разворачивает проект
# ==========================================

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_NAME="usdx-wexel"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="${SCRIPT_DIR}/do_deploy_${TIMESTAMP}.log"

# DigitalOcean API Configuration
# Предустановленные значения - можно переопределить через переменные окружения
# ВАЖНО: Не храните токены в коде! Используйте переменные окружения или секретные хранилища
DO_API_TOKEN="${DO_API_TOKEN:-}"
DO_DROPLET_SIZE="${DO_DROPLET_SIZE:-s-2vcpu-4gb}"  # 2 CPU, 4GB RAM
DO_DROPLET_REGION="${DO_DROPLET_REGION:-nyc3}"      # New York 3
DO_DROPLET_IMAGE="${DO_DROPLET_IMAGE:-ubuntu-22-04-x64}"
DO_SSH_KEY_ID="${DO_SSH_KEY_ID:-}"  # ID SSH ключа в DO (опционально)

# Application Configuration
# Предустановленные значения - можно переопределить через переменные окружения
GIT_REPO_URL="${GIT_REPO_URL:-https://github.com/olegin77/TUSD}"
GIT_BRANCH="${GIT_BRANCH:-main}"
DOMAIN_NAME="${DOMAIN_NAME:-}"  # Опционально: доменное имя
DEPLOY_ENV="${DEPLOY_ENV:-production}"

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
# SSH Key Management Functions
# ==========================================

generate_ssh_key() {
    local key_path="$HOME/.ssh/id_rsa_do_deploy_${PROJECT_NAME}"
    
    if [ -f "${key_path}.pub" ]; then
        log_info "SSH key already exists: ${key_path}.pub"
        echo "${key_path}.pub"
        return 0
    fi
    
    log_info "Generating SSH key for deployment..."
    
    mkdir -p "$HOME/.ssh"
    chmod 700 "$HOME/.ssh"
    
    ssh-keygen -t rsa -b 4096 -f "$key_path" -N "" -C "do-deploy-${PROJECT_NAME}-$(date +%s)" > /dev/null 2>&1
    
    if [ -f "${key_path}.pub" ]; then
        log "✓ SSH key generated: ${key_path}.pub"
        echo "${key_path}.pub"
        return 0
    else
        log_error "Failed to generate SSH key"
        return 1
    fi
}

add_ssh_key_to_do() {
    local public_key_file=$1
    local key_name="${PROJECT_NAME}-auto-$(date +%s)"
    
    if [ ! -f "$public_key_file" ]; then
        log_error "SSH public key file not found: $public_key_file"
        return 1
    fi
    
    local public_key_content=$(cat "$public_key_file" | tr -d '\n')
    
    log_info "Adding SSH key to DigitalOcean..."
    
    local jq_cmd="${JQ_PATH:-jq}"
    local response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $DO_API_TOKEN" \
        -d "{
            \"name\": \"$key_name\",
            \"public_key\": \"$public_key_content\"
        }" \
        "https://api.digitalocean.com/v2/account/keys")
    
    local key_id=$(echo "$response" | $jq_cmd -r '.ssh_key.id // empty')
    
    if [ -n "$key_id" ] && [ "$key_id" != "null" ]; then
        log "✓ SSH key added to DigitalOcean with ID: $key_id"
        echo "$key_id"
        return 0
    else
        # Возможно ключ уже существует, попробуем найти его
        log_info "Checking for existing SSH key..."
        local existing_keys=$(curl -s -X GET \
            -H "Authorization: Bearer $DO_API_TOKEN" \
            "https://api.digitalocean.com/v2/account/keys")
        
        local key_fingerprint=$(ssh-keygen -lf "$public_key_file" 2>/dev/null | awk '{print $2}')
        local existing_key_id=$(echo "$existing_keys" | $jq_cmd -r ".ssh_keys[] | select(.fingerprint == \"$key_fingerprint\") | .id" | head -n1)
        
        if [ -n "$existing_key_id" ] && [ "$existing_key_id" != "null" ]; then
            log_info "SSH key already exists in DigitalOcean with ID: $existing_key_id"
            echo "$existing_key_id"
            return 0
        else
            log_error "Failed to add SSH key to DigitalOcean"
            log_error "Response: $response"
            return 1
        fi
    fi
}

get_or_create_ssh_key() {
    if [ -n "$DO_SSH_KEY_ID" ]; then
        log_info "Using provided SSH key ID: $DO_SSH_KEY_ID"
        echo "$DO_SSH_KEY_ID"
        return 0
    fi
    
    log_info "No SSH key ID provided, checking for existing key..."
    local ssh_key_path
    ssh_key_path=$(generate_ssh_key)
    
    if [ -z "$ssh_key_path" ] || [ ! -f "$ssh_key_path" ]; then
        log_error "Failed to generate SSH key"
        echo ""
        return 1
    fi
    
    # Проверяем существующие ключи в DO по fingerprint
    local key_fingerprint
    key_fingerprint=$(ssh-keygen -lf "$ssh_key_path" 2>/dev/null | awk '{print $2}')
    
    if [ -n "$key_fingerprint" ]; then
        local jq_cmd="${JQ_PATH:-jq}"
        local existing_keys
        existing_keys=$(curl -s -X GET -H "Authorization: Bearer $DO_API_TOKEN" "https://api.digitalocean.com/v2/account/keys")
        local existing_key_id
        existing_key_id=$(echo "$existing_keys" | $jq_cmd -r ".ssh_keys[] | select(.fingerprint == \"$key_fingerprint\") | .id" | head -n1)
        
        if [ -n "$existing_key_id" ] && [ "$existing_key_id" != "null" ]; then
            log_info "SSH key already exists in DigitalOcean with ID: $existing_key_id"
            export SSH_KEY_PATH="${ssh_key_path%.pub}"
            echo "$existing_key_id"
            return 0
        fi
    fi
    
    # Если ключа нет, добавляем его
    log_info "Adding SSH key to DigitalOcean..."
    local key_id
    key_id=$(add_ssh_key_to_do "$ssh_key_path")
    
    if [ -n "$key_id" ] && [ "$key_id" != "null" ] && [ "$key_id" != "" ]; then
        export SSH_KEY_PATH="${ssh_key_path%.pub}"
        echo "$key_id"
        return 0
    fi
    
    log_warning "Could not add SSH key to DigitalOcean, creating droplet without SSH key"
    echo ""
    return 1
}

# ==========================================
# Validation Functions
# ==========================================

check_dependencies() {
    log "Checking local dependencies..."
    
    local missing_deps=()
    
    if ! command -v curl &> /dev/null; then
        missing_deps+=("curl")
    fi
    
    if ! command -v jq &> /dev/null; then
        log_info "jq not found. Attempting to install..."
        # Try to download jq binary directly
        if command -v wget &> /dev/null; then
            if wget -qO /tmp/jq https://github.com/jqlang/jq/releases/download/jq-1.7.1/jq-linux-amd64 2>/dev/null && \
               chmod +x /tmp/jq && \
               /tmp/jq --version > /dev/null 2>&1; then
                export PATH=/tmp:$PATH
                JQ_PATH=/tmp/jq
                export JQ_PATH
                log_info "jq downloaded to /tmp/jq"
            else
                missing_deps+=("jq")
            fi
        elif command -v curl &> /dev/null; then
            if curl -sL https://github.com/jqlang/jq/releases/download/jq-1.7.1/jq-linux-amd64 -o /tmp/jq && \
               chmod +x /tmp/jq && \
               /tmp/jq --version > /dev/null 2>&1; then
                export PATH=/tmp:$PATH
                JQ_PATH=/tmp/jq
                export JQ_PATH
                log_info "jq downloaded to /tmp/jq"
            else
                missing_deps+=("jq")
            fi
        else
            missing_deps+=("jq")
        fi
    else
        JQ_PATH=jq
        export JQ_PATH
    fi
    
    if ! command -v ssh &> /dev/null; then
        missing_deps+=("ssh")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        log_error "Missing dependencies: ${missing_deps[*]}"
        exit 1
    fi
    
    log "✓ All local dependencies are installed"
}

check_do_api() {
    log "Checking DigitalOcean API token..."
    
    if [ -z "$DO_API_TOKEN" ]; then
        log_error "DO_API_TOKEN environment variable is not set!"
        log_info "Please set it: export DO_API_TOKEN=your_token_here"
        exit 1
    fi
    
    # Test API token
    local jq_cmd="${JQ_PATH:-jq}"
    local response=$(curl -s -X GET \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $DO_API_TOKEN" \
        "https://api.digitalocean.com/v2/account")
    
    if echo "$response" | $jq_cmd -e '.account' > /dev/null 2>&1; then
        local email=$(echo "$response" | $jq_cmd -r '.account.email')
        log "✓ API token is valid (Account: $email)"
    else
        log_error "Invalid API token or API error"
        log_error "Response: $response"
        exit 1
    fi
}

# ==========================================
# DigitalOcean API Functions
# ==========================================

do_create_droplet() {
    log "Creating DigitalOcean droplet..."
    
    local droplet_name="${PROJECT_NAME}-${TIMESTAMP}"
    
    # Get or create SSH key
    local ssh_key_id
    ssh_key_id=$(get_or_create_ssh_key)
    
    # Build droplet creation JSON
    local jq_cmd="${JQ_PATH:-jq}"
    local droplet_json
    
    if [ -n "$ssh_key_id" ] && [ "$ssh_key_id" != "null" ] && [ "$ssh_key_id" != "" ]; then
        DO_SSH_KEY_ID="$ssh_key_id"
        droplet_json=$(cat <<EOF
{
    "name": "$droplet_name",
    "region": "$DO_DROPLET_REGION",
    "size": "$DO_DROPLET_SIZE",
    "image": "$DO_DROPLET_IMAGE",
    "ssh_keys": [$ssh_key_id],
    "monitoring": true,
    "tags": ["$PROJECT_NAME", "automated-deploy"]
}
EOF
)
    else
        droplet_json=$(cat <<EOF
{
    "name": "$droplet_name",
    "region": "$DO_DROPLET_REGION",
    "size": "$DO_DROPLET_SIZE",
    "image": "$DO_DROPLET_IMAGE",
    "monitoring": true,
    "tags": ["$PROJECT_NAME", "automated-deploy"]
}
EOF
)
    fi
    
    # Create droplet
    log_info "Request JSON: $droplet_json"
    local create_response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $DO_API_TOKEN" \
        -d "$droplet_json" \
        "https://api.digitalocean.com/v2/droplets")
    
    local jq_cmd="${JQ_PATH:-jq}"
    local droplet_id=$(echo "$create_response" | $jq_cmd -r '.droplet.id // empty')
    
    if [ -z "$droplet_id" ] || [ "$droplet_id" = "null" ]; then
        log_error "Failed to create droplet"
        log_error "Response: $create_response"
        exit 1
    fi
    
    log "✓ Droplet created with ID: $droplet_id"
    echo "$droplet_id"
}

do_get_droplet_ip() {
    local droplet_id=$1
    
    log "Waiting for droplet to be active..."
    
    local max_attempts=30
    local attempt=0
    local ip_address=""
    
    while [ $attempt -lt $max_attempts ]; do
        local response=$(curl -s -X GET \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $DO_API_TOKEN" \
            "https://api.digitalocean.com/v2/droplets/$droplet_id")
        
        local jq_cmd="${JQ_PATH:-jq}"
        local status=$(echo "$response" | $jq_cmd -r '.droplet.status')
        ip_address=$(echo "$response" | $jq_cmd -r '.droplet.networks.v4[] | select(.type=="public") | .ip_address' | head -n1)
        
        if [ "$status" = "active" ] && [ -n "$ip_address" ]; then
            log "✓ Droplet is active with IP: $ip_address"
            echo "$ip_address"
            return 0
        fi
        
        attempt=$((attempt + 1))
        log_info "Waiting for droplet... (attempt $attempt/$max_attempts)"
        sleep 10
    done
    
    log_error "Droplet did not become active in time"
    exit 1
}

do_wait_for_ssh() {
    local ip_address=$1
    
    log "Waiting for SSH to be available..."
    
    local max_attempts=30
    local attempt=0
    
    # Build SSH command with key if available
    local ssh_cmd="ssh"
    local ssh_opts="-o ConnectTimeout=5 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"
    if [ -n "${SSH_KEY_PATH:-}" ] && [ -f "${SSH_KEY_PATH:-}" ]; then
        ssh_opts="$ssh_opts -i ${SSH_KEY_PATH}"
    fi
    
    while [ $attempt -lt $max_attempts ]; do
        if $ssh_cmd $ssh_opts root@"$ip_address" "echo 'SSH ready'" > /dev/null 2>&1; then
            log "✓ SSH is ready"
            return 0
        fi
        
        attempt=$((attempt + 1))
        log_info "Waiting for SSH... (attempt $attempt/$max_attempts)"
        sleep 5
    done
    
    log_error "SSH did not become available in time"
    log_info "You may need to check the droplet console in DigitalOcean dashboard"
    log_info "Or try connecting manually: ssh root@$ip_address"
    exit 1
}

# ==========================================
# Server Setup Functions
# ==========================================

setup_server() {
    local ip_address=$1
    
    log "Setting up server..."
    
    # Create setup script
    local setup_script=$(cat <<'SETUP_EOF'
#!/bin/bash
set -euo pipefail

# Update system
echo "Updating system..."
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get upgrade -y

# Install dependencies
echo "Installing dependencies..."
apt-get install -y \
    curl \
    wget \
    git \
    jq \
    ufw \
    certbot \
    python3-certbot-nginx \
    postgresql-client

# Install Docker
echo "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
fi

# Install Docker Compose
echo "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Install Node.js and pnpm
echo "Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

# Install pnpm
echo "Installing pnpm..."
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm@9.5.0
fi

# Configure firewall
echo "Configuring firewall..."
ufw --force enable
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# Create application user
if ! id -u appuser &>/dev/null; then
    useradd -m -s /bin/bash appuser
    usermod -aG docker appuser
fi

echo "✓ Server setup completed"
SETUP_EOF
)
    
    # Build SSH command with key if available
    local ssh_cmd="ssh"
    local ssh_opts="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"
    if [ -n "${SSH_KEY_PATH:-}" ] && [ -f "${SSH_KEY_PATH:-}" ]; then
        ssh_opts="$ssh_opts -i ${SSH_KEY_PATH}"
    fi
    
    # Copy setup script to server
    log_info "Copying setup script to server..."
    echo "$setup_script" | $ssh_cmd $ssh_opts root@"$ip_address" "cat > /tmp/setup.sh && chmod +x /tmp/setup.sh"
    
    # Run setup script
    log_info "Running setup script..."
    $ssh_cmd $ssh_opts root@"$ip_address" "/tmp/setup.sh"
    
    log "✓ Server setup completed"
}

deploy_application() {
    local ip_address=$1
    
    log "Deploying application..."
    
    # Prepare deployment script
    local deploy_script=$(cat <<DEPLOY_EOF
#!/bin/bash
set -euo pipefail

PROJECT_NAME="${PROJECT_NAME}"
GIT_REPO_URL="${GIT_REPO_URL}"
GIT_BRANCH="${GIT_BRANCH}"
DEPLOY_ENV="${DEPLOY_ENV}"
DOMAIN_NAME="${DOMAIN_NAME}"

# Create application directory
mkdir -p /opt/$PROJECT_NAME
cd /opt/$PROJECT_NAME

# Clone repository
if [ -n "$GIT_REPO_URL" ]; then
    echo "Cloning repository..."
    if [ -d .git ]; then
        git fetch origin
        git checkout $GIT_BRANCH
        git pull origin $GIT_BRANCH
    else
        git clone -b $GIT_BRANCH $GIT_REPO_URL .
    fi
else
    echo "NOTE: GIT_REPO_URL not set. You'll need to clone repository manually."
fi

# Install dependencies
echo "Installing dependencies..."
if [ -f package.json ]; then
    pnpm install
fi

# Create .env file if it doesn't exist
if [ ! -f .env.$DEPLOY_ENV ]; then
    echo "Creating .env.$DEPLOY_ENV file..."
    cat > .env.$DEPLOY_ENV <<ENV_EOF
# Database
DATABASE_URL=postgresql://usdx:CHANGE_THIS_PASSWORD@db:5432/usdx_wexel

# Redis
REDIS_URL=redis://redis:6379

# Application
NODE_ENV=production
API_PORT=3001
CORS_ALLOWED_ORIGINS=\${DOMAIN_NAME:+https://\${DOMAIN_NAME}}
CORS_ALLOWED_ORIGINS=\${CORS_ALLOWED_ORIGINS:-http://localhost:3000,http://localhost:3001}

# JWT & Security - CHANGE THESE!
JWT_SECRET=\$(openssl rand -base64 64)
ADMIN_JWT_SECRET=\$(openssl rand -base64 64)
JWT_EXPIRES_IN=7d

# Solana - CONFIGURE THESE!
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_WEBSOCKET_URL=wss://api.devnet.solana.com
SOLANA_POOL_PROGRAM_ID=
SOLANA_WEXEL_NFT_PROGRAM_ID=
SOLANA_REWARDS_PROGRAM_ID=
SOLANA_COLLATERAL_PROGRAM_ID=
SOLANA_ORACLE_PROGRAM_ID=
SOLANA_MARKETPLACE_PROGRAM_ID=
SOLANA_BOOST_MINT_ADDRESS=

# Tron - CONFIGURE THESE!
TRON_GRID_API_KEY=
TRON_NETWORK=nile
TRON_DEPOSIT_VAULT_ADDRESS=
TRON_PRICE_FEED_ADDRESS=
TRON_BRIDGE_PROXY_ADDRESS=
TRON_USDT_ADDRESS=TXlaQadyoKuR4C198dM8f3Mxe3zPPnt5p8
ENV_EOF
fi

# Make deploy script executable
chmod +x deploy.sh

# Start infrastructure
echo "Starting infrastructure..."
cd infra/local
docker-compose up -d

# Run migrations
echo "Running database migrations..."
cd /opt/$PROJECT_NAME/apps/indexer
pnpm prisma:generate
pnpm prisma:migrate:deploy

# Deploy application
echo "Deploying application..."
cd /opt/$PROJECT_NAME
./deploy.sh --env $DEPLOY_ENV --skip-tests

echo "✓ Application deployed"
DEPLOY_EOF
)
    
    # Build SSH command with key if available
    local ssh_cmd="ssh"
    local ssh_opts="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"
    if [ -n "${SSH_KEY_PATH:-}" ] && [ -f "${SSH_KEY_PATH:-}" ]; then
        ssh_opts="$ssh_opts -i ${SSH_KEY_PATH}"
    fi
    
    # Copy deployment script
    log_info "Copying deployment script to server..."
    echo "$deploy_script" | $ssh_cmd $ssh_opts root@"$ip_address" "cat > /tmp/deploy_app.sh && chmod +x /tmp/deploy_app.sh"
    
    # Run deployment script
    log_info "Running deployment script..."
    $ssh_cmd $ssh_opts root@"$ip_address" "/tmp/deploy_app.sh" || {
        log_warning "Deployment script encountered errors. Check logs on server."
    }
    
    log "✓ Application deployment initiated"
}

# ==========================================
# Main Function
# ==========================================

main() {
    log "=================================="
    log "USDX/Wexel - DigitalOcean Deployment"
    log "=================================="
    
    # Pre-flight checks
    check_dependencies
    check_do_api
    
    # Create droplet
    local droplet_id=$(do_create_droplet)
    local ip_address=$(do_get_droplet_ip "$droplet_id")
    
    # Wait for SSH
    do_wait_for_ssh "$ip_address"
    
    # Setup server
    setup_server "$ip_address"
    
    # Deploy application
    if [ -n "$GIT_REPO_URL" ]; then
        deploy_application "$ip_address"
    else
        log_warning "GIT_REPO_URL not set. Skipping application deployment."
        log_info "You can deploy manually:"
        log_info "  ssh root@$ip_address"
        log_info "  # Then clone repository and run deploy.sh"
    fi
    
    # Output results
    log "=================================="
    log "✓ Deployment completed!"
    log "=================================="
    log "Droplet ID: $droplet_id"
    log "IP Address: $ip_address"
    log "SSH Command: ssh root@$ip_address"
    log "=================================="
    
    # Save deployment info
    cat > "${SCRIPT_DIR}/do_deployment_info.txt" <<EOF
Deployment Info - $(date)
====================
Droplet ID: $droplet_id
IP Address: $ip_address
Region: $DO_DROPLET_REGION
Size: $DO_DROPLET_SIZE
SSH: ssh root@$ip_address
EOF
    
    log "Deployment info saved to: do_deployment_info.txt"
}

# ==========================================
# Script Entry Point
# ==========================================

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --token)
            DO_API_TOKEN="$2"
            shift 2
            ;;
        --repo)
            GIT_REPO_URL="$2"
            shift 2
            ;;
        --branch)
            GIT_BRANCH="$2"
            shift 2
            ;;
        --domain)
            DOMAIN_NAME="$2"
            shift 2
            ;;
        --size)
            DO_DROPLET_SIZE="$2"
            shift 2
            ;;
        --region)
            DO_DROPLET_REGION="$2"
            shift 2
            ;;
        --ssh-key)
            DO_SSH_KEY_ID="$2"
            shift 2
            ;;
        --env)
            DEPLOY_ENV="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --token TOKEN       DigitalOcean API token (or set DO_API_TOKEN)"
            echo "  --repo URL          Git repository URL"
            echo "  --branch BRANCH     Git branch (default: main)"
            echo "  --domain DOMAIN     Domain name (optional)"
            echo "  --size SIZE         Droplet size (default: s-2vcpu-4gb)"
            echo "  --region REGION     Droplet region (default: nyc3)"
            echo "  --ssh-key ID        SSH key ID in DigitalOcean (optional)"
            echo "  --env ENV           Deployment environment (default: production)"
            echo "  --help              Show this help"
            echo ""
            echo "Environment variables:"
            echo "  DO_API_TOKEN        DigitalOcean API token"
            echo "  DO_DROPLET_SIZE     Droplet size"
            echo "  DO_DROPLET_REGION   Droplet region"
            echo "  DO_SSH_KEY_ID       SSH key ID"
            echo "  GIT_REPO_URL        Git repository URL"
            echo ""
            echo "Example:"
            echo "  $0 --token YOUR_TOKEN --repo https://github.com/user/repo.git"
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Run main function
main

