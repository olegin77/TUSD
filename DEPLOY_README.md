# 🚀 USDX/Wexel - Быстрый Старт Деплоя

## Созданные Файлы

### Docker
- ✅ `apps/indexer/Dockerfile` - Backend (NestJS)
- ✅ `apps/webapp/Dockerfile` - Frontend (Next.js)
- ✅ `apps/indexer/.dockerignore`
- ✅ `apps/webapp/.dockerignore`

### Деплой
- ✅ `deploy.sh` - **Главный скрипт автоматического деплоя**
- ✅ `.env.production.example` - Шаблон для production
- ✅ `.env.staging.example` - Шаблон для staging

### Документация
- ✅ `DEPLOYMENT_GUIDE.md` - Полное руководство (500+ строк)
- ✅ `QUICK_DEPLOY.md` - Краткая инструкция
- ✅ `DEPLOYMENT_AUTOMATION_REPORT.md` - Отчет о проделанной работе

---

## ⚡ Быстрый Запуск

### 1. Подготовка (один раз)

```bash
# Клонируем репозиторий
git clone https://github.com/your-org/usdx-wexel.git
cd usdx-wexel

# Даем права на выполнение
chmod +x deploy.sh

# Копируем и настраиваем .env
cp .env.production.example .env.production
nano .env.production
```

### 2. Важные переменные в .env.production

```bash
# ОБЯЗАТЕЛЬНО измените:
DATABASE_URL=postgresql://usdx:YOUR_PASSWORD@postgres:5432/usdx_wexel
JWT_SECRET=$(openssl rand -base64 64)
ADMIN_JWT_SECRET=$(openssl rand -base64 64)  # Другой!
POSTGRES_PASSWORD=YOUR_STRONG_PASSWORD

# После деплоя Solana контрактов:
SOLANA_POOL_PROGRAM_ID=<ваш program ID>
SOLANA_WEXEL_NFT_PROGRAM_ID=<ваш program ID>
SOLANA_REWARDS_PROGRAM_ID=<ваш program ID>
SOLANA_COLLATERAL_PROGRAM_ID=<ваш program ID>
SOLANA_ORACLE_PROGRAM_ID=<ваш program ID>
SOLANA_MARKETPLACE_PROGRAM_ID=<ваш program ID>
```

### 3. Деплой Solana Контрактов

```bash
cd contracts/solana/solana-contracts

# Собираем
anchor build

# Деплоим на devnet (для теста)
anchor deploy --provider.cluster devnet

# ИЛИ на mainnet (для продакшна)
anchor deploy --provider.cluster mainnet

# Копируем Program IDs в .env.production
```

### 4. Запуск Автоматического Деплоя

```bash
# Возвращаемся в корень
cd /workspace

# 🚀 ПОЛНЫЙ ДЕПЛОЙ НА PRODUCTION
./deploy.sh --env production --tag v1.0.0

# Или на staging (devnet)
./deploy.sh --env staging

# Быстрый деплой без тестов
./deploy.sh --env production --skip-tests
```

### 5. Проверка

```bash
# Проверяем здоровье сервисов
curl http://localhost:3001/health  # Backend
curl http://localhost:3000/        # Frontend

# Смотрим статус
docker ps

# Логи
docker logs -f usdx-indexer
docker logs -f usdx-webapp
```

---

## 📋 Основные Команды

```bash
# Полный деплой
./deploy.sh --env production --tag v1.0.0

# Деплой без тестов (быстрее)
./deploy.sh --env production --skip-tests

# Staging деплой
./deploy.sh --env staging

# Просмотр справки
./deploy.sh --help

# Остановить все
docker-compose -f infra/production/docker-compose.yml down

# Перезапустить сервис
docker restart usdx-indexer
docker restart usdx-webapp

# Логи
docker logs -f usdx-indexer
docker logs --tail 100 usdx-webapp
```

---

## 🔧 Что Делает Скрипт deploy.sh

1. ✅ Проверяет зависимости (Docker, Git, jq)
2. ✅ Валидирует .env файл
3. ✅ Создает backup базы данных
4. ✅ Собирает Docker образы
5. ✅ Запускает тесты (опционально)
6. ✅ Применяет миграции БД
7. ✅ Деплоит сервисы
8. ✅ Проверяет health checks
9. ✅ Очищает старые образы
10. ✅ Откатывает изменения при ошибке

---

## 📚 Документация

- **QUICK_DEPLOY.md** - Быстрый старт с минимальными шагами
- **DEPLOYMENT_GUIDE.md** - Полное руководство с troubleshooting
- **DEPLOYMENT_AUTOMATION_REPORT.md** - Детальный отчет о реализации

---

## 🆘 Помощь

### Проблема: База данных не подключается

```bash
# Проверяем, что БД запущена
docker ps | grep postgres

# Запускаем БД
docker-compose -f infra/local/docker-compose.yml up -d db

# Проверяем DATABASE_URL в .env
```

### Проблема: Контейнер не запускается

```bash
# Смотрим логи
docker logs usdx-indexer

# Пересобираем образ
docker build -t usdx-wexel-indexer:latest -f apps/indexer/Dockerfile .
```

### Проблема: Миграции не применились

```bash
# Применяем вручную
cd apps/indexer
pnpm prisma:migrate:deploy
```

---

## ✅ Готово!

Теперь у вас есть:
- 🐳 Production-ready Docker образы
- 🚀 Автоматический deployment script
- 📖 Полная документация
- 🔧 Готовая конфигурация для staging и production

**Платформа готова к деплою!** 🎉

---

**Версия**: 1.0.0  
**Дата**: 2025-10-28  
**Статус**: ✅ Ready to Deploy
