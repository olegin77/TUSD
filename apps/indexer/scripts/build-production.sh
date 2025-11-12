#!/bin/bash
set -e

echo "=== Production Build for Indexer ==="

cd "$(dirname "$0")/.."

# Чистка
echo "1. Cleaning..."
rm -rf dist node_modules/.prisma

# Генерация Prisma Client
echo "2. Generating Prisma Client..."
npx prisma generate

# Проверка
if [ ! -d "node_modules/.prisma/client" ]; then
  echo "❌ ERROR: Prisma client not generated!"
  exit 1
fi
echo "✓ Prisma Client generated"

# TypeScript компиляция БЕЗ тестов
echo "3. Building TypeScript (excluding tests)..."
npx nest build

# Проверка результата
if [ ! -f "dist/main.js" ]; then
  echo "❌ ERROR: Build failed - no main.js!"
  exit 1
fi

echo "✅ Build successful!"
ls -lh dist/main.js
