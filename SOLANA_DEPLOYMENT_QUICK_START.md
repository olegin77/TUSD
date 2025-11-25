# 🚀 SOLANA SMART CONTRACTS - QUICK START
## 30-Minute Deployment Guide

**Target**: Deploy TUSD smart contracts to Solana Devnet
**Recommended Method**: Build on Production Server

---

## ⚡ FASTEST PATH (30 minutes)

### 1️⃣ Install Tools on Production Server (15 min)

```bash
# SSH to server
ssh root@143.198.17.162

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18.22/install)"
export PATH="/root/.local/share/solana/install/active_release/bin:$PATH"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install 0.30.1
avm use 0.30.1

# Verify installations
rustc --version && solana --version && anchor --version
```

### 2️⃣ Build Contracts (5 min)

```bash
# Navigate to contracts
cd /root/TUSD/contracts/solana/solana-contracts

# Build
anchor build

# Generate program ID
solana-keygen new --outfile target/deploy/solana_contracts-keypair.json
PROGRAM_ID=$(solana address -k target/deploy/solana_contracts-keypair.json)
echo "Program ID: $PROGRAM_ID"
echo "$PROGRAM_ID" > /root/TUSD/PROGRAM_ID.txt
```

### 3️⃣ Update Program ID (2 min)

```bash
# Update lib.rs
sed -i "s/declare_id!(\".*\")/declare_id!(\"$PROGRAM_ID\")/" \
  programs/solana-contracts/src/lib.rs

# Update Anchor.toml
cat > Anchor.toml << EOF
[toolchain]
package_manager = "yarn"

[features]
resolution = true
skip-lint = false

[programs.devnet]
solana_contracts = "$PROGRAM_ID"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "devnet"
wallet = "~/.config/solana/deployer-devnet.json"
EOF

# Rebuild
anchor build
```

### 4️⃣ Setup Wallet & Get SOL (3 min)

```bash
# Create deployment wallet
mkdir -p ~/.config/solana
solana-keygen new --outfile ~/.config/solana/deployer-devnet.json
solana config set --keypair ~/.config/solana/deployer-devnet.json
solana config set --url devnet

# Get devnet SOL (may need to run 2-3 times)
solana airdrop 2
sleep 30
solana airdrop 2

# Check balance
solana balance
```

### 5️⃣ Deploy to Devnet (2 min)

```bash
cd /root/TUSD/contracts/solana/solana-contracts

# Deploy
anchor deploy --provider.cluster devnet

# Verify
solana program show $PROGRAM_ID --url devnet
```

### 6️⃣ Update Application Config (3 min)

```bash
# Update indexer
cat >> /root/TUSD/apps/indexer/.env.production << EOF
SOLANA_PROGRAM_ID=$PROGRAM_ID
SOLANA_WEXEL_PROGRAM_ID=$PROGRAM_ID
EOF

# Update webapp
cat >> /root/TUSD/apps/webapp/.env.production << EOF
NEXT_PUBLIC_SOLANA_PROGRAM_ID=$PROGRAM_ID
NEXT_PUBLIC_SOLANA_WEXEL_PROGRAM_ID=$PROGRAM_ID
EOF

# Restart services
systemctl restart tusd-indexer tusd-webapp

# Verify
curl -s http://localhost:3001/api/v1/indexer/status | jq
```

### 7️⃣ Download Artifacts to Local (2 min)

```bash
# From your local machine
mkdir -p /home/nod/tusd/TUSD/contracts/solana/solana-contracts/target/deploy

# Copy artifacts
scp root@143.198.17.162:/root/TUSD/PROGRAM_ID.txt /home/nod/tusd/TUSD/
scp root@143.198.17.162:/root/TUSD/contracts/solana/solana-contracts/target/deploy/solana_contracts.so \
    /home/nod/tusd/TUSD/contracts/solana/solana-contracts/target/deploy/
scp root@143.198.17.162:/root/TUSD/contracts/solana/solana-contracts/target/idl/solana_contracts.json \
    /home/nod/tusd/TUSD/contracts/solana/solana-contracts/target/idl/
```

---

## ✅ VERIFICATION CHECKLIST

Run these commands to verify everything is working:

```bash
# On production server
solana program show $PROGRAM_ID --url devnet
curl -s http://localhost:3001/api/v1/indexer/status
systemctl status tusd-indexer tusd-webapp

# Check Solana Explorer
echo "https://explorer.solana.com/address/$PROGRAM_ID?cluster=devnet"
```

---

## 🆘 TROUBLESHOOTING

### Problem: "insufficient funds"
```bash
# Get more SOL (multiple times if needed)
for i in {1..3}; do solana airdrop 2; sleep 30; done
```

### Problem: "airdrop failed"
```bash
# Use web faucet instead
echo "Get SOL at: https://faucet.solana.com/"
echo "Your address: $(solana address)"
```

### Problem: "Anchor version mismatch"
```bash
# Ensure using Anchor 0.30.1
avm use 0.30.1
anchor --version
# Should show: anchor-cli 0.30.1
```

### Problem: Build fails
```bash
# Clean and rebuild
rm -rf target/
anchor build
```

---

## 📋 COPY-PASTE COMMANDS

### Complete Deployment Script

Save this as `/root/deploy-contracts.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Starting TUSD Smart Contract Deployment"

# Navigate to contracts
cd /root/TUSD/contracts/solana/solana-contracts

# Build
echo "📦 Building contracts..."
anchor build

# Generate program ID if not exists
if [ ! -f target/deploy/solana_contracts-keypair.json ]; then
    echo "🔑 Generating program keypair..."
    solana-keygen new --outfile target/deploy/solana_contracts-keypair.json
fi

PROGRAM_ID=$(solana address -k target/deploy/solana_contracts-keypair.json)
echo "📝 Program ID: $PROGRAM_ID"
echo "$PROGRAM_ID" > /root/TUSD/PROGRAM_ID.txt

# Update lib.rs
echo "📝 Updating lib.rs with program ID..."
sed -i "s/declare_id!(\".*\")/declare_id!(\"$PROGRAM_ID\")/" \
  programs/solana-contracts/src/lib.rs

# Update Anchor.toml
echo "📝 Updating Anchor.toml..."
cat > Anchor.toml << EOF
[toolchain]
package_manager = "yarn"

[features]
resolution = true
skip-lint = false

[programs.devnet]
solana_contracts = "$PROGRAM_ID"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "devnet"
wallet = "~/.config/solana/deployer-devnet.json"
EOF

# Rebuild with correct program ID
echo "🔨 Rebuilding with correct program ID..."
anchor build

# Setup Solana CLI
echo "⚙️  Configuring Solana CLI..."
solana config set --url devnet
solana config set --keypair ~/.config/solana/deployer-devnet.json

# Check balance
BALANCE=$(solana balance 2>/dev/null || echo "0")
echo "💰 Current balance: $BALANCE SOL"

if [ "$BALANCE" = "0 SOL" ] || [ "$BALANCE" = "0" ]; then
    echo "💸 Requesting devnet SOL..."
    solana airdrop 2
    sleep 5
    solana airdrop 2
fi

# Deploy
echo "🚀 Deploying to devnet..."
anchor deploy --provider.cluster devnet

# Verify
echo "✅ Verifying deployment..."
solana program show $PROGRAM_ID --url devnet

# Update application config
echo "📝 Updating application configuration..."
cat >> /root/TUSD/apps/indexer/.env.production << EOF

# Solana Program IDs (deployed $(date))
SOLANA_PROGRAM_ID=$PROGRAM_ID
SOLANA_WEXEL_PROGRAM_ID=$PROGRAM_ID
EOF

cat >> /root/TUSD/apps/webapp/.env.production << EOF

# Solana Program IDs (deployed $(date))
NEXT_PUBLIC_SOLANA_PROGRAM_ID=$PROGRAM_ID
NEXT_PUBLIC_SOLANA_WEXEL_PROGRAM_ID=$PROGRAM_ID
EOF

# Restart services
echo "🔄 Restarting services..."
systemctl restart tusd-indexer tusd-webapp

# Final status
echo ""
echo "✅ Deployment complete!"
echo "📝 Program ID: $PROGRAM_ID"
echo "🔗 Explorer: https://explorer.solana.com/address/$PROGRAM_ID?cluster=devnet"
echo "📊 Indexer status: http://localhost:3001/api/v1/indexer/status"
```

### Run the script:

```bash
# Make executable
chmod +x /root/deploy-contracts.sh

# Run deployment
/root/deploy-contracts.sh
```

---

## 📊 EXPECTED OUTPUT

### Successful Deployment:
```
🚀 Starting TUSD Smart Contract Deployment
📦 Building contracts...
    Finished release [optimized] target(s) in 2m 34s
🔑 Generating program keypair...
📝 Program ID: 8qF9v9wq3xK7qZ8y7M3k2H1x6N4p5R7s8T9u1V2w3X4y
📝 Updating lib.rs with program ID...
📝 Updating Anchor.toml...
🔨 Rebuilding with correct program ID...
⚙️  Configuring Solana CLI...
💰 Current balance: 4 SOL
🚀 Deploying to devnet...
Deploy success
Program Id: 8qF9v9wq3xK7qZ8y7M3k2H1x6N4p5R7s8T9u1V2w3X4y
✅ Verifying deployment...
Program Id: 8qF9v9wq3xK7qZ8y7M3k2H1x6N4p5R7s8T9u1V2w3X4y
Owner: BPFLoaderUpgradeab1e11111111111111111111111
ProgramData Address: DqX4...5kLp
Authority: EqF3...9mKx
Last Deployed In Slot: 286549382
Data Length: 245760 bytes
Balance: 1.70491168 SOL
📝 Updating application configuration...
🔄 Restarting services...
✅ Deployment complete!
📝 Program ID: 8qF9v9wq3xK7qZ8y7M3k2H1x6N4p5R7s8T9u1V2w3X4y
🔗 Explorer: https://explorer.solana.com/address/8qF9v9wq3xK7qZ8y7M3k2H1x6N4p5R7s8T9u1V2w3X4y?cluster=devnet
📊 Indexer status: http://localhost:3001/api/v1/indexer/status
```

---

## 🎯 NEXT STEPS

After successful deployment:

1. **Test Integration**
   ```bash
   curl http://localhost:3001/api/v1/indexer/status
   ```

2. **Check Monitoring**
   - Prometheus: https://143.198.17.162/monitoring/
   - Check if program events are being indexed

3. **Update Frontend**
   - Verify wallet connection works
   - Test deposit transaction
   - Check transaction history

4. **Monitor Performance**
   - Watch gas costs
   - Monitor transaction success rates
   - Check indexer sync status

---

## 📚 ADDITIONAL RESOURCES

- **Full Guide**: See `SOLANA_SMART_CONTRACTS_DEPLOYMENT_GUIDE.md`
- **Troubleshooting**: See detailed guide for common issues
- **Solana Explorer**: https://explorer.solana.com/?cluster=devnet
- **Devnet Faucet**: https://faucet.solana.com/

---

## 💡 PRO TIPS

1. **Save Program ID**: Store it somewhere safe - you'll need it!
2. **Multiple Airdrops**: If one airdrop fails, try multiple times with sleep
3. **Check Balance**: Always verify wallet balance before deploying
4. **Use Script**: The deployment script automates everything
5. **Verify on Explorer**: Always check on Solana Explorer after deployment

---

**Status**: ✅ Ready to Deploy
**Time Required**: ~30 minutes
**Difficulty**: Easy (with provided scripts)

---

Need help? Check the full deployment guide or ask in Solana Discord.
