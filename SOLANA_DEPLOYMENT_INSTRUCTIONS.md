# TUSD Solana Contracts - Manual Deployment Instructions

## Overview
This guide provides step-by-step instructions to build and deploy the TUSD Solana smart contracts to devnet. The build must be done in an environment with compatible Rust toolchain (Rust 1.82+), then deployed to the production server.

## Current Status
- Production server: 143.198.17.162
- Deployer wallet: GjLe629pUMhnHWAPWGzbiVHbRR5gvPNHd3d4zujy3ccw (6 SOL on devnet)
- Platform is operational with HTTPS, but blockchain functionality unavailable until contracts deployed

## Prerequisites

### Required Software
1. **Rust 1.82 or newer** (critical requirement)
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   rustup default stable
   rustc --version  # Should show 1.82+
   ```

2. **Solana CLI 1.18.22+**
   ```bash
   sh -c "$(curl -sSfL https://release.solana.com/v1.18.22/install)"
   export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
   solana --version
   ```

3. **Anchor CLI 0.30.1**
   ```bash
   cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
   avm install 0.30.1
   avm use 0.30.1
   anchor --version
   ```

### Verify Toolchain Compatibility
```bash
# All commands should succeed
rustc --version    # Must show >= 1.82
solana --version   # Should show 1.18.22
anchor --version   # Should show 0.30.1
```

## Step 1: Build Contracts Locally

### 1.1 Navigate to Contracts Directory
```bash
cd /home/nod/tusd/TUSD/contracts/solana/solana-contracts
```

### 1.2 Clean Previous Build (if any)
```bash
rm -rf target/
rm -f Cargo.lock
```

### 1.3 Build with Anchor
```bash
anchor build
```

**Expected output:**
- Build process will take 5-10 minutes
- Should complete with "Deploy success"
- Creates files in `target/deploy/`:
  - `solana_contracts.so` (compiled program)
  - `solana_contracts-keypair.json` (program keypair)

**Troubleshooting:**
- If Cargo.lock version error: Your Rust is too old, upgrade to 1.82+
- If dependency errors: Run `cargo update` first
- If network errors: Check internet connection and retry

### 1.4 Verify Build Output
```bash
ls -lh target/deploy/
```

You should see:
```
solana_contracts.so              (~500KB)
solana_contracts-keypair.json    (~125 bytes)
```

## Step 2: Upload Compiled Files to Server

### 2.1 Upload Program Binary
```bash
scp target/deploy/solana_contracts.so \
    root@143.198.17.162:/root/TUSD/contracts/solana/solana-contracts/target/deploy/
```

### 2.2 Upload Program Keypair
```bash
scp target/deploy/solana_contracts-keypair.json \
    root@143.198.17.162:/root/TUSD/contracts/solana/solana-contracts/target/deploy/
```

### 2.3 Verify Upload
```bash
ssh root@143.198.17.162 "ls -lh /root/TUSD/contracts/solana/solana-contracts/target/deploy/"
```

## Step 3: Deploy to Devnet

### 3.1 Connect to Server
```bash
ssh root@143.198.17.162
```

### 3.2 Run Deployment Script
```bash
bash /tmp/deploy-compiled-contracts.sh
```

**Expected output:**
```
=== TUSD Solana Contracts Deployment Script ===

1. Checking Solana CLI...
solana-cli 1.18.22

2. Checking wallet...
Wallet: GjLe629pUMhnHWAPWGzbiVHbRR5gvPNHd3d4zujy3ccw
Balance: 6 SOL

3. Checking for compiled program...
✓ Found compiled program: 500K

4. Deploying to devnet...
[deployment progress...]

✅ Deployment successful!
Program ID: <PROGRAM_ID_HERE>

5. Next steps:
   - Update /root/TUSD/apps/indexer/.env with:
     SOLANA_PROGRAM_ID=<PROGRAM_ID_HERE>
   - Create Boost SPL token
   - Restart tusd-indexer service
```

### 3.3 Save Program ID
**IMPORTANT:** Copy the Program ID from the output. You'll need it for Step 5.

The Program ID is also saved to:
```bash
cat /root/TUSD/contracts/solana/solana-contracts/deployed-program-id.txt
```

## Step 4: Create Boost SPL Token

### 4.1 Install SPL Token CLI (if not installed)
```bash
cargo install spl-token-cli
```

### 4.2 Configure Solana CLI
```bash
export PATH="/root/.local/share/solana/install/active_release/bin:$PATH"
solana config set --url devnet
solana config set --keypair ~/.config/solana/deployer-devnet.json
```

### 4.3 Create Boost Token
```bash
spl-token create-token --decimals 9 --url devnet
```

**Expected output:**
```
Creating token <TOKEN_MINT_ADDRESS>

Signature: <SIGNATURE>
```

### 4.4 Save Token Mint Address
**IMPORTANT:** Copy the token mint address from the output. You'll need it for Step 5.

### 4.5 Create Token Account (Optional)
```bash
spl-token create-account <TOKEN_MINT_ADDRESS> --url devnet
```

### 4.6 Mint Initial Supply (Optional)
```bash
# Mint 1 billion tokens (1000000000 * 10^9 for 9 decimals)
spl-token mint <TOKEN_MINT_ADDRESS> 1000000000 --url devnet
```

## Step 5: Update Environment Configuration

### 5.1 Edit Indexer Environment File
```bash
nano /root/TUSD/apps/indexer/.env
```

### 5.2 Add/Update These Lines
```bash
# Solana Configuration
SOLANA_PROGRAM_ID=<PROGRAM_ID_FROM_STEP_3>
SOLANA_BOOST_MINT_ADDRESS=<TOKEN_MINT_FROM_STEP_4>
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
```

### 5.3 Save and Exit
Press `Ctrl+X`, then `Y`, then `Enter`

### 5.4 Verify Configuration
```bash
grep "SOLANA_" /root/TUSD/apps/indexer/.env
```

Should show all four variables with correct values.

## Step 6: Restart Services

### 6.1 Restart Indexer Service
```bash
systemctl restart tusd-indexer
```

### 6.2 Check Indexer Status
```bash
systemctl status tusd-indexer
```

**Expected output:**
```
● tusd-indexer.service - TUSD Indexer Service
   Loaded: loaded
   Active: active (running)
```

### 6.3 Check Indexer Logs
```bash
journalctl -u tusd-indexer -f --since "1 minute ago"
```

**Look for:**
- "Solana program initialized: <PROGRAM_ID>"
- "Connected to Solana devnet"
- No connection errors

Press `Ctrl+C` to exit log view.

### 6.4 Restart Webapp (if needed)
```bash
systemctl restart tusd-webapp
```

## Step 7: Verification

### 7.1 Check Platform Health
```bash
curl -s https://143.198.17.162/api/v1/indexer/status | jq
```

Should show:
- status: "ok"
- solana connection: "connected"
- program ID: matches your deployment

### 7.2 Verify Program on Devnet
```bash
solana program show <PROGRAM_ID> --url devnet
```

Should display:
- Program ID
- Owner: BPFLoaderUpgradeab1e11111111111111111111111
- Executable: Yes
- Last Deployed Slot

### 7.3 Verify Token on Devnet
```bash
spl-token display <TOKEN_MINT_ADDRESS> --url devnet
```

Should show:
- Mint address
- Decimals: 9
- Supply information

### 7.4 Test Platform Endpoints
```bash
# Test pools endpoint
curl -s https://143.198.17.162/api/v1/pools | jq

# Test oracles endpoint
curl -s https://143.198.17.162/api/v1/oracles/price?mint=So11111111111111111111111111111111111111112 | jq

# Test wexels endpoint
curl -s https://143.198.17.162/api/v1/wexels | jq
```

All should return valid JSON responses (may be empty arrays initially).

## Troubleshooting

### Build Fails with "Cargo.lock version 4 requires"
**Cause:** Rust version too old
**Fix:** Upgrade to Rust 1.82+
```bash
rustup update stable
rustup default stable
```

### Deployment Fails with "Insufficient funds"
**Cause:** Deployer wallet needs more SOL
**Fix:** Request devnet airdrop
```bash
solana airdrop 2 GjLe629pUMhnHWAPWGzbiVHbRR5gvPNHd3d4zujy3ccw --url devnet
```

### Indexer Shows "Program not found"
**Cause:** Wrong Program ID in .env or program not deployed
**Fix:**
1. Verify Program ID matches deployment output
2. Check program exists: `solana program show <PROGRAM_ID> --url devnet`
3. Ensure SOLANA_NETWORK=devnet in .env

### API Returns CORS Errors
**Cause:** Indexer needs restart after .env changes
**Fix:**
```bash
systemctl restart tusd-indexer
systemctl status tusd-indexer
```

### Services Won't Start
**Cause:** Configuration error in .env
**Fix:** Check logs
```bash
journalctl -u tusd-indexer -n 50 --no-pager
journalctl -u tusd-webapp -n 50 --no-pager
```

## Important Notes

1. **Program ID is permanent** - Once deployed, the Program ID cannot be changed without redeployment
2. **Devnet resets** - Devnet occasionally resets; you'll need to redeploy if this happens
3. **Wallet security** - Keep deployer keypair secure; it has upgrade authority
4. **Gas costs** - Each deployment costs ~2-3 SOL in gas fees
5. **Upgrade authority** - Save the deployer keypair to upgrade the program later

## Next Steps After Deployment

1. **Update Frontend** - Ensure webapp uses correct Program ID
2. **Initialize Program** - Call program initialization instructions if needed
3. **Create Test Data** - Add test pools, wexels, and oracles
4. **Monitor Indexer** - Watch logs for transaction processing
5. **Test Wallet Integration** - Connect wallet and test transactions

## Reference Information

### Server Details
- IP: 143.198.17.162
- Webapp: https://143.198.17.162 (port 443 → 3000)
- API: https://143.198.17.162/api (port 443 → 3001)

### Wallet Details
- Public Key: GjLe629pUMhnHWAPWGzbiVHbRR5gvPNHd3d4zujy3ccw
- Keypair Location: /root/.config/solana/deployer-devnet.json
- Network: Devnet

### File Locations on Server
- Contracts: /root/TUSD/contracts/solana/solana-contracts
- Webapp: /root/TUSD/apps/webapp
- Indexer: /root/TUSD/apps/indexer
- Indexer .env: /root/TUSD/apps/indexer/.env
- Deployment script: /tmp/deploy-compiled-contracts.sh

### Service Commands
```bash
# Check status
systemctl status tusd-indexer
systemctl status tusd-webapp

# Restart services
systemctl restart tusd-indexer
systemctl restart tusd-webapp

# View logs
journalctl -u tusd-indexer -f
journalctl -u tusd-webapp -f
```

## Support

If you encounter issues not covered in troubleshooting:
1. Check service logs: `journalctl -u tusd-indexer -n 100`
2. Verify network connectivity: `solana cluster-version --url devnet`
3. Check wallet balance: `solana balance ~/.config/solana/deployer-devnet.json --url devnet`
4. Verify file permissions: `ls -la /root/TUSD/contracts/solana/solana-contracts/target/deploy/`

---

**Created:** 2025-11-13
**Last Updated:** 2025-11-13
**Server:** 143.198.17.162
**Network:** Devnet
