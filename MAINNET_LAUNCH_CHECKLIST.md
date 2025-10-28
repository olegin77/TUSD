# Mainnet Launch Checklist (T-0127)

**Version:** 1.0  
**Date Created:** 2025-10-28  
**Target Launch:** 6-8 weeks  
**Status:** 🟡 IN PREPARATION

---

## Pre-Launch Phases

### Phase 1: Code Completion & Testing (Week 1-2)

#### Critical Tasks (P0):

- [ ] **Add Unit Tests** for critical modules
  - [ ] Auth module (wallet verification)
    - [ ] Solana signature verification
    - [ ] Tron signature verification
    - [ ] JWT token generation & validation
    - [ ] Nonce replay protection
  - [ ] Wexels module (business logic)
    - [ ] Boost calculation formula
    - [ ] APY computation
    - [ ] Collateral LTV calculation
    - [ ] Reward distribution (40/60 split)
  - [ ] Oracles module (price aggregation)
    - [ ] Pyth integration
    - [ ] DEX TWAP calculation
    - [ ] Price deviation detection
    - [ ] Fallback mechanisms
  - [ ] Pools module
  - [ ] Target: >80% coverage for critical paths

- [ ] **Integration Tests**
  - [ ] API endpoint flows (deposit → boost → claim)
  - [ ] Cross-module interactions
  - [ ] Database transactions & rollbacks
  - [ ] WebSocket notifications

- [ ] **Solana Contracts Tests**
  ```bash
  cd contracts/solana/solana-contracts
  anchor test --skip-local-validator  # Against devnet
  ```
  - [ ] All 42+ tests pass
  - [ ] Gas optimization verified
  - [ ] Account rent exemption checks

#### High Priority (P1):

- [ ] **JWT Refresh Token Rotation**
  - [ ] Implement refresh token endpoint
  - [ ] Add token rotation on refresh
  - [ ] Update frontend to handle token refresh
  - [ ] Test token expiry & renewal flow

- [ ] **Redis for Nonce Storage**
  - [ ] Replace in-memory Map with Redis
  - [ ] Implement distributed nonce tracking
  - [ ] Add TTL for nonces (5 minutes)
  - [ ] Test across multiple backend instances

- [ ] **Fix Security Vulnerabilities (High Priority from audit)**
  - [ ] H-2: JWT refresh tokens (see above)
  - [ ] H-4: Redis nonces (see above)
  - [ ] Review and fix any other High issues

#### Medium Priority (P2):

- [ ] **Clean Up Linting Warnings**
  - [ ] Remove unused imports (~35 warnings)
  - [ ] Fix unused variables
  - [ ] Review and clean up commented code

- [ ] **Replace Mock Data with Real API**
  - [ ] Admin dashboard metrics
  - [ ] Marketplace listings
  - [ ] User profiles
  - [ ] Oracle prices

- [ ] **Improve Form Validation UX**
  - [ ] Add inline error messages
  - [ ] Add success feedback
  - [ ] Improve loading states

---

### Phase 2: Security Audit (Week 3-6)

#### External Audit:

- [ ] **Select Audit Firm**
  - Options:
    - [ ] Trail of Bits (recommended)
    - [ ] OpenZeppelin
    - [ ] Halborn
    - [ ] CertiK
  - Budget: $50k-$100k
  - Timeline: 3-4 weeks

- [ ] **Prepare Audit Package**
  - [ ] ✅ Documentation completed (docs/security/EXTERNAL_AUDIT_PREPARATION.md)
  - [ ] Architecture diagrams
  - [ ] Smart contract specifications
  - [ ] API documentation
  - [ ] Known issues list
  - [ ] Test coverage reports

- [ ] **Audit Execution**
  - [ ] Kickoff meeting with auditors
  - [ ] Weekly status updates
  - [ ] Respond to auditor questions
  - [ ] Review preliminary findings

- [ ] **Remediation**
  - [ ] Fix all Critical issues (if any)
  - [ ] Fix all High issues
  - [ ] Address Medium issues (prioritize)
  - [ ] Document Low issues for future
  - [ ] Re-test all fixes

- [ ] **Final Audit Report**
  - [ ] Review final report
  - [ ] Publish audit results (transparency)
  - [ ] Update documentation with audit findings

#### Internal Security Review:

- [ ] **Security Score Target: 85/100**
  - Current: 67/100
  - Gap: 18 points
  - Plan: Fix High (4) + 50% of Medium (6) = ~18 points

- [ ] **Penetration Testing**
  - [ ] API endpoints fuzzing
  - [ ] Wallet signature replay attempts
  - [ ] Oracle price manipulation tests
  - [ ] Admin panel access control tests

- [ ] **Code Review**
  - [ ] Smart contracts (Solana + Tron)
  - [ ] Backend API security
  - [ ] Frontend input validation
  - [ ] Authentication flows

---

### Phase 3: Performance & Load Testing (Week 7)

#### Performance Testing:

- [ ] **Backend Performance**
  - [ ] API response times (<200ms for most endpoints)
  - [ ] Database query optimization
  - [ ] Redis caching effectiveness
  - [ ] Indexer throughput (events/sec)

- [ ] **Frontend Performance**
  - [ ] Lighthouse score >90
  - [ ] Core Web Vitals optimization
  - [ ] Bundle size optimization
  - [ ] SSR rendering speed

#### Load Testing:

- [ ] **Simulate Production Load**
  - Tool: k6 or Artillery
  - Scenarios:
    - [ ] 1,000 concurrent users
    - [ ] 100 deposits/minute
    - [ ] 500 API requests/second
    - [ ] 10,000 active WebSocket connections

- [ ] **Stress Testing**
  - [ ] Database connection pool limits
  - [ ] Redis memory limits
  - [ ] API rate limiting under load
  - [ ] Graceful degradation

- [ ] **Solana Program Load**
  - [ ] Multiple simultaneous deposits
  - [ ] Concurrent boost applications
  - [ ] Mass claim operations
  - [ ] Marketplace high-frequency trading

---

### Phase 4: Staging Deployment (Week 7)

#### Infrastructure Setup:

- [ ] **Provision Production Infrastructure**
  - [ ] Server/VPS (DigitalOcean, AWS, or similar)
  - [ ] Database (PostgreSQL managed service)
  - [ ] Redis (managed or self-hosted)
  - [ ] Domain & SSL certificates
  - [ ] CDN setup (optional)

- [ ] **Deploy Staging Environment**
  ```bash
  cd infra/production
  docker-compose up -d
  ```
  - [ ] Backend API running
  - [ ] Frontend served
  - [ ] Database migrations applied
  - [ ] Redis connected
  - [ ] Monitoring active (Grafana accessible)

- [ ] **Configure Environment Variables**
  - [ ] Solana RPC URLs (devnet → mainnet-beta)
  - [ ] Tron RPC URLs (nile → mainnet)
  - [ ] Contract addresses (update after mainnet deploy)
  - [ ] JWT secrets (strong, unique)
  - [ ] API keys (Pyth, Chainlink, TronGrid, etc.)
  - [ ] Admin multisig addresses

#### Staging Smoke Tests:

- [ ] **Basic Functionality**
  - [ ] Homepage loads
  - [ ] Wallet connection (Phantom, Solflare, TronLink)
  - [ ] View pools
  - [ ] Create deposit (devnet/testnet)
  - [ ] Apply boost
  - [ ] View dashboard
  - [ ] Check notifications

- [ ] **Admin Panel**
  - [ ] Login with admin credentials
  - [ ] View dashboard metrics
  - [ ] Manage pools (read/update)
  - [ ] View users & wexels
  - [ ] Oracle management
  - [ ] Global settings

- [ ] **Monitoring & Alerts**
  - [ ] Grafana dashboards display correctly
  - [ ] Prometheus scraping metrics
  - [ ] Test alert triggers (simulate downtime)
  - [ ] Alert notifications received (Slack/Email/PagerDuty)

- [ ] **Backup & Restore**
  - [ ] Trigger manual backup
  - [ ] Verify backup integrity
  - [ ] Test restore procedure (on separate instance)
  - [ ] Verify restored data accuracy

---

### Phase 5: Smart Contracts Deployment (Week 8 - Day 1-3)

#### Solana Mainnet:

- [ ] **Pre-Deployment Checklist**
  - [ ] All tests pass on devnet
  - [ ] Audit report final & published
  - [ ] Admin multisig wallet created (Squads/Realms)
  - [ ] SOL funded for deployment (~5-10 SOL)

- [ ] **Deploy Programs**
  ```bash
  cd contracts/solana/solana-contracts
  anchor build --verifiable
  solana program deploy --program-id <PROGRAM_ID> target/deploy/program.so
  ```
  - [ ] LiquidityPool program
  - [ ] WexelNFT program
  - [ ] Rewards program
  - [ ] CollateralVault program
  - [ ] PriceOracleProxy program
  - [ ] Marketplace program

- [ ] **Initialize State**
  - [ ] Create pools (18%, 24%, 30%, 36% APY)
  - [ ] Set boost parameters
  - [ ] Configure oracle price feeds
  - [ ] Set admin addresses
  - [ ] Enable programs (unpause)

- [ ] **Verification**
  - [ ] Verify program IDs match expected
  - [ ] Test deposit on mainnet with small amount
  - [ ] Verify events emitted correctly
  - [ ] Check account data structure

#### Tron Mainnet:

- [ ] **Pre-Deployment Checklist**
  - [ ] Contracts compiled (TVM Solidity)
  - [ ] TRX funded for deployment (~5000 TRX)
  - [ ] TronGrid API key ready

- [ ] **Deploy Contracts**
  - [ ] TronDepositVault
  - [ ] TronPriceFeed
  - [ ] BridgeProxy
  - [ ] (Optional) TronWexel721

- [ ] **Initialize State**
  - [ ] Set USDT token address
  - [ ] Configure Solana bridge address
  - [ ] Set price oracle sources
  - [ ] Set admin addresses

- [ ] **Verification**
  - [ ] Test deposit on mainnet
  - [ ] Verify cross-chain event emission
  - [ ] Check Solana-Tron sync

---

### Phase 6: Application Deployment (Week 8 - Day 4-5)

#### Update Configuration:

- [ ] **Backend Environment Variables**
  ```bash
  # Update .env.production
  SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
  SOLANA_POOL_PROGRAM_ID=<deployed_program_id>
  SOLANA_WEXEL_NFT_PROGRAM_ID=<deployed_program_id>
  # ... (all other program IDs)
  
  TRON_NETWORK=mainnet
  TRON_DEPOSIT_VAULT_ADDRESS=<deployed_contract_address>
  # ... (all other contract addresses)
  ```

- [ ] **Frontend Environment Variables**
  ```bash
  NEXT_PUBLIC_API_URL=https://api.usdx-wexel.com
  NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
  NEXT_PUBLIC_TRON_NETWORK=mainnet
  # ... (program IDs)
  ```

#### Deploy Applications:

- [ ] **Backend Deployment**
  ```bash
  cd apps/indexer
  pnpm run build
  # Deploy to server (PM2, Docker, or platform service)
  pm2 start dist/main.js --name usdx-api
  ```

- [ ] **Frontend Deployment**
  ```bash
  cd apps/webapp
  pnpm run build
  # Deploy to Vercel/Netlify or self-host
  ```

- [ ] **Database Migration**
  ```bash
  cd apps/indexer
  npx prisma migrate deploy
  npx prisma db seed  # (if needed)
  ```

#### Post-Deployment Verification:

- [ ] **Smoke Tests (Production)**
  - [ ] Homepage loads (https://usdx-wexel.com)
  - [ ] Connect wallet (real mainnet wallets)
  - [ ] View pools (real data from blockchain)
  - [ ] API endpoints responding
  - [ ] WebSocket connections established

- [ ] **Integration Checks**
  - [ ] Solana indexer syncing events
  - [ ] Tron event listener active
  - [ ] Oracle prices updating
  - [ ] Database writes successful
  - [ ] Notifications sending

---

### Phase 7: Launch & Monitoring (Week 8 - Day 6-7)

#### Go-Live:

- [ ] **Announce Launch**
  - [ ] Social media (Twitter, Discord, Telegram)
  - [ ] Blog post / Medium article
  - [ ] Email to waitlist
  - [ ] Community announcement

- [ ] **Marketing Materials**
  - [ ] Landing page updated
  - [ ] Tutorial videos
  - [ ] Documentation (user guides)
  - [ ] FAQ

#### 24/7 Monitoring (First 48 Hours):

- [ ] **Team Availability**
  - [ ] On-call engineer(s) assigned
  - [ ] Incident response team ready
  - [ ] Escalation paths defined

- [ ] **Metrics to Watch**
  - [ ] API error rate (<1%)
  - [ ] Database performance
  - [ ] Blockchain transaction success rate
  - [ ] User wallet connection success
  - [ ] Deposit/withdrawal flows

- [ ] **Alerts Configured**
  - [ ] Service downtime (P0)
  - [ ] High error rate (P1)
  - [ ] Oracle price deviation (P1)
  - [ ] Database connection issues (P1)
  - [ ] Slow response times (P2)

#### First Deposits:

- [ ] **Test with Team Wallets**
  - [ ] Make small test deposits ($10-$100)
  - [ ] Apply boost
  - [ ] Wait for rewards accrual
  - [ ] Test claim
  - [ ] Verify everything on-chain

- [ ] **Invite Beta Users**
  - [ ] Limited launch (invite-only or cap)
  - [ ] Collect feedback
  - [ ] Monitor user behavior
  - [ ] Quick bug fixes if needed

---

## Post-Launch (Week 9+)

### Week 1-2 After Launch:

- [ ] **Gradual Rollout**
  - [ ] Remove deposit caps (if any)
  - [ ] Enable all features
  - [ ] Increase marketing

- [ ] **User Feedback**
  - [ ] Collect user feedback (surveys, Discord)
  - [ ] Prioritize feature requests
  - [ ] Fix reported bugs

- [ ] **Performance Optimization**
  - [ ] Analyze actual usage patterns
  - [ ] Optimize slow queries
  - [ ] Scale infrastructure if needed

### Month 1-3:

- [ ] **Feature Enhancements**
  - [ ] Based on user feedback
  - [ ] Additional pools/APY tiers
  - [ ] New boost tokens
  - [ ] Marketplace improvements

- [ ] **Security Hardening**
  - [ ] Bug bounty program launch
  - [ ] Continuous monitoring
  - [ ] Quarterly security reviews

- [ ] **Business Growth**
  - [ ] TVL targets
  - [ ] User acquisition campaigns
  - [ ] Partnerships & integrations

---

## Rollback Plan

### If Critical Issues Arise:

#### Immediate Actions:

- [ ] **Pause Deposits**
  - Smart contract pause functions
  - UI warning banner

- [ ] **Assess Impact**
  - How many users affected?
  - Funds at risk?
  - Data integrity?

- [ ] **Communication**
  - Transparent announcement (Twitter, Discord)
  - Email to affected users
  - Status page update

#### Rollback Procedure:

See: `docs/ops/runbooks/rollback.md`

1. **Database Rollback**
   ```bash
   psql $DATABASE_URL < backup_YYYYMMDD_HHMMSS.sql
   ```

2. **Code Rollback**
   ```bash
   git checkout <previous_commit>
   pnpm run build
   pm2 restart all
   ```

3. **Smart Contract**
   - Cannot rollback deployed contracts
   - Can pause/disable
   - May need to deploy patched version

---

## Success Criteria

### Launch is considered successful if:

- ✅ Zero critical bugs in first 48 hours
- ✅ >95% uptime in first week
- ✅ >50 deposits in first week
- ✅ >$100k TVL in first month
- ✅ No security incidents
- ✅ Positive user feedback (>80% satisfaction)

---

## Resources & Contacts

### Documentation:

- **Deployment:** `docs/DEPLOYMENT_READINESS.md`
- **Deployment Guide:** `docs/ops/DEPLOYMENT_GUIDE.md`
- **Runbooks:** `docs/ops/runbooks/`
- **Security:** `docs/security/`
- **Monitoring:** `docs/MONITORING.md`

### External Services:

- **Solana RPC:** Alchemy, QuickNode, or GenesisGo
- **Tron RPC:** TronGrid (requires API key)
- **Monitoring:** Grafana Cloud (optional)
- **Audit Firm:** [To be selected]

### Team Contacts:

- **Lead Developer:** [Name] - [Email] - [Phone]
- **DevOps:** [Name] - [Email] - [Phone]
- **Security:** [Name] - [Email] - [Phone]
- **On-Call:** [Rotation schedule]

---

## Estimated Budget

| Item | Cost | Notes |
|------|------|-------|
| External Audit | $50k-$100k | Trail of Bits / OpenZeppelin |
| Infrastructure (1st month) | $500-$1000 | Servers, DB, CDN |
| Solana Program Deploy | ~$10 SOL | (~$2000 at $200/SOL) |
| Tron Contract Deploy | ~5000 TRX | (~$700) |
| Domain & SSL | $50/year | |
| Monitoring Tools | $0-$200/mo | Grafana Cloud (optional) |
| Marketing (initial) | $5k-$10k | Launch campaign |
| **TOTAL (1st month)** | **$58k-$114k** | |

### Ongoing Costs (per month):

- Infrastructure: $500-$1000
- RPC Services: $100-$500
- Monitoring: $0-$200
- Marketing: Variable

---

## Timeline Summary

```
Week 1-2:  Unit Tests + Bug Fixes
Week 3-6:  External Security Audit + Remediation  
Week 7:    Performance Testing + Staging Deploy
Week 8:    Smart Contracts Deploy + App Deploy + Launch
Week 9+:   Monitoring, Feedback, Optimization
```

**Total Time to Mainnet: 6-8 weeks**

---

**Document Owner:** Project Lead  
**Last Updated:** 2025-10-28  
**Version:** 1.0  
**Status:** 🟡 IN PREPARATION

---

## Sign-off

Before proceeding to mainnet launch, the following stakeholders must sign off:

- [ ] **Technical Lead** - Code quality & testing
- [ ] **Security Lead** - Audit results & remediation
- [ ] **DevOps Lead** - Infrastructure readiness
- [ ] **Product Manager** - Feature completeness
- [ ] **Legal Counsel** - Compliance review (if applicable)
- [ ] **Business Lead** - Go/No-go decision

---

**IMPORTANT:** This is a living document. Update it as the project progresses and new information becomes available.
