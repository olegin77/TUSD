# Database Migrations Guide

## Overview

This document provides a quick reference for database migration workflows across all services in the USDX/Wexel platform.

## Quick Start

### First Time Setup

```bash
# 1. Start local database
cd infra/local
docker-compose up -d db redis

# 2. Configure environment
cp .env.example .env
# Edit .env and ensure DATABASE_URL is correct

# 3. Run migrations
cd apps/indexer
pnpm prisma:migrate:deploy
pnpm prisma:generate

# 4. Seed initial data
pnpm db:seed
```

### Daily Development

```bash
# Start database
docker-compose -f infra/local/docker-compose.yml up -d

# Run app (migrations run automatically)
cd apps/indexer
pnpm start:dev
```

## Common Tasks

### Creating a Migration

When you modify `apps/indexer/prisma/schema.prisma`:

```bash
cd apps/indexer

# Development: Create and apply migration
pnpm prisma:migrate:dev
# Enter migration name when prompted: "add_wexel_status_field"
```

This will:

1. Generate migration SQL
2. Apply to database
3. Regenerate Prisma Client
4. Update type definitions

### Applying Pending Migrations

For production/staging (non-interactive):

```bash
cd apps/indexer
pnpm prisma:migrate:deploy
```

### Viewing Database

```bash
cd apps/indexer

# Option 1: Prisma Studio (GUI)
pnpm prisma:studio
# Opens http://localhost:5555

# Option 2: psql CLI
docker exec -it usdx-wexel-db psql -U usdx -d usdx_wexel
```

### Resetting Database (Development Only)

⚠️ **WARNING**: Deletes all data!

```bash
cd apps/indexer
pnpm prisma migrate reset
# Confirms, then drops DB, recreates, applies migrations, runs seed
```

### Generating Types

After pulling changes that include migrations:

```bash
cd apps/indexer
pnpm prisma:generate
```

## Migration Workflow

### Feature Branch Workflow

1. **Create feature branch**

   ```bash
   git checkout -b feature/add-notifications
   ```

2. **Modify schema**

   ```prisma
   // apps/indexer/prisma/schema.prisma
   model User {
     // ... existing fields
     notifications_enabled Boolean @default(true)
   }
   ```

3. **Generate migration**

   ```bash
   cd apps/indexer
   pnpm prisma:migrate:dev
   # Name: "add_notifications_enabled"
   ```

4. **Test locally**

   ```bash
   pnpm start:dev
   # Verify application works
   ```

5. **Commit**

   ```bash
   git add prisma/
   git commit -m "feat(db): Add notifications_enabled field to users"
   ```

6. **Push and PR**
   ```bash
   git push origin feature/add-notifications
   # Create pull request
   ```

### Team Collaboration

When pulling teammate's migration:

```bash
# 1. Pull latest code
git pull origin tusd

# 2. Apply new migrations
cd apps/indexer
pnpm prisma:migrate:deploy

# 3. Regenerate client
pnpm prisma:generate

# 4. Restart dev server
pnpm start:dev
```

## Migration Patterns

### Adding Optional Field

✅ **Safe - No breaking changes**

```prisma
model User {
  // ... existing
  phone String?  // Optional field
}
```

```bash
pnpm prisma:migrate:dev
# Migration applies cleanly
```

### Adding Required Field

⚠️ **Requires data backfill**

**Step 1**: Add as optional

```prisma
model User {
  // ... existing
  status String?
}
```

```bash
pnpm prisma:migrate:dev --name add_status_optional
```

**Step 2**: Backfill data

```sql
-- Edit migration SQL to add:
UPDATE users SET status = 'active' WHERE status IS NULL;
```

**Step 3**: Make required (separate PR)

```prisma
model User {
  // ... existing
  status String @default("active")
}
```

```bash
pnpm prisma:migrate:dev --name make_status_required
```

### Renaming Column

**Step 1**: Add new column

```prisma
model Wexel {
  // ... existing
  // owner_address String  // Keep old
  owner_wallet String?     // Add new
}
```

**Step 2**: Migrate data

```sql
UPDATE wexels SET owner_wallet = owner_address;
```

**Step 3**: Update application code

```typescript
// Use owner_wallet instead of owner_address
```

**Step 4**: Remove old column

```prisma
model Wexel {
  // ... existing
  owner_wallet String
  // Removed: owner_address
}
```

### Adding Index

For performance:

```prisma
model Wexel {
  // ... fields

  @@index([owner_solana])  // Fast lookups
  @@index([pool_id, is_collateralized])  // Composite
}
```

```bash
pnpm prisma:migrate:dev --name add_wexel_indexes
```

Review generated SQL to ensure indexes are created:

```sql
CREATE INDEX "wexels_owner_solana_idx" ON "wexels"("owner_solana");
```

## CI/CD

### GitHub Actions

Migrations are automatically applied in CI:

```yaml
# .github/workflows/ci.yml
- name: Run migrations
  working-directory: apps/indexer
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
  run: |
    pnpm prisma:migrate:deploy
    pnpm prisma:generate
```

### Deployment

**Staging**:

```bash
# Automatic via CI/CD
# Migrations run before app deployment
```

**Production**:

```bash
# Manual approval required
# Review migration SQL before applying
# Run during maintenance window if needed
```

## Troubleshooting

### "Migration failed" Error

```bash
# Check status
cd apps/indexer
npx prisma migrate status

# Mark as applied if it actually succeeded
npx prisma migrate resolve --applied 20241215120000_migration_name

# Or mark as rolled back to retry
npx prisma migrate resolve --rolled-back 20241215120000_migration_name
```

### Schema Drift Warning

Database schema doesn't match `schema.prisma`:

```bash
# Pull actual DB schema (overwrites schema.prisma)
cd apps/indexer
npx prisma db pull

# Review changes
git diff prisma/schema.prisma

# If correct, commit
git add prisma/schema.prisma
git commit -m "fix(db): Sync schema with database"
```

### Prisma Client Out of Sync

```bash
cd apps/indexer
pnpm prisma:generate
```

### Cannot Connect to Database

```bash
# Check Docker containers
docker ps | grep postgres

# Check logs
docker logs usdx-wexel-db

# Restart database
docker-compose -f infra/local/docker-compose.yml restart db

# Test connection
cd apps/indexer
npx prisma db execute --stdin <<< "SELECT 1;"
```

### Seed Script Fails

```bash
# Check error message
pnpm db:seed

# Common fixes:
# 1. Ensure migrations are applied first
pnpm prisma:migrate:deploy

# 2. Check data constraints
# 3. Review seed.ts for errors
```

## Best Practices

### ✅ DO

- Run migrations locally before pushing
- Review generated SQL files
- Add indexes for frequently queried fields
- Use transactions for multi-step migrations
- Test rollback procedures
- Document breaking changes in commit messages
- Use `upsert` in seed scripts for idempotency

### ❌ DON'T

- Don't edit applied migration files
- Don't skip migrations (always sequential)
- Don't drop columns with data without backup
- Don't run `prisma migrate reset` in production
- Don't commit `.env` files
- Don't ignore schema drift warnings

## Resources

### Documentation

- [Prisma Migrate Docs](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Best Practices](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate)

### Project Files

- Schema: `apps/indexer/prisma/schema.prisma`
- Migrations: `apps/indexer/prisma/migrations/`
- Seed: `apps/indexer/prisma/seed.ts`
- Service: `apps/indexer/src/database/prisma.service.ts`
- Detailed Guide: `apps/indexer/prisma/README.md`

### Support

- Ask in team chat for migration questions
- Review PRs with `db:migration` label carefully
- Consult with backend lead for complex migrations
