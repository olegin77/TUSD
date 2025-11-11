# Техническое задание на исправления

## Цель

Восстановить доступность платформы USDX/Wexel и обеспечить прохождение CI/CD пайплайна: рабочий Next.js фронтенд, стабильный NestJS индексер с покрытием тестами и прогоняемыми миграциями, доступные метрики качества.

## Обязательные метрики (Definition of Done)

- Продакшн-URL отвечает 200 OK на / и статические ресурсы, консоль браузера без ошибок.
- `pnpm lint`, `pnpm test`, `pnpm build`, e2e-smoke, Lighthouse проходят в CI и прикладывают артефакты.
- Бэкенд-тесты стабильно зелёные, покрытие ≥60% по ключевым модулям Tron/Solana (TronIndexerService, TronBridgeService, Deposits, Oracles).
- Prisma миграции/seed выполняются без ручных вмешательств.
- npm/audit инструменты доступны через настроенный registry, отчёты хранятся в `reports/artifacts/<дата>/`.

## Контекст и наблюдения

- `TronWeb is not a constructor` ломает юнит-тесты и блокирует сервис (`chunks b3a3be`, `78e6b4`).
- Next.js билд падает на загрузке `Inter` с fonts.googleapis.com (сеть закрыта) (`chunks f87ae2`, `8bb34e`, `63e939`, `013d47`).
- Продакшн HTTP 403 (Envoy) и пустой ответ `Forbidden` (`reports/artifacts/20251111-140553/prod-headers.txt`).
- `pnpm prisma generate`/`db:seed`/`pnpm audit`/`license-checker`/`playwright`/`lighthouse` не запускаются из-за отсутствующих CLI и 403 к npm/apt (`chunks ed8e2d`, `065474`, `4c42d8`, `cebb44`, `9bba02`, `6286bf`, `aeb52d`).

## Объём работ

1. **Инфраструктура/доступность**
   - Разобраться с 403 на продакшне: проверить ingress/Envoy правила, health-checks, SSL, DNS. При необходимости — откатить/перезапустить сервис, восстановить backend.
   - Настроить корпоративный прокси или зеркала для npm/apt, прописать `.npmrc`/`.pnpmfile.cjs`, обновить документацию по установке tooling.
2. **Фронтенд (apps/webapp)**
   - Перевести `Inter` на `next/font/local` либо хранить шрифт в репозитории/CDN под контролем; исключить зависимость от Google Fonts.
   - После фикса — добиться успешного `pnpm --filter webapp build` и `start`.
   - Добавить `pnpm --filter webapp run type-check` и интегрировать в корневой `pnpm lint/typecheck`.
   - Включить e2e смоук (Playwright) и Lighthouse в CI, сохранить отчёты в `reports/artifacts/`.
3. **Бэкенд/индексер (apps/indexer)**
   - Обновить зависимость `tronweb` или внедрить корректный mock/инициализацию, чтобы `TronWeb` создавался в тестах и рантайме.
   - Пересмотреть `TronIndexerService` тесты: добавить проверку статусов, использовать DI для TronWeb клиента.
   - Восстановить Prisma CLI (`pnpm prisma generate`) и seed (`ts-node prisma/seed.ts`), настроить `.env`.
   - Расширить покрытие: добавить тесты на основные контроллеры/сервисы (deposits, collateral, marketplace, oracles).
4. **CI/CD & QA**
   - Добавить скрипты `format:check`, `typecheck`, обновить pipeline документацию (`README`, `WORK_PLAN`).
   - Зафиксировать запуск e2e, broken-link checker, Lighthouse в отдельном job, выгружать артефакты в S3/GCS.
   - Настроить автоматический сбор http-headers и логов (аналогично `reports/artifacts/20251111-140553`).
5. **Документация/Наблюдаемость**
   - Обновить README/TZ с актуальными инструкциями запуска, добавить раздел о прокси/шрифтах.
   - Включить health-check endpoint, Prometheus/Sentry конфигурации согласно ТЗ.

## Тестирование и приёмка

- Повторить полный цикл: lint → typecheck → unit → build → db:seed → e2e → Lighthouse → smoke API. Все артефакты — в `reports/artifacts/<дата>/`.
- Вручную подтвердить, что продакшн отдаёт UI без 4xx/5xx, а критические пользовательские сценарии покрыты Playwright.
