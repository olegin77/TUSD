# 🚀 Краткая инструкция: Деплой на DigitalOcean

## 🚀 Быстрый запуск

**ВАЖНО:** Сначала получите API токен DigitalOcean:
- Откройте: https://cloud.digitalocean.com/account/api/tokens
- Создайте токен с правами Read и Write
- Скопируйте токен

```bash
# Установите токен и запустите скрипт
export DO_API_TOKEN="your_api_token_here"
./scripts/deploy-do.sh

# Или с дополнительными параметрами (опционально)
./scripts/deploy-do.sh \
  --token "your_api_token_here" \
  --size "s-4vcpu-8gb" \
  --region "nyc3" \
  --domain "app.usdx-wexel.com" \
  --env "production"
```

## Что произойдет:

1. ✅ Скрипт создаст дроплет на DigitalOcean
2. ✅ Установит Docker, Node.js, pnpm на сервере
3. ✅ Клонирует репозиторий
4. ✅ Настроит и запустит приложение
5. ✅ Покажет IP адрес сервера

## После деплоя:

1. **Подключитесь к серверу:**
   ```bash
   ssh root@YOUR_IP_ADDRESS
   ```

2. **Настройте .env файл:**
   ```bash
   cd /opt/usdx-wexel
   nano .env.production
   # Измените JWT_SECRET, пароли БД и другие настройки
   ```

3. **Перезапустите приложение:**
   ```bash
   ./deploy.sh --env production
   ```

## Полная документация:

См. файл `DEPLOY_DIGITALOCEAN.md` для детальной информации.

