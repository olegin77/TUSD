# Production Server Upgrade Plan: Ubuntu 22.04 → 24.04

## Overview
Upgrade production server (159.203.114.210) from Ubuntu 22.04 to 24.04 to obtain GLIBC 2.39 support required for Anchor 0.32.1 and Solana contract compilation.

## Current Environment
- **OS**: Ubuntu 22.04.5 LTS (Kernel 6.8.0-87-generic)
- **GLIBC**: 2.35 (Anchor 0.32.1 requires 2.39)
- **Services Running**:
  - tusd-webapp (Next.js on port 3000)
  - tusd-indexer (NestJS on port 3001)
  - nginx (HTTPS reverse proxy on port 443)
  - PostgreSQL database
  - Redis cache
- **Critical Data**: Database, configuration files, keypairs

## Risk Assessment

### HIGH RISK
- ❌ Database data loss if upgrade fails
- ❌ Service downtime during upgrade (30-60 minutes)
- ❌ Nginx/SSL configuration may need adjustments
- ❌ Node.js/npm/pnpm version changes

### MEDIUM RISK
- ⚠️ Systemd service files may need updates
- ⚠️ Environment variables/paths may change
- ⚠️ Docker compatibility issues

### LOW RISK
- ✓ SSH access should remain stable
- ✓ Most configurations stored in /root/TUSD

## Pre-Upgrade Checklist

### 1. Create Complete Backup (CRITICAL)

#### 1.1 Database Backup
```bash
# Backup PostgreSQL database
sudo -u postgres pg_dumpall > /root/backup-$(date +%Y%m%d-%H%M%S).sql

# Verify backup
ls -lh /root/backup-*.sql
```

#### 1.2 Configuration Backup
```bash
# Create backup directory
mkdir -p /root/TUSD-backup-$(date +%Y%m%d)

# Backup critical files
cp -r /root/TUSD /root/TUSD-backup-$(date +%Y%m%d)/
cp -r /root/.config/solana /root/TUSD-backup-$(date +%Y%m%d)/solana-config
cp -r /etc/nginx /root/TUSD-backup-$(date +%Y%m%d)/nginx-config
cp -r /etc/systemd/system/tusd-* /root/TUSD-backup-$(date +%Y%m%d)/systemd

# Backup environment files
cp /root/TUSD/apps/indexer/.env /root/TUSD-backup-$(date +%Y%m%d)/indexer.env
cp /root/TUSD/apps/webapp/.env.production /root/TUSD-backup-$(date +%Y%m%d)/webapp.env

# Create archive
cd /root
tar czf TUSD-backup-$(date +%Y%m%d).tar.gz TUSD-backup-$(date +%Y%m%d)/

# Verify archive
ls -lh /root/TUSD-backup-*.tar.gz
```

#### 1.3 DigitalOcean Snapshot (HIGHLY RECOMMENDED)
```bash
# Via DigitalOcean web interface:
# https://cloud.digitalocean.com/droplets → Select droplet → Snapshots → Take Snapshot

# Or find droplet ID and create snapshot via API:
curl -X GET \
  -H "Authorization: Bearer YOUR_DO_API_TOKEN" \
  "https://api.digitalocean.com/v2/droplets" | jq '.droplets[] | select(.name | contains("tusd")) | .id'
```

#### 1.4 Document Current State
```bash
# System info
uname -a > /root/pre-upgrade-system-info.txt
lsb_release -a >> /root/pre-upgrade-system-info.txt
dpkg -l >> /root/pre-upgrade-packages.txt

# Services status
systemctl status tusd-webapp tusd-indexer nginx postgresql redis > /root/pre-upgrade-services.txt

# Network info
ip addr >> /root/pre-upgrade-network.txt
ss -tulpn >> /root/pre-upgrade-ports.txt

# Versions
node --version >> /root/pre-upgrade-versions.txt
npm --version >> /root/pre-upgrade-versions.txt
pnpm --version >> /root/pre-upgrade-versions.txt
docker --version >> /root/pre-upgrade-versions.txt
```

### 2. Download Backups Locally (CRITICAL)
```bash
# On local machine
scp root@159.203.114.210:/root/TUSD-backup-*.tar.gz ~/tusd-backups/
scp root@159.203.114.210:/root/backup-*.sql ~/tusd-backups/
```

## Upgrade Process

### Method 1: In-Place Upgrade (Recommended for Testing)

#### Step 1: Prepare System
```bash
# Stop services to prevent data corruption
systemctl stop tusd-webapp
systemctl stop tusd-indexer

# Update current system
apt update
apt upgrade -y
apt dist-upgrade -y

# Install update-manager-core
apt install update-manager-core -y
```

#### Step 2: Configure Upgrade
```bash
# Edit upgrade configuration
nano /etc/update-manager/release-upgrades

# Ensure this line is set:
# Prompt=lts

# Check for new release
do-release-upgrade -c
```

#### Step 3: Execute Upgrade
```bash
# Start upgrade (will take 30-60 minutes)
do-release-upgrade

# During upgrade:
# - Answer 'y' to prompts
# - Keep locally modified configuration files
# - Restart services when prompted
```

#### Step 4: Post-Upgrade Verification
```bash
# Verify OS version
lsb_release -a
# Should show: Ubuntu 24.04 LTS

# Verify GLIBC version
ldd --version
# Should show: GLIBC 2.39

# Check critical services
systemctl status tusd-webapp
systemctl status tusd-indexer
systemctl status nginx
systemctl status postgresql
systemctl status redis

# Test database
sudo -u postgres psql -c "\l"

# Test web access
curl -k https://159.203.114.210/health
```

### Method 2: Fresh Installation (Recommended for Production)

#### Step 1: Create New Droplet
```bash
# Via DigitalOcean web interface:
# 1. Create → Droplets
# 2. Choose Ubuntu 24.04 LTS x64
# 3. Select same size/region as current droplet
# 4. Add SSH keys
# 5. Enable backups and monitoring
# 6. Name: tusd-prod-ubuntu24
```

#### Step 2: Setup New Server
```bash
# On new server
apt update && apt upgrade -y
apt install -y curl build-essential pkg-config libssl-dev libudev-dev nginx postgresql redis-server docker.io

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source ~/.cargo/env

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18.22/install)"
export PATH="/root/.local/share/solana/install/active_release/bin:$PATH"

# Install Anchor via avm
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install 0.32.1
avm use 0.32.1

# Verify installation
anchor --version  # Should show: anchor-cli 0.32.1
ldd --version     # Should show: GLIBC 2.39
```

#### Step 3: Migrate Data
```bash
# Transfer TUSD directory
scp -r root@159.203.114.210:/root/TUSD /root/

# Transfer Solana config
mkdir -p ~/.config
scp -r root@159.203.114.210:/root/.config/solana ~/.config/

# Transfer Nginx config
scp root@159.203.114.210:/etc/nginx/sites-available/tusd-https /etc/nginx/sites-available/

# Restore database
scp root@159.203.114.210:/root/backup-*.sql /tmp/
sudo -u postgres psql < /tmp/backup-*.sql
```

#### Step 4: Rebuild Services
```bash
# Build webapp
cd /root/TUSD/apps/webapp
pnpm install
pnpm build

# Build indexer
cd /root/TUSD/apps/indexer
pnpm install
pnpm run build

# Setup systemd services
scp root@159.203.114.210:/etc/systemd/system/tusd-* /etc/systemd/system/
systemctl daemon-reload
systemctl enable tusd-webapp tusd-indexer
systemctl start tusd-webapp tusd-indexer

# Setup Nginx
ln -s /etc/nginx/sites-available/tusd-https /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Setup SSL (copy from old server or regenerate)
mkdir -p /etc/ssl/tusd
scp root@159.203.114.210:/etc/ssl/tusd/* /etc/ssl/tusd/
```

#### Step 5: Compile Solana Contracts
```bash
cd /root/TUSD/contracts/solana/solana-contracts
source ~/.cargo/env
export PATH="/root/.local/share/solana/install/active_release/bin:$PATH"

# Clean build
rm -rf target/ .anchor/ Cargo.lock

# Build with Anchor 0.32.1 (should work now with GLIBC 2.39)
anchor build

# Verify compiled files
ls -la target/deploy/
# Should see:
# - solana_contracts.so (~500KB)
# - solana_contracts-keypair.json
```

#### Step 6: Deploy Contracts to Devnet
```bash
# Configure Solana CLI
solana config set --url devnet
solana config set --keypair ~/.config/solana/deployer-devnet.json

# Check wallet balance
solana balance
# If needed: solana airdrop 2

# Deploy program
solana program deploy target/deploy/solana_contracts.so

# Get Program ID
PROGRAM_ID=$(solana address -k target/deploy/solana_contracts-keypair.json)
echo "Program ID: $PROGRAM_ID"
echo $PROGRAM_ID > deployed-program-id.txt
```

#### Step 7: Create Boost Token
```bash
# Install SPL Token CLI
cargo install spl-token-cli

# Create token with 9 decimals
BOOST_MINT=$(spl-token create-token --decimals 9 --url devnet | grep "Creating token" | awk '{print $3}')
echo "Boost Mint: $BOOST_MINT"
echo $BOOST_MINT > boost-mint-address.txt

# Create token account (optional)
spl-token create-account $BOOST_MINT --url devnet

# Mint initial supply (optional - 1 billion tokens)
spl-token mint $BOOST_MINT 1000000000 --url devnet
```

#### Step 8: Update Configuration
```bash
# Get the deployed IDs
PROGRAM_ID=$(cat /root/TUSD/contracts/solana/solana-contracts/deployed-program-id.txt)
BOOST_MINT=$(cat /root/TUSD/contracts/solana/solana-contracts/boost-mint-address.txt)

# Update indexer .env
sed -i "s/SOLANA_PROGRAM_ID=.*/SOLANA_PROGRAM_ID=$PROGRAM_ID/" /root/TUSD/apps/indexer/.env
sed -i "s/SOLANA_BOOST_MINT_ADDRESS=.*/SOLANA_BOOST_MINT_ADDRESS=$BOOST_MINT/" /root/TUSD/apps/indexer/.env

# Update webapp .env
sed -i "s/NEXT_PUBLIC_SOLANA_PROGRAM_ID=.*/NEXT_PUBLIC_SOLANA_PROGRAM_ID=$PROGRAM_ID/" /root/TUSD/apps/webapp/.env.production
sed -i "s/NEXT_PUBLIC_SOLANA_BOOST_MINT_ADDRESS=.*/NEXT_PUBLIC_SOLANA_BOOST_MINT_ADDRESS=$BOOST_MINT/" /root/TUSD/apps/webapp/.env.production

# Restart services
systemctl restart tusd-indexer
systemctl restart tusd-webapp
```

#### Step 9: Switch DNS/Traffic
```bash
# Test new server thoroughly first
curl -k https://NEW_SERVER_IP/api/v1/indexer/status

# Then update:
# - DigitalOcean Floating IP (if used)
# - DNS A record
# - Load balancer configuration
```

## Post-Upgrade Tasks

### 1. Verification Tests
```bash
# Test platform health
curl -k https://159.203.114.210/api/v1/indexer/status | jq
curl -k https://159.203.114.210/api/v1/pools | jq

# Verify Solana program on devnet
PROGRAM_ID=$(cat /root/TUSD/contracts/solana/solana-contracts/deployed-program-id.txt)
solana program show $PROGRAM_ID --url devnet

# Verify Boost token
BOOST_MINT=$(cat /root/TUSD/contracts/solana/solana-contracts/boost-mint-address.txt)
spl-token display $BOOST_MINT --url devnet

# Test wallet connection
# Visit: https://159.203.114.210
# Try connecting wallet and performing test transaction
```

### 2. Performance Monitoring
```bash
# Monitor system resources
htop

# Check service logs
journalctl -u tusd-webapp -f
journalctl -u tusd-indexer -f

# Monitor database
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"

# Check Nginx access logs
tail -f /var/log/nginx/access.log
```

### 3. Update Documentation
```bash
# Update deployment docs with new Program ID and Boost Mint
nano /root/TUSD/SOLANA_DEPLOYMENT_INSTRUCTIONS.md

# Document upgrade process
nano /root/TUSD/UPGRADE_HISTORY.md
```

## Rollback Plan

### If Upgrade Fails

#### Method 1: Restore from Snapshot (Fastest)
1. Go to DigitalOcean web interface
2. Droplets → Select droplet → Snapshots
3. Select pre-upgrade snapshot
4. Create new droplet from snapshot
5. Update DNS to restored droplet IP
6. Estimated time: 10-15 minutes

#### Method 2: Restore from Backup (If no snapshot)
```bash
# Restore TUSD directory
cd /root
tar xzf TUSD-backup-*.tar.gz
rm -rf /root/TUSD
cp -r TUSD-backup-*/TUSD /root/

# Restore database
sudo -u postgres psql < backup-*.sql

# Restore configurations
cp -r TUSD-backup-*/nginx-config/* /etc/nginx/
cp -r TUSD-backup-*/systemd/* /etc/systemd/system/
cp -r TUSD-backup-*/solana-config ~/.config/solana

# Restore environment files
cp TUSD-backup-*/indexer.env /root/TUSD/apps/indexer/.env
cp TUSD-backup-*/webapp.env /root/TUSD/apps/webapp/.env.production

# Restart services
systemctl daemon-reload
systemctl restart tusd-webapp tusd-indexer nginx postgresql redis
```

## Timeline Estimation

### Method 1: In-Place Upgrade
- **Backup**: 15 minutes
- **Upgrade**: 45-60 minutes
- **Verification**: 15 minutes
- **Contract compilation**: 10 minutes
- **Total**: ~90 minutes downtime

### Method 2: Fresh Installation (Recommended)
- **New server setup**: 30 minutes
- **Data migration**: 20 minutes
- **Service rebuild**: 30 minutes
- **Contract compilation & deployment**: 15 minutes
- **Testing**: 20 minutes
- **DNS switch**: 5 minutes
- **Total**: ~120 minutes (but minimal downtime for users)

## Critical Success Factors

1. ✅ **Complete backup before starting** (MOST IMPORTANT!)
2. ✅ **DigitalOcean snapshot** for quick rollback
3. ✅ **Test all endpoints** after upgrade
4. ✅ **Verify database integrity**
5. ✅ **Keep old server running** until fully verified (48 hours minimum)
6. ✅ **Document all changes** including new Program IDs

## Decision Matrix

| Factor | In-Place Upgrade | Fresh Install |
|--------|------------------|---------------|
| Downtime | 90 min | ~30 min |
| Risk Level | Medium-High | Low-Medium |
| Rollback Speed | Slow (snapshot) | Fast (keep old server) |
| Data Safety | Higher risk | Lower risk |
| Complexity | Lower | Higher |
| Testing Ability | Limited | Extensive |
| **Recommendation** | Dev/Staging | **Production** ✅ |

## Recommended Approach for Production

**Method 2 (Fresh Installation)** is strongly recommended because:

1. **Zero-downtime migration** - Old server stays up while new one is built
2. **Safe testing** - Fully test new server before switching traffic
3. **Easy rollback** - Just point DNS back to old server if issues
4. **Clean environment** - No upgrade conflicts or leftover packages
5. **Parallel operation** - Can run both servers simultaneously

## Next Steps

1. **Review this plan** - Ensure understanding of all steps
2. **Schedule maintenance window** (or proceed with Method 2 for zero downtime)
3. **Create DigitalOcean snapshot** of current server
4. **Download backups locally**
5. **Execute Method 2** (Fresh Installation)
6. **Compile and deploy Solana contracts**
7. **Update production configuration** with real Program IDs
8. **Monitor for 48 hours** before decommissioning old server

## Emergency Contacts

- **DigitalOcean Support**: https://cloud.digitalocean.com/support
- **Ubuntu Upgrade Guide**: https://ubuntu.com/server/docs/upgrade-introduction
- **Solana Discord**: https://discord.gg/solana
- **Anchor GitHub**: https://github.com/coral-xyz/anchor

---

**Created**: 2025-11-21
**Server**: 159.203.114.210
**Current OS**: Ubuntu 22.04.5 LTS (GLIBC 2.35)
**Target OS**: Ubuntu 24.04 LTS (GLIBC 2.39)
**Purpose**: Enable Anchor 0.32.1 / Solana contract compilation
**Status**: Ready for execution
