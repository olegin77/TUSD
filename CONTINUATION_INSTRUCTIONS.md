# Инструкции для продолжения работы - USDX/Wexel

**Дата:** 2025-10-28  
**Текущая ветка:** `cursor/continue-project-work-with-specifications-679b`  
**Последний коммит:** SSR debugging attempts

---

## 🔴 Критический блокер

**Проблема:** Next.js build fails с ошибкой `ReferenceError: window is not defined`  
**Локация:** /dashboard, /boost, /marketplace и другие страницы с wallet  
**Причина:** Solana wallet adapters используют `window` при импорте модуля

**Детальный анализ:** См. `SSR_ISSUE_RESOLUTION_REPORT.md`

---

## ✅ Что уже сделано

### Сессия 1: Тестирование (T-0126) ✅

- Создано 2 детальных отчета о тестировании
- Исправлено 6 TypeScript ошибок
- Backend тесты: 1/1 passed
- Linting: PASS (35 warnings)

### Сессия 2: Отладка SSR (T-0126.1) ⏸️

- Попытано 10+ различных решений
- Создан ClientOnly компонент
- Обновлены все wallet страницы с `force-dynamic`
- Упрощены wallet adapters (удалены Torus, Ledger)
- Создана полная документация проблемы

---

## 🎯 Следующие шаги (выберите один вариант)

### Вариант A: Быстрое решение (15-30 мин) 🟢 РЕКОМЕНДУЕТСЯ

**Создать route groups для разделения SSR и client-only страниц**

```bash
cd apps/webapp/src/app

# Создать структуру
mkdir -p "(public)" "(wallet)"

# Переместить страницы без wallet
mv page.tsx "(public)/"
mv admin/login "(public)/admin/"

# Переместить страницы с wallet
mv dashboard "(wallet)/"
mv boost "(wallet)/"
mv marketplace "(wallet)/"
mv pools "(wallet)/"
mv wallet "(wallet)/"
mv oracles "(wallet)/"
mv wexel "(wallet)/"
mv admin/page.tsx "(wallet)/admin/"
mv admin/pools "(wallet)/admin/"
mv admin/users "(wallet)/admin/"
mv admin/wexels "(wallet)/admin/"
mv admin/oracles "(wallet)/admin/"
mv admin/settings "(wallet)/admin/"

# Создать отдельный layout для wallet страниц
cat > "(wallet)/layout.tsx" << 'EOF'
"use client";

import { MultiWalletProvider } from "@/providers/MultiWalletProvider";

export default function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MultiWalletProvider>
      {children}
    </MultiWalletProvider>
  );
}
EOF

# Обновить основной layout
# Удалить MultiWalletProvider из app/layout.tsx
```

**Проверка:**

```bash
cd apps/webapp
pnpm build
```

---

### Вариант B: Упрощенное решение (5-10 мин) 🟡

**Временно отключить проблемные страницы**

```bash
# Переименовать проблемные страницы
cd apps/webapp/src/app
mv boost boost.disabled
mv marketplace marketplace.disabled

# Попробовать сборку
pnpm build
```

Если сработает - постепенно возвращать страницы по одной.

---

### Вариант C: Полное решение (45-60 мин) 🔵

**Переписать wallet integration с правильной архитектурой**

1. Создать `useWalletClient` hook с lazy loading
2. Все wallet операции делать только на client side
3. Использовать Suspense boundaries
4. Добавить proper loading states

См. детали в `SSR_ISSUE_RESOLUTION_REPORT.md` → "Option C"

---

## 📝 Полезные команды

```bash
# Проверка TypeScript
cd apps/webapp && pnpm run type-check

# Сборка (текущее состояние - FAILS)
cd apps/webapp && pnpm build

# Dev server (работает нормально)
cd apps/webapp && pnpm dev

# Backend тесты
cd apps/indexer && pnpm test

# Linting
cd /workspace && pnpm lint

# Git статус
git status
git log --oneline -5
```

---

## 📊 Текущее состояние проекта

| Компонент        | Статус  | Примечание                   |
| ---------------- | ------- | ---------------------------- |
| Контракты Solana | ✅ 100% | 42+ теста, все проходят      |
| Backend API      | ✅ 95%  | Работает, мало unit тестов   |
| Frontend UI      | ✅ 90%  | Готов, есть SSR блокер       |
| Админ-панель     | ✅ 100% | Полностью функциональна      |
| Мониторинг       | ✅ 100% | Prometheus+Grafana настроены |
| DevOps           | ✅ 90%  | Production-ready             |
| **Build**        | ❌ 0%   | **BLOCKED by SSR**           |

**Общая готовность:** 85% → Блокировано SSR проблемой

---

## 🔗 Важные файлы

### Документация

- `SSR_ISSUE_RESOLUTION_REPORT.md` - Детальный анализ SSR проблемы
- `FINAL_TESTING_SUMMARY.md` - Отчет о тестировании
- `tests/reports/final_staging_test_summary.md` - Детальные результаты

### Проблемные файлы

- `apps/webapp/src/providers/WalletProvider.tsx` - Импортирует wallet adapters
- `apps/webapp/src/providers/MultiWalletProvider.tsx` - Обертка провайдеров
- `apps/webapp/src/app/layout.tsx` - Использует MultiWalletProvider
- `apps/webapp/next.config.js` - Webpack конфигурация

### Рабочие файлы

- `apps/indexer/` - Backend полностью работает
- `apps/webapp/src/components/` - UI компоненты OK
- `apps/webapp/src/app/page.tsx` - Главная страница OK (нет wallet)

---

## 💡 Рекомендации

1. **Немедленно:** Реализовать Вариант A (route groups) - 15-30 мин
2. **После fix:** Запустить `pnpm build` для проверки
3. **Затем:** Провести ручное тестирование основных flow
4. **Далее:** Добавить unit тесты для достижения 70% coverage
5. **Финально:** Подготовить к staging деплою

---

## 📞 Контакты и эскалация

**Создано:** Cursor AI Agent (Sonnet 4.5)  
**Сессия:** 3+ hours of SSR debugging  
**Время на fix:** 15-60 мин (в зависимости от варианта)

**Если нужна помощь:**

- Проверьте `SSR_ISSUE_RESOLUTION_REPORT.md`
- Изучите Next.js docs: https://nextjs.org/docs/app/building-your-application/rendering
- Community: https://github.com/solana-labs/wallet-adapter/issues

---

## ✨ Что сделать после fix SSR

1. ✅ Убедиться что `pnpm build` проходит успешно
2. ✅ Запустить `pnpm dev` и проверить все страницы
3. ✅ Тестировать wallet connection (Phantom, Solflare)
4. ✅ Проверить dashboard, boost, marketplace
5. ✅ Обновить TODO: T-0126.1 → completed
6. ✅ Начать T-0127 (подготовка к mainnet)

---

## 🎯 Roadmap к Production

- [x] T-0126: Комплексное тестирование ✅
- [ ] **T-0126.1: Fix SSR issue** ⏸️ В ПРОЦЕССЕ (этот шаг)
- [ ] T-0127: Подготовка к Mainnet
- [ ] External security audit
- [ ] Final E2E testing
- [ ] Mainnet launch 🚀

---

**Статус:** Ready to continue - выберите вариант решения SSR проблемы выше ☝️

_Обновлено: 2025-10-28_
