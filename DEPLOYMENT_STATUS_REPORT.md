# 📊 Отчет о деплое проекта USDX/Wexel на DigitalOcean

## 📌 Краткая сводка

**Дата:** 29 октября 2025  
**Дроплет IP:** 134.209.173.236  
**Droplet ID:** 527022765  
**Регион:** NYC3 (New York 3)  
**Размер:** s-2vcpu-4gb (2 CPU, 4GB RAM)  
**Статус:** ⚠️ **ЧАСТИЧНО ВЫПОЛНЕН** - требует сборки и запуска приложений

**SSH доступ:**
```bash
ssh -i ~/.ssh/id_rsa_do_deploy_usdx-wexel root@134.209.173.236
```

**Критические проблемы:**
1. ❌ Backend не собран (`pnpm build` не выполнен)
2. ❌ Frontend не собран (`pnpm build` не выполнен)  
3. ❌ Firewall блокирует порты 3000 и 3001
4. ❌ Приложения не запущены

**Что работает:**
- ✅ Дроплет создан и настроен
- ✅ PostgreSQL и Redis запущены
- ✅ База данных настроена
- ✅ Репозиторий клонирован

---

## ✅ Выполненные работы

### 1. Создание и настройка дроплета
- ✅ **Дроплет создан** через DigitalOcean API
- ✅ **SSH ключ сгенерирован** и добавлен в DigitalOcean (ID: 51662735)
  - Приватный ключ: `/home/noda/.ssh/id_rsa_do_deploy_usdx-wexel`
  - Публичный ключ: `/home/noda/.ssh/id_rsa_do_deploy_usdx-wexel.pub`
- ✅ **SSH подключение работает**
- ✅ **Сервер настроен:**
  - Ubuntu 22.04 LTS
  - Docker 28.2.2 установлен и запущен
  - Docker Compose установлен
  - Node.js 20.19.5 установлен
  - pnpm 9.5.0 установлен
  - PostgreSQL client установлен
  - Nginx установлен (для будущего SSL)
  - Firewall настроен (порты 22, 80, 443 открыты)

### 2. Репозиторий и зависимости
- ✅ **Репозиторий клонирован:** `https://github.com/olegin77/TUSD`
  - Локальный путь: `/opt/usdx-wexel`
  - Ветка: `main`
- ✅ **Зависимости установлены:** `pnpm install` выполнен успешно

### 3. Инфраструктура (Docker)
- ✅ **PostgreSQL запущен:**
  - Контейнер: `local_db_1`
  - Порт: 5432
  - База данных: `usdx_wexel`
  - Пользователь: `usdx`
  - Пароль: `usdxpassword`
  - DATABASE_URL: `postgresql://usdx:usdxpassword@localhost:5432/usdx_wexel`
  
- ✅ **Redis запущен:**
  - Контейнер: `local_redis_1`
  - Порт: 6379
  - REDIS_URL: `redis://localhost:6379`

### 4. База данных
- ✅ **Prisma Client сгенерирован**
- ✅ **Миграции применены:**
  - `20241028_tron_tables` - применена
  - `20241201000000_init` - применена
- ✅ **База данных готова к использованию**

### 5. Конфигурация
- ✅ **Файл `.env.production` создан** в `/opt/usdx-wexel/`
- ✅ **Переменные окружения настроены:**
  ```env
  DATABASE_URL=postgresql://usdx:usdxpassword@localhost:5432/usdx_wexel
  REDIS_URL=redis://localhost:6379
  NODE_ENV=production
  API_PORT=3001
  CORS_ALLOWED_ORIGINS=http://localhost:3000,http://134.209.173.236:3000
  JWT_SECRET=<сгенерирован>
  ADMIN_JWT_SECRET=<сгенерирован>
  JWT_EXPIRES_IN=7d
  SOLANA_RPC_URL=https://api.devnet.solana.com
  SOLANA_WEBSOCKET_URL=wss://api.devnet.solana.com
  ```

### 6. Приложение
- ❌ **Backend (NestJS)**: НЕ ЗАПУЩЕН - ошибка сборки
  - Команда запуска: `pnpm start:prod`
  - Логи: `/tmp/indexer.log`
  - Порт: 3001
  - **ОШИБКА:** `Cannot find module '/opt/usdx-wexel/apps/indexer/dist/main'`
  - **ПРИЧИНА:** Проект не собран (отсутствует команда `pnpm build`)
  
- ❌ **Frontend (Next.js)**: НЕ ЗАПУЩЕН - ошибка сборки
  - Команда запуска: `pnpm start`
  - Логи: `/tmp/webapp.log`
  - Порт: 3000
  - **ОШИБКА:** `Could not find a production build in the '.next' directory`
  - **ПРИЧИНА:** Проект не собран (отсутствует команда `pnpm build`)

---

## ❌ Проблемы

### 1. ❗ КРИТИЧНО: Приложения не собраны

**Backend ошибка:**
```
Error: Cannot find module '/opt/usdx-wexel/apps/indexer/dist/main'
```
**Причина:** Отсутствует сборка проекта. Нужно выполнить `pnpm build` в `/opt/usdx-wexel/apps/indexer/`

**Frontend ошибка:**
```
Error: Could not find a production build in the '.next' directory. 
Try building your app with 'next build' before starting the production server.
```
**Причина:** Отсутствует сборка проекта. Нужно выполнить `pnpm build` в `/opt/usdx-wexel/apps/webapp/`

### 2. Firewall блокирует порты 3000 и 3001

**Текущий статус firewall:**
```
Status: active
- 22/tcp   ALLOW
- 80/tcp   ALLOW
- 443/tcp  ALLOW
- 3000/tcp БЛОКИРОВАН ❌
- 3001/tcp БЛОКИРОВАН ❌
```

**Решение:**
```bash
ufw allow 3000/tcp
ufw allow 3001/tcp
ufw reload
```

### 3. Приложения не запущены

**Текущий статус:** Процессы Node.js не запущены (упали из-за ошибок сборки)

**Решение:** После сборки запустить заново

### 4. Отсутствует Nginx reverse proxy
- Nginx установлен, но не настроен
- Нет конфигурации для проксирования запросов на backend/frontend

---

## 📋 Что нужно сделать дальше

### Приоритет 1: 🔴 КРИТИЧНО - Собрать и запустить приложения

1. **Подключиться к серверу:**
   ```bash
   ssh -i ~/.ssh/id_rsa_do_deploy_usdx-wexel root@134.209.173.236
   cd /opt/usdx-wexel
   ```

2. **Собрать Backend:**
   ```bash
   cd apps/indexer
   pnpm build
   # Проверить что появилась папка dist/
   ls -la dist/
   ```

3. **Собрать Frontend:**
   ```bash
   cd /opt/usdx-wexel/apps/webapp
   export NEXT_PUBLIC_API_URL="http://134.209.173.236:3001"
   pnpm build
   # Проверить что появилась папка .next/
   ls -la .next/
   ```

4. **Открыть порты в firewall:**
   ```bash
   ufw allow 3000/tcp
   ufw allow 3001/tcp
   ufw reload
   ufw status  # Проверить что порты открыты
   ```

5. **Запустить Backend:**
   ```bash
   cd /opt/usdx-wexel/apps/indexer
   source /opt/usdx-wexel/.env.production
   # Или вручную:
   export DATABASE_URL="postgresql://usdx:usdxpassword@localhost:5432/usdx_wexel"
   export REDIS_URL="redis://localhost:6379"
   export NODE_ENV="production"
   export API_PORT="3001"
   export CORS_ALLOWED_ORIGINS="http://localhost:3000,http://134.209.173.236:3000"
   # Запустить в фоне или через screen/tmux:
   nohup pnpm start:prod > /tmp/indexer.log 2>&1 &
   # Или в screen:
   screen -S backend
   pnpm start:prod
   # Отключиться: Ctrl+A затем D
   ```

6. **Запустить Frontend:**
   ```bash
   cd /opt/usdx-wexel/apps/webapp
   export NEXT_PUBLIC_API_URL="http://134.209.173.236:3001"
   # Запустить в фоне или через screen/tmux:
   nohup pnpm start > /tmp/webapp.log 2>&1 &
   # Или в screen:
   screen -S frontend
   pnpm start
   # Отключиться: Ctrl+A затем D
   ```

7. **Проверить что сервисы запущены:**
   ```bash
   ps aux | grep node
   ss -tuln | grep -E ":(3000|3001)"
   curl http://localhost:3001/health
   curl http://localhost:3000
   ```

8. **Проверить доступность извне:**
   ```bash
   # С локального компьютера:
   curl http://134.209.173.236:3001/health
   curl http://134.209.173.236:3000
   ```

### Приоритет 2: Настройка Nginx (опционально)

1. Создать конфигурацию Nginx для проксирования запросов
2. Настроить SSL (Let's Encrypt)
3. Настроить доменное имя (если есть)

### Приоритет 3: Настройка как системных сервисов

1. Создать systemd service для backend
2. Создать systemd service для frontend
3. Настроить автозапуск при перезагрузке

---

## 🔑 Доступ к серверу

**SSH подключение:**
```bash
ssh -i ~/.ssh/id_rsa_do_deploy_usdx-wexel root@134.209.173.236
```

**Ключевые пути:**
- Проект: `/opt/usdx-wexel`
- Backend: `/opt/usdx-wexel/apps/indexer`
- Frontend: `/opt/usdx-wexel/apps/webapp`
- Логи backend: `/tmp/indexer.log`
- Логи frontend: `/tmp/webapp.log`
- Конфигурация: `/opt/usdx-wexel/.env.production`

---

## 📝 API токены и ключи

**DigitalOcean API Token:**
- Токен: `<удален из отчета для безопасности>`
- Аккаунт: `ole-savelev@ya.ru`
- Примечание: Токен должен храниться только в переменных окружения или зашифрованном хранилище

**SSH ключ в DigitalOcean:**
- ID: `51662735`
- Fingerprint: `SHA256:xlRffAf/mqUudjUAY+CsN50G5NPSwYm3IGbjfN0eAms`

---

## 🔍 Команды для диагностики

```bash
# Проверка статуса процессов
ps aux | grep node

# Проверка портов
netstat -tuln | grep -E ":(3000|3001)"

# Проверка Docker контейнеров
docker ps
docker logs local_db_1
docker logs local_redis_1

# Проверка firewall
ufw status

# Проверка логов приложений
tail -f /tmp/indexer.log
tail -f /tmp/webapp.log

# Проверка подключения к БД
psql postgresql://usdx:usdxpassword@localhost:5432/usdx_wexel -c "SELECT 1;"

# Тест health endpoint локально
curl http://localhost:3001/health

# Проверка доступности извне
curl http://134.209.173.236:3001/health
```

---

## 📁 Созданные файлы и скрипты

1. `scripts/deploy-do.sh` - Основной скрипт деплоя на DigitalOcean
2. `create_droplet_direct.sh` - Прямое создание дроплета
3. `deploy_to_server.sh` - Настройка сервера
4. `start_application.sh` - Запуск приложения
5. `check_all_droplets.sh` - Проверка дроплетов
6. `test_ssh_key.sh` - Тест SSH ключа

---

## ⚠️ Важные замечания

1. **Пароли и секреты:**
   - JWT_SECRET и ADMIN_JWT_SECRET сгенерированы случайно
   - Пароль БД: `usdxpassword` (слабый, рекомендуется изменить)
   - Все секреты находятся в `.env.production`

2. **Безопасность:**
   - Firewall настроен базово
   - SSL не настроен
   - Доменное имя не настроено
   - Рекомендуется настроить fail2ban

3. **Мониторинг:**
   - Мониторинг не настроен
   - Логи не ротируются
   - Нет автоматических бэкапов БД

4. **Производительность:**
   - Размер дроплета минимальный (2 CPU, 4GB RAM)
   - Для production рекомендуется минимум 4 CPU, 8GB RAM

---

## 🎯 Следующие шаги для агента

1. Подключиться к серверу по SSH
2. Проверить почему сервисы недоступны извне
3. Исправить настройки firewall или приложений
4. Убедиться что приложения запущены и работают
5. Протестировать доступность по IP адресу
6. Настроить мониторинг и логирование
7. Опционально: настроить доменное имя и SSL

---

## 📊 Итоговый статус

**Статус деплоя:** ⚠️ **ЧАСТИЧНО ВЫПОЛНЕН**

### ✅ Что работает:
- Дроплет создан и настроен
- SSH доступ работает
- Docker инфраструктура запущена (PostgreSQL, Redis)
- База данных настроена и миграции применены
- Репозиторий клонирован
- Зависимости установлены
- Переменные окружения настроены

### ❌ Что НЕ работает:
- ❌ **Backend не собран** - отсутствует `dist/` папка
- ❌ **Frontend не собран** - отсутствует `.next/` папка
- ❌ **Приложения не запущены** - упали из-за ошибок сборки
- ❌ **Firewall блокирует порты** 3000 и 3001
- ❌ **Сервисы недоступны извне** по IP адресу

### 🔧 Что нужно сделать:
1. ✅ Выполнить `pnpm build` для backend и frontend
2. ✅ Открыть порты 3000 и 3001 в firewall
3. ✅ Запустить backend с правильными env переменными
4. ✅ Запустить frontend с правильными env переменными
5. ✅ Проверить доступность сервисов

**Ожидаемое время до полного запуска:** 10-15 минут

**Последнее обновление:** 2025-10-29 21:20 UTC

