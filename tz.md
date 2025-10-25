# USDX/Wexel — Финальное техническое задание (ТЗ)

**Версия:** 1.0-final • **Цепочки:** Solana (SPL/Anchor), Tron (TRC‑20/TRC‑721/TVM) • **Токены:** USDT, USDX (внутренний токен учёта, опционально), буст‑монеты на Solana • **Артефакты:** NFT‑вексель (Wexel) • **Локи:** 12–36 мес • **APY:** ≥18% + буст до +5%

---

## 0) Назначение документа

Этот документ задаёт **конечную спецификацию** платформы приёма ликвидности с поддержкой кошельков **Solana** и **Tron**, депозитов в **USDT**, механики **буст‑монеты (SPL)**, выпуском **NFT‑векселей (Wexel)**, режимом **залог/кредит (LTV 60%)** с перераспределением доходности (40% пользователю / 60% платформе в период залога), а также **маркетплейсом векселей**. Документ составлен в формате **реализуемого ТЗ**: архитектура, контракты, API, формулы, диаграммы потоков, события, безопасность, тест‑кейсы, DevOps.

---

## 1) Краткая бизнес‑логика

1. Пользователь подключает кошелёк: **Solana** (SPL) или **Tron** (TRC).
2. Размещает **USDT** в выбранный пул (APY ≥18%; варианты 18/24/…/36% под разные сроки/условия).
3. (Опционально) добавляет **буст‑монету (SPL на Solana)** на сумму, зависящую от депозита, чтобы получить **до +5%** к базовому APY. Цена буст‑монеты считается автоматически по агрегатору цен (DEX/CEX/оракулы).
4. После фиксации депозита и (если есть) буста система выпускает **NFT‑вексель (Wexel)** с параметрами депозита.
5. Доходность начисляется **ежедневно**; дашборд показывает баланс, начисления, график выплат. Срок блокировки **12–36 мес**.
6. Пользователь может заложить вексель под **60%** стоимости (LTV=0.60). В залоге NFT передаётся хранилищу, а **доходность делится**: пользователю 40%, платформе 60%.
7. На **маркетплейсе** векселей пользователи могут продавать/покупать Wexel’и (учёт срока до погашения, APY, состояние залога и т.п.).

---

## 2) Архитектура (высокий уровень)

**Фронтенд (Web):** Next.js/React + Wallet‑адаптеры (Solana: Phantom/Solflare/…; Tron: TronLink).  
**Бэкенд/Индексер:** Node.js (NestJS) + PostgreSQL/Redis. Индексация событий контрактов, расчёт прогрессии наград (off‑chain preview), kyc/aml (по требованию), e‑mail/Telegram уведомления.  
**Смарт‑контракты:**

- **Solana / Anchor**: LiquidityPool, WexelNFT, Rewards, CollateralVault, PriceOracleProxy, Marketplace.
- **Tron / TVM (Solidity)**: TronDepositVault (приём TRC‑20 USDT, выпуск зеркального TRC‑721 Wexel **или** запись в кросс‑чейн реестр), PriceFeed, BridgeProxy.  
  **Оракулы/цены:** Pyth/Chainlink + TWAP с DEX (Raydium/Orca) и CEX‑мид; on‑chain агрегация (см. §7).  
  **Кросс‑чейн модель:** два нативных контура (Solana/Tron). Канонический реестр Wexel — **Solana**. Для Tron‑депозитов:
- Вариант А (рекомендуемый): при TRC‑депозите пользователь указывает Solana‑адрес; канонический **SPL‑Wexel** минтится на Solana (custody‑связка, event‑proof с Tron).
- Вариант B: выпуск **TRC‑721 Wexel** + запись хэша‑ссылки в Solana‑реестр (двойной учёт; каноничность за Solana).

Диаграмма потоков (словами):

- **Депозит** → Price check → (опц.) **Буст** → **Mint Wexel** → **Rewards accrue** → (опц.) **Collateralize** → **Marketplace**/Redemption.

---

## 3) Модель данных и формулы

### 3.1. Базовая доходность

- Базовый APY пула: `APY_base ∈ {18%, 24%, 30%, 36%}` (точный набор конфигурируем).
- Эффективный APY до залога: `APY_eff = APY_base + APY_boost`, где `0 ≤ APY_boost ≤ 5%`.
- Ежедневная награда (про‑рата):  
  \[\text{Reward}\_{day} = Principal \times \frac{APY_eff}{100} \times \frac{1}{365}\]

### 3.2. Буст‑формула (SPL‑монета на Solana)

- Требуемый объём буста для максимума: `BoostTarget = 0.30 × Principal` (т.е. 30% от суммы депозита).
- Фактическая добавленная стоимость буст‑монеты в USD по **агрегированной цене** на момент фиксации буста: `V_added`.
- Аплай бустов можно делать **при создании депозита** и **позже** (если кошелёк владеет Wexel). При последующем аплае на один и тот же Wexel учитываются **кумулятивно** (лимит: не более `BoostTarget`).
- Расчёт буста:  
  \[\text{APY_boost} = 5\% \times \min\Big(\frac{V\_{added}}{0.30 \times Principal}, 1\Big)\]
- Примечания:  
  (i) Величина `V_added` считается по цене из §7 (агрегатор DEX/CEX/оракул).  
  (ii) При откате курса буст‑монеты **APY_boost не снижается** — фиксируется при аплае.  
  (iii) Возврат буст‑монеты до погашения запрещён (или допускается своп в маркетплейсе Wexel, если **вексель целиком продаётся**).

### 3.3. Залог (LTV=60%) и перераспределение доходности

- Сумма кредита:  
  \[\text{Loan} = 0.60 \times Principal\]
- На период залога (NFT во **владении CollateralVault**):  
  Пользователь получает `40%` от начисляемых наград, Платформа — `60%`.  
  \[\text{Reward*user_collateral} = 0.40 \times \text{Reward}*{day}\]
  \[\text{Reward*platform_collateral} = 0.60 \times \text{Reward}*{day}\]
- Погашение кредита возможно досрочно; после погашения NFT возвращается, доли наград — по формуле без залога.
- По наступлении срока погашения векселя (end_ts):  
  (i) если Loan не погашен — **право на погашение Principal** направляется на погашение займа (излишек → пользователю),  
  (ii) остатки начисленных наград распределяются по текущим правилам.

### 3.4. Сроки и график выплат

- Срок блокировки: `T ∈ {12, 18, 24, 30, 36} мес`.
- Награды **ежедневно начисляются on‑chain** (или по чекпойнтам с off‑chain индексацией и on‑chain клеймом).
- Выплаты: раз в сутки/неделю; расписание отображается в дашборде; невыплаченные → «к выплате».

---

## 4) Контракты: Solana (Anchor)

### 4.1. Аккаунты (структуры)

```rust
#[account]
pub struct Pool {
    pub id: u8,
    pub apy_bp: u16,            // APY в базисных пунктах, напр. 1800 = 18%
    pub lock_months: u8,        // 12..36
    pub min_deposit_usd: u64,
    pub total_liquidity: u64,
    pub total_wexels: u64,
    pub boost_target_bp: u16,   // 3000 = 30% от Principal
    pub boost_max_bp: u16,      // 500 = +5% APY максимум
}

#[account]
pub struct Wexel {
    pub id: u64,
    pub owner: Pubkey,
    pub pool_id: u8,
    pub principal_usd: u64,
    pub apy_base_bp: u16,
    pub apy_boost_bp: u16,
    pub start_ts: i64,
    pub end_ts: i64,
    pub is_collateralized: bool,
    pub total_claimed_usd: u64,
}

#[account]
pub struct CollateralPosition {
    pub wexel_id: u64,
    pub loan_usd: u64,
    pub start_ts: i64,
    pub repaid: bool,
}
```

### 4.2. Инструкции (основные)

```rust
pub fn deposit(ctx: Context<Deposit>, pool_id: u8, principal_usd: u64) -> Result<()>
// Принимает USDT (SPL) → создаёт Wexel (без буста).

pub fn apply_boost(ctx: Context<ApplyBoost>, wexel_id: u64, token_mint: Pubkey, amount: u64) -> Result<()>
// Принимает SPL‑монету; оценивает через PriceOracleProxy; фиксирует apy_boost_bp.

pub fn mint_wexel_finalize(ctx: Context<MintFinalize>, wexel_id: u64) -> Result<()>
// Финализация метаданных и чекпоинта после (возможного) буста; выпуск NFT‑метадаты.

pub fn accrue(ctx: Context<Accrue>, wexel_id: u64) -> Result<()>
// Ежедневная капитализация/учёт начислений (bucket‑счёт).

pub fn claim(ctx: Context<Claim>, wexel_id: u64) -> Result<()>
// Выплата наград владельцу или по split‑правилам при залоге.

pub fn collateralize(ctx: Context<Collateralize>, wexel_id: u64) -> Result<()>
// Перевод NFT во владение CollateralVault; выдача кредита 60%.

pub fn repay_loan(ctx: Context<RepayLoan>, wexel_id: u64, amount: u64) -> Result<()>
// Погашение займа; возврат NFT.

pub fn redeem(ctx: Context<Redeem>, wexel_id: u64) -> Result<()>
// Погашение в конце срока: вывод Principal + фин. награды/чистка состояний.
```

### 4.3. События

```rust
#[event] pub struct WexelCreated { pub id: u64, pub owner: Pubkey, pub principal_usd: u64 }
#[event] pub struct BoostApplied { pub wexel_id: u64, pub apy_boost_bp: u16, pub value_usd: u64 }
#[event] pub struct Accrued { pub wexel_id: u64, pub reward_usd: u64 }
#[event] pub struct Claimed { pub wexel_id: u64, pub to: Pubkey, pub amount_usd: u64 }
#[event] pub struct Collateralized { pub wexel_id: u64, pub loan_usd: u64 }
#[event] pub struct LoanRepaid { pub wexel_id: u64 }
#[event] pub struct Redeemed { pub wexel_id: u64, pub principal_usd: u64 }
```

### 4.4. NFT‑вексель (SPL‑NFT)

- Метаданные: `deposit_date`, `principal`, `apy_base`, `apy_boost`, `lock_months`, `end_date`, `collateral_flag`, `claim_progress`.
- Минт выполняется после финализации (учтены все бусты на момент выпуска; последующие бусты отражаются в **extension data**/метаполя).
- NFT **невзаимозаменяем** и уникален по `wexel_id`; передача ограничена, если `is_collateralized = true`.

### 4.5. Маркетплейс (Solana)

- Листинг: `ask_price_usd`, `min_bid_usd` (для аукциона), `expiry_ts`.
- Покупка: перевод прав владения Wexel, перенос всех будущих выплат/прав; если Wexel в залоге — листинг невозможен (или специальный рынок «залоговых» с дисклеймером и ценовым дисконтом).
- Комиссии: `fee_market_bp` от сделки.

---

## 5) Контракты: Tron (TVM / Solidity)

### 5.1. Основные контракты

- **TronDepositVault**: приём TRC‑20 USDT, фиксация депозита, события для кросс‑чейн; опциональная эмиссия TRC‑721 Wexel с тем же `wexel_id` (hash‑link на Solana).
- **TronPriceFeed**: чтение Chainlink (если доступно) + DEX TWAP (SunSwap), fallback по админскому оракулу (мультисиг).
- **BridgeProxy**: публикация доказательств в Solana‑реестр (и обратно).

### 5.2. Интерфейсы (фрагменты)

```solidity
interface ITronDepositVault {
    function depositUSDT(uint256 amount, bytes solanaOwner) external returns (uint256 wexelId);
    function eventsFeed() external view returns (address);
}

interface ITronWexel721 {
    function mint(address to, uint256 wexelId, bytes32 solanaHash) external;
    function setCollateralFlag(uint256 wexelId, bool flag) external;
}
```

---

## 6) Цена/Оракулы/Агрегация (§ критично для буста)

**Цель:** корректно фиксировать `V_added` буст‑монеты в USD.

1. **Источник‑1 (on‑chain, приоритет):** Pyth/Chainlink для буст‑монеты (если фид существует).
2. **Источник‑2:** DEX TWAP (Solana: Raydium/Orca; Tron: SunSwap) — усреднение 10–30 мин, защита от флеш‑спайков.
3. **Источник‑3:** Заверенный off‑chain ценовой мид по листингу CEX (Binance/OKX/Bybit…) → публикуется в PriceOracleProxy через **мультисиг + timelock** (используется **только** как резервный канал).
4. **Агрегация:** `price = median(Source1, Source2, Source3_available)`. Если доступны два — медиана из двух = среднее.
5. **Валидация:** допустимое отклонение между источниками ≤ `max_dev_bp` (например 150 б.п.). При превышении — отказ в аплае буста до стабилизации.
6. **Запись цены:** в событии `BoostApplied` фиксируется `value_usd` и `apy_boost_bp`.

---

## 7) UI/UX (Web)

### 7.1. Дашборд (главный экран)

- **Карточка портфеля:** суммарный депозит, текущий APY (база+буст), начислено сегодня/всего, выплачено, к выплате.
- **График выплат:** дневные/недельные столбцы + чекбокс «показывать только невыплаченные».
- **Список Wexel:** id, пул, срок, базовый APY, буст APY, статус (активен/в залоге/на продаже), LTV, D‑days до end_ts.
- **Кнопки:** «Заложить», «Погасить займ», «Выставить на продажу», «Получить выплату».

### 7.2. Экран «Пулы»

- Выбор пула (12/18/24/30/36 мес; APY_base).
- Поле суммы USDT, рассчитывается **BoostTarget** и слайдер добавления буста (0→100%).
- Автоматический прайс‑чек буст‑монеты, подсказка «для +5% внесите монет на $X (сейчас курс …)».
- Подтверждение: чекбокс «срок блокировки принят», «риски понятны».

### 7.3. Экран «Залог»

- Таблица Wexel, доступных к залогу, расчёт суммы `Loan`, предупреждения о смене доли дохода (40/60).
- Кнопки `Заложить` → `Подписать` → статус `В залоге`.

### 7.4. «Маркетплейс»

- Листинг по фильтрам: срок до погашения, APY, залоговый статус.
- Создание объявления (fix/auction), авто‑проверки ограничений.

### 7.5. Правый верхний угол (кошелёк)

- Статус соединения (Solana/Tron), адреса, переключатель сети, настройки уведомлений.

---

## 8) Backend API (REST+GraphQL) — контракт

```http
GET   /api/v1/user/profile
GET   /api/v1/user/wallets                      # привязанные Solana/Tron адреса
POST  /api/v1/user/wallets/link                 # подпись‑доказательство владения

GET   /api/v1/pools                             # конфиг пулов (APY_base, lock)
POST  /api/v1/deposits                          # init депозит (резерв id)
POST  /api/v1/deposits/:id/confirm              # on-chain tx hash → finalize
POST  /api/v1/deposits/:id/boost                # аплай буста (amount, mint)
GET   /api/v1/wexels                            # список Wexel пользователя
GET   /api/v1/wexels/:id/rewards                # расчёт наград (view)
POST  /api/v1/wexels/:id/claim                  # клейм наград

POST  /api/v1/collateral/:id/open               # залог (60%)
POST  /api/v1/collateral/:id/repay              # погашение займа

GET   /api/v1/market/listings                   # маркетплейс
POST  /api/v1/market/listings                   # создать листинг
POST  /api/v1/market/buy                        # купить листинг

GET   /api/v1/oracle/price?mint=...            # цены (кеш/агрегат)
GET   /api/v1/feeds/wexel/:id                   # событийная лента
```

**Требования:**

- Все мутирующие вызовы → подпись владельца кошелька (SIWS/SIWT).
- Идемпотентность по `client_tx_id`.
- Ограничение частоты (rate limit), аудит‑лог.

---

## 9) DevData: схемы БД (PostgreSQL)

```sql
create table pools(
  id smallint primary key,
  apy_base_bp integer not null,
  lock_months smallint not null,
  boost_target_bp integer not null default 3000,
  boost_max_bp integer not null default 500
);

create table wexels(
  id bigserial primary key,
  owner_solana text,
  owner_tron text,
  pool_id smallint references pools(id),
  principal_usd bigint not null,
  apy_base_bp integer not null,
  apy_boost_bp integer not null default 0,
  start_ts timestamptz not null,
  end_ts timestamptz not null,
  is_collateralized boolean not null default false,
  total_claimed_usd bigint not null default 0
);

create table collateral(
  wexel_id bigint primary key references wexels(id),
  loan_usd bigint not null,
  start_ts timestamptz not null,
  repaid boolean not null default false
);

create table listings(
  id bigserial primary key,
  wexel_id bigint references wexels(id),
  ask_price_usd bigint not null,
  auction boolean not null default false,
  expiry_ts timestamptz,
  status text not null check (status in ('active','sold','cancelled'))
);
```

---

## 10) Безопасность и соответствие

- **Мультисиг + TimeLock** на обновления оракулов, конфигов APY, включение новых буст‑монов.
- **Pause‑гейт** (экстренная остановка) на буст и маркетплейс, не затрагивая клейм.
- **Reentrancy‑guard** (Tron), строгая проверка токенов (mint allowlist).
- **Чёткая каноничность Wexel (Solana)** — единственный источник истины; Tron‑слой синхронизируется событиями/доказательствами.
- **KYC/AML** опциональны, через провайдера; флаги в профиле блокируют клейм/маркетплейс при алертах.
- **Надёжные типы чисел** (bps/uint128), округление вниз для начислений; защита от переполнений.
- **Фрод‑контроль буста:** лимит суммарного буста ≤ 30% Principal; анти‑манипуляция цен по §6.

---

## 11) Тест‑план (E2E → Unit)

**Юниты (Anchor/TVM):**

- Депозит: корректное создание Wexel, записи полей, события.
- Буст: проверка агрегации цен, расчёт `APY_boost`, запись в событие.
- Начисления: `accrue()` за N дней совпадает с формулой.
- Залог: перевод NFT, выдача 60%, изменение сплитов начислений.
- Погашение: возврат прав, восстановление долей, блокировки маркетплейса в залоге.
- Маркетплейс: листинг/покупка, комиссионные, запреты при залоге.

**Интеграционные:**

- Tron→Solana: депозит на Tron с указанием Solana‑адреса → выпуск SPL‑Wexel.
- Pyth/DEX/CEX: отказоустойчивость при рассинхронизации; девиация > threshold → отказ буста.
- Нагрузочные: 10k Wexel, массовые клеймы/начисления.

**E2E (тестнеты):**

1. Депозит $1000 USDT, буст на $300 → APY_boost = +5%.
2. Клейм за 30 дней, сверка с формулой.
3. Залог 60%, проверка изменения долей 40/60.
4. Погашение займа → возврат 100% доли наград.
5. Листинг Wexel, продажа, переход прав.

---

## 12) DevOps / Выпуск

- **Сети:** Solana (devnet → mainnet‑beta), Tron (Nile → mainnet).
- **CI/CD:** линтеры (Anchor/Foundry‑совм), юниты, интеграция, миграции БД, arweave/ipfs для метаданных NFT.
- **Мониторинг:** Prometheus/Grafana, алерты по оракулам/ценам/девиации.
- **Аудит:** внешний аудит контрактов до mainnet; bug‑bounty.

---

## 13) Примеры расчётов

- **Без буста:** Principal = $1000, APY_base = 18% → за день: `1000 * 0.18 / 365 ≈ $0.4932`.
- **С полным бустом:** добавлено $300 → APY_boost = +5% → APY_eff = 23%.  
  За день: `1000 * 0.23 / 365 ≈ $0.6301`.
- **В залоге:** пользователь получает `40%` от $0.6301 → `$0.2520/день`; платформа — `$0.3781/день`.

---

## 14) Юридические оговорки (примеры)

- Доходность фиксируется по правилам пула и не является гарантированной третьими лицами; риски оракулов/сетей описаны в пользовательском соглашении.
- В регионах с регулированием ценных бумаг — доступ ограничен (geo‑fencing), KYC/AML обязательны.

---

## 15) Чек‑лист готовности к разработке

- [x] Спецификация APY/сроков пулов
- [x] Формула буста и прайс‑агрегация
- [x] NFT‑вексель и события
- [x] Логика залога (60%) и сплиты 40/60
- [x] Маркетплейс
- [x] Tron↔Solana маршрут
- [x] API/БД/Индексер
- [x] Тест‑план и DevOps

**Готово к постановке задач разработчикам и запуску Codex‑потока.**
