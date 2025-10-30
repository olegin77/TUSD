# 🚀 Запуск деплоя на DigitalOcean

## ⚠️ Необходимая настройка

**Сначала получите API токен:**
1. Откройте: https://cloud.digitalocean.com/account/api/tokens
2. Создайте новый токен с правами Read и Write
3. Скопируйте токен

## 🚀 Запуск

```bash
# Установите токен и запустите
export DO_API_TOKEN="your_api_token_here"
./scripts/deploy-do.sh
```

Скрипт автоматически:
1. Создаст дроплет на DigitalOcean (s-2vcpu-4gb в nyc3)
2. Установит Docker, Node.js, pnpm
3. Клонирует ваш репозиторий
4. Настроит и запустит приложение

## 📝 Опциональные параметры

Если нужно изменить размер сервера или другие параметры:

```bash
./scripts/deploy-do.sh \
  --size "s-4vcpu-8gb" \
  --region "nyc3" \
  --domain "app.usdx-wexel.com" \
  --env "production"
```

## 🔍 После запуска

После завершения скрипт покажет:
- IP адрес сервера
- Команду для SSH подключения
- Сохранит информацию в файл `do_deployment_info.txt`

## ⚠️ Важно

После деплоя подключитесь к серверу и настройте `.env.production`:
- Измените пароль базы данных
- Настройте JWT_SECRET
- Добавьте Program IDs Solana контрактов (если развернуты)

```bash
ssh root@YOUR_IP_ADDRESS
cd /opt/usdx-wexel
nano .env.production
./deploy.sh --env production
```

---

**Готово! Просто запустите `./scripts/deploy-do.sh` и следуйте инструкциям!** 🎉



