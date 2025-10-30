# 🚀 Инструкция по сборке и запуску проекта USDX/Wexel

## 📋 Требования

Для сборки и запуска проекта вам потребуется установить следующие инструменты:

### 1. Обязательные зависимости

- **Node.js** версии 18 или выше
  - Проверка: `node --version`
  - Скачать: https://nodejs.org/

- **pnpm** версии 9.5.0 или выше
  - Установка: `npm install -g pnpm@9.5.0`
  - Проверка: `pnpm --version`

- **Docker** и **Docker Compose**
  - Проверка: `docker --version` и `docker-compose --version`
  - Скачать: https://www.docker.com/products/docker-desktop

- **Git**
  - Проверка: `git --version`

### 2. Опциональные зависимости (для Solana контрактов)

- **Rust** и **Solana CLI** (если нужно деплоить контракты)
  - Установка: https://docs.solana.com/cli/install-solana-cli-tools

- **Anchor Framework** (для Solana контрактов)
  - Установка: https://www.anchor-lang.com/docs/installation

### 3. Опциональные утилиты

- **jq** (для работы скриптов деплоя)
  - Windows: использовать через WSL или Git Bash
  - Linux/Mac: `sudo apt-get install jq` или `brew install jq`

---

## 🔧 Шаги для запуска проекта

### Шаг 1: Установка зависимостей

```bash
# Установка зависимостей проекта
pnpm install
```

### Шаг 2: Настройка переменных окружения

Создайте файлы `.env` для локальной разработки.

#### Для Backend (apps/indexer)

Создайте файл `apps/indexer/.env`:

```env
# Database
DATABASE_URL=postgresql://usdx:usdxpassword@localhost:5432/usdx_wexel

# Redis
REDIS_URL=redis://localhost:6379

# Application
NODE_ENV=development
API_PORT=3001
CORS_ALLOWED_ORIGINS=http://localhost:3000

# JWT & Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
ADMIN_JWT_SECRET=your-admin-secret-different-from-jwt-secret

# Solana (можно оставить пустым для локальной разработки)
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_WEBSOCKET_URL=wss://api.devnet.solana.com
SOLANA_POOL_PROGRAM_ID=
SOLANA_WEXEL_NFT_PROGRAM_ID=
SOLANA_REWARDS_PROGRAM_ID=
SOLANA_COLLATERAL_PROGRAM_ID=
SOLANA_ORACLE_PROGRAM_ID=
SOLANA_MARKETPLACE_PROGRAM_ID=
SOLANA_BOOST_MINT_ADDRESS=

# Tron (можно оставить пустым для локальной разработки)
TRON_GRID_API_KEY=
TRON_NETWORK=nile
TRON_DEPOSIT_VAULT_ADDRESS=
TRON_PRICE_FEED_ADDRESS=
TRON_BRIDGE_PROXY_ADDRESS=
TRON_USDT_ADDRESS=TXlaQadyoKuR4C198dM8f3Mxe3zPPnt5p8

# Oracles (опционально)
PYTH_PRICE_FEED_ID=
CHAINLINK_PRICE_FEED_ADDRESS=
CEX_API_KEY=

# WalletConnect (опционально)
WALLETCONNECT_PROJECT_ID=

# Admin & Security (опционально)
ADMIN_MULTISIG_ADDRESS=
PAUSE_GUARDIAN_ADDRESS=
TIMELOCK_ADDRESS=

# KYC/AML (опционально)
KYC_PROVIDER_API_KEY=

# Notifications (опционально)
EMAIL_API_KEY=
SMS_API_KEY=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# Sentry (опционально)
SENTRY_DSN=
SENTRY_TRACES_SAMPLE_RATE=0.1
```

#### Для Frontend (apps/webapp)

Создайте файл `apps/webapp/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id
```

### Шаг 3: Запуск инфраструктуры (PostgreSQL и Redis)

```bash
# Запуск базы данных и Redis через Docker Compose
cd infra/local
docker-compose up -d

# Проверка, что контейнеры запущены
docker ps
```

Ожидаемый вывод: должны быть запущены контейнеры `db` (PostgreSQL) и `redis`.

### Шаг 4: Применение миграций базы данных

```bash
# Переход в директорию indexer
cd apps/indexer

# Генерация Prisma Client
pnpm prisma:generate

# Применение миграций базы данных
pnpm prisma:migrate:deploy

# Опционально: заполнение тестовыми данными
pnpm db:seed
```

### Шаг 5: Сборка проекта

```bash
# Возврат в корень проекта
cd ../..

# Сборка всех приложений
pnpm build
```

Или сборка по отдельности:

```bash
# Сборка backend
cd apps/indexer
pnpm build

# Сборка frontend
cd apps/webapp
pnpm build
```

### Шаг 6: Запуск приложений

#### Вариант A: Запуск в режиме разработки (рекомендуется для разработки)

**Терминал 1 - Backend:**
```bash
cd apps/indexer
pnpm start:dev
```

**Терминал 2 - Frontend:**
```bash
cd apps/webapp
pnpm dev
```

#### Вариант B: Запуск собранных приложений

**Терминал 1 - Backend:**
```bash
cd apps/indexer
pnpm start:prod
```

**Терминал 2 - Frontend:**
```bash
cd apps/webapp
pnpm start
```

### Шаг 7: Проверка работоспособности

После запуска откройте в браузере:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Backend Health Check**: http://localhost:3001/health
- **Prisma Studio** (для просмотра БД): `cd apps/indexer && pnpm prisma:studio`

---

## 🐳 Альтернативный способ: Запуск через Docker (Production-подобный)

Если вы хотите запустить проект в production-подобном режиме:

```bash
# Использование скрипта деплоя (для локальной разработки)
# Сначала создайте .env.production файл на основе примера
cp .env.production.example .env.production
# Отредактируйте .env.production

# Запуск деплоя
./deploy.sh --env production
```

Или вручную через Docker Compose:

```bash
# Запуск инфраструктуры
cd infra/local
docker-compose up -d

# Запуск приложений через Docker Compose production
cd ../../infra/production
docker-compose up -d
```

---

## 📝 Полезные команды

### Работа с базой данных

```bash
cd apps/indexer

# Генерация Prisma Client после изменения схемы
pnpm prisma:generate

# Создание новой миграции
pnpm prisma:migrate:dev --name migration_name

# Применение миграций
pnpm prisma:migrate:deploy

# Открытие Prisma Studio (GUI для БД)
pnpm prisma:studio

# Заполнение тестовыми данными
pnpm db:seed
```

### Разработка

```bash
# Линтинг всех проектов
pnpm lint

# Форматирование кода
pnpm format

# Запуск тестов
pnpm test

# Очистка node_modules
pnpm clean
```

### Проверка статуса

```bash
# Проверка работы backend
curl http://localhost:3001/health

# Проверка статуса Docker контейнеров
docker ps

# Просмотр логов
docker logs -f <container_name>
```

---

## ❗ Частые проблемы и решения

### Проблема: База данных не подключается

**Решение:**
```bash
# Проверьте, что PostgreSQL запущен
docker ps | grep postgres

# Если нет, запустите
cd infra/local
docker-compose up -d db

# Проверьте DATABASE_URL в .env файле
```

### Проблема: Ошибка при применении миграций

**Решение:**
```bash
cd apps/indexer

# Убедитесь, что Prisma Client сгенерирован
pnpm prisma:generate

# Попробуйте применить миграции снова
pnpm prisma:migrate:deploy

# Или сбросьте базу и примените заново (ВНИМАНИЕ: удалит данные!)
pnpm prisma:migrate:reset
```

### Проблема: Порт уже занят

**Решение:**
```bash
# Windows: найти процесс, использующий порт
netstat -ano | findstr :3001
netstat -ano | findstr :3000

# Linux/Mac: найти процесс
lsof -i :3001
lsof -i :3000

# Измените порты в .env файлах или остановите процесс
```

### Проблема: node_modules не устанавливаются

**Решение:**
```bash
# Убедитесь, что используется правильная версия pnpm
pnpm --version  # должно быть 9.5.0 или выше

# Очистите и переустановите
rm -rf node_modules
rm -rf apps/*/node_modules
pnpm install
```

### Проблема: Ошибки при сборке TypeScript

**Решение:**
```bash
# Проверьте версию TypeScript
pnpm list typescript

# Очистите и пересоберите
pnpm clean
pnpm install
pnpm build
```

---

## 🔐 Безопасность

⚠️ **ВАЖНО**: Перед деплоем в production обязательно:

1. Измените все секретные ключи (`JWT_SECRET`, `ADMIN_JWT_SECRET`, пароли БД)
2. Настройте CORS правильно (`CORS_ALLOWED_ORIGINS`)
3. Используйте сильные пароли для базы данных
4. Настройте SSL/TLS для production
5. Включите мониторинг и логирование (Sentry)

---

## 📚 Дополнительная документация

- **QUICK_DEPLOY.md** - Быстрый деплой
- **DEPLOY_README.md** - Подробное руководство по деплою
- **DEPLOYMENT_GUIDE.md** - Полное руководство по деплою
- **docs/PROJECT_STRUCTURE.md** - Структура проекта
- **apps/indexer/README.md** - Документация по backend
- **apps/webapp/README.md** - Документация по frontend (если есть)

---

## ✅ Чеклист готовности

Перед тем как начать работу, убедитесь что:

- [ ] Установлен Node.js (v18+)
- [ ] Установлен pnpm (v9.5.0+)
- [ ] Установлен Docker и Docker Compose
- [ ] Выполнена команда `pnpm install`
- [ ] Созданы файлы `.env` для backend и frontend
- [ ] Запущены PostgreSQL и Redis через Docker Compose
- [ ] Применены миграции базы данных
- [ ] Проект успешно собрался (`pnpm build`)

---

**Готово!** Теперь вы можете запускать проект локально. 🎉

Если возникнут проблемы, проверьте логи приложений и убедитесь, что все зависимости установлены правильно.



