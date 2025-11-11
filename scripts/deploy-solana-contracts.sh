#!/bin/bash
# Скрипт деплоя Solana контрактов

set -e

echo "========================================="
echo "Deploying Solana Contracts"
echo "========================================="

cd contracts/solana/solana-contracts

# Check if Anchor is installed
if ! command -v anchor &> /dev/null; then
    echo "Error: Anchor CLI not installed"
    echo "Install with: cargo install --git https://github.com/coral-xyz/anchor avm --locked && avm install latest && avm use latest"
    exit 1
fi

# Set cluster (devnet, testnet, mainnet-beta)
CLUSTER=${1:-devnet}
echo "Deploying to: $CLUSTER"

# Build contracts
echo "Building contracts..."
anchor build

# Deploy
echo "Deploying to Solana $CLUSTER..."
anchor deploy --provider.cluster $CLUSTER

# Get program IDs
PROGRAM_ID=$(solana address -k target/deploy/usdx-keypair.json)
echo "Program deployed: $PROGRAM_ID"

# Update .env files
echo "Updating environment variables..."
ENV_FILE="../../../apps/indexer/.env.production"

if grep -q "SOLANA_PROGRAM_ID" "$ENV_FILE"; then
    sed -i "s|SOLANA_PROGRAM_ID=.*|SOLANA_PROGRAM_ID=$PROGRAM_ID|" "$ENV_FILE"
else
    echo "SOLANA_PROGRAM_ID=$PROGRAM_ID" >> "$ENV_FILE"
fi

echo "========================================="
echo "Deployment Complete!"
echo "Program ID: $PROGRAM_ID"
echo "Cluster: $CLUSTER"
echo "========================================="
