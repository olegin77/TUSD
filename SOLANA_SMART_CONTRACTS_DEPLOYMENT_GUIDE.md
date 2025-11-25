# SOLANA SMART CONTRACTS - LOCAL DEPLOYMENT GUIDE

## TUSD Platform - Wexel NFT & Pool Management

**Date**: November 24, 2025
**Status**: ⚠️ Deployment Pending (GLIBC Version Mismatch)
**Target Network**: Solana Devnet

---

## TABLE OF CONTENTS

1. [Current Situation](#current-situation)
2. [Prerequisites](#prerequisites)
3. [Solution Options](#solution-options)
4. [Option 1: Build on Production Server](#option-1-build-on-production-server-recommended)
5. [Option 2: Build with Docker](#option-2-build-with-docker)
6. [Option 3: Upgrade Local System](#option-3-upgrade-local-system)
7. [Testing Smart Contracts](#testing-smart-contracts)
8. [Deployment to Devnet](#deployment-to-devnet)
9. [Configuration Updates](#configuration-updates)
10. [Troubleshooting](#troubleshooting)

---

## CURRENT SITUATION

### Problem

The local development machine has a **GLIBC version mismatch** preventing Anchor compilation:

```
Local System:  GLIBC 2.35 (Ubuntu 22.04)
Anchor 0.32.1: GLIBC 2.39 required
Anchor 0.30.1: Compatible but not installed properly
```

### Contract Location

```
/home/nod/tusd/TUSD/contracts/solana/solana-contracts/
```

### Current Status

- ✅ Smart contract code written (lib.rs)
- ✅ Anchor project configured
- ✅ Dependencies defined
- ❌ Cannot compile locally due to GLIBC mismatch
- ❌ Not deployed to devnet
- ❌ Program IDs not configured

---

## PREREQUISITES

### Required Software

- Rust 1.75+
- Solana CLI 1.18+
- Anchor 0.30.1
- Node.js 18+
- pnpm or yarn

### Required Keys

You'll need a Solana wallet with devnet SOL for deployment:

```bash
# Generate deployment keypair if not exists
solana-keygen new --outfile ~/.config/solana/deployer-devnet.json

# Get devnet SOL (2 SOL for deployment)
solana airdrop 2 --url devnet
```

---

## SOLUTION OPTIONS

### Comparison Matrix

| Option                   | Pros                                                         | Cons                                                    | Time    | Difficulty |
| ------------------------ | ------------------------------------------------------------ | ------------------------------------------------------- | ------- | ---------- |
| **1. Production Server** | ✅ No local changes<br>✅ Quick setup<br>✅ Production-ready | ⚠️ Uses production resources                            | 30 min  | Easy       |
| **2. Docker Build**      | ✅ Isolated environment<br>✅ Reproducible                   | ⚠️ Requires Docker permissions<br>⚠️ Large image size   | 45 min  | Medium     |
| **3. Upgrade System**    | ✅ Permanent fix<br>✅ Latest tools                          | ❌ OS upgrade required<br>❌ Potential breaking changes | 2-3 hrs | Hard       |

**Recommended**: **Option 1** (Production Server) for fastest deployment.

---

## OPTION 1: BUILD ON PRODUCTION SERVER (Recommended)

### Why This Option?

- ✅ Fastest solution (30 minutes)
- ✅ Production server has newer GLIBC
- ✅ All tools available
- ✅ No local changes needed

### Step 1: Install Build Tools on Production Server

```bash
# SSH to production server
ssh root@143.198.17.162

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"

# Verify Rust installation
rustc --version
cargo --version

# Install Solana CLI 1.18.22
sh -c "$(curl -sSfL https://release.solana.com/v1.18.22/install)"

# Add Solana to PATH (add to ~/.bashrc for persistence)
export PATH="/root/.local/share/solana/install/active_release/bin:$PATH"

# Verify Solana installation
solana --version  # Should show: solana-cli 1.18.22

# Install Anchor Version Manager (AVM)
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# Install Anchor 0.30.1
avm install 0.30.1
avm use 0.30.1

# Verify Anchor installation
anchor --version  # Should show: anchor-cli 0.30.1
```

### Step 2: Build Smart Contracts

```bash
# Navigate to contracts directory
cd /root/TUSD/contracts/solana/solana-contracts

# Clean any previous builds
rm -rf target/

# Build the program
anchor build

# Verify build output
ls -lh target/deploy/
# Should see: solana_contracts.so (compiled program)
```

**Expected Output:**

```
Compiling solana-contracts v0.1.0
    Finished release [optimized] target(s) in 2m 34s

Build successful! Program binary:
target/deploy/solana_contracts.so (≈200-300 KB)
```

### Step 3: Generate Program Keypair

```bash
# Generate new program keypair (or use existing)
solana-keygen new --outfile target/deploy/solana_contracts-keypair.json

# Get the program ID
PROGRAM_ID=$(solana address -k target/deploy/solana_contracts-keypair.json)
echo "Program ID: $PROGRAM_ID"

# Save this Program ID - you'll need it for configuration!
echo "$PROGRAM_ID" > /root/TUSD/PROGRAM_ID.txt
```

### Step 4: Update Program ID in Code

```bash
# Update the declare_id! in lib.rs
cd /root/TUSD/contracts/solana/solana-contracts/programs/solana-contracts/src

# Backup original
cp lib.rs lib.rs.backup

# Update with new program ID (replace YOUR_PROGRAM_ID)
sed -i "s/declare_id!(\".*\")/declare_id!(\"$PROGRAM_ID\")/" lib.rs

# Verify the change
head -10 lib.rs | grep declare_id
```

### Step 5: Update Anchor.toml

```bash
cd /root/TUSD/contracts/solana/solana-contracts

# Update Anchor.toml with new program ID
cat > Anchor.toml << EOF
[toolchain]
package_manager = "yarn"

[features]
resolution = true
skip-lint = false

[programs.localnet]
solana_contracts = "$PROGRAM_ID"

[programs.devnet]
solana_contracts = "$PROGRAM_ID"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "devnet"
wallet = "~/.config/solana/deployer-devnet.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 \"tests/**/*.ts\""
EOF

# Rebuild with correct program ID
anchor build
```

### Step 6: Configure Solana CLI

```bash
# Set cluster to devnet
solana config set --url devnet

# Create/use deployment wallet
if [ ! -f ~/.config/solana/deployer-devnet.json ]; then
    solana-keygen new --outfile ~/.config/solana/deployer-devnet.json
fi

# Set as default wallet
solana config set --keypair ~/.config/solana/deployer-devnet.json

# Check balance
solana balance

# If balance is 0, request airdrop
solana airdrop 2
```

### Step 7: Deploy to Devnet

```bash
cd /root/TUSD/contracts/solana/solana-contracts

# Deploy using Anchor
anchor deploy --provider.cluster devnet

# Or deploy using Solana CLI directly
solana program deploy \
  --program-id target/deploy/solana_contracts-keypair.json \
  target/deploy/solana_contracts.so \
  --url devnet
```

**Expected Output:**

```
Deploying workspace: https://api.devnet.solana.com
Upgrade authority: <YOUR_WALLET_ADDRESS>
Deploying program "solana_contracts"...
Program path: target/deploy/solana_contracts.so...
Program Id: <PROGRAM_ID>

Deploy success
```

### Step 8: Verify Deployment

```bash
# Check program account
solana program show $PROGRAM_ID --url devnet

# Test program interaction (optional)
cd /root/TUSD/contracts/solana/solana-contracts
anchor test --skip-local-validator --provider.cluster devnet
```

### Step 9: Transfer Artifacts to Local Machine

```bash
# From your local machine:
# Create local artifacts directory
mkdir -p /home/nod/tusd/TUSD/contracts/solana/solana-contracts/target/deploy

# Copy build artifacts from production server
scp root@143.198.17.162:/root/TUSD/contracts/solana/solana-contracts/target/deploy/solana_contracts.so \
    /home/nod/tusd/TUSD/contracts/solana/solana-contracts/target/deploy/

scp root@143.198.17.162:/root/TUSD/contracts/solana/solana-contracts/target/deploy/solana_contracts-keypair.json \
    /home/nod/tusd/TUSD/contracts/solana/solana-contracts/target/deploy/

# Copy IDL (Interface Definition)
scp root@143.198.17.162:/root/TUSD/contracts/solana/solana-contracts/target/idl/solana_contracts.json \
    /home/nod/tusd/TUSD/contracts/solana/solana-contracts/target/idl/

# Copy program ID
scp root@143.198.17.162:/root/TUSD/PROGRAM_ID.txt /home/nod/tusd/TUSD/
```

---

## OPTION 2: BUILD WITH DOCKER

### Step 1: Prepare Docker Environment

```bash
# Navigate to contracts directory
cd /home/nod/tusd/TUSD/contracts/solana

# Check if Dockerfile exists
ls -la Dockerfile.solana-build
```

### Step 2: Fix Docker Permissions (if needed)

```bash
# Check current user groups
groups

# If 'docker' is not in groups, add user to docker group
sudo usermod -aG docker $USER

# Apply group changes
newgrp docker

# Verify docker access
docker ps
```

### Step 3: Build Docker Image

```bash
cd /home/nod/tusd/TUSD/contracts/solana

# Build the Solana build environment
docker build -t solana-builder:latest -f Dockerfile.solana-build .

# This will take 10-15 minutes
```

### Step 4: Build Contracts in Docker

```bash
# Run build in container
docker run --rm \
  -v $(pwd)/solana-contracts:/workspace \
  -w /workspace \
  solana-builder:latest \
  bash -c "anchor build"

# Check output
ls -lh solana-contracts/target/deploy/
```

### Step 5: Deploy from Docker Container

```bash
# Create deploy script
cat > /home/nod/tusd/TUSD/contracts/solana/deploy-from-docker.sh << 'DEPLOY_SCRIPT'
#!/bin/bash
set -e

PROGRAM_ID=$(solana address -k target/deploy/solana_contracts-keypair.json)
echo "Program ID: $PROGRAM_ID"

# Deploy to devnet
solana program deploy \
  --program-id target/deploy/solana_contracts-keypair.json \
  target/deploy/solana_contracts.so \
  --url devnet \
  --keypair ~/.config/solana/deployer-devnet.json

echo "Deployment complete!"
echo "Program ID: $PROGRAM_ID"
DEPLOY_SCRIPT

chmod +x /home/nod/tusd/TUSD/contracts/solana/deploy-from-docker.sh

# Run deployment in container
docker run --rm \
  -v $(pwd)/solana-contracts:/workspace \
  -v ~/.config/solana:/root/.config/solana \
  -w /workspace \
  solana-builder:latest \
  /workspace/deploy-from-docker.sh
```

---

## OPTION 3: UPGRADE LOCAL SYSTEM

### ⚠️ Warning

This option requires upgrading your Ubuntu system from 22.04 to 24.04. This is a major upgrade and may cause issues.

### Backup First!

```bash
# Backup important data
sudo tar czf /backup/home-$(date +%Y%m%d).tar.gz /home/nod/

# Backup package list
dpkg --get-selections > /backup/packages-$(date +%Y%m%d).txt
```

### Upgrade Steps

```bash
# Update current system
sudo apt update && sudo apt upgrade -y && sudo apt dist-upgrade -y

# Install update manager
sudo apt install update-manager-core -y

# Check upgrade availability
do-release-upgrade --check-dist-upgrade-only

# Perform upgrade (THIS WILL TAKE 1-2 HOURS)
sudo do-release-upgrade

# Reboot after upgrade
sudo reboot
```

### After Upgrade

```bash
# Verify GLIBC version
ldd --version
# Should now show: ldd (Ubuntu GLIBC 2.39-0ubuntu8.3) 2.39

# Reinstall Anchor
avm install 0.32.1
avm use 0.32.1
anchor --version

# Now you can build locally
cd /home/nod/tusd/TUSD/contracts/solana/solana-contracts
anchor build
```

---

## TESTING SMART CONTRACTS

### Local Testing (After Successful Build)

```bash
cd /home/nod/tusd/TUSD/contracts/solana/solana-contracts

# Start local validator
solana-test-validator --reset

# In another terminal, run tests
anchor test --skip-local-validator

# Or run specific test
anchor test --skip-local-validator tests/deposit_boost.ts
```

### Devnet Testing

```bash
# Set cluster to devnet
solana config set --url devnet

# Run integration tests on devnet
anchor test --provider.cluster devnet
```

### Manual Testing via CLI

```bash
# After deployment, test basic functionality

# Example: Create a pool (deposit)
anchor run initialize-pool --provider.cluster devnet

# Check program logs
solana logs $PROGRAM_ID --url devnet
```

---

## DEPLOYMENT TO DEVNET

### Pre-Deployment Checklist

- [ ] Smart contracts built successfully
- [ ] Program keypair generated
- [ ] Program ID updated in code
- [ ] Deployment wallet has SOL (2+ SOL recommended)
- [ ] Connected to devnet
- [ ] Tests passing locally

### Deployment Command

```bash
cd /home/nod/tusd/TUSD/contracts/solana/solana-contracts

# Ensure connected to devnet
solana config set --url devnet

# Deploy
anchor deploy --provider.cluster devnet
```

### Verify Deployment

```bash
# Get program info
PROGRAM_ID="<YOUR_PROGRAM_ID>"
solana program show $PROGRAM_ID --url devnet

# Expected output:
# Program Id: <PROGRAM_ID>
# Owner: BPFLoaderUpgradeab1e11111111111111111111111
# ProgramData Address: <ADDRESS>
# Authority: <YOUR_WALLET>
# Last Deployed In Slot: <SLOT_NUMBER>
# Data Length: <SIZE> bytes
# Balance: <SOL_BALANCE> SOL
```

---

## CONFIGURATION UPDATES

After successful deployment, you need to update the application configuration with the new Program ID.

### Step 1: Update Environment Variables

```bash
# Production server
ssh root@143.198.17.162

# Update indexer environment
cat >> /root/TUSD/apps/indexer/.env.production << EOF

# Solana Program IDs (added $(date))
SOLANA_PROGRAM_ID=$PROGRAM_ID
SOLANA_WEXEL_PROGRAM_ID=$PROGRAM_ID
EOF

# Update webapp environment
cat >> /root/TUSD/apps/webapp/.env.production << EOF

# Solana Program IDs (added $(date))
NEXT_PUBLIC_SOLANA_PROGRAM_ID=$PROGRAM_ID
NEXT_PUBLIC_SOLANA_WEXEL_PROGRAM_ID=$PROGRAM_ID
EOF
```

### Step 2: Update Indexer Configuration

```bash
# File: /root/TUSD/apps/indexer/src/config/solana.config.ts

# Update with your program ID
export const SOLANA_PROGRAM_IDS = {
  wexel: process.env.SOLANA_WEXEL_PROGRAM_ID || '<PROGRAM_ID>',
  pool: process.env.SOLANA_POOL_PROGRAM_ID || '<PROGRAM_ID>',
  // Add other program IDs as needed
};
```

### Step 3: Update Frontend Configuration

```bash
# File: /root/TUSD/apps/webapp/src/config/constants.ts

export const SOLANA_PROGRAM_IDS = {
  wexel: process.env.NEXT_PUBLIC_SOLANA_WEXEL_PROGRAM_ID || '<PROGRAM_ID>',
};
```

### Step 4: Restart Services

```bash
# Restart indexer
sudo systemctl restart tusd-indexer

# Restart webapp
sudo systemctl restart tusd-webapp

# Verify services are running
sudo systemctl status tusd-indexer
sudo systemctl status tusd-webapp

# Check logs
journalctl -u tusd-indexer -f
```

### Step 5: Verify Integration

```bash
# Test indexer connection
curl -s http://localhost:3001/api/v1/indexer/status

# Should show:
# {
#   "success": true,
#   "data": {
#     "solana": {
#       "isRunning": true,
#       "activeSubscriptions": 1,
#       "programIds": {
#         "wexel": "<PROGRAM_ID>"
#       }
#     }
#   }
# }
```

---

## TROUBLESHOOTING

### Issue: "insufficient funds for rent"

**Solution:**

```bash
# Check wallet balance
solana balance --url devnet

# Request more SOL
solana airdrop 2 --url devnet

# If airdrop fails (rate limited), wait 5-10 minutes or use faucet
# https://faucet.solana.com/
```

### Issue: "program account does not exist"

**Solution:**

```bash
# Ensure program keypair exists
ls -la target/deploy/solana_contracts-keypair.json

# If missing, regenerate
solana-keygen new --outfile target/deploy/solana_contracts-keypair.json

# Rebuild with correct program ID
anchor build
```

### Issue: "Anchor version mismatch"

**Solution:**

```bash
# Check Anchor version in Cargo.toml
grep anchor-lang programs/solana-contracts/Cargo.toml

# Install matching Anchor CLI version
avm install 0.30.1
avm use 0.30.1
```

### Issue: "Error: Account allocation failed"

**Solution:**

```bash
# Program deployment needs more SOL
# Request 5 SOL instead
solana airdrop 5 --url devnet

# Or split into multiple airdrops
for i in {1..3}; do
    solana airdrop 2 --url devnet
    sleep 30
done
```

### Issue: Docker "permission denied"

**Solution:**

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Logout and login, or run:
newgrp docker

# Verify
docker ps
```

### Issue: "GLIBC version not found"

**Solution:**

- Use Option 1 (Production Server) instead
- Or use Option 2 (Docker)
- Or upgrade to Ubuntu 24.04 (Option 3)

---

## QUICK REFERENCE

### Important Commands

```bash
# Build contracts
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Run tests
anchor test --skip-local-validator

# Check program
solana program show <PROGRAM_ID> --url devnet

# Get devnet SOL
solana airdrop 2 --url devnet

# View logs
solana logs <PROGRAM_ID> --url devnet
```

### Important Files

```
Contracts:
  programs/solana-contracts/src/lib.rs    - Main program code
  programs/solana-contracts/Cargo.toml    - Rust dependencies
  Anchor.toml                              - Anchor configuration

Build Output:
  target/deploy/solana_contracts.so       - Compiled program binary
  target/deploy/solana_contracts-keypair.json - Program keypair
  target/idl/solana_contracts.json        - Interface definition

Configuration:
  ~/.config/solana/id.json                - Default wallet
  ~/.config/solana/deployer-devnet.json   - Deployment wallet
```

### Important Addresses

```bash
# Devnet RPC
https://api.devnet.solana.com

# Devnet Explorer
https://explorer.solana.com/?cluster=devnet

# Devnet Faucet
https://faucet.solana.com/
```

---

## NEXT STEPS AFTER DEPLOYMENT

1. ✅ **Verify Deployment**
   - Check program on Solana Explorer
   - Verify program ID in configuration

2. ✅ **Update Application**
   - Update environment variables
   - Restart services
   - Test integration

3. ✅ **Enable Indexing**
   - Indexer should start monitoring events
   - Check database for blockchain data

4. ✅ **Test Frontend**
   - Connect wallet
   - Test deposit functionality
   - Verify transactions

5. ✅ **Monitor**
   - Watch Prometheus metrics
   - Check application logs
   - Monitor gas usage

---

## ESTIMATED TIMELINES

### Option 1: Production Server

- Setup tools: 15 minutes
- Build contracts: 5 minutes
- Deploy to devnet: 5 minutes
- Update configuration: 5 minutes
- **Total: ~30 minutes**

### Option 2: Docker

- Fix permissions: 5 minutes
- Build Docker image: 15 minutes
- Build contracts: 5 minutes
- Deploy: 5 minutes
- Update configuration: 5 minutes
- **Total: ~35 minutes**

### Option 3: System Upgrade

- Backup: 30 minutes
- Ubuntu upgrade: 60-120 minutes
- Reinstall tools: 20 minutes
- Build and deploy: 10 minutes
- **Total: ~2-3 hours**

---

## SUPPORT & RESOURCES

### Documentation

- Anchor Documentation: https://www.anchor-lang.com/
- Solana Documentation: https://docs.solana.com/
- Solana Cookbook: https://solanacookbook.com/

### Tools

- Solana Explorer: https://explorer.solana.com/
- Solana Faucet: https://faucet.solana.com/
- Anchor Playground: https://beta.solpg.io/

### Community

- Solana Discord: https://discord.gg/solana
- Anchor GitHub: https://github.com/coral-xyz/anchor
- Stack Exchange: https://solana.stackexchange.com/

---

**Document Version**: 1.0
**Last Updated**: November 24, 2025
**Status**: Ready for deployment
**Recommended Option**: Option 1 (Production Server Build)

---

## DEPLOYMENT CHECKLIST

Print this checklist and check off items as you complete them:

- [ ] Choose deployment option (1, 2, or 3)
- [ ] Install required tools
- [ ] Verify GLIBC version compatibility
- [ ] Build smart contracts successfully
- [ ] Generate program keypair
- [ ] Update program ID in code
- [ ] Update Anchor.toml configuration
- [ ] Rebuild with correct program ID
- [ ] Verify wallet has sufficient SOL (2+ SOL)
- [ ] Deploy to devnet
- [ ] Verify deployment on explorer
- [ ] Save program ID
- [ ] Update indexer environment variables
- [ ] Update webapp environment variables
- [ ] Restart services
- [ ] Test indexer integration
- [ ] Test frontend wallet connection
- [ ] Test deposit transaction
- [ ] Verify events in database
- [ ] Monitor Prometheus metrics
- [ ] Document program ID for team
- [ ] Celebrate successful deployment! 🎉

---
