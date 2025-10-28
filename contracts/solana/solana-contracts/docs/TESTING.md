# Testing Guide

## Overview

This document provides comprehensive information about testing the Solana contracts for the USDX/Wexel platform.

## Test Structure

### Unit Tests

Located in `tests/` directory, covering individual instructions and account operations.

#### Key Test Files

- **deposit_boost.ts**: Tests for deposit and boost functionality
  - Successful deposits with various amounts
  - Boost application (partial, full, excessive)
  - Error handling and validation
  - Integration tests for deposit + boost flow

- **event_tests.ts**: Tests for event emissions
  - Verifies all state-changing operations emit correct events
  - Validates event data structure and content

- **contract_structure_tests.ts**: Tests for account structure
  - PDA derivation correctness
  - Account initialization and state

### Integration Tests

End-to-end tests simulating real user workflows:

1. **Full Deposit Flow**
   - Create pool
   - Deposit funds
   - Apply boost
   - Verify state

2. **Collateral Flow**
   - Deposit → Boost → Collateralize → Repay

3. **Rewards Flow**
   - Deposit → Accrue → Claim → Redeem

## Running Tests

### Prerequisites

Ensure you have installed:

- Rust (latest stable)
- Solana CLI (v1.18+)
- Anchor CLI (latest)
- Node.js 20+
- pnpm 9+

### Commands

```bash
# Install dependencies
pnpm install

# Run all tests with local validator
pnpm test

# Run unit tests (skip validator)
pnpm test:unit

# Run specific test file
anchor test tests/deposit_boost.ts

# Run with verbose output
anchor test --verbose
```

## Code Coverage

### Setup

Install `cargo-llvm-cov`:

```bash
cargo install cargo-llvm-cov
```

### Generating Coverage Reports

```bash
# Generate HTML report
pnpm test:coverage

# Open report in browser
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
start coverage/index.html  # Windows
```

### Coverage Targets

| Component       | Target | Current |
| --------------- | ------ | ------- |
| Instructions    | >90%   | TBD     |
| Event Emissions | 100%   | TBD     |
| Error Handling  | >90%   | TBD     |
| Overall         | >90%   | TBD     |

### Interpreting Coverage

The HTML report shows:

- **Green lines**: Covered by tests
- **Red lines**: Not covered
- **Yellow lines**: Partially covered (branches)

Focus on:

1. Critical paths (deposits, withdrawals, collateral)
2. Error conditions
3. Edge cases (overflow, underflow, boundary values)

### CI/CD Integration

Coverage is automatically checked on:

- Every push to `tusd` or `main` branches
- All pull requests

The build fails if coverage drops below 90%.

## Test Data

### Default Test Values

```typescript
// Amounts (6 decimals for USDT)
const PRINCIPAL = 1000_000000; // $1,000
const BOOST_FULL = 300_000000; // $300 (30% of principal)
const BOOST_HALF = 150_000000; // $150 (15% of principal)

// Time periods
const LOCK_PERIOD = 12; // months
const SECONDS_PER_DAY = 86400;
const SECONDS_PER_MONTH = 30 * 86400;

// APY (basis points)
const BASE_APY_BP = 1800; // 18%
const MAX_BOOST_APY_BP = 500; // 5%
const LTV_BP = 6000; // 60%
```

### Test Accounts

Each test suite generates fresh keypairs:

```typescript
before(async () => {
  user = anchor.web3.Keypair.generate();
  // Airdrop SOL for transaction fees
  await provider.connection.requestAirdrop(user.publicKey, 10 * anchor.web3.LAMPORTS_PER_SOL);
});
```

## Writing New Tests

### Test Template

```typescript
describe("Feature Name", () => {
  it("Should perform action successfully", async () => {
    // 1. Setup: Derive PDAs
    const [accountPda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("seed"), ...],
      program.programId
    );

    // 2. Execute: Call instruction
    const tx = await program.methods
      .instructionName(params)
      .accounts({ ... })
      .signers([user])
      .rpc();

    // 3. Verify: Check account state
    const account = await program.account.accountType.fetch(accountPda);
    expect(account.field).to.equal(expectedValue);
  });

  it("Should fail with error condition", async () => {
    try {
      await program.methods
        .instructionName(invalidParams)
        .accounts({ ... })
        .signers([user])
        .rpc();

      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.error.errorCode.code).to.equal("ExpectedError");
    }
  });
});
```

### Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Use fresh accounts for each test
3. **Assertions**: Verify all relevant state changes
4. **Events**: Check that events are emitted
5. **Errors**: Test both success and failure paths
6. **Edge Cases**: Test boundary values and limits

### PDA Derivation

Always use consistent seed patterns:

```typescript
// Pool PDA
const [poolPda, poolBump] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("pool"), poolId.toArrayLike(Buffer, "le", 8)],
  program.programId
);

// Wexel PDA
const [wexelPda, wexelBump] = anchor.web3.PublicKey.findProgramAddressSync(
  [Buffer.from("wexel"), user.publicKey.toBuffer(), poolId.toArrayLike(Buffer, "le", 8)],
  program.programId
);
```

## Debugging Tests

### Enable Detailed Logs

```bash
# Set Solana log level
export RUST_LOG=solana_runtime::system_instruction_processor=trace,solana_runtime::message_processor=debug,solana_bpf_loader=debug,solana_rbpf=debug

# Run with Anchor logs
ANCHOR_LOG=true anchor test
```

### Common Issues

**Issue**: `AccountNotFound` error

- **Solution**: Verify PDA derivation seeds match contract
- **Solution**: Ensure account is initialized before use

**Issue**: `ConstraintRaw` error

- **Solution**: Check account ownership constraints
- **Solution**: Verify signer requirements

**Issue**: Test timeout

- **Solution**: Increase Mocha timeout: `this.timeout(60000)`
- **Solution**: Confirm local validator is running

## Performance Testing

### Load Testing

Test contract behavior under high load:

```typescript
it("Should handle 1000 sequential deposits", async () => {
  for (let i = 0; i < 1000; i++) {
    const poolId = new anchor.BN(i);
    // ... perform deposit
  }
}).timeout(300000); // 5 minute timeout
```

### Gas Optimization

Monitor compute units used:

```typescript
const tx = await program.methods
  .instruction()
  .accounts({ ... })
  .rpc({ commitment: "confirmed" });

const txDetails = await provider.connection.getTransaction(tx, {
  commitment: "confirmed"
});

console.log("Compute units used:", txDetails.meta.computeUnitsConsumed);
```

## Continuous Integration

### GitHub Actions Workflow

See `.github/workflows/test-coverage.yml` for the CI configuration.

The workflow:

1. Installs Rust, Solana, and Anchor
2. Builds contracts
3. Runs all tests
4. Generates coverage report
5. Fails if coverage < 90%
6. Uploads coverage artifacts

### Local CI Simulation

Run the same checks locally:

```bash
# Full CI test suite
pnpm test:all

# This runs:
# 1. pnpm test:unit (all unit tests)
# 2. pnpm test:coverage:check (coverage > 90%)
```

## Test Maintenance

### When to Update Tests

- Adding new instructions → Add corresponding test suite
- Modifying instruction logic → Update affected tests
- Changing account structure → Update PDA derivation tests
- Updating error codes → Update error handling tests
- Changing constants → Update test data values

### Review Checklist

Before committing test changes:

- [ ] All tests pass locally
- [ ] Coverage remains >90%
- [ ] New tests follow naming conventions
- [ ] Edge cases are covered
- [ ] Error paths are tested
- [ ] Events are verified
- [ ] Documentation is updated

## Resources

- [Anchor Testing](https://www.anchor-lang.com/docs/testing)
- [Solana Test Validator](https://docs.solana.com/developing/test-validator)
- [Mocha Documentation](https://mochajs.org/)
- [Chai Assertions](https://www.chaijs.com/api/bdd/)
