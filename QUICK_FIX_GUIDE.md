# ⚡ Быстрое исправление - Запуск сервисов

## 🔴 Критические проблемы (нужно исправить СЕЙЧАС)

### Проблема 1: Приложения не собраны

### Проблема 2: Firewall блокирует порты

### Проблема 3: Приложения не запущены

---

## 🚀 Пошаговая инструкция (5-10 минут)

### Шаг 1: Подключиться к серверу

```bash
ssh -i ~/.ssh/id_rsa_do_deploy_usdx-wexel root@134.209.173.236
cd /opt/usdx-wexel
```

### Шаг 2: Собрать Backend

```bash
cd apps/indexer
pnpm build
# Дождаться завершения сборки (1-2 минуты)
ls -la dist/  # Проверить что появилась папка dist
```

### Шаг 3: Собрать Frontend

```bash
cd /opt/usdx-wexel/apps/webapp
export NEXT_PUBLIC_API_URL="http://134.209.173.236:3001"
pnpm build
# Дождаться завершения сборки (2-3 минуты)
ls -la .next/  # Проверить что появилась папка .next
```

### Шаг 4: Открыть порты в firewall

```bash
ufw allow 3000/tcp
ufw allow 3001/tcp
ufw reload
ufw status  # Проверить что порты открыты
```

### Шаг 5: Загрузить переменные окружения

```bash
cd /opt/usdx-wexel
set -a
source .env.production
set +a
```

### Шаг 6: Запустить Backend

```bash
cd apps/indexer
# Используя screen для сохранения сессии:
screen -S backend
pnpm start:prod
# Нажать Ctrl+A затем D для отключения от screen
# Или через nohup:
# nohup pnpm start:prod > /tmp/indexer.log 2>&1 &
```

### Шаг 7: Запустить Frontend (в новом терминале или screen)

```bash
cd /opt/usdx-wexel/apps/webapp
export NEXT_PUBLIC_API_URL="http://134.209.173.236:3001"
screen -S frontend
pnpm start
# Нажать Ctrl+A затем D для отключения
# Или через nohup:
# nohup pnpm start > /tmp/webapp.log 2>&1 &
```

### Шаг 8: Проверить статус

```bash
# Проверить процессы
ps aux | grep node

# Проверить порты
ss -tuln | grep -E ":(3000|3001)"

# Проверить локально
curl http://localhost:3001/health
curl http://localhost:3000 | head -n5

# С другого компьютера
curl http://134.209.173.236:3001/health
curl http://134.209.173.236:3000 | head -n5
```

---

## ✅ Ожидаемый результат

После выполнения всех шагов должны быть доступны:

- ✅ `http://134.209.173.236:3001/health` - Backend API
- ✅ `http://134.209.173.236:3000` - Frontend приложение

---

## 🔍 Диагностика если не работает

### Проверить логи:

```bash
# Backend логи
tail -f /tmp/indexer.log
# или если запущен в screen:
screen -r backend

# Frontend логи
tail -f /tmp/webapp.log
# или если запущен в screen:
screen -r frontend
```

### Проверить ошибки сборки:

```bash
# Если backend не собрался
cd /opt/usdx-wexel/apps/indexer
pnpm build 2>&1 | tee /tmp/build-indexer.log
cat /tmp/build-indexer.log

# Если frontend не собрался
cd /opt/usdx-wexel/apps/webapp
pnpm build 2>&1 | tee /tmp/build-webapp.log
cat /tmp/build-webapp.log
```

### Проверить подключение к БД:

```bash
psql postgresql://usdx:usdxpassword@localhost:5432/usdx_wexel -c "SELECT 1;"
```

---

## 📝 Быстрая команда (все сразу)

Если уверены, что все настройки правильные:

```bash
ssh -i ~/.ssh/id_rsa_do_deploy_usdx-wexel root@134.209.173.236 << 'EOF'
cd /opt/usdx-wexel
source .env.production

# Собрать
cd apps/indexer && pnpm build
cd ../webapp && export NEXT_PUBLIC_API_URL="http://134.209.173.236:3001" && pnpm build

# Открыть порты
ufw allow 3000/tcp && ufw allow 3001/tcp && ufw reload

# Запустить
cd /opt/usdx-wexel/apps/indexer
nohup pnpm start:prod > /tmp/indexer.log 2>&1 &

cd /opt/usdx-wexel/apps/webapp
export NEXT_PUBLIC_API_URL="http://134.209.173.236:3001"
nohup pnpm start > /tmp/webapp.log 2>&1 &

sleep 10
curl http://localhost:3001/health
curl http://localhost:3000 | head -n1
EOF
```

---

**Время выполнения:** 5-10 минут  
**Сложность:** Средняя  
**Необходимые права:** root
