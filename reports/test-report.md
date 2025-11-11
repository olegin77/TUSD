# Тестовый отчёт

## Юнит-тесты/покрытие

- Команда `pnpm -r run test -- --reporter=default --coverage` падает на `apps/indexer`: `TronWeb is not a constructor`, статусы `isRunning` остаются `false`. (см. `chunks b3a3be`, `78e6b4`).
- Покрытие по проекту: statements 3.55%, branches 3.21%, functions 2.28%, lines 3.28%. Большинство модулей NestJS (admin/auth/deposits/oracles и т.д.) не покрыты вовсе. Отчёт сохранён в `reports/artifacts/20251111-140553/coverage/`.
- `apps/indexer` единственный пакет, где тесты запускаются; фронтенд и контракты не имеют тестов в CI.

## E2E (Playwright)

- Установка `playwright` через npm завершается ошибкой 403, смоук-тесты не запускались. Артефакт `reports/artifacts/20251111-140553/pw-report.json` не создан (`chunks 9bba02`, `7766d9`). Скрипт `e2e-smoke.spec.ts` подготовлен для последующего запуска.

## Битые ссылки

- `npx broken-link-checker` не установлен (403 Forbidden), поэтому проверка ссылок не выполнялась. В результате `reports/artifacts/20251111-140553/blc.txt` пустой (`chunk 6355e8`).

## Lighthouse

- CLI `lighthouse` отсутствует и не устанавливается из-за 403. Метрики производительности/SEO/a11y недоступны (`chunk 6286bf`).

## Приложения

- Артефакты аудита: `reports/artifacts/20251111-140553/` (док-резюме, http-ответы, coverage, dev.log, audits). См. также `_SUMMARY.txt` для кратких ссылок.
