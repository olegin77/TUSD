#!/bin/bash
# Скрипт деплоя Tron контрактов

set -e

echo "========================================="
echo "Deploying Tron Contracts"
echo "========================================="

cd contracts/tron

# Check if TronBox is installed
if ! command -v tronbox &> /dev/null; then
    echo "Error: TronBox not installed"
    echo "Install with: npm install -g tronbox"
    exit 1
fi

# Set network (development, nile, mainnet)
NETWORK=${1:-nile}
echo "Deploying to: $NETWORK"

# Compile contracts
echo "Compiling contracts..."
tronbox compile

# Deploy
echo "Deploying to Tron $NETWORK..."
tronbox migrate --network $NETWORK --reset

# Save deployed addresses
echo "Saving deployed contract addresses..."
cat > deployed-addresses.json <<EOF
{
  "network": "$NETWORK",
  "deployedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "contracts": {
    "TronDepositVault": "$(grep -o 'TronDepositVault: T[A-Za-z0-9]*' build/contracts/*.json | tail -1 | cut -d: -f2 | tr -d ' ')",
    "TronPriceFeed": "$(grep -o 'TronPriceFeed: T[A-Za-z0-9]*' build/contracts/*.json | tail -1 | cut -d: -f2 | tr -d ' ')",
    "BridgeProxy": "$(grep -o 'BridgeProxy: T[A-Za-z0-9]*' build/contracts/*.json | tail -1 | cut -d: -f2 | tr -d ' ')",
    "TronWexel721": "$(grep -o 'TronWexel721: T[A-Za-z0-9]*' build/contracts/*.json | tail -1 | cut -d: -f2 | tr -d ' ')"
  }
}
EOF

echo "Contract addresses saved to deployed-addresses.json"

# Update backend .env
ENV_FILE="../../apps/indexer/.env.production"
VAULT_ADDRESS=$(jq -r '.contracts.TronDepositVault' deployed-addresses.json)
FEED_ADDRESS=$(jq -r '.contracts.TronPriceFeed' deployed-addresses.json)
BRIDGE_ADDRESS=$(jq -r '.contracts.BridgeProxy' deployed-addresses.json)
WEXEL_ADDRESS=$(jq -r '.contracts.TronWexel721' deployed-addresses.json)

if grep -q "TRON_DEPOSIT_VAULT_ADDRESS" "$ENV_FILE"; then
    sed -i "s|TRON_DEPOSIT_VAULT_ADDRESS=.*|TRON_DEPOSIT_VAULT_ADDRESS=$VAULT_ADDRESS|" "$ENV_FILE"
    sed -i "s|TRON_PRICE_FEED_ADDRESS=.*|TRON_PRICE_FEED_ADDRESS=$FEED_ADDRESS|" "$ENV_FILE"
    sed -i "s|TRON_BRIDGE_PROXY_ADDRESS=.*|TRON_BRIDGE_PROXY_ADDRESS=$BRIDGE_ADDRESS|" "$ENV_FILE"
    sed -i "s|TRON_WEXEL721_ADDRESS=.*|TRON_WEXEL721_ADDRESS=$WEXEL_ADDRESS|" "$ENV_FILE"
else
    echo "TRON_DEPOSIT_VAULT_ADDRESS=$VAULT_ADDRESS" >> "$ENV_FILE"
    echo "TRON_PRICE_FEED_ADDRESS=$FEED_ADDRESS" >> "$ENV_FILE"
    echo "TRON_BRIDGE_PROXY_ADDRESS=$BRIDGE_ADDRESS" >> "$ENV_FILE"
    echo "TRON_WEXEL721_ADDRESS=$WEXEL_ADDRESS" >> "$ENV_FILE"
fi

echo "========================================="
echo "Deployment Complete!"
echo "Network: $NETWORK"
echo "Vault: $VAULT_ADDRESS"
echo "PriceFeed: $FEED_ADDRESS"
echo "Bridge: $BRIDGE_ADDRESS"
echo "Wexel721: $WEXEL_ADDRESS"
echo "========================================="
