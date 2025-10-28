# Critical Fixes Action Plan

## USDX/Wexel Platform - Pre-Staging Critical Fixes

**Created:** 2025-10-28  
**Priority:** 🔴 CRITICAL  
**Target:** Complete within 3-4 days  
**Status:** In Progress

---

## Overview

Based on the Final Comprehensive Testing Report, we have identified **3 HIGH PRIORITY** security issues and several medium priority items that must be resolved before staging deployment.

**Total Issues to Fix:** 7  
**Estimated Time:** 3-4 days  
**Team Required:** 2 developers

---

## Phase 1: Critical Security Fixes (Days 1-3)

### 1.1 HIGH-01: Reentrancy Guards in Solana Contracts
**Severity:** 🔴 HIGH  
**Estimated Time:** 2 days  
**Assigned To:** Solana Developer

#### Issue Description:
Missing reentrancy protection in `claim` and `collateralize` functions could allow double-spending attacks.

#### Files to Modify:
```
contracts/solana/solana-contracts/programs/solana-contracts/src/lib.rs
```

#### Implementation Steps:
1. Add reentrancy guard state to account structures
2. Implement check-effect-interaction pattern
3. Add `ReentrancyGuard` struct with locked flag
4. Update `claim()` function with guard checks
5. Update `collateralize()` function with guard checks
6. Add tests for reentrancy attack scenarios
7. Document the implementation

#### Acceptance Criteria:
- [ ] ReentrancyGuard implemented
- [ ] Both functions protected
- [ ] Tests pass for reentrancy scenarios
- [ ] No performance degradation
- [ ] Documentation updated

#### Code Template:
```rust
#[account]
pub struct ReentrancyGuard {
    pub locked: bool,
}

// In claim function:
pub fn claim(ctx: Context<Claim>, wexel_id: u64) -> Result<()> {
    let guard = &mut ctx.accounts.reentrancy_guard;
    require!(!guard.locked, ErrorCode::ReentrancyDetected);
    
    guard.locked = true;
    // ... existing claim logic ...
    guard.locked = false;
    
    Ok(())
}
```

---

### 1.2 HIGH-02: Tron Signature Verification
**Severity:** 🔴 HIGH  
**Estimated Time:** 1 day  
**Assigned To:** Backend Developer

#### Issue Description:
Tron wallet signature verification is not implemented, allowing potential unauthorized access.

#### Files to Modify:
```
apps/indexer/src/auth/auth.service.ts
apps/indexer/src/auth/dto/link-wallet.dto.ts
```

#### Implementation Steps:
1. Install TronWeb library: `pnpm add tronweb`
2. Add Tron signature verification helper function
3. Implement `verifyTronSignature()` in AuthService
4. Add signature format validation
5. Add message reconstruction logic
6. Update `linkWallet()` endpoint logic
7. Add unit tests for Tron verification
8. Add integration tests with real Tron signatures

#### Acceptance Criteria:
- [ ] TronWeb integrated
- [ ] Signature verification works correctly
- [ ] Invalid signatures rejected
- [ ] Address recovery matches claimed address
- [ ] Unit tests pass (5+ scenarios)
- [ ] Integration test with TronLink

#### Code Template:
```typescript
import TronWeb from 'tronweb';

async verifyTronSignature(
  address: string,
  message: string,
  signature: string
): Promise<boolean> {
  try {
    const tronWeb = new TronWeb({
      fullHost: this.configService.get('TRON_NETWORK') === 'mainnet'
        ? 'https://api.trongrid.io'
        : 'https://nile.trongrid.io'
    });
    
    const recoveredAddress = await tronWeb.trx.verifyMessage(
      message,
      signature
    );
    
    return recoveredAddress === address;
  } catch (error) {
    this.logger.error(`Tron signature verification failed: ${error.message}`);
    return false;
  }
}
```

#### Testing:
```typescript
describe('Tron Signature Verification', () => {
  it('should verify valid Tron signature', async () => {
    const result = await authService.verifyTronSignature(
      'TXlaQadyoKuR4C198dM8f3Mxe3zPPnt5p8',
      'Link wallet to USDX/Wexel - Nonce: 123456',
      'validSignatureHere'
    );
    expect(result).toBe(true);
  });

  it('should reject invalid signature', async () => {
    // Test implementation
  });

  it('should reject mismatched address', async () => {
    // Test implementation
  });
});
```

---

### 1.3 HIGH-03: CORS Configuration
**Severity:** 🔴 HIGH  
**Estimated Time:** 0.5 days  
**Assigned To:** Backend Developer

#### Issue Description:
CORS is not properly configured, potentially allowing unauthorized cross-origin requests.

#### Files to Modify:
```
apps/indexer/src/main.ts
apps/indexer/.env.example
```

#### Implementation Steps:
1. Install CORS package (already in NestJS)
2. Configure CORS in main.ts
3. Add environment variables for allowed origins
4. Set proper headers (Access-Control-*)
5. Configure preflight requests
6. Add security headers
7. Test with different origins

#### Acceptance Criteria:
- [ ] CORS properly configured
- [ ] Only allowed origins can access API
- [ ] Credentials handling secure
- [ ] Preflight requests handled
- [ ] Security headers present
- [ ] Tested with frontend

#### Code Implementation:
```typescript
// apps/indexer/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Security headers
  app.use(helmet());
  
  // CORS configuration
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',') || [
        'http://localhost:3000',
        'http://localhost:3001',
      ];
      
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Wallet-Signature'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    maxAge: 86400, // 24 hours
  });
  
  await app.listen(process.env.API_PORT || 3001);
}
bootstrap();
```

#### Environment Variables:
```bash
# .env.example
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://app.usdx-wexel.com,https://staging.usdx-wexel.com
```

#### Testing:
```bash
# Test from allowed origin
curl -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS http://localhost:3001/api/v1/pools

# Test from disallowed origin (should fail)
curl -H "Origin: http://malicious-site.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS http://localhost:3001/api/v1/pools
```

---

## Phase 2: Medium Priority Fixes (Days 3-4)

### 2.1 MEDIUM-01: Input Validation in Admin Endpoints
**Severity:** 🟡 MEDIUM  
**Estimated Time:** 0.5 days

#### Files to Modify:
```
apps/indexer/src/admin/dto/*.dto.ts
apps/indexer/src/admin/*.controller.ts
```

#### Implementation:
```typescript
// Update DTOs with comprehensive validation
import { IsNumber, IsString, Min, Max, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdatePoolDto {
  @IsNumber()
  @Min(0)
  @Max(10000)
  apy_base_bp: number;

  @IsNumber()
  @Min(1)
  @Max(36)
  lock_months: number;

  @IsNumber()
  @Min(0)
  min_deposit_usd: number;

  @IsNumber()
  @Min(0)
  @Max(10000)
  @IsOptional()
  boost_target_bp?: number;

  @IsNumber()
  @Min(0)
  @Max(2000)
  @IsOptional()
  boost_max_bp?: number;
}

export class ManualPriceUpdateDto {
  @IsString()
  @IsNotEmpty()
  mint: string;

  @IsNumber()
  @Min(0)
  price_usd: number;

  @IsString()
  @IsNotEmpty()
  reason: string; // Required for audit trail
}
```

#### Validation Pipe:
```typescript
// Ensure ValidationPipe is globally configured with these options:
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,           // Strip non-DTO properties
  forbidNonWhitelisted: true, // Throw error if extra properties
  transform: true,            // Auto-transform to DTO types
  transformOptions: {
    enableImplicitConversion: false, // Explicit conversion only
  },
  exceptionFactory: (errors) => {
    // Custom error formatting
    return new BadRequestException({
      statusCode: 400,
      message: 'Validation failed',
      errors: errors.map(error => ({
        field: error.property,
        constraints: error.constraints,
      })),
    });
  },
}));
```

---

### 2.2 MEDIUM-02: Replay Attack Prevention
**Severity:** 🟡 MEDIUM  
**Estimated Time:** 1 day

#### Implementation:
Add nonce-based replay attack prevention to wallet authentication.

#### Files to Modify:
```
apps/indexer/src/auth/auth.service.ts
apps/indexer/src/auth/entities/nonce.entity.ts
prisma/schema.prisma
```

#### Prisma Schema Addition:
```prisma
model Nonce {
  id        String   @id @default(cuid())
  address   String   @index
  nonce     String   @unique
  used      Boolean  @default(false)
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@index([address, used])
  @@index([expiresAt])
}
```

#### Service Implementation:
```typescript
export class AuthService {
  async generateNonce(address: string): Promise<string> {
    // Clean up expired nonces
    await this.prisma.nonce.deleteMany({
      where: { expiresAt: { lt: new Date() } }
    });
    
    const nonce = randomBytes(32).toString('hex');
    
    await this.prisma.nonce.create({
      data: {
        address,
        nonce,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      }
    });
    
    return nonce;
  }
  
  async verifyAndConsumeNonce(address: string, nonce: string): Promise<boolean> {
    const record = await this.prisma.nonce.findFirst({
      where: {
        address,
        nonce,
        used: false,
        expiresAt: { gt: new Date() }
      }
    });
    
    if (!record) {
      return false;
    }
    
    // Mark as used (one-time use)
    await this.prisma.nonce.update({
      where: { id: record.id },
      data: { used: true }
    });
    
    return true;
  }
}
```

#### API Flow:
```typescript
// 1. Client requests nonce
GET /auth/nonce?address=TXlaQ...
Response: { nonce: "abc123..." }

// 2. Client signs message with nonce
message = "Link wallet to USDX/Wexel - Nonce: abc123..."
signature = wallet.sign(message)

// 3. Client submits signature
POST /auth/wallets/link
Body: { address, signature, nonce }

// 4. Server verifies and consumes nonce
- Verify nonce exists and not used
- Verify signature matches
- Mark nonce as used
- Create wallet link
```

---

### 2.3 MEDIUM-03: Oracle Rate Limiting
**Severity:** 🟡 MEDIUM  
**Estimated Time:** 0.5 days

#### Implementation:
Add rate limiting specifically for oracle price update endpoints.

```typescript
// apps/indexer/src/oracle/oracle.controller.ts
import { Throttle } from '@nestjs/throttler';

@Controller('oracle')
export class OracleController {
  
  // Public price query - higher rate limit
  @Get('price')
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 per minute
  async getPrice(@Query('mint') mint: string) {
    // ...
  }
  
  // Manual price update - strict rate limit
  @Post('price/manual')
  @Throttle({ default: { limit: 5, ttl: 300000 } }) // 5 per 5 minutes
  @UseGuards(AdminGuard)
  async updatePriceManual(@Body() dto: ManualPriceUpdateDto) {
    // ...
  }
  
  // Refresh all prices - very strict
  @Post('refresh')
  @Throttle({ default: { limit: 1, ttl: 60000 } }) // 1 per minute
  @UseGuards(AdminGuard)
  async refreshAllPrices() {
    // ...
  }
}
```

---

### 2.4 MEDIUM-04: Weak JWT Secret
**Severity:** 🟡 MEDIUM  
**Estimated Time:** 0.5 days

#### Implementation:
1. Generate strong secrets for development and production
2. Update .env.example with warnings
3. Add validation in ConfigModule
4. Document secret generation process

```bash
# Generate strong secrets
openssl rand -base64 64

# .env.example
# WARNING: NEVER use this secret in production!
# Generate your own: openssl rand -base64 64
JWT_SECRET=REPLACE_WITH_STRONG_SECRET_IN_PRODUCTION
ADMIN_JWT_SECRET=REPLACE_WITH_DIFFERENT_STRONG_SECRET_IN_PRODUCTION

# Minimum length: 32 characters
# Include: uppercase, lowercase, numbers, special chars
# Rotate: every 90 days
```

#### Config Validation:
```typescript
// apps/indexer/src/config/configuration.ts
export default () => {
  const jwtSecret = process.env.JWT_SECRET;
  const adminJwtSecret = process.env.ADMIN_JWT_SECRET;
  
  // Validation
  if (process.env.NODE_ENV === 'production') {
    if (!jwtSecret || jwtSecret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters in production');
    }
    if (jwtSecret === adminJwtSecret) {
      throw new Error('ADMIN_JWT_SECRET must be different from JWT_SECRET');
    }
    if (jwtSecret.includes('example') || jwtSecret.includes('default')) {
      throw new Error('JWT_SECRET appears to be a default value - use a strong random secret');
    }
  }
  
  return {
    jwt: {
      secret: jwtSecret,
      expiresIn: '7d',
    },
    adminJwt: {
      secret: adminJwtSecret || jwtSecret,
      expiresIn: '1d',
    },
  };
};
```

---

## Phase 3: ESLint Cleanup (Day 4)

### 3.1 Fix Unused Variables
**Severity:** 🟢 LOW  
**Estimated Time:** 0.5 days

#### Files to Fix:
```
apps/webapp/src/hooks/useOracle.ts
apps/webapp/src/lib/api.ts
apps/webapp/src/providers/MultiWalletProvider.tsx
apps/webapp/src/providers/TronProvider.tsx
```

#### Implementation:
1. Remove unused imports
2. Prefix intentionally unused variables with underscore
3. Remove unused type definitions or export them if needed
4. Run `pnpm lint --fix` to auto-fix

```typescript
// Before:
const queryClient = useQueryClient();
const [isMounted, setIsMounted] = useState(false);
import TronWeb from 'tronweb';

// After:
// Remove if truly unused, or use it, or prefix with _
const _queryClient = useQueryClient(); // If needed for future
// Remove isMounted if not used
import type TronWeb from 'tronweb'; // If only used as type
```

---

## Testing Checklist

After all fixes are implemented, run this comprehensive test suite:

### Unit Tests:
```bash
cd /workspace
pnpm test --coverage
# Target: >80% coverage
```

### Linting:
```bash
pnpm lint
# Target: 0 errors, 0 warnings
```

### Build:
```bash
pnpm build
# Target: Success on all packages
```

### Integration Tests:
```bash
cd apps/indexer
pnpm test:e2e
# Target: All endpoints working
```

### Security Validation:
```bash
# Run security audit
npm audit --production
pnpm audit --production

# Check for vulnerable dependencies
pnpm outdated
```

### Manual Testing:
- [ ] Test Solana wallet connection and signature
- [ ] Test Tron wallet connection and signature
- [ ] Test deposit flow end-to-end
- [ ] Test boost application
- [ ] Test collateralization
- [ ] Test marketplace listing
- [ ] Test admin panel authentication
- [ ] Test admin pool management
- [ ] Test oracle price updates
- [ ] Test rate limiting (use tools like `ab` or `wrk`)

---

## Success Criteria

### Code Quality:
- [ ] All builds pass
- [ ] Zero ESLint errors
- [ ] Zero ESLint warnings
- [ ] Test coverage >80%
- [ ] All tests passing

### Security:
- [ ] All HIGH priority issues resolved
- [ ] All MEDIUM priority issues resolved
- [ ] Security audit documentation updated
- [ ] Penetration testing completed

### Functionality:
- [ ] All user flows working
- [ ] All admin functions working
- [ ] All API endpoints responding correctly
- [ ] WebSocket notifications working
- [ ] Real-time updates functioning

### Documentation:
- [ ] All fixes documented
- [ ] Security improvements noted
- [ ] API documentation updated
- [ ] Deployment guide reviewed

---

## Timeline

| Day | Tasks | Assignees | Status |
|-----|-------|-----------|--------|
| **Day 1** | Reentrancy guards, CORS config | Dev 1 | ⚠️ Pending |
| **Day 2** | Complete reentrancy, start Tron sig | Dev 1 | ⚠️ Pending |
| **Day 3** | Complete Tron sig, input validation | Dev 1 & 2 | ⚠️ Pending |
| **Day 4** | Replay prevention, rate limiting, cleanup | Dev 1 & 2 | ⚠️ Pending |
| **Day 5** | Testing, validation, documentation | Both | ⚠️ Pending |

---

## Dependencies

### Required:
- Solana development environment (Anchor)
- TronWeb library
- Access to staging database
- Test Solana wallets
- Test Tron wallets

### External:
- Tron RPC access (nile.trongrid.io)
- Solana RPC access (devnet)

---

## Rollback Plan

If any fix introduces breaking changes:

1. **Immediate Rollback:**
   ```bash
   git revert <commit-hash>
   git push
   ```

2. **Isolate Changes:**
   - Each fix should be in separate commit
   - Tag commits: `fix/HIGH-01`, `fix/HIGH-02`, etc.

3. **Alternative Approach:**
   - If fix is too complex, implement feature flag
   - Deploy with flag disabled
   - Enable after thorough testing

---

## Communication Plan

### Daily Standups:
- Progress update on each fix
- Blockers identification
- Risk assessment

### Completion Report:
- After all fixes complete
- Include: test results, performance impact, remaining risks
- Sign-off from team lead

---

## Next Steps After Completion

1. **Update Test Report:**
   - Re-run comprehensive testing
   - Update final_comprehensive_test_report.md
   - Document new security score

2. **Deploy to Staging:**
   - Follow deployment runbook
   - Monitor error rates
   - Validate all functionality

3. **External Audit:**
   - Package code for auditors
   - Provide documentation
   - Schedule audit kickoff

4. **Mainnet Preparation:**
   - Update mainnet deployment plan
   - Review launch checklist
   - Coordinate with operations team

---

**Document Owner:** Development Team Lead  
**Last Updated:** 2025-10-28  
**Review Frequency:** Daily during fix implementation  
**Status:** 🔴 IN PROGRESS

---

**IMPORTANT:** Do not skip any of these fixes. Each one addresses a real security or functionality issue that could compromise the platform or user funds.
