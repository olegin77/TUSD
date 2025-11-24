# Список задач для исправления проблем USDX/Wexel Platform

**Дата создания:** 11 ноября 2025
**Основано на:** audit_report.md
**Статус проекта:** Критические проблемы блокируют работу

---

## 🔴 ПРИОРИТЕТ P0 - КРИТИЧЕСКИЕ (Выполнить немедленно)

### Задача #1: Развернуть Backend API в Production

**Приоритет:** P0 - КРИТИЧЕСКИЙ
**Время:** 6-8 часов
**Статус:** 🔴 Не начато
**Блокирует:** ВСЁ приложение

#### Проблема:

Backend API не запущен на production сервере (143.198.17.162:3001). Connection refused на все API endpoints. Приложение полностью нефункционально.

#### Шаги выполнения:

**1.1. Подготовить инфраструктуру (1 час)**

```bash
# На сервере 143.198.17.162
cd /root/TUSD

# Создать docker-compose для production
cat > infra/production/docker-compose.backend.yml <<'EOF'
version: '3.9'
services:
  postgres:
    image: postgres:16
    container_name: postgres-prod
    environment:
      POSTGRES_USER: usdx
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: usdx_wexel
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: redis-prod
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
EOF

# Запустить PostgreSQL и Redis
docker-compose -f infra/production/docker-compose.backend.yml up -d

# Проверить
docker ps | grep -E "(postgres|redis)"
```

**1.2. Настроить environment variables (30 мин)**

```bash
# Создать .env для production
cat > apps/indexer/.env.production <<'EOF'
# Application
NODE_ENV=production
API_PORT=3001
CORS_ORIGIN=http://143.198.17.162:3000,https://wexel.io

# Database
DATABASE_URL=postgresql://usdx:CHANGE_ME_PASSWORD@localhost:5432/usdx_wexel
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=CHANGE_ME_LONG_RANDOM_STRING_64_CHARS_MIN
JWT_EXPIRES_IN=7d

# Solana
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_WEBSOCKET_URL=wss://api.devnet.solana.com
SOLANA_POOL_PROGRAM_ID=
SOLANA_WEXEL_NFT_PROGRAM_ID=
SOLANA_REWARDS_PROGRAM_ID=
SOLANA_COLLATERAL_PROGRAM_ID=
SOLANA_MARKETPLACE_PROGRAM_ID=
SOLANA_ORACLE_PROGRAM_ID=
SOLANA_BOOST_MINT_ADDRESS=

# Tron
TRON_GRID_API_KEY=
TRON_NETWORK=nile
TRON_DEPOSIT_VAULT_ADDRESS=
TRON_USDT_ADDRESS=TXlaQadyoKuR4C198dM8f3Mxe3zPPnt5p8

# Monitoring
SENTRY_DSN=
EOF

# ВАЖНО: Заменить все CHANGE_ME на реальные значения!
nano apps/indexer/.env.production
```

**1.3. Применить миграции базы данных (15 мин)**

```bash
cd apps/indexer

# Установить зависимости (если не установлены)
pnpm install --frozen-lockfile

# Применить миграции
pnpm prisma:migrate:deploy

# Проверить схему
pnpm prisma:studio # откроется на :5555
```

**1.4. Собрать backend в production (30 мин)**

```bash
cd apps/indexer

# Собрать TypeScript в JavaScript
pnpm build

# Проверить dist/
ls -la dist/

# Должны быть: main.js, app.module.js, modules/, ...
```

**1.5. Создать systemd service для автозапуска (30 мин)**

```bash
# Создать systemd unit
sudo cat > /etc/systemd/system/usdx-backend.service <<'EOF'
[Unit]
Description=USDX Wexel Backend API
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
User=root
WorkingDirectory=/root/TUSD/apps/indexer
Environment="NODE_ENV=production"
ExecStart=/usr/local/bin/pnpm start:prod
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Перезагрузить systemd
sudo systemctl daemon-reload

# Запустить сервис
sudo systemctl start usdx-backend

# Включить автозапуск
sudo systemctl enable usdx-backend

# Проверить статус
sudo systemctl status usdx-backend
```

**1.6. Альтернатива: PM2 (если systemd не подходит) (20 мин)**

```bash
# Установить PM2 глобально
npm install -g pm2

# Создать ecosystem файл
cat > apps/indexer/ecosystem.config.js <<'EOF'
module.exports = {
  apps: [{
    name: 'usdx-backend',
    script: 'dist/main.js',
    cwd: '/root/TUSD/apps/indexer',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
    },
    error_file: '/root/logs/backend-error.log',
    out_file: '/root/logs/backend-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
  }]
}
EOF

# Создать директорию для логов
mkdir -p /root/logs

# Запустить через PM2
cd apps/indexer
pm2 start ecosystem.config.js

# Сохранить для автозапуска
pm2 save
pm2 startup systemd

# Мониторинг
pm2 monit
pm2 logs usdx-backend --lines 100
```

**1.7. Верификация (30 мин)**

```bash
# Проверить что backend запустился
curl http://localhost:3001/health
# Ожидается: {"status":"ok"}

# Проверить PostgreSQL подключение
curl http://localhost:3001/api/v1/pools
# Ожидается: [] или массив пулов

# Проверить внешний доступ
curl http://143.198.17.162:3001/health

# Проверить логи
journalctl -u usdx-backend -f
# или
pm2 logs usdx-backend

# Проверить процессы
ps aux | grep node

# Проверить порты
netstat -tlnp | grep 3001
```

#### Ожидаемый результат:

- ✅ Backend отвечает на http://143.198.17.162:3001/health
- ✅ PostgreSQL и Redis работают
- ✅ Все API endpoints возвращают корректные ответы (пустые массивы OK)
- ✅ Backend автоматически запускается при перезагрузке сервера
- ✅ Логи пишутся в systemd journal или PM2

#### Файлы для изменения/создания:

- `infra/production/docker-compose.backend.yml` (создать)
- `apps/indexer/.env.production` (создать)
- `/etc/systemd/system/usdx-backend.service` (создать)
- `apps/indexer/ecosystem.config.js` (создать, если PM2)

#### Критерии проверки:

```bash
# Все команды должны вернуть успех:
curl http://143.198.17.162:3001/health # HTTP 200
curl http://143.198.17.162:3001/api/v1/pools # HTTP 200
systemctl status usdx-backend # active (running)
docker ps | grep postgres-prod # Up
docker ps | grep redis-prod # Up
```

---

### Задача #2: Production Build Frontend

**Приоритет:** P0 - КРИТИЧЕСКИЙ
**Время:** 3-4 часа
**Статус:** 🔴 Не начато
**Блокирует:** Производительность, безопасность

#### Проблема:

Frontend запущен в **development mode** (`pnpm dev`). Время отклика страниц 5-7 секунд. В HTML видны Error Boundaries и webpack-internal пути.

#### Шаги выполнения:

**2.1. Настроить .env.production (15 мин)**

```bash
cd apps/webapp

# Создать production environment
cat > .env.production <<'EOF'
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://143.198.17.162:3001
NEXT_PUBLIC_WS_URL=ws://143.198.17.162:3001/notifications

# После настройки HTTPS (Задача #3), изменить на:
# NEXT_PUBLIC_API_URL=https://api.wexel.io
# NEXT_PUBLIC_WS_URL=wss://api.wexel.io/notifications
EOF

# ВАЖНО: Не коммитить .env.production с production URLs!
echo ".env.production" >> .gitignore
```

**2.2. Оптимизировать next.config.js (20 мин)**

```bash
cd apps/webapp

# Создать/обновить next.config.js
cat > next.config.js <<'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Performance
  compress: true,
  poweredByHeader: false,

  // Images
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // Output
  output: 'standalone',

  // Security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
EOF
```

**2.3. Собрать production bundle (30 мин)**

```bash
cd apps/webapp

# Очистить предыдущий build
rm -rf .next

# Собрать production build
NODE_ENV=production pnpm build

# Должна пройти успешно без ошибок
# Проверить размер bundle
du -sh .next

# Проверить что создался standalone
ls -la .next/standalone
```

**2.4. Обновить Dockerfile на production (20 мин)**

```bash
cd apps/webapp

# Создать production Dockerfile (multi-stage)
cat > Dockerfile.prod <<'EOF'
# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.5.0 --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml ./
COPY apps/webapp/package.json ./apps/webapp/

# Install dependencies
RUN pnpm install --frozen-lockfile --prod

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.5.0 --activate

# Copy dependency files and install all deps (including dev)
COPY package.json pnpm-lock.yaml ./
COPY apps/webapp/package.json ./apps/webapp/
RUN pnpm install --frozen-lockfile

# Copy source code
COPY apps/webapp ./apps/webapp
COPY tsconfig.base.json ./

# Build
WORKDIR /app/apps/webapp
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
RUN pnpm build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/apps/webapp/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/webapp/.next/static ./apps/webapp/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/webapp/public ./apps/webapp/public

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "apps/webapp/server.js"]
EOF
```

**2.5. Пересобрать и задеплоить контейнер (1 час)**

```bash
# На сервере
cd /root/TUSD

# Остановить старый контейнер
docker stop webapp-prod
docker rm webapp-prod

# Собрать новый образ
docker build -f apps/webapp/Dockerfile.prod -t webapp-prod:latest .

# Запустить production контейнер
docker run -d \
  --name webapp-prod \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://143.198.17.162:3001 \
  -e NEXT_PUBLIC_WS_URL=ws://143.198.17.162:3001/notifications \
  webapp-prod:latest

# Проверить логи
docker logs -f webapp-prod

# Проверить что запустился
docker ps | grep webapp-prod
```

**2.6. Верификация производительности (30 мин)**

```bash
# Тест загрузки главной страницы
time curl -o /dev/null -s -w "Time: %{time_total}s\nHTTP Code: %{http_code}\n" http://143.198.17.162:3000/

# Должно быть < 1 секунды

# Тест всех страниц
for page in "/" "/dashboard" "/pools" "/wallet" "/marketplace"; do
  echo "Testing: $page"
  time curl -o /dev/null -s -w "Time: %{time_total}s\n" "http://143.198.17.162:3000$page"
done

# Проверить что нет webpack-internal
curl http://143.198.17.162:3000/ | grep -i "webpack-internal"
# Не должно быть совпадений

# Проверить что нет dev режима
curl http://143.198.17.162:3000/ | grep -i "development"
# Не должно быть

# Проверить minification
curl http://143.198.17.162:3000/_next/static/chunks/main-*.js | head -c 100
# Должен быть минифицированный код (без пробелов)
```

#### Ожидаемый результат:

- ✅ Время загрузки страниц < 1 секунды
- ✅ Нет webpack-internal путей в HTML
- ✅ Нет Error Boundaries в production
- ✅ JavaScript bundle минифицирован
- ✅ Контейнер запущен в production mode
- ✅ Размер Docker image оптимизирован (multi-stage build)

#### Файлы для изменения/создания:

- `apps/webapp/.env.production` (создать)
- `apps/webapp/next.config.js` (обновить)
- `apps/webapp/Dockerfile.prod` (создать)

#### Критерии проверки:

```bash
# Производительность
curl -w "@curl-format.txt" -o /dev/null -s http://143.198.17.162:3000/
# time_total < 1.0s

# Нет dev артефактов
curl -s http://143.198.17.162:3000/ | grep -E "(webpack-internal|ErrorBoundary)" | wc -l
# Должно быть 0

# Production mode
docker exec webapp-prod env | grep NODE_ENV
# Должно быть: NODE_ENV=production
```

---

### Задача #3: Настроить HTTPS с SSL сертификатом

**Приоритет:** P0 - КРИТИЧЕСКИЙ
**Время:** 2-3 часа
**Статус:** 🔴 Не начато
**Блокирует:** Wallet подключение, безопасность

#### Проблема:

Приложение доступно только по HTTP. Браузеры блокируют Web3 кошельки на HTTP. Риск Man-in-the-Middle атак.

#### Шаги выполнения:

**3.1. Получить домен (или использовать существующий) (10 мин)**

```bash
# Вариант A: Если есть домен (например, wexel.io)
# Настроить DNS A records:
# @ (root)          A    143.198.17.162
# www               A    143.198.17.162
# api               A    143.198.17.162

# Вариант B: Использовать nip.io для тестирования (бесплатно)
# wexel.143.198.17.162.nip.io автоматически резолвится в 143.198.17.162

# Вариант C: Использовать DuckDNS (бесплатно)
# Зарегистрироваться на https://www.duckdns.org/
# Создать поддомен: wexel-demo.duckdns.org

# Проверить DNS
dig wexel.io
# или
ping wexel.io
```

**3.2. Установить Certbot и получить сертификат (30 мин)**

```bash
# На Ubuntu/Debian
apt-get update
apt-get install -y certbot python3-certbot-nginx

# Остановить Nginx если запущен
systemctl stop nginx || true

# Получить сертификат (standalone mode)
certbot certonly --standalone \
  --preferred-challenges http \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email \
  -d wexel.io \
  -d www.wexel.io \
  -d api.wexel.io

# Сертификаты будут в /etc/letsencrypt/live/wexel.io/

# Проверить
ls -la /etc/letsencrypt/live/wexel.io/
# Должны быть: fullchain.pem, privkey.pem
```

**3.3. Установить и настроить Nginx (45 мин)**

```bash
# Установить Nginx
apt-get install -y nginx

# Скопировать готовую конфигурацию из проекта
cp infra/production/nginx/nginx.conf /etc/nginx/nginx.conf

# Создать конфигурацию для USDX
cat > /etc/nginx/sites-available/usdx-wexel <<'EOF'
# Frontend (webapp)
server {
    listen 80;
    listen [::]:80;
    server_name wexel.io www.wexel.io;

    # Redirect to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name wexel.io www.wexel.io;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/wexel.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wexel.io/privkey.pem;

    # SSL configuration (modern)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API
server {
    listen 80;
    listen [::]:80;
    server_name api.wexel.io;

    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.wexel.io;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/wexel.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wexel.io/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;

    # CORS (if needed, adjust origins)
    add_header Access-Control-Allow-Origin "https://wexel.io" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=100r/m;
    limit_req zone=api_limit burst=20 nodelay;

    # Proxy to NestJS
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # WebSocket for notifications
    location /notifications {
        proxy_pass http://localhost:3001/notifications;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket timeouts
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
EOF

# Включить конфигурацию
ln -sf /etc/nginx/sites-available/usdx-wexel /etc/nginx/sites-enabled/

# Удалить default конфигурацию
rm -f /etc/nginx/sites-enabled/default

# Проверить конфигурацию
nginx -t

# Запустить Nginx
systemctl enable nginx
systemctl start nginx
systemctl status nginx
```

**3.4. Настроить автоматическое обновление сертификатов (15 мин)**

```bash
# Создать systemd timer для auto-renewal
cat > /etc/systemd/system/certbot-renewal.service <<'EOF'
[Unit]
Description=Let's Encrypt renewal

[Service]
Type=oneshot
ExecStart=/usr/bin/certbot renew --quiet --post-hook "systemctl reload nginx"
EOF

cat > /etc/systemd/system/certbot-renewal.timer <<'EOF'
[Unit]
Description=Twice daily renewal of Let's Encrypt certificates

[Timer]
OnCalendar=0/12:00:00
RandomizedDelaySec=1h
Persistent=true

[Install]
WantedBy=timers.target
EOF

# Включить timer
systemctl enable certbot-renewal.timer
systemctl start certbot-renewal.timer

# Проверить
systemctl status certbot-renewal.timer
systemctl list-timers certbot-renewal

# Тест обновления
certbot renew --dry-run
```

**3.5. Обновить frontend environment variables (15 мин)**

```bash
# Обновить .env.production
cat > apps/webapp/.env.production <<'EOF'
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.wexel.io
NEXT_PUBLIC_WS_URL=wss://api.wexel.io/notifications
EOF

# Пересобрать frontend контейнер
cd /root/TUSD
docker stop webapp-prod
docker rm webapp-prod

# Собрать с новыми env vars
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.wexel.io \
  --build-arg NEXT_PUBLIC_WS_URL=wss://api.wexel.io/notifications \
  -f apps/webapp/Dockerfile.prod \
  -t webapp-prod:latest .

# Запустить
docker run -d \
  --name webapp-prod \
  --restart unless-stopped \
  -p 3000:3000 \
  webapp-prod:latest
```

**3.6. Обновить backend CORS (10 мин)**

```bash
# Обновить .env.production backend
nano apps/indexer/.env.production
# Изменить:
# CORS_ORIGIN=https://wexel.io,https://www.wexel.io

# Рестарт backend
systemctl restart usdx-backend
# или
pm2 restart usdx-backend
```

**3.7. Верификация SSL (20 мин)**

```bash
# Тест HTTPS
curl -I https://wexel.io
# Должен вернуть HTTP/2 200

# Проверить HSTS header
curl -I https://wexel.io | grep -i strict-transport-security

# Проверить redirect HTTP -> HTTPS
curl -I http://wexel.io | grep -i location
# Должно быть: Location: https://wexel.io/

# Проверить API
curl https://api.wexel.io/health

# Тест SSL grade (онлайн)
# https://www.ssllabs.com/ssltest/analyze.html?d=wexel.io
# Ожидаем: A или A+

# Тест сертификата
openssl s_client -connect wexel.io:443 -servername wexel.io < /dev/null
# Проверить: Verify return code: 0 (ok)
```

#### Ожидаемый результат:

- ✅ Сайт доступен на https://wexel.io
- ✅ API доступен на https://api.wexel.io
- ✅ HTTP редиректит на HTTPS
- ✅ SSL Labs Grade: A или A+
- ✅ HSTS header присутствует
- ✅ Wallet адаптеры работают (HTTPS required)
- ✅ WebSocket работает через WSS
- ✅ Автоматическое обновление сертификатов настроено

#### Файлы для изменения/создания:

- `/etc/nginx/sites-available/usdx-wexel` (создать)
- `apps/webapp/.env.production` (обновить URLs)
- `apps/indexer/.env.production` (обновить CORS_ORIGIN)
- `/etc/systemd/system/certbot-renewal.*` (создать)

#### Критерии проверки:

```bash
# HTTPS работает
curl -I https://wexel.io | head -1
# HTTP/2 200

# Redirect настроен
curl -I http://wexel.io | grep Location
# Location: https://wexel.io/

# HSTS header
curl -I https://wexel.io | grep -i strict-transport
# Strict-Transport-Security: max-age=31536000

# SSL сертификат валиден
echo | openssl s_client -connect wexel.io:443 2>/dev/null | openssl x509 -noout -dates
# notAfter должен быть в будущем
```

---

### Задача #4: Развернуть Solana Smart Contracts на Devnet

**Приоритет:** P0 - КРИТИЧЕСКИЙ
**Время:** 6-8 часов
**Статус:** 🔴 Не начато
**Блокирует:** Все blockchain функции

#### Проблема:

Solana контракты не развёрнуты. Program IDs пустые в .env. Депозиты, Wexel NFT, Boost, Collateral, Marketplace не работают.

#### Шаги выполнения:

**4.1. Подготовить Solana окружение (30 мин)**

```bash
# Установить Solana CLI (если не установлен)
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Добавить в PATH
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Проверить версию
solana --version
# Должна быть >= 1.18

# Установить Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked

# Проверить
anchor --version
# Должна быть >= 0.30

# Настроить Solana на devnet
solana config set --url https://api.devnet.solana.com

# Создать/импортировать deployer кошелёк
solana-keygen new --outfile ~/.config/solana/deployer-devnet.json

# Или импортировать существующий:
# solana-keygen recover --outfile ~/.config/solana/deployer-devnet.json

# Установить как default
solana config set --keypair ~/.config/solana/deployer-devnet.json

# Проверить баланс
solana balance
# Если 0, получить airdrop:
solana airdrop 2
solana airdrop 2
# (максимум 2 SOL за раз на devnet)
```

**4.2. Собрать контракты (1 час)**

```bash
cd contracts/solana/solana-contracts

# Проверить Anchor.toml
cat Anchor.toml
# Должен быть cluster = "devnet"

# Установить зависимости
pnpm install

# Очистить предыдущий build
anchor clean

# Собрать все программы
anchor build

# Проверить что .so файлы созданы
ls -lh target/deploy/
# Должны быть: *.so файлы для каждой программы

# Проверить размер (не должны быть больше 400KB)
du -sh target/deploy/*.so

# Если больше 400KB, нужна оптимизация:
# anchor build --verifiable
```

**4.3. Развернуть контракты на devnet (2 часа)**

```bash
cd contracts/solana/solana-contracts

# Проверить баланс (нужно >= 5 SOL для всех программ)
solana balance

# Развернуть все программы
anchor deploy --provider.cluster devnet

# Процесс займёт 5-10 минут, output:
# Program Id: <program_id_1>
# Program Id: <program_id_2>
# ...

# ВАЖНО: Сохранить все Program IDs!

# Если ошибка "Insufficient funds", получить больше airdrop:
solana airdrop 2 && sleep 5 && solana airdrop 2

# Если airdrop rate limit, использовать faucet:
# https://faucet.solana.com/

# Альтернатива: развернуть программы по одной
anchor deploy --program-name solana_contracts --provider.cluster devnet

# Проверить что программы развёрнуты
solana program show <program_id> --url devnet
```

**4.4. Получить и сохранить Program IDs (30 мин)**

```bash
cd contracts/solana/solana-contracts

# Получить все program IDs
anchor keys list

# Output будет примерно:
# solana_contracts: <POOL_PROGRAM_ID>
# wexel_nft: <WEXEL_NFT_PROGRAM_ID>
# ...

# Создать файл с IDs
cat > deployed_programs.txt <<'EOF'
# Solana Devnet Program IDs
# Deployed: 2025-11-11

SOLANA_POOL_PROGRAM_ID=<paste_here>
SOLANA_WEXEL_NFT_PROGRAM_ID=<paste_here>
SOLANA_REWARDS_PROGRAM_ID=<paste_here>
SOLANA_COLLATERAL_PROGRAM_ID=<paste_here>
SOLANA_MARKETPLACE_PROGRAM_ID=<paste_here>
SOLANA_ORACLE_PROGRAM_ID=<paste_here>

# Boost token mint (нужно создать отдельно)
SOLANA_BOOST_MINT_ADDRESS=<будет создан в следующем шаге>
EOF

# Скопировать в безопасное место
cp deployed_programs.txt ~/SOLANA_PROGRAMS_DEVNET_BACKUP.txt

# Добавить в .gitignore
echo "deployed_programs.txt" >> .gitignore
```

**4.5. Создать Boost SPL Token (1 час)**

```bash
# Установить spl-token CLI
cargo install spl-token-cli

# Создать новый token mint
spl-token create-token --decimals 9 --url devnet

# Output: Creating token <BOOST_TOKEN_MINT>
# Сохранить этот адрес!

# Создать account для себя (для тестирования)
spl-token create-account <BOOST_TOKEN_MINT> --url devnet

# Выпустить тестовые токены (1 миллион)
spl-token mint <BOOST_TOKEN_MINT> 1000000 --url devnet

# Проверить баланс
spl-token balance <BOOST_TOKEN_MINT> --url devnet

# Обновить deployed_programs.txt
echo "SOLANA_BOOST_MINT_ADDRESS=<BOOST_TOKEN_MINT>" >> deployed_programs.txt
```

**4.6. Обновить .env файлы с Program IDs (20 мин)**

```bash
# Backend .env.production
cd /root/TUSD
nano apps/indexer/.env.production

# Вставить program IDs из deployed_programs.txt
# SOLANA_POOL_PROGRAM_ID=...
# SOLANA_WEXEL_NFT_PROGRAM_ID=...
# и т.д.

# Frontend .env.production (если нужно на клиенте)
nano apps/webapp/.env.production

# Добавить (если требуется):
# NEXT_PUBLIC_POOL_PROGRAM_ID=...
# NEXT_PUBLIC_BOOST_MINT=...

# Сохранить
```

**4.7. Протестировать контракты на devnet (2 часа)**

```bash
cd contracts/solana/solana-contracts

# Запустить тесты на devnet
anchor test --provider.cluster devnet --skip-local-validator

# Должны пройти все тесты:
# ✓ deposit
# ✓ apply_boost
# ✓ mint_wexel_finalize
# ✓ accrue
# ✓ claim
# ✓ collateralize
# ✓ repay_loan
# ✓ redeem

# Если тесты не проходят, проверить логи:
anchor test --provider.cluster devnet --skip-local-validator -- --nocapture

# Тест через CLI (manual smoke test)
# 1. Create pool
solana program invoke <POOL_PROGRAM_ID> \
  --data "create_pool 1 1800 12 100000000000" \
  --url devnet

# 2. Create deposit
# (аналогично для других инструкций)
```

**4.8. Верифицировать на Solana Explorer (30 мин)**

```bash
# Открыть в браузере для каждой программы:
# https://explorer.solana.com/address/<PROGRAM_ID>?cluster=devnet

# Проверить что:
# - Program deployed
# - Has executable data
# - Has upgrade authority (ваш deployer address)

# Верифицировать через CLI
for program_id in <POOL_PROGRAM_ID> <WEXEL_NFT_PROGRAM_ID> ...; do
  echo "Checking $program_id"
  solana program show $program_id --url devnet
done

# Output должен показывать:
# Program Id: <program_id>
# Owner: BPFLoaderUpgradeab1e...
# Authority: <ваш deployer pubkey>
# Last Deployed In Slot: ...
```

**4.9. Рестарт backend с новыми program IDs (15 мин)**

```bash
# Рестарт backend
systemctl restart usdx-backend
# или
pm2 restart usdx-backend

# Проверить логи
journalctl -u usdx-backend -n 50 -f
# или
pm2 logs usdx-backend

# Должны увидеть:
# [IndexerService] Connecting to Solana programs...
# [IndexerService] Subscribed to Pool program: <POOL_PROGRAM_ID>
# [IndexerService] Subscribed to Wexel program: <WEXEL_NFT_PROGRAM_ID>
# ...

# Проверить что indexer подключился
curl http://localhost:3001/api/v1/indexer/status

# Ожидается:
# {
#   "status": "running",
#   "programIds": {
#     "pool": "<POOL_PROGRAM_ID>",
#     ...
#   }
# }
```

#### Ожидаемый результат:

- ✅ Все 6 программ развёрнуты на Solana devnet
- ✅ Program IDs записаны в .env файлы
- ✅ Boost token создан и готов к использованию
- ✅ Тесты проходят на devnet
- ✅ Explorer показывает deployed программы
- ✅ Backend indexer успешно подключается к программам
- ✅ Нет ошибок в логах backend

#### Файлы для изменения/создания:

- `contracts/solana/solana-contracts/Anchor.toml` (проверить cluster)
- `contracts/solana/solana-contracts/deployed_programs.txt` (создать)
- `apps/indexer/.env.production` (обновить program IDs)
- `apps/webapp/.env.production` (обновить если нужно)

#### Критерии проверки:

```bash
# Программы развёрнуты
anchor keys list | wc -l
# Должно быть >= 6

# Тесты проходят
anchor test --provider.cluster devnet --skip-local-validator
# exit code 0

# Explorer показывает программы
curl -s "https://explorer.solana.com/address/<POOL_PROGRAM_ID>?cluster=devnet" | grep -i "executable"

# Backend подключился
curl http://localhost:3001/api/v1/indexer/status | jq '.status'
# "running"
```

---

## ⚠️ ПРИОРИТЕТ P1 - ВАЖНЫЕ (Выполнить в течение недели)

### Задача #5: Исправить Уязвимости в Зависимостях

**Приоритет:** P1 - ВЫСОКИЙ
**Время:** 4-6 часов
**Статус:** 🟡 Не начато

#### Проблема:

`pnpm audit` нашёл 6+ уязвимостей высокой и средней серьёзности: validator, axios, request, tar, min-document, tough-cookie.

#### Шаги выполнения:

```bash
# 1. Обновить validator
cd apps/indexer
pnpm update validator@latest --recursive

# 2. Обновить axios везде
pnpm update axios@latest --recursive

# 3. Заменить deprecated 'request' на axios
cd contracts/tron
# Найти все использования request
grep -r "require('request')" .
# Заменить на axios

# 4. Запустить автоматическое исправление
pnpm audit fix

# 5. Проверить
pnpm audit --audit-level high
# 0 vulnerabilities

# 6. Запустить тесты
pnpm test

# 7. Если тесты не прошли, откатить и фиксить по одному
```

#### Ожидаемый результат:

- ✅ 0 высоких уязвимостей в `pnpm audit`
- ✅ Все тесты проходят
- ✅ Приложение работает после обновлений

---

### Задача #6: Настроить Prometheus/Grafana Мониторинг

**Приоритет:** P1 - ВЫСОКИЙ
**Время:** 3-4 часа
**Статус:** 🟡 Не начато

#### Шаги выполнения:

```bash
# 1. Запустить monitoring stack
cd infra/monitoring
docker-compose up -d

# 2. Проверить
docker ps | grep -E "(prometheus|grafana|alertmanager)"

# 3. Открыть Grafana http://143.198.17.162:3002
# Login: admin / admin (изменить пароль!)

# 4. Импортировать dashboards из infra/monitoring/grafana/dashboards/

# 5. Настроить Alertmanager для Slack/Email

# 6. Протестировать алерты
```

#### Ожидаемый результат:

- ✅ Prometheus на :9090
- ✅ Grafana на :3002
- ✅ 5+ dashboards
- ✅ Алерты работают

---

### Задача #7: Добавить E2E Тесты (Playwright)

**Приоритет:** P1 - ВЫСОКИЙ
**Время:** 16-20 часов
**Статус:** 🟡 Не начато

#### Шаги выполнения:

```bash
# 1. Установить Playwright
pnpm add -D @playwright/test

# 2. Инициализировать
npx playwright install

# 3. Создать тесты
mkdir -p tests/e2e

# 4. Написать тесты для критических flows
# - Wallet connection
# - Deposit flow
# - Marketplace

# 5. Настроить CI
# Обновить .github/workflows/ci.yml

# 6. Запустить
pnpm playwright test
```

#### Ожидаемый результат:

- ✅ 10+ E2E тестов
- ✅ Тесты в CI
- ✅ HTML report

---

## 🔵 ПРИОРИТЕТ P2 - СРЕДНИЕ (Выполнить в течение 2 недель)

### Задача #8: Оптимизировать Мобильную Адаптивность

**Время:** 6-8 часов

```bash
# 1. Тест на разных экранах
# 2. Исправить таблицы (scrollable)
# 3. Добавить hamburger menu
# 4. Протестировать на реальных устройствах
```

### Задача #9: Настроить CDN и Redis Caching

**Время:** 4-6 часов

### Задача #10: Внедрить i18n (Русский + Английский)

**Время:** 6-8 часов

### Задача #11: Улучшить Accessibility (WCAG AA)

**Время:** 4-6 часов

---

## 🟢 ПРИОРИТЕТ P3 - НИЗКИЕ (Backlog)

### Задача #12: Развернуть Tron Контракты на Nile Testnet

**Время:** 8-12 часов

### Задача #13: Настроить KYC Провайдера (Sumsub/Onfido)

**Время:** 8-10 часов

### Задача #14: Интегрировать Email/SMS Уведомления

**Время:** 4-6 часов

### Задача #15: Добавить Storybook для UI компонентов

**Время:** 8-10 часов

---

## Сводная таблица задач

| #   | Задача                    | Приоритет | Время  | Блокирует            | Статус |
| --- | ------------------------- | --------- | ------ | -------------------- | ------ |
| 1   | Backend Deployment        | P0        | 6-8ч   | Всё                  | 🔴     |
| 2   | Frontend Production Build | P0        | 3-4ч   | Производительность   | 🔴     |
| 3   | HTTPS Setup               | P0        | 2-3ч   | Wallet, Безопасность | 🔴     |
| 4   | Solana Contracts Deploy   | P0        | 6-8ч   | Blockchain функции   | 🔴     |
| 5   | Security Patches          | P1        | 4-6ч   | -                    | 🟡     |
| 6   | Monitoring Setup          | P1        | 3-4ч   | -                    | 🟡     |
| 7   | E2E Tests                 | P1        | 16-20ч | -                    | 🟡     |
| 8   | Mobile Responsive         | P2        | 6-8ч   | -                    | ⚪     |
| 9   | CDN + Cache               | P2        | 4-6ч   | -                    | ⚪     |
| 10  | i18n                      | P2        | 6-8ч   | -                    | ⚪     |
| 11  | Accessibility             | P2        | 4-6ч   | -                    | ⚪     |
| 12  | Tron Deploy               | P3        | 8-12ч  | -                    | ⚪     |
| 13  | KYC Integration           | P3        | 8-10ч  | -                    | ⚪     |
| 14  | Notifications             | P3        | 4-6ч   | -                    | ⚪     |
| 15  | Storybook                 | P3        | 8-10ч  | -                    | ⚪     |

---

## Оценка времени

**MVP (только P0): 17-23 часа** = 2-3 рабочих дня
**Production-Ready (P0 + P1): 44-57 часов** = 6-7 рабочих дней
**Полная готовность (P0 + P1 + P2): 68-87 часов** = 9-11 рабочих дней

---

## Следующие шаги

1. **Немедленно начать задачи P0** (блокируют всё)
2. **Параллельно выполнять P1** (важные улучшения)
3. **Планировать P2-P3** (после стабилизации)

---

## Контакты и ресурсы

- **Audit Report:** `audit_report.md`
- **Deployment Guide:** `docs/DEPLOYMENT_GUIDE.md`
- **Admin Key Management:** `docs/ADMIN_KEY_MANAGEMENT.md`
- **Monitoring:** `docs/MONITORING.md`
- **Security Audit:** `tests/reports/security/internal_vulnerability_test_report.md`
