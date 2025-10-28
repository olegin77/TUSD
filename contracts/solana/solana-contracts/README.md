# Solana Contracts - USDX/Wexel Platform

Smart contracts for the USDX/Wexel platform built with Anchor on Solana.

## Overview

This project contains the core Solana smart contracts for:
- **Liquidity Pools**: Manage USDT deposits with configurable APY
- **Wexel NFTs**: NFT-based promissory notes with rewards
- **Boost System**: Apply boost tokens for increased APY (up to +5%)
- **Collateralization**: Collateralize Wexels for 60% LTV loans
- **Rewards Distribution**: Daily accrual and claiming of rewards

## Architecture

### Core Accounts

- **Pool**: Liquidity pool with deposits and configuration
- **Wexel**: Individual deposit record (NFT-backed)
- **CollateralPosition**: Tracks collateralized Wexels and loans
- **RewardsVault**: Manages reward distribution

### Key Instructions

- `deposit`: Create a new Wexel with USDT deposit
- `apply_boost`: Apply boost tokens to increase APY
- `mint_wexel_finalize`: Finalize Wexel metadata
- `accrue`: Calculate and update accrued rewards
- `claim`: Claim accumulated rewards
- `collateralize`: Lock Wexel for 60% LTV loan
- `repay_loan`: Repay loan and unlock Wexel
- `redeem`: Redeem matured Wexel for principal + rewards

## Testing

### Prerequisites

```bash
# Install Rust and Solana CLI
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install latest
avm use latest

# Install Node dependencies
pnpm install
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run unit tests only (skip validator)
pnpm test:unit

# Run with coverage
pnpm test:coverage

# Check coverage threshold (must be >90%)
pnpm test:coverage:check

# Run all tests with coverage check
pnpm test:all
```

### Test Coverage

This project maintains **>90% code coverage** for all smart contract code.

#### Measuring Coverage

We use `cargo-llvm-cov` for Rust code coverage:

```bash
# Install cargo-llvm-cov (one-time setup)
cargo install cargo-llvm-cov

# Generate HTML coverage report
pnpm test:coverage
# Report will be in: coverage/index.html

# Check coverage meets threshold
pnpm test:coverage:check
```

#### Coverage Reports

After running `pnpm test:coverage`, open `coverage/index.html` in a browser to see:
- Line-by-line coverage highlighting
- Function coverage percentages
- Branch coverage analysis
- Overall project coverage

#### CI/CD Integration

The test coverage check is integrated into CI/CD pipeline and will fail if coverage drops below 90%.

## Building

```bash
# Build the program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Deploy to mainnet
anchor deploy --provider.cluster mainnet
```

## Configuration

### Constants

Key constants defined in the program:

```rust
const LTV_BP: u16 = 6000;          // 60% LTV for collateral
const APY_BP: u16 = 1800;          // 18% base APY
const BOOST_APY_BP: u16 = 500;     // 5% maximum boost APY
const BOOST_TARGET_BP: u16 = 3000; // 30% of principal for max boost
```

### Formulas

**Daily Rewards (no collateral):**
```
daily_reward = principal × (apy_base + apy_boost) / (365 × 10000)
```

**Boost APY Calculation:**
```
boost_target = principal × 0.30
boost_ratio = min(boost_amount, boost_target) / boost_target
apy_boost = boost_ratio × 5%
```

**Collateral Loan:**
```
loan_amount = principal × 0.60
```

## Security

### Audits

- [ ] External audit pending
- [ ] Bug bounty program pending

### Key Security Features

- **Reentrancy Protection**: All state changes before external calls
- **Overflow Protection**: Safe math with checked operations
- **Access Control**: Owner-only operations with constraint checks
- **PDA Validation**: All accounts use Program Derived Addresses

### Error Codes

| Code | Description |
|------|-------------|
| `InsufficientFunds` | Not enough funds for operation |
| `WexelNotFound` | Wexel account not found |
| `WexelNotMatured` | Wexel has not reached maturity date |
| `InvalidAmount` | Amount is zero or invalid |
| `Unauthorized` | User not authorized for operation |
| `MathOverflow` | Arithmetic overflow detected |
| `WexelAlreadyCollateralized` | Wexel is already collateralized |

## Development

### Project Structure

```
.
├── programs/
│   └── solana-contracts/
│       └── src/
│           └── lib.rs           # Main program logic
├── tests/
│   ├── deposit_boost.ts         # Deposit and boost tests
│   ├── event_tests.ts           # Event emission tests
│   └── ...
├── Anchor.toml                  # Anchor configuration
├── Cargo.toml                   # Rust dependencies
└── package.json                 # Node.js scripts
```

### Adding New Instructions

1. Define the instruction function in `lib.rs`
2. Create corresponding account context struct
3. Add event emission for state changes
4. Write unit tests in `tests/`
5. Update this README with new functionality

### Code Quality

- Run `cargo clippy` for Rust linting
- Run `pnpm lint` for TypeScript linting
- Ensure all tests pass before committing
- Maintain >90% test coverage

## Resources

- [Anchor Documentation](https://www.anchor-lang.com/)
- [Solana Documentation](https://docs.solana.com/)
- [Project Technical Specification](../../../tz.md)

## License

ISC
