# Database Schema & Migrations

This directory contains the Prisma schema, migrations, and database utilities for the USDX/Wexel indexer backend.

## Overview

We use **Prisma** as our ORM to manage the PostgreSQL database. Prisma provides:
- Type-safe database client
- Automatic migrations
- Schema introspection
- Query optimization

## Schema Overview

### Core Models

**Pools** - Liquidity pool configurations
- APY settings (base and boost)
- Lock period (12-36 months)
- Minimum deposit requirements
- Active status

**Wexels** - NFT-backed promissory notes
- Owner addresses (Solana/Tron)
- Principal amount and APY
- Collateral status
- Claim tracking

**Users** - User profiles
- Multi-chain addresses (Solana, Tron)
- KYC status
- Contact information

**CollateralPosition** - Loan positions
- Loan amount (60% LTV)
- Repayment status
- Timestamps

**Listings** - Marketplace entries
- Ask price
- Auction settings
- Status tracking

**Claims** - Reward distributions
- Claim amounts and types
- Transaction hashes

**Boosts** - Boost token applications
- Token mint addresses
- USD values
- APY boost calculations

**Deposits** - Deposit transactions
- User addresses
- Amounts and status
- Transaction tracking

**TokenPrice** - Oracle price cache
- Token mint → USD price
- Price sources (Pyth, Chainlink, DEX, CEX)
- Last update timestamp

**BlockchainEvent** - Event indexing
- Chain (Solana/Tron)
- Event types
- Processing status

## Database Setup

### Prerequisites

- PostgreSQL 14+ running
- Node.js 20+
- pnpm installed

### Initial Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp ../../.env.example ../../.env
# Edit .env and set DATABASE_URL

# 3. Run migrations
pnpm prisma:migrate:deploy

# 4. Generate Prisma Client
pnpm prisma:generate

# 5. (Optional) Seed initial data
pnpm db:seed
```

## Working with Migrations

### Creating a New Migration

When you modify `schema.prisma`, create a migration:

```bash
# Development: Interactive migration
pnpm prisma:migrate:dev

# This will:
# 1. Prompt for a migration name
# 2. Generate SQL migration file
# 3. Apply migration to database
# 4. Regenerate Prisma Client
```

Example:
```bash
pnpm prisma:migrate:dev
# Enter migration name: add_user_preferences
```

### Deploying Migrations

For production/staging environments:

```bash
# Apply pending migrations (non-interactive)
pnpm prisma:migrate:deploy
```

This command:
- Runs all pending migrations
- Does NOT generate new migrations
- Safe for CI/CD pipelines

### Resetting Database

⚠️ **CAUTION**: This will delete all data!

```bash
# Development only: Reset database and reseed
pnpm prisma migrate reset

# This will:
# 1. Drop database
# 2. Recreate database
# 3. Apply all migrations
# 4. Run seed script
```

### Viewing Current Schema

```bash
# Launch Prisma Studio (GUI)
pnpm prisma:studio

# Opens http://localhost:5555
```

## Migration Best Practices

### 1. Always Test Migrations Locally

```bash
# Create migration locally
pnpm prisma:migrate:dev

# Test the migration
pnpm start:dev

# Verify data integrity
pnpm prisma:studio
```

### 2. Review Generated SQL

Always review the generated SQL before committing:

```bash
# Migration files are in:
prisma/migrations/TIMESTAMP_migration_name/migration.sql
```

Check for:
- Data loss operations (DROP, DELETE)
- Index additions for performance
- Constraint changes
- Default values

### 3. Backward Compatibility

When possible, make schema changes backward compatible:

**Good**: Add nullable column
```prisma
model User {
  // ...existing fields
  phone String?  // Optional, won't break existing code
}
```

**Bad**: Add required column
```prisma
model User {
  // ...existing fields
  phone String  // Required! Will break if not handled
}
```

If you must add a required field:
1. Add as optional first
2. Backfill data
3. Make required in separate migration

### 4. Handle Data Migrations

For complex schema changes requiring data transformation:

```bash
# 1. Create schema migration
pnpm prisma:migrate:dev --create-only

# 2. Edit generated migration.sql to add data transformation
# Example: Update existing records

# 3. Apply migration
pnpm prisma:migrate:dev
```

### 5. Document Breaking Changes

If a migration requires code changes, document it in commit message:

```
feat(db): Add user preferences table

BREAKING CHANGE: User model now requires `preferences` relation.
Update all queries to include preferences when needed.

Migration: 20241215120000_add_user_preferences
```

## Seeding Data

### Running Seed

```bash
# Run seed script
pnpm db:seed
```

The seed script (`seed.ts`) populates:
- Initial pools (5 pools with different APY and lock periods)
- Test user (development only)

### Customizing Seed Data

Edit `prisma/seed.ts` to add more initial data:

```typescript
// Add custom seed logic
const customData = await prisma.model.create({
  data: { /* ... */ }
});
```

### Seed Best Practices

1. **Use upsert** for idempotency
2. **Environment checks** for dev-only data
3. **Error handling** with transactions
4. **Logging** for visibility

## Schema Maintenance

### Adding a New Model

1. Define model in `schema.prisma`:
```prisma
model NewModel {
  id         BigInt   @id @default(autoincrement())
  field1     String
  field2     Int
  created_at DateTime @default(now())
  
  @@map("new_models")
}
```

2. Create migration:
```bash
pnpm prisma:migrate:dev
```

3. Use in code:
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const record = await prisma.newModel.create({
  data: { field1: 'value', field2: 123 }
});
```

### Modifying Existing Model

1. Update model in `schema.prisma`
2. Generate migration:
```bash
pnpm prisma:migrate:dev
```

3. Review generated SQL
4. Test locally
5. Commit migration

### Adding Indexes

For performance optimization:

```prisma
model Wexel {
  // ... fields
  
  @@index([owner_solana])  // Index for fast lookups
  @@index([pool_id, created_at])  // Composite index
}
```

Then run:
```bash
pnpm prisma:migrate:dev
```

## Troubleshooting

### Migration Failed

If a migration fails mid-execution:

```bash
# 1. Check migration status
npx prisma migrate status

# 2. Resolve failed migration
npx prisma migrate resolve --applied 20241215120000_migration_name

# OR mark as rolled back
npx prisma migrate resolve --rolled-back 20241215120000_migration_name

# 3. Fix schema and retry
pnpm prisma:migrate:dev
```

### Schema Drift

If database schema doesn't match `schema.prisma`:

```bash
# Check for drift
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource prisma/schema.prisma

# Pull current database schema
npx prisma db pull

# This overwrites schema.prisma with actual DB schema
```

### Connection Issues

```bash
# Test database connection
npx prisma db execute --stdin <<< "SELECT 1;"

# Check environment variable
echo $DATABASE_URL
```

### Prisma Client Out of Sync

If you see "Prisma Client out of sync" error:

```bash
# Regenerate Prisma Client
pnpm prisma:generate
```

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run migrations
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
  run: |
    pnpm prisma:migrate:deploy
    pnpm prisma:generate
```

### Docker Container

```dockerfile
# In Dockerfile
RUN pnpm prisma:generate
CMD pnpm prisma:migrate:deploy && pnpm start:prod
```

## Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Migrate Reference](https://www.prisma.io/docs/reference/api-reference/command-reference#migrate)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Don't_Do_This)
