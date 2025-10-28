# USDX/Wexel Tron Smart Contracts

Smart contracts for the USDX/Wexel platform on Tron blockchain (TVM/Solidity).

## 📋 Overview

This package contains the Tron-side smart contracts for cross-chain deposits and bridge communication with Solana.

### Contracts

1. **TronDepositVault** - Main deposit contract
   - Accepts TRC-20 USDT deposits
   - Manages pools with different APY/lock periods
   - Emits events for cross-chain indexing
   - Admin controls and pause functionality

2. **TronPriceFeed** - Price oracle
   - Aggregates prices from multiple sources
   - Supports Chainlink, DEX TWAP, and manual prices
   - Confidence scoring and staleness detection
   - Multi-source price validation

3. **BridgeProxy** - Cross-chain bridge
   - Facilitates Tron <-> Solana communication
   - Validator-based message confirmation
   - Nonce-based replay attack prevention
   - Multiple message types support

4. **TronWexel721** - NFT representation (optional)
   - TRC-721 NFT for Wexels
   - Links to canonical Solana Wexels
   - Collateral flag and transfer restrictions
   - Metadata storage

## 🚀 Installation

```bash
# Install dependencies
npm install

# Or with pnpm
pnpm install
```

## 🛠️ Development

### Prerequisites

- Node.js >= 16
- TronBox >= 3.2
- TronWeb >= 6.0

### Compilation

```bash
# Compile contracts
npm run compile

# Or
tronbox compile
```

### Testing

```bash
# Run tests
npm test

# Or
tronbox test
```

### Deployment

#### Nile Testnet

```bash
# Set environment variable
export TRON_PRIVATE_KEY_NILE=your_private_key

# Deploy
npm run migrate

# Or
tronbox migrate --network nile
```

#### Mainnet

```bash
# Set environment variable
export TRON_PRIVATE_KEY_MAINNET=your_private_key

# Deploy to mainnet
npm run migrate:mainnet

# Or
tronbox migrate --network mainnet
```

## 📝 Contract Addresses

### Nile Testnet

Will be populated after deployment.

### Mainnet

Will be populated after deployment.

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
# Development
TRON_PRIVATE_KEY=your_dev_private_key

# Nile Testnet
TRON_PRIVATE_KEY_NILE=your_nile_private_key

# Mainnet
TRON_PRIVATE_KEY_MAINNET=your_mainnet_private_key

# USDT Addresses
USDT_MAINNET=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
USDT_NILE=TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf
```

### TronBox Configuration

See `tronbox.js` for network configurations.

## 📖 Usage Examples

### Deposit USDT

```javascript
const TronDepositVault = artifacts.require("TronDepositVault");

// Get contract instance
const vault = await TronDepositVault.at(VAULT_ADDRESS);

// Approve USDT
const usdt = await tronWeb.contract().at(USDT_ADDRESS);
await usdt.approve(vault.address, amount).send();

// Deposit
const solanaOwner = "0x..."; // 32 bytes Solana address
await vault.depositUSDT(poolId, amount, solanaOwner).send();
```

### Update Price

```javascript
const TronPriceFeed = artifacts.require("TronPriceFeed");

const priceFeed = await TronPriceFeed.at(PRICE_FEED_ADDRESS);

// Update price (oracle role required)
await priceFeed.updatePrice(
  tokenAddress,
  priceInUsd,     // 8 decimals
  confidence,      // 0-10000
  sources
).send();
```

### Bridge Message

```javascript
const BridgeProxy = artifacts.require("BridgeProxy");

const bridge = await BridgeProxy.at(BRIDGE_ADDRESS);

// Bridge a deposit
await bridge.bridgeDeposit(
  depositId,
  solanaOwner,
  amount,
  poolId
).send();
```

## 🔐 Security

### Roles

#### TronDepositVault
- `DEFAULT_ADMIN_ROLE` - Full admin control
- `ADMIN_ROLE` - Pool management, pause
- `BRIDGE_ROLE` - Mark deposits as processed

#### TronPriceFeed
- `DEFAULT_ADMIN_ROLE` - Full admin control
- `ADMIN_ROLE` - Configuration updates
- `ORACLE_ROLE` - Price updates

#### BridgeProxy
- `DEFAULT_ADMIN_ROLE` - Full admin control
- `ADMIN_ROLE` - Configuration, pause
- `BRIDGE_ROLE` - Create messages
- `VALIDATOR_ROLE` - Confirm messages

#### TronWexel721
- `DEFAULT_ADMIN_ROLE` - Full admin control
- `ADMIN_ROLE` - Pause functionality
- `MINTER_ROLE` - Mint and update NFTs

### Security Features

- ✅ ReentrancyGuard on all state-changing functions
- ✅ AccessControl for role-based permissions
- ✅ Pausable for emergency stops
- ✅ SafeERC20 for token transfers
- ✅ Nonce-based replay attack prevention
- ✅ Validator-based message confirmation

### Audits

- Internal audit: Completed ✅
- External audit: Pending (scheduled for mainnet launch)

## 🧪 Testing

### Test Coverage

```bash
# Run tests with coverage
tronbox test --coverage
```

Target coverage: >90%

### Test Networks

- Development: http://127.0.0.1:9090
- Nile Testnet: https://nile.trongrid.io
- Mainnet: https://api.trongrid.io

## 📚 Documentation

### Architecture

```
┌─────────────────┐
│  TronDepositVault│
│  (USDT deposits) │
└────────┬─────────┘
         │
         │ Events
         ↓
┌─────────────────┐      ┌──────────────┐
│   BridgeProxy   │◄────►│ Validators   │
│  (Cross-chain)  │      └──────────────┘
└────────┬─────────┘
         │
         │ Messages
         ↓
┌─────────────────┐
│  Solana Chain   │
│ (Canonical Wexel)│
└──────────────────┘

        ┌──────────────┐
        │TronPriceFeed │
        │ (Oracles)    │
        └──────────────┘

        ┌──────────────┐
        │TronWexel721  │
        │ (Optional NFT)│
        └──────────────┘
```

### Cross-Chain Flow

1. **Deposit on Tron**
   - User approves USDT
   - User calls `depositUSDT()`
   - Event emitted: `DepositCreated`

2. **Bridge Communication**
   - Backend indexer detects event
   - Bridge creates cross-chain message
   - Validators confirm message

3. **Solana Processing**
   - Message processed on Solana
   - Canonical Wexel NFT minted
   - Deposit marked as processed

4. **Optional: Mirror NFT**
   - TronWexel721 NFT minted on Tron
   - Links to canonical Solana Wexel

## 🤝 Contributing

Please read [CONTRIBUTING.md](../../CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

## 🔗 Links

- [USDX/Wexel Documentation](../../docs/)
- [Solana Contracts](../solana/)
- [Backend/Indexer](../../apps/indexer/)
- [Frontend](../../apps/webapp/)

## ⚠️ Disclaimer

These smart contracts are provided "as is" without warranty of any kind. Use at your own risk. Always conduct thorough testing and auditing before deploying to mainnet.

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Contact the development team
- Check the main project documentation

---

**Built with ❤️ by the USDX/Wexel Team**
