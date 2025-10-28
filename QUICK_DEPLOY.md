# 🚀 Быстрый Деплой USDX/Wexel

## Минимальная инструкция для деплоя

### 1. Подготовка (один раз)

```bash
# Клонируем репозиторий
git clone https://github.com/your-org/usdx-wexel.git
cd usdx-wexel

# Устанавливаем зависимости (если еще не установлены)
sudo apt-get update
sudo apt-get install docker.io docker-compose git jq -y

# Даем права на выполнение скрипту
chmod +x deploy.sh
```

### 2. Конфигурация

```bash
# Копируем и редактируем настройки окружения
cp .env.production.example .env.production
nano .env.production

# ОБЯЗАТЕЛЬНО измените:
# - DATABASE_URL (замените пароль)
# - JWT_SECRET (сгенерируйте: openssl rand -base64 64)
# - ADMIN_JWT_SECRET (другой секрет)
# - SOLANA_POOL_PROGRAM_ID (ID развернутых контрактов)
# - POSTGRES_PASSWORD
```

### 3. Деплой Solana контрактов

```bash
cd contracts/solana/solana-contracts

# Собираем
anchor build

# Деплоим на devnet (для теста)
anchor deploy --provider.cluster devnet

# Или на mainnet (для продакшна)
anchor deploy --provider.cluster mainnet

# Копируем Program ID из вывода в .env.production
```

### 4. Запуск деплоя

```bash
# Возвращаемся в корень
cd /workspace

# Деплой на production
./deploy.sh --env production --tag v1.0.0

# Или на staging (devnet)
./deploy.sh --env staging
```

### 5. Проверка

```bash
# Проверяем здоровье сервисов
curl http://localhost:3001/health  # Backend
curl http://localhost:3000/        # Frontend

# Смотрим логи
docker logs -f usdx-indexer
docker logs -f usdx-webapp

# Статус контейнеров
docker ps
```

## Быстрые команды

```bash
# Полный деплой
./deploy.sh --env production --tag v1.0.0

# Деплой без тестов (быстрее)
./deploy.sh --env production --skip-tests

# Деплой без бэкапа (не рекомендуется!)
./deploy.sh --env production --skip-backup

# Staging деплой
./deploy.sh --env staging

# Откат на предыдущую версию
export IMAGE_TAG=v0.9.0
docker-compose -f infra/production/docker-compose.yml up -d

# Остановить все сервисы
docker-compose -f infra/production/docker-compose.yml down

# Перезапустить сервис
docker restart usdx-indexer
docker restart usdx-webapp

# Просмотр логов
docker logs -f usdx-indexer
docker logs -f --tail 100 usdx-webapp
```

## Типичные проблемы

### Проблема: База данных не подключается

```bash
# Проверяем, что БД запущена
docker ps | grep postgres

# Запускаем БД отдельно
docker-compose -f infra/local/docker-compose.yml up -d db

# Проверяем DATABASE_URL в .env.production
```

### Проблема: Миграции не применились

```bash
# Применяем миграции вручную
cd apps/indexer
pnpm prisma:migrate:deploy

# Или через Docker
docker run --rm --network host \
  -e DATABASE_URL="postgresql://user:pass@localhost:5432/db" \
  usdx-wexel-indexer:latest \
  sh -c "npx prisma migrate deploy"
```

### Проблема: Контейнер не запускается

```bash
# Смотрим логи
docker logs usdx-indexer

# Проверяем образ
docker images | grep usdx-wexel

# Пересобираем образ
docker build -t usdx-wexel-indexer:latest -f apps/indexer/Dockerfile .
```

## SSL (для production)

```bash
# Устанавливаем certbot
sudo apt-get install certbot python3-certbot-nginx

# Получаем сертификат
sudo certbot --nginx -d app.usdx-wexel.com -d api.usdx-wexel.com

# Авто-обновление (уже настроено)
sudo certbot renew --dry-run
```

## Мониторинг

```bash
# Запускаем стек мониторинга
cd infra/monitoring
docker-compose up -d

# Доступны по адресам:
# Grafana: http://your-server:3002 (admin/admin)
# Prometheus: http://your-server:9090
# Alertmanager: http://your-server:9093
```

## Полезные ссылки

- 📖 Полная документация: `DEPLOYMENT_GUIDE.md`
- 🔧 Операционные runbooks: `docs/ops/runbooks/`
- 📊 Статус проекта: `PROJECT_STATUS.md`
- 🔐 Безопасность: `docs/security/`

## Поддержка

Если что-то не работает:

1. Проверьте логи: `docker logs usdx-indexer`
2. Проверьте .env файл: `cat .env.production`
3. Посмотрите документацию: `DEPLOYMENT_GUIDE.md`
4. Напишите в поддержку: devops@usdx-wexel.com

---

**Версия**: 1.0.0  
**Дата**: 2025-10-28
