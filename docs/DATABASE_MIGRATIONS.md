# Database Migrations Guide

## Overview

This project uses Prisma for database migrations and schema management.

## Commands

### Development

```bash
# Create a new migration
cd apps/indexer
pnpm prisma:migrate:dev --name migration_name

# Apply migrations
pnpm prisma:migrate:dev

# Generate Prisma Client
pnpm prisma:generate

# Open Prisma Studio
pnpm prisma:studio
```

### Production

```bash
# Apply migrations (no dev features)
pnpm prisma:migrate:deploy

# Generate client
pnpm prisma:generate
```

## Migration Status

Current migrations:

- ✅ `20241201000000_init` - Initial schema with all tables

## Schema Overview

### Tables

- `pools` - Pool configurations (APY, lock periods)
- `users` - User accounts and KYC info
- `wexels` - NFT-векселя (NFT vouchers)
- `collateral` - Collateral positions (LTV 60%)
- `listings` - Marketplace listings
- `claims` - Reward claims
- `boosts` - Boost applications
- `deposits` - Deposit records
- `token_prices` - Price oracle cache
- `blockchain_events` - Event indexing

## Important Notes

1. Always create migrations in development before deploying to production
2. Test migrations on staging environment first
3. Backup database before applying migrations in production
4. Use `prisma:migrate:deploy` in CI/CD, not `prisma:migrate:dev`
