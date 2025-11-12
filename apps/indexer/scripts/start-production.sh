#!/bin/bash
set -e

cd "$(dirname "$0")/.."

# Проверка что собрано
if [ ! -f "dist/main.js" ]; then
  echo "❌ Build not found, building first..."
  ./scripts/build-production.sh
fi

# Миграции БД
echo "Running database migrations..."
npx prisma migrate deploy || echo "⚠️  Migration skipped (may need manual intervention)"

# Запуск в production
echo "Starting Indexer in PRODUCTION mode..."
NODE_ENV=production node dist/main.js
