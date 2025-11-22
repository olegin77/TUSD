# Solana Contracts Compilation - Solution Guide

**Problem**: Cannot compile Solana contracts due to dependency version conflicts

## Root Cause Analysis

###Problem 1: Rust Version Conflict (Production Server)
```
Solana platform-tools v1.41:  Rust 1.75.0-dev (embedded)
Anchor 0.32.1 dependencies:    Rust 1.76+ required
Status: INCOMPATIBLE
```

### Problem 2: GLIBC Version Conflict (Local/Production)
```
Current GLIBC:  2.35
Anchor 0.32.1:  GLIBC 2.39 required
Status: INCOMPATIBLE
```

## ✅ RECOMMENDED SOLUTION: Docker-Based Compilation

### Step 1: Create Docker Build Environment

Create `Dockerfile.solana-build` in `/home/nod/tusd/TUSD/contracts/solana/`:

```dockerfile
FROM ubuntu:24.04

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    build-essential \
    pkg-config \
    libssl-dev \
    libudev-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Rust 1.82+
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"
RUN rustup default stable && rustup update

# Install Solana CLI 1.18.22
RUN sh -c "$(curl -sSfL https://release.solana.com/v1.18.22/install)"
ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"

# Install Anchor CLI 0.32.1
RUN cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
RUN avm install 0.32.1
RUN avm use 0.32.1

# Set working directory
WORKDIR /workspace

CMD ["/bin/bash"]
```

### Step 2: Build Docker Image

```bash
cd /home/nod/tusd/TUSD/contracts/solana
docker build -f Dockerfile.solana-build -t solana-builder:latest .
```

### Step 3: Compile Contracts in Docker

```bash
# Run Docker container with source mounted
docker run --rm -v /home/nod/tusd/TUSD/contracts/solana/solana-contracts:/workspace solana-builder:latest bash -c "
  cd /workspace &&
  anchor build &&
  ls -la target/deploy/
"

# Extract compiled files
ls -lh /home/nod/tusd/TUSD/contracts/solana/solana-contracts/target/deploy/
```

Expected output:
```
solana_contracts.so              (~500KB)
solana_contracts-keypair.json    (~125 bytes)
```

### Step 4: Upload to Production Server

```bash
# Upload compiled program
scp /home/nod/tusd/TUSD/contracts/solana/solana-contracts/target/deploy/solana_contracts.so \
    root@159.203.114.210:/root/TUSD/contracts/solana/solana-contracts/target/deploy/

# Upload program keypair  
scp /home/nod/tusd/TUSD/contracts/solana/solana-contracts/target/deploy/solana_contracts-keypair.json \
    root@159.203.114.210:/root/TUSD/contracts/solana/solana-contracts/target/deploy/
```

### Step 5: Deploy to Devnet

```bash
ssh root@159.203.114.210

# Deploy using pre-compiled .so file
cd /root/TUSD/contracts/solana/solana-contracts
export PATH="/root/.local/share/solana/install/active_release/bin:$PATH"

solana config set --url devnet
solana config set --keypair ~/.config/solana/deployer-devnet.json

# Deploy program
solana program deploy \
  target/deploy/solana_contracts.so \
  --program-id target/deploy/solana_contracts-keypair.json

# Save the Program ID from output
echo "<PROGRAM_ID>" > deployed-program-id.txt
```

### Step 6: Update Configuration

Replace mock Program IDs with real ones:

```bash
# Update indexer .env
sed -i 's|SOLANA_PROGRAM_ID=.*|SOLANA_PROGRAM_ID=<REAL_PROGRAM_ID>|' /root/TUSD/apps/indexer/.env

# Update webapp .env
sed -i 's|NEXT_PUBLIC_SOLANA_PROGRAM_ID=.*|NEXT_PUBLIC_SOLANA_PROGRAM_ID=<REAL_PROGRAM_ID>|' /root/TUSD/apps/webapp/.env.production

# Restart services
systemctl restart tusd-indexer tusd-webapp
```

---

## Alternative Solution 1: Upgrade System (Ubuntu 24.04)

### For Production Server

```bash
# WARNING: Requires careful planning and testing
# 1. Backup all data
# 2. Upgrade Ubuntu 22.04 → 24.04
do-release-upgrade

# 3. Reinstall Anchor 0.32.1 (will have GLIBC 2.39+)
source ~/.cargo/env
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install 0.32.1
avm use 0.32.1

# 4. Compile contracts
cd /root/TUSD/contracts/solana/solana-contracts
anchor build
```

**Pros**: 
- Native compilation on production
- Latest system libs

**Cons**: 
- Risky upgrade process
- Potential downtime
- May break other services
- NOT RECOMMENDED for production

---

## Alternative Solution 2: Downgrade Anchor Dependencies

### Modify Cargo.toml

Edit `/home/nod/tusd/TUSD/contracts/solana/solana-contracts/programs/solana-contracts/Cargo.toml`:

```toml
[dependencies]
# OLD (requires Rust 1.76+):
anchor-lang = "0.32.1"
anchor-spl = "0.32.1"

# NEW (compatible with Rust 1.75):
anchor-lang = "0.30.1"
anchor-spl = "0.30.1"
```

**Pros**: 
- Works with current infrastructure
- No system upgrades needed

**Cons**:
- Loses features from Anchor 0.32.1
- Need to verify compatibility
- May require code changes

---

## Alternative Solution 3: Use Pre-built Binaries

If contracts were previously compiled:

```bash
# Find existing .so file
find /home/nod/tusd/TUSD -name "solana_contracts.so" 2>/dev/null

# Or download from CI/CD artifacts
# Or use from another development machine
```

---

## Comparison of Solutions

| Solution | Time | Risk | Recommended |
|----------|------|------|-------------|
| Docker Build | 30 min | Low | ✅ **YES** |
| System Upgrade | 2-4 hours | High | ❌ No |
| Downgrade Deps | 15 min | Medium | ⚠️  Maybe |
| Pre-built Binary | 5 min | Low | ⚠️  If available |

---

## Next Steps (Recommended Path)

1. **Immediate** (Today):
   - [ ] Create Dockerfile.solana-build
   - [ ] Build Docker image
   - [ ] Compile contracts in Docker
   - [ ] Upload to production server

2. **Deploy** (Within 1 hour):
   - [ ] Deploy .so file to devnet
   - [ ] Create SPL Boost token
   - [ ] Update production configuration
   - [ ] Test end-to-end

3. **Long-term** (Next sprint):
   - [ ] Add Docker build to CI/CD pipeline
   - [ ] Plan system upgrade strategy
   - [ ] Fix 3 CRITICAL issues before mainnet

---

## Verification Commands

After successful compilation:

```bash
# Check compiled file size
ls -lh target/deploy/solana_contracts.so
# Should be ~400-600KB

# Verify it's a valid BPF program
file target/deploy/solana_contracts.so
# Should show: ELF 64-bit LSB executable

# Check program ID
solana-keygen pubkey target/deploy/solana_contracts-keypair.json
```

---

**Status**: Infrastructure complete, waiting for Docker-based compilation  
**Blocker**: GLIBC 2.35 < required GLIBC 2.39  
**Solution**: Docker with Ubuntu 24.04 base image  
**ETA**: 30 minutes

---
**Created**: 21 Noyabr, 2025 yil, Juma  
**Author**: DevOps/Blockchain Team  
**Priority**: HIGH
