# 🚀 Автоматический деплой на DigitalOcean

Этот скрипт автоматически создает дроплет на DigitalOcean, настраивает сервер и разворачивает проект USDX/Wexel.

## 📋 Требования

### Локальные зависимости

- **curl** - для работы с API
- **jq** - для обработки JSON
- **ssh** - для подключения к серверу
- **Git** - для клонирования репозитория (опционально, если используете --repo)

### DigitalOcean

- **API Token** - токен доступа к DigitalOcean API
  - Получить можно здесь: https://cloud.digitalocean.com/account/api/tokens
  - Минимальные права: `Read` и `Write`

- **SSH ключ** (опционально, но рекомендуется)
  - Добавьте ваш SSH ключ в DigitalOcean: https://cloud.digitalocean.com/account/security
  - Запишите ID ключа для использования в `--ssh-key`

## 🚀 Быстрый старт

### 1. Настройка API токена

**ВАЖНО:** Нужно получить API токен DigitalOcean и установить его:

```bash
# Получите токен здесь: https://cloud.digitalocean.com/account/api/tokens
# Затем установите:
export DO_API_TOKEN="your_api_token_here"
```

**Просто запустите скрипт:**

```bash
# Запуск с токеном (обязательно!)
export DO_API_TOKEN="your_api_token_here"
./scripts/deploy-do.sh

# Или через параметр:
./scripts/deploy-do.sh --token "your_api_token_here"

# С дополнительными параметрами:
./scripts/deploy-do.sh \
  --token "your_api_token_here" \
  --size "s-4vcpu-8gb" \
  --domain "app.usdx-wexel.com"
```

### 2. Полный пример с параметрами

```bash
./scripts/deploy-do.sh \
  --token "YOUR_DO_API_TOKEN" \
  --repo "https://github.com/your-org/usdx-wexel.git" \
  --branch "main" \
  --domain "app.usdx-wexel.com" \
  --size "s-4vcpu-8gb" \
  --region "nyc3" \
  --ssh-key "12345678" \
  --env "production"
```

## 📝 Параметры скрипта

### Обязательные параметры

- `--token TOKEN` или переменная `DO_API_TOKEN` - API токен DigitalOcean

### Опциональные параметры

- `--repo URL` - URL Git репозитория (если не указан, нужно будет клонировать вручную)
- `--branch BRANCH` - ветка для деплоя (по умолчанию: `main`)
- `--domain DOMAIN` - доменное имя (для настройки CORS и SSL)
- `--size SIZE` - размер дроплета (по умолчанию: `s-2vcpu-4gb`)
  - Рекомендуемые размеры:
    - Минимум: `s-2vcpu-4gb` (2 CPU, 4GB RAM) - для тестирования
    - Рекомендуется: `s-4vcpu-8gb` (4 CPU, 8GB RAM) - для production
    - Высокая нагрузка: `s-8vcpu-16gb` (8 CPU, 16GB RAM)
- `--region REGION` - регион дроплета (по умолчанию: `nyc3`)
  - Популярные регионы:
    - `nyc1`, `nyc3` - Нью-Йорк
    - `sfo3` - Сан-Франциско
    - `ams3` - Амстердам
    - `sgp1` - Сингапур
    - `fra1` - Франкфурт
- `--ssh-key ID` - ID SSH ключа в DigitalOcean (для безопасного доступа)
- `--env ENV` - окружение деплоя (по умолчанию: `production`)

## 🔧 Что делает скрипт

1. **Проверка зависимостей** - проверяет наличие необходимых инструментов локально
2. **Проверка API токена** - валидирует токен DigitalOcean
3. **Создание дроплета** - создает новый сервер на DigitalOcean
4. **Ожидание активации** - ждет пока дроплет станет активным и получит IP адрес
5. **Настройка сервера** - устанавливает:
   - Docker и Docker Compose
   - Node.js и pnpm
   - Необходимые системные пакеты
   - Настраивает firewall
6. **Деплой приложения** - если указан `--repo`:
   - Клонирует репозиторий
   - Устанавливает зависимости
   - Создает `.env` файл
   - Запускает инфраструктуру (PostgreSQL, Redis)
   - Применяет миграции БД
   - Запускает приложение через `deploy.sh`

## 📊 Размеры дроплетов и стоимость

| Размер | CPU | RAM | Диск | ~Стоимость/мес |
|--------|-----|-----|------|----------------|
| s-2vcpu-4gb | 2 | 4GB | 80GB | $24 |
| s-4vcpu-8gb | 4 | 8GB | 160GB | $48 |
| s-8vcpu-16gb | 8 | 16GB | 320GB | $96 |

*Цены актуальны на момент написания, проверьте актуальные цены на сайте DigitalOcean*

## 🔐 Настройка SSH ключа

Рекомендуется добавить SSH ключ в DigitalOcean для безопасного доступа:

```bash
# 1. Проверьте наличие SSH ключа
ls -la ~/.ssh/id_rsa.pub

# Если нет, создайте:
ssh-keygen -t rsa -b 4096

# 2. Добавьте ключ в DigitalOcean через веб-интерфейс:
# https://cloud.digitalocean.com/account/security

# Или через API:
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DO_API_TOKEN" \
  -d '{
    "name": "My SSH Key",
    "public_key": "'"$(cat ~/.ssh/id_rsa.pub)"'"
  }' \
  "https://api.digitalocean.com/v2/account/keys"

# 3. Получите ID ключа:
curl -X GET \
  -H "Authorization: Bearer $DO_API_TOKEN" \
  "https://api.digitalocean.com/v2/account/keys" | jq '.ssh_keys[] | {id, name, fingerprint}'

# 4. Используйте ID в скрипте:
./scripts/deploy-do.sh --ssh-key "12345678" ...
```

## 📝 После деплоя

### 1. Подключитесь к серверу

```bash
# IP адрес будет показан в конце выполнения скрипта
# Также сохранен в файле: do_deployment_info.txt

ssh root@YOUR_IP_ADDRESS
```

### 2. Настройте переменные окружения

```bash
# Отредактируйте файл .env.production
cd /opt/usdx-wexel
nano .env.production

# ВАЖНО: Измените:
# - DATABASE_URL (пароль БД)
# - JWT_SECRET (сгенерируйте новый)
# - ADMIN_JWT_SECRET (другой секрет)
# - SOLANA_POOL_PROGRAM_ID (если контракты уже развернуты)
# - Другие значения по необходимости
```

### 3. Настройте домен (если используется)

```bash
# Установите DNS записи для вашего домена:
# A запись: @ -> YOUR_IP_ADDRESS
# A запись: api -> YOUR_IP_ADDRESS (если отдельный поддомен для API)

# На сервере установите SSL:
certbot --nginx -d app.usdx-wexel.com -d api.usdx-wexel.com
```

### 4. Проверьте статус

```bash
# На сервере проверьте статус контейнеров:
docker ps

# Проверьте логи:
docker logs usdx-indexer
docker logs usdx-webapp

# Проверьте health endpoints:
curl http://localhost:3001/health
curl http://localhost:3000
```

## 🔄 Обновление приложения

После изменений в коде, обновите приложение на сервере:

```bash
# Подключитесь к серверу
ssh root@YOUR_IP_ADDRESS

# Перейдите в директорию проекта
cd /opt/usdx-wexel

# Обновите код
git pull origin main

# Перезапустите приложение
./deploy.sh --env production
```

## 🗑️ Удаление дроплета

Если нужно удалить созданный дроплет:

```bash
# Используйте ID из файла do_deployment_info.txt
export DROPLET_ID="123456789"

# Удалите дроплет через API
curl -X DELETE \
  -H "Authorization: Bearer $DO_API_TOKEN" \
  "https://api.digitalocean.com/v2/droplets/$DROPLET_ID"

# Или через веб-интерфейс:
# https://cloud.digitalocean.com/droplets
```

## ⚠️ Troubleshooting

### Проблема: Скрипт не может подключиться по SSH

**Решение:**
```bash
# Проверьте, что дроплет активен и имеет IP
curl -X GET \
  -H "Authorization: Bearer $DO_API_TOKEN" \
  "https://api.digitalocean.com/v2/droplets/$DROPLET_ID" | jq '.droplet.status'

# Подождите немного дольше (дроплет может еще настраиваться)
# Попробуйте подключиться вручную:
ssh root@YOUR_IP_ADDRESS
```

### Проблема: Ошибка при клонировании репозитория

**Решение:**
```bash
# Убедитесь что URL репозитория правильный и доступен
# Если репозиторий приватный, добавьте SSH ключ в GitHub/GitLab

# Или клонируйте вручную на сервере:
ssh root@YOUR_IP_ADDRESS
cd /opt/usdx-wexel
git clone https://github.com/your-org/usdx-wexel.git .
```

### Проблема: Порт уже занят

**Решение:**
```bash
# На сервере проверьте что порты свободны:
netstat -tuln | grep -E ':(3000|3001|5432|6379)'

# Остановите контейнеры если нужно:
cd /opt/usdx-wexel/infra/local
docker-compose down
```

### Проблема: База данных не подключается

**Решение:**
```bash
# Проверьте что PostgreSQL запущен:
docker ps | grep postgres

# Проверьте DATABASE_URL в .env файле
# Убедитесь что пароль совпадает в DATABASE_URL и docker-compose.yml
```

## 📚 Дополнительные ресурсы

- [DigitalOcean API Documentation](https://docs.digitalocean.com/reference/api/api-reference/)
- [Docker Installation Guide](https://docs.docker.com/engine/install/)
- [Setup Guide (SETUP_RU.md)](SETUP_RU.md)
- [Deployment Guide (DEPLOYMENT_GUIDE.md)](DEPLOYMENT_GUIDE.md)

## ✅ Чеклист перед деплоем

- [ ] Получен API токен DigitalOcean
- [ ] Добавлен SSH ключ в DigitalOcean (рекомендуется)
- [ ] Указан URL репозитория (если используется автоматический деплой)
- [ ] Выбраны размер и регион дроплета
- [ ] Подготовлены переменные окружения для `.env.production`
- [ ] Solana контракты развернуты (если нужно)
- [ ] Настроен домен и DNS (если используется)

---

**Готово!** Теперь вы можете автоматически развернуть проект на DigitalOcean! 🎉

Если возникнут проблемы, проверьте логи скрипта или подключитесь к серверу и проверьте статус вручную.

