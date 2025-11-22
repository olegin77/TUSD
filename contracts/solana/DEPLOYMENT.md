# Solana Contracts Deployment Guide

## Current Situation
Server cannot build contracts due to Rust toolchain incompatibility.
Build must be done locally, then compiled files uploaded to server.

## Prerequisites (Local Machine)
- Rust 1.82+
- Solana CLI 1.18.22+
- Anchor CLI 0.30.1

## Step 1: Build Locally
```bash
cd /home/nod/tusd/TUSD/contracts/solana/solana-contracts
anchor build
```

## Step 2: Upload Compiled Files
```bash
scp target/deploy/solana_contracts.so root@159.203.114.210:/root/TUSD/contracts/solana/solana-contracts/target/deploy/
scp target/deploy/solana_contracts-keypair.json root@159.203.114.210:/root/TUSD/contracts/solana/solana-contracts/target/deploy/
```

## Step 3: Deploy to Devnet (on server)
```bash
ssh root@159.203.114.210
bash /tmp/deploy-compiled-contracts.sh
```

## Step 4: Create Boost SPL Token
```bash
# Install SPL Token CLI
cargo install spl-token-cli

# Create token
spl-token create-token --decimals 9 --url devnet

# Save the token mint address
```

## Step 5: Update Environment
Add to /root/TUSD/apps/indexer/.env:
```
SOLANA_PROGRAM_ID=<from deployment>
SOLANA_BOOST_MINT_ADDRESS=<from token creation>
```

## Step 6: Restart Services
```bash
systemctl restart tusd-indexer
systemctl status tusd-indexer
```

## Verification
- Check indexer logs: `journalctl -u tusd-indexer -f`
- Verify program on Solana Explorer: https://explorer.solana.com/?cluster=devnet
- Test wallet connection on https://159.203.114.210
