# Fix-tasks (приоритеты P0…P3)

## P0 — критичные

- Восстановить доступ к продакшну: устранить 403 Forbidden на `http://159.203.114.210:3000/` и статику (`reports/artifacts/20251111-140553/prod-headers.txt`).
- Исправить инициализацию `TronWeb` в `apps/indexer` и поднять юнит-тесты `TronIndexerService`/`TronBridgeService` до зелёного состояния (`chunks b3a3be`, `78e6b4`).
- Сделать сборку `apps/webapp` воспроизводимой без доступа к Google Fonts (локальный шрифт), добиться успешного `pnpm --filter webapp build` (`chunks 8bb34e`, `63e939`).

## P1 — важные

- Настроить доступ к npm/apt (прокси/зеркала), чтобы работали `pnpm audit`, `license-checker`, Playwright, Lighthouse, broken-link checker (`chunks 4c42d8`, `cebb44`, `9bba02`, `6286bf`, `6355e8`, `aeb52d`).
- Восстановить Prisma CLI и seed скрипты (`chunks ed8e2d`, `065474`), добавить health-check миграций в CI.
- Добавить скрипты `format:check`, `typecheck` для всех пакетов и включить их в пайплайн.
- Настроить e2e смоук и Lighthouse отчёты, сохранять результаты в `reports/artifacts/<дата>/`.

## P2 — средние

- Поднять покрытие NestJS модулей минимум до 60% (deposits, collateral, marketplace, oracles) и добавить интеграционные тесты по API.
- Восстановить auto-discovery API (Swagger/OpenAPI), зафиксировать генерацию спек в репозитории.
- Проработать fallback для внешних ресурсов (иконки, аналитика), чтобы сборка не зависела от внешних CDN.

## P3 — прочее

- Актуализировать README/документацию (добавить инструкции по прокси, артефактам, запуску тестов).
- Автоматизировать сбор артефактов аудита (скрипт, Makefile) и интегрировать в CI/CD.
- Расширить наблюдаемость (Prometheus/Sentry) и добавить оповещения о падении продакшна (403/5xx).
