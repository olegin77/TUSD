# External Security Audit Preparation Package
## USDX/Wexel Platform

**Prepared for:** External Security Auditors  
**Date:** 2025-10-28  
**Version:** 1.0  
**Contact:** security@wexel.io  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Scope of Audit](#2-scope-of-audit)
3. [System Architecture](#3-system-architecture)
4. [Smart Contracts Documentation](#4-smart-contracts-documentation)
5. [Backend API Documentation](#5-backend-api-documentation)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [Critical Business Logic](#7-critical-business-logic)
8. [Known Issues & Mitigations](#8-known-issues--mitigations)
9. [Test Coverage](#9-test-coverage)
10. [Deployment Environment](#10-deployment-environment)
11. [Audit Checklist](#11-audit-checklist)
12. [Timeline & Deliverables](#12-timeline--deliverables)

---

## 1. Project Overview

### 1.1 Platform Description

USDX/Wexel is a decentralized liquidity platform that:
- Accepts USDT deposits on **Solana** and **Tron** blockchains
- Issues **NFT-backed promissory notes (Wexels)** representing deposits
- Provides **18-36% APY** with optional boost mechanism (up to +5%)
- Enables **collateralization** of Wexels (60% LTV)
- Operates a **marketplace** for trading Wexels

### 1.2 Key Features

1. **Multi-Chain Support:** Solana (primary) and Tron (bridge)
2. **Boost Mechanism:** SPL token-based APY enhancement
3. **NFT Wexels:** On-chain proof of deposit with unique characteristics
4. **Collateral System:** 60% LTV with 40/60 reward split
5. **Marketplace:** P2P trading of Wexels
6. **Oracle Integration:** Pyth, DEX TWAP, fallback mechanisms

### 1.3 Technical Stack

- **Smart Contracts:** Anchor/Rust (Solana), Solidity (Tron)
- **Backend:** NestJS, TypeScript, Prisma ORM
- **Database:** PostgreSQL, Redis
- **Frontend:** Next.js, React, TailwindCSS
- **Infrastructure:** Docker, monitoring with Prometheus/Grafana

---

## 2. Scope of Audit

### 2.1 In-Scope Components

#### Smart Contracts (Critical Priority)
- ✅ `contracts/solana/solana-contracts/programs/solana-contracts/src/lib.rs`
  - All instruction handlers (deposit, apply_boost, accrue, claim, collateralize, repay_loan, redeem)
  - Account structures (Pool, Wexel, CollateralPosition, RewardsVault)
  - Events and error handling
  - Math operations and overflow protection

#### Backend API (High Priority)
- ✅ Authentication system (`apps/indexer/src/modules/auth/`)
  - Wallet signature verification (Solana & Tron)
  - JWT token generation and validation
  - Admin authentication
- ✅ Oracle services (`apps/indexer/src/modules/oracles/`)
  - Price aggregation logic
  - Deviation checks
  - Cache management
- ✅ Admin endpoints (`apps/indexer/src/modules/admin/`)
  - Access control
  - Parameter updates
  - Manual price setting

#### Critical Business Logic (High Priority)
- ✅ Reward calculation algorithms
- ✅ Boost value computation
- ✅ Collateral LTV calculations
- ✅ Marketplace commission handling

### 2.2 Out-of-Scope

- ❌ Frontend UI/UX (already audited internally)
- ❌ Infrastructure configuration (Docker, Nginx)
- ❌ Monitoring setup (Prometheus/Grafana)
- ❌ Third-party integrations (Pyth, DEX APIs)

### 2.3 Focus Areas

**Top Priority:**
1. Reentrancy vulnerabilities in smart contracts
2. Integer overflow/underflow in financial calculations
3. Access control bypasses
4. Oracle manipulation attacks
5. Replay attacks in authentication

**Secondary Priority:**
6. Denial of Service vectors
7. Front-running opportunities
8. Economic attack vectors
9. Admin privilege escalation
10. Data integrity issues

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────┐
│   Web Frontend  │ (Next.js)
│  (User Interface)│
└────────┬────────┘
         │ HTTPS/WSS
         ▼
┌─────────────────┐
│   Backend API   │ (NestJS)
│   + Indexer     │ ← Redis Cache
└────┬───────┬────┘
     │       │
     │       └──────┐
     ▼              ▼
┌──────────┐  ┌──────────┐
│PostgreSQL│  │  Solana  │
│ Database │  │   RPC    │
└──────────┘  └─────┬────┘
                    │
                    ▼
              ┌──────────┐
              │  Smart   │
              │Contracts │
              └──────────┘
```

### 3.2 Data Flow

#### Deposit Flow:
```
User → Frontend → Backend API → Smart Contract
                              → Emit WexelCreated Event
                              → Backend Indexer catches event
                              → Update PostgreSQL
                              → Notify User (WebSocket)
```

#### Boost Application Flow:
```
User → Frontend → Backend API → Price Oracle Service
                              → Fetch Pyth + DEX prices
                              → Calculate boost value
                              → Call apply_boost on contract
                              → Emit BoostApplied event
                              → Update database
```

#### Reward Accrual Flow:
```
Cron Job → Backend → accrue() on each Wexel
                   → Calculate daily reward
                   → Update total_rewards
                   → Emit Accrued event
```

### 3.3 Trust Boundaries

1. **User ↔ Frontend:** Trust required (client-side wallet)
2. **Frontend ↔ Backend:** Authenticated via JWT (wallet signature)
3. **Backend ↔ Smart Contract:** Backend has no special privileges
4. **Backend ↔ Oracles:** Trust in Pyth/DEX, deviation checks
5. **Admin ↔ Backend:** Authenticated with admin JWT, role-based access

---

## 4. Smart Contracts Documentation

### 4.1 Contract Overview

**Program ID:** `Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS` (placeholder)

**Account Structures:**

```rust
#[account]
pub struct Pool {
    pub id: u64,                  // Pool identifier
    pub total_deposits: u64,      // Sum of all deposits (micro-USD)
    pub total_loans: u64,         // Sum of all active loans (micro-USD)
    pub apy_bp: u16,              // APY in basis points (1800 = 18%)
    pub created_at: i64,          // Unix timestamp
}

#[account]
pub struct Wexel {
    pub id: u64,                  // Unique wexel ID
    pub owner: Pubkey,            // Current owner address
    pub principal_usd: u64,       // Original deposit (micro-USD)
    pub apy_bp: u16,              // Base APY
    pub apy_boost_bp: u16,        // Boost APY (0-500 bp)
    pub lock_period_months: u8,   // 12, 18, 24, 30, or 36
    pub created_at: i64,          // Creation timestamp
    pub matured_at: i64,          // Maturity timestamp
    pub is_collateralized: bool,  // Whether in collateral
    pub is_finalized: bool,       // Finalization status
    pub total_rewards: u64,       // Accumulated rewards
    pub claimed_rewards: u64,     // Already claimed
}

#[account]
pub struct CollateralPosition {
    pub wexel_id: u64,            // Associated wexel
    pub owner: Pubkey,            // Original owner
    pub loan_usd: u64,            // Loan amount (60% of principal)
    pub ltv_bp: u16,              // LTV in basis points (6000 = 60%)
    pub created_at: i64,          // Collateralization timestamp
    pub is_repaid: bool,          // Repayment status
}
```

### 4.2 Key Constants

```rust
const LTV_BP: u16 = 6000;              // 60% LTV
const APY_BP: u16 = 1800;              // 18% base APY
const BOOST_APY_BP: u16 = 500;         // 5% max boost
const BOOST_TARGET_BP: u16 = 3000;     // 30% of principal for max boost
const SECONDS_PER_DAY: u64 = 86400;
const SECONDS_PER_MONTH: u64 = 2592000;
```

### 4.3 Critical Functions

#### deposit()
**Purpose:** Create new wexel with USDT deposit  
**Access:** Public (any user)  
**Parameters:** `pool_id: u64, principal_usd: u64`  
**Validation:**
- ✅ `principal_usd > 0`
- ✅ Overflow protection on `pool.total_deposits`
- ❓ **Missing:** Maximum deposit limit
- ❓ **Missing:** Pool capacity check

**Security Concerns:**
1. No reentrancy guard (H-1 from internal audit)
2. No maximum principal limit (M-2)

#### apply_boost()
**Purpose:** Add boost to existing wexel  
**Access:** Public (should be owner-only)  
**Parameters:** `wexel_id: u64, amount: u64`  
**Validation:**
- ✅ Boost value calculation
- ❌ **CRITICAL:** Missing owner check (H-2)
- ❌ **CRITICAL:** No finalization check

**Security Concerns:**
1. **UNAUTHORIZED BOOST APPLICATION** - Anyone can boost any wexel
2. Missing boost cap enforcement
3. No time-based restrictions

#### accrue()
**Purpose:** Calculate and add daily rewards  
**Access:** Public (should be time-restricted)  
**Parameters:** `wexel_id: u64`  
**Validation:**
- ✅ Math overflow protection
- ❌ **CRITICAL:** No time-based validation (H-3)
- ❌ Can be called multiple times per day

**Security Concerns:**
1. **REWARD INFLATION** - Multiple accruals possible
2. No last_accrued_at tracking
3. Griefing vector (excess compute)

#### collateralize()
**Purpose:** Put wexel as collateral, get 60% loan  
**Access:** Owner only  
**Parameters:** `wexel_id: u64`  
**Validation:**
- ✅ Owner check present
- ✅ Not already collateralized
- ✅ LTV calculation

**Security Concerns:**
1. Moderate - proper access control
2. Missing reentrancy guard on loan transfer

#### claim()
**Purpose:** Claim accumulated rewards  
**Access:** Owner (or platform if collateralized)  
**Parameters:** `wexel_id: u64`  
**Validation:**
- ✅ Ownership verification
- ✅ Reward split if collateralized
- ❌ Missing reentrancy guard

**Security Concerns:**
1. Reentrancy risk during token transfer
2. Potential for double-claiming

### 4.4 Event Log

All events include:
- Event type (WexelCreated, BoostApplied, Accrued, Claimed, Collateralized, LoanRepaid, Redeemed)
- Relevant data (IDs, amounts, addresses)
- Timestamp (where applicable)

**Events are critical for:**
- Backend indexing
- Audit trails
- Fraud detection

---

## 5. Backend API Documentation

### 5.1 Authentication Flow

```
┌─────────┐                          ┌──────────┐
│ User    │                          │ Backend  │
└────┬────┘                          └─────┬────┘
     │                                     │
     │ 1. Request nonce                    │
     ├────────────────────────────────────>│
     │                                     │
     │ 2. Return message with nonce        │
     │<────────────────────────────────────┤
     │                                     │
     │ 3. Sign message with wallet         │
     │                                     │
     │ 4. Send walletAddress, signature    │
     ├────────────────────────────────────>│
     │                                     │
     │    5. Verify signature              │
     │    6. Check timestamp (< 5 min)     │
     │    7. Create/find user              │
     │    8. Generate JWT                  │
     │                                     │
     │ 9. Return JWT + user info           │
     │<────────────────────────────────────┤
     │                                     │
```

### 5.2 Authentication Security

**Solana Signature Verification:**
```typescript
const publicKeyBytes = bs58.decode(walletAddress);
const signatureBytes = bs58.decode(signature);
const messageBytes = new TextEncoder().encode(message);

const verified = nacl.sign.detached.verify(
  messageBytes,
  signatureBytes,
  publicKeyBytes
);
```

**Known Issues:**
- ❌ **H-4:** Nonce not tracked (replay attack possible)
- ❌ **M-5:** Tron verification not implemented

**Mitigations Required:**
1. Add nonce tracking (Redis set with TTL)
2. Implement Tron signature verification
3. Add rate limiting on auth endpoints

### 5.3 Admin Access Control

**Guard Stack:**
```typescript
@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminController {
  // All methods protected
}
```

**Admin Guard Logic:**
```typescript
if (user.role !== 'ADMIN') {
  throw new ForbiddenException('Insufficient permissions');
}
```

**Known Issues:**
- ❌ **M-10:** No audit logging
- ❌ **M-11:** Manual oracle price without multisig
- ❌ **M-12:** No IP whitelisting

---

## 6. Authentication & Authorization

### 6.1 Role-Based Access Control (RBAC)

**Roles:**
- `USER` - Default role, access to own resources
- `ADMIN` - Full platform access, can modify settings

**Permission Matrix:**

| Endpoint | USER | ADMIN |
|----------|------|-------|
| GET /api/v1/user/profile | ✅ (own) | ✅ (all) |
| POST /api/v1/deposits | ✅ | ✅ |
| GET /api/v1/admin/users | ❌ | ✅ |
| PATCH /api/v1/admin/settings | ❌ | ✅ |
| POST /api/v1/admin/oracles/:token/manual-price | ❌ | ✅ |

### 6.2 JWT Payload Structure

```typescript
{
  sub: "user_id",           // User ID from database
  walletAddress: "...",     // Solana or Tron address
  walletType: "SOLANA",     // SOLANA or TRON
  iat: 1234567890,          // Issued at
  exp: 1234654290           // Expires (typically iat + 24h)
}
```

### 6.3 Authorization Decorators

```typescript
// Get current user from JWT
@CurrentUser() user: User

// Require specific role
@Roles('ADMIN')
@UseGuards(RolesGuard)
```

---

## 7. Critical Business Logic

### 7.1 Reward Calculation

**Formula:**
```
Daily Reward = Principal × (APY_base + APY_boost) / 100 / 365

Where:
- Principal: Original deposit in micro-USD (6 decimals)
- APY_base: 18-36% (1800-3600 basis points)
- APY_boost: 0-5% (0-500 basis points)
```

**Example:**
```
Principal = $10,000 = 10,000,000,000 micro-USD
APY_base = 18% = 1800 bp
APY_boost = 3% = 300 bp
APY_eff = 21% = 2100 bp

Daily Reward = 10,000,000,000 × 0.21 / 365
             = 5,753,424 micro-USD
             ≈ $5.75
```

### 7.2 Boost Calculation

**Formula:**
```
Boost Target = 0.30 × Principal (30% of deposit)
APY_boost = 5% × min(Boost Value / Boost Target, 1)

Where:
- Boost Value: USD value of boost tokens at aggregated price
- Boost Target: Required amount for max boost
```

**Example:**
```
Principal = $10,000
Boost Target = $3,000

Scenario A: User adds $1,500 worth of boost tokens
APY_boost = 5% × (1,500 / 3,000) = 2.5%

Scenario B: User adds $4,000 worth of boost tokens
APY_boost = 5% × min(4,000 / 3,000, 1) = 5% (capped)
```

### 7.3 Collateral LTV Calculation

**Formula:**
```
Loan Amount = 0.60 × Principal (60% LTV)

Reward Split (when collateralized):
- User receives: 40% of daily rewards
- Platform receives: 60% of daily rewards
```

**Example:**
```
Principal = $10,000
Loan Amount = $6,000

Daily Reward = $5.75
- User gets: $5.75 × 0.40 = $2.30
- Platform gets: $5.75 × 0.60 = $3.45
```

### 7.4 Oracle Price Aggregation

**Algorithm:**
```typescript
1. Fetch prices from multiple sources:
   - Pyth (highest priority)
   - DEX TWAP (10-min window)
   - Cached price (fallback, max 5 min old)

2. Calculate deviation:
   deviation = (max_price - min_price) / min_price × 10000

3. Validate deviation:
   if (deviation > MAX_DEVIATION_BP) {
     throw Error('Price sources have too much deviation');
   }

4. Use median price:
   price = median([pyth_price, dex_price, cached_price])

5. Return aggregated price with confidence score
```

**Safety Thresholds:**
- MAX_DEVIATION_BP = 150 (1.5%)
- Cache staleness = 5 minutes
- Confidence levels: 0.5 (single source), 0.7 (two sources), 0.9 (three sources)

---

## 8. Known Issues & Mitigations

### 8.1 High Priority Issues (From Internal Audit)

| ID | Issue | Status | Mitigation Plan |
|----|-------|--------|-----------------|
| H-1 | Missing reentrancy guards | 🔴 Not Fixed | Add ReentrancyGuard pattern in all token transfer functions |
| H-2 | Unauthorized boost application | 🔴 Not Fixed | Add `require!(wexel.owner == user.key())` check |
| H-3 | No time validation in accrue | 🔴 Not Fixed | Add `last_accrued_at` field, enforce 24h minimum gap |
| H-4 | Replay attack in auth | 🔴 Not Fixed | Implement Redis-based nonce tracking |

### 8.2 Medium Priority Issues

| ID | Issue | Status | Mitigation Plan |
|----|-------|--------|-----------------|
| M-1 | Hardcoded constants | 🟡 Accepted | Move to configurable Pool parameters in v2 |
| M-2 | No max deposit limit | 🟡 Accepted | Add MAX_PRINCIPAL constant (e.g., $1M) |
| M-5 | Tron verification missing | 🔴 Not Fixed | Implement TronWeb signature verification |
| M-10 | No admin audit logging | 🟡 Partial | Add AuditLogInterceptor for all admin actions |
| M-11 | Oracle price without multisig | 🔴 Not Fixed | Integrate Gnosis Safe for price updates |

### 8.3 Accepted Risks

1. **No Early Withdrawal:** Users cannot exit before maturity (by design)
2. **Fixed APY:** APY cannot be changed after wexel creation (by design)
3. **Oracle Dependency:** Platform relies on external price feeds
4. **Smart Contract Immutability:** Once deployed, contracts cannot be upgraded (use proxy pattern in production)

---

## 9. Test Coverage

### 9.1 Smart Contract Tests

**Location:** `contracts/solana/solana-contracts/tests/`

**Test Files:**
- `deposit_boost.ts` - Deposit and boost functionality (18 tests)
- `accrue_claim_tests.ts` - Reward accrual and claiming (12 tests)
- `collateral_tests.ts` - Collateral operations (8 tests)
- `finalize_edge_cases_tests.ts` - Edge cases and finalization (4 tests)

**Total Tests:** 42  
**Coverage:** ~75% (estimated)

**Key Test Scenarios:**
- ✅ Deposit validation (amount, overflow)
- ✅ Boost calculation (partial, max, overflow)
- ✅ Reward accrual (single, multiple days)
- ✅ Collateral flow (open, repay)
- ✅ Error cases (unauthorized, invalid amounts)
- ❌ **Missing:** Reentrancy tests
- ❌ **Missing:** Time manipulation tests
- ❌ **Missing:** Griefing attack tests

### 9.2 Backend API Tests

**Location:** `apps/indexer/src/`

**Test Coverage:** Limited (mostly unit tests for services)

**Missing Critical Tests:**
- ❌ Authentication replay attack tests
- ❌ Admin authorization bypass tests
- ❌ Oracle manipulation tests
- ❌ Rate limiting tests
- ❌ Input validation fuzzing

### 9.3 Integration Tests

**Status:** ❌ Not implemented

**Recommended:**
- End-to-end flows (deposit → boost → accrue → claim)
- Cross-service integration (backend ↔ smart contract)
- Oracle failure scenarios
- Database transaction rollbacks

---

## 10. Deployment Environment

### 10.1 Network Configuration

**Testnet (Staging):**
- Solana: Devnet
- Tron: Nile Testnet
- Backend: staging.wexel.io
- Database: Staging PostgreSQL (encrypted)

**Mainnet (Production):**
- Solana: Mainnet-beta
- Tron: Mainnet
- Backend: api.wexel.io
- Database: Production PostgreSQL (encrypted, replicated)

### 10.2 Security Configurations

**Rate Limiting:**
```typescript
// Global rate limit
{
  ttl: 60000,    // 1 minute
  limit: 100,    // 100 requests
}

// Auth endpoints
{
  ttl: 60000,    // 1 minute
  limit: 5,      // 5 attempts
}
```

**CORS:**
```typescript
{
  origin: ['https://wexel.io', 'https://app.wexel.io'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}
```

**JWT:**
```typescript
{
  secret: process.env.JWT_SECRET,  // 64+ character random string
  expiresIn: '24h',                // 24 hour expiration
  algorithm: 'HS256',
}
```

### 10.3 Monitoring & Alerts

**Prometheus Metrics:**
- API response times
- Error rates
- Database connection pool
- Oracle price updates
- Smart contract events indexed

**Critical Alerts:**
- Oracle price deviation > 1.5%
- Failed authentication spike (>10/min)
- Database connection failures
- Smart contract transaction failures

---

## 11. Audit Checklist

### 11.1 Smart Contract Audit Checklist

#### Reentrancy Attacks
- [ ] Test reentrancy in `deposit()`
- [ ] Test reentrancy in `claim()`
- [ ] Test reentrancy in `collateralize()`
- [ ] Test reentrancy in `repay_loan()`

#### Access Control
- [ ] Verify owner checks in all state-changing functions
- [ ] Test privilege escalation vectors
- [ ] Verify admin-only functions are protected

#### Integer Arithmetic
- [ ] Audit all math operations for overflow/underflow
- [ ] Verify proper use of `checked_add()`, `checked_sub()`, `checked_mul()`
- [ ] Test edge cases (max values, zero values)

#### Time Manipulation
- [ ] Test multiple `accrue()` calls in short timeframe
- [ ] Verify timestamp validation in auth flows
- [ ] Test maturity checks with manipulated clock

#### Economic Attacks
- [ ] Test flash loan attacks (if applicable)
- [ ] Verify APY calculation correctness
- [ ] Test boost manipulation via price oracle
- [ ] Verify collateral LTV is enforced

#### Event Integrity
- [ ] Ensure all state changes emit events
- [ ] Verify event data accuracy
- [ ] Test event emission in error cases

### 11.2 Backend API Audit Checklist

#### Authentication
- [ ] Test signature verification (Solana & Tron)
- [ ] Test replay attack prevention
- [ ] Test JWT expiration and refresh
- [ ] Test brute force protection

#### Authorization
- [ ] Test horizontal privilege escalation (user accessing other user's data)
- [ ] Test vertical privilege escalation (user → admin)
- [ ] Test admin panel access controls
- [ ] Test API endpoint permissions

#### Input Validation
- [ ] Test all DTOs for validation
- [ ] Test SQL injection vectors (if raw queries used)
- [ ] Test XSS in API responses
- [ ] Test command injection in admin functions

#### Oracle Security
- [ ] Test price manipulation via single source
- [ ] Test deviation threshold enforcement
- [ ] Test cache poisoning
- [ ] Test manual price setting authorization

#### Rate Limiting
- [ ] Test global rate limits
- [ ] Test per-endpoint rate limits
- [ ] Test rate limit bypass techniques

### 11.3 Integration & Business Logic Checklist

- [ ] Test deposit → boost → accrue → claim full flow
- [ ] Test collateral flow with reward split
- [ ] Test marketplace commission calculations
- [ ] Verify financial calculations match specification
- [ ] Test edge cases (min/max values, boundary conditions)
- [ ] Test concurrent operations (race conditions)

---

## 12. Timeline & Deliverables

### 12.1 Audit Timeline

**Estimated Duration:** 3-4 weeks

**Phase 1: Preparation (1 week)**
- Auditors review documentation
- Setup audit environment (testnet access)
- Initial questions and clarifications

**Phase 2: Code Review (1-2 weeks)**
- Manual code review
- Automated scanning (Slither, MythX for contracts)
- Test case execution
- Vulnerability identification

**Phase 3: Exploitation & Validation (3-5 days)**
- Attempt to exploit found vulnerabilities
- Validate severity ratings
- Document proof-of-concepts

**Phase 4: Reporting (3-5 days)**
- Draft audit report
- Review with team
- Final report delivery

### 12.2 Expected Deliverables

1. **Comprehensive Audit Report:**
   - Executive summary
   - Detailed findings (Critical, High, Medium, Low, Info)
   - Proof-of-concept exploits
   - Remediation recommendations
   - Re-audit requirements

2. **Security Score:**
   - Overall platform security rating
   - Per-component scores
   - Comparison to industry standards

3. **Remediation Support:**
   - 30-day post-audit consultation
   - Code review of fixes
   - Re-audit of critical findings

### 12.3 Audit Methodology

**Tools Expected to be Used:**
- **Solana:** Anchor CLI, Solana Test Validator
- **Static Analysis:** Slither, Semgrep, Anchor security checks
- **Dynamic Analysis:** Fuzzing, property-based testing
- **Manual Review:** Line-by-line code analysis
- **Pentesting:** Burp Suite, custom scripts for API testing

---

## 13. Supporting Materials

### 13.1 Architecture Diagrams

**Available in:** `docs/PROJECT_STRUCTURE.md`

### 13.2 Technical Specification

**Available in:** `tz.md` (Russian, full technical specification)

### 13.3 Internal Audit Report

**Available in:** `tests/reports/security/internal_vulnerability_test_report.md`

**Key Findings:**
- 0 Critical issues
- 4 High priority issues (must fix before audit)
- 12 Medium priority issues
- Overall score: 67/100

### 13.4 Codebase Access

**Repository:** [Provide Git repository URL]

**Branches:**
- `main` - Production code
- `develop` - Development branch
- `audit-prep` - Code prepared for audit (with H-1 to H-4 fixes)

**Commit for Audit:** [Provide specific commit hash]

---

## 14. Contact Information

### 14.1 Primary Contacts

**Security Lead:**
- Name: [Your Name]
- Email: security@wexel.io
- Telegram: @wexel_security

**Technical Lead:**
- Name: [Your Name]
- Email: dev@wexel.io
- Available: Mon-Fri, 9 AM - 6 PM UTC

**Project Manager:**
- Name: [Your Name]
- Email: pm@wexel.io

### 14.2 Communication Channels

- **Urgent Issues:** security@wexel.io (24h response SLA)
- **General Questions:** audit@wexel.io
- **Slack Channel:** #external-audit (invite to be provided)
- **Weekly Sync:** Scheduled after kickoff

### 14.3 Disclosure Policy

- **Confidentiality:** All findings must remain confidential until public disclosure
- **Public Disclosure:** 30 days after remediation of Critical/High issues
- **Responsible Disclosure:** Coordinate timeline with project team

---

## 15. Post-Audit Action Plan

### 15.1 Remediation Process

1. **Critical & High Findings:**
   - Fix within 7 days
   - Internal testing
   - Request re-audit from external auditor

2. **Medium Findings:**
   - Fix within 30 days
   - Internal review
   - Include in next audit cycle

3. **Low & Info Findings:**
   - Prioritize for next development sprint
   - Document as known limitations if accepted

### 15.2 Re-Audit

- Required if Critical or High findings are discovered
- Focused re-audit on fixed issues
- Target: Clean audit report before mainnet launch

### 15.3 Continuous Security

- **Bug Bounty Program:** Launch post-audit (budget: $50k-$100k)
- **Annual Audits:** Schedule yearly security reviews
- **Incident Response:** 24/7 monitoring post-launch

---

## Appendices

### Appendix A: Glossary

- **Wexel:** NFT promissory note representing a deposit
- **Boost:** Additional APY enhancement mechanism
- **LTV:** Loan-to-Value ratio (60% in this platform)
- **APY:** Annual Percentage Yield
- **Basis Points (bp):** 1/100th of a percent (100 bp = 1%)
- **Oracle:** Price feed service (Pyth, DEX, etc.)
- **TWAP:** Time-Weighted Average Price

### Appendix B: Code Statistics

**Smart Contract (Rust):**
- Lines of Code: ~540
- Functions: 8 instructions + helpers
- Complexity: Medium

**Backend API (TypeScript):**
- Lines of Code: ~12,000
- Modules: 12 (auth, pools, wexels, oracles, admin, etc.)
- Endpoints: ~40

**Database Schema:**
- Tables: 10 (users, pools, wexels, collateral, listings, token_prices, etc.)
- Indexes: 15

### Appendix C: Dependencies

**Smart Contract:**
- anchor-lang = "0.29.0"
- anchor-spl = "0.29.0"

**Backend:**
- @nestjs/core = "^10.0.0"
- prisma = "^5.0.0"
- @nestjs/jwt = "^10.0.0"
- tweetnacl = "^1.0.3" (signature verification)

**Known Vulnerabilities:** None (as of npm audit on 2025-10-28)

---

**Document Version:** 1.0  
**Last Updated:** 2025-10-28  
**Next Review:** After external audit completion

**Prepared By:** USDX/Wexel Security Team  
**Approved By:** [CTO/Security Lead Name]

---

END OF EXTERNAL AUDIT PREPARATION PACKAGE
