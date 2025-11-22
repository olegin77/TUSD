# TUSD Solana Contracts - Mainnet Deployment Guide

## 🔒 КРИТИЧЕСКИ ВАЖНО: БЕЗОПАСНОСТЬ

**ВНИМАНИЕ**: Этот keypair дает полный контроль над программой на Mainnet!

### Mainnet Program Keypair
**Расположение**: `/root/TUSD/contracts/solana/mainnet-deployment/mainnet-program-keypair.json`
**Program ID**: `9W9SLrhGaXVVbtu2BioTCMaqaTsPesJBumcrMHWaJ8uc`

**Seed Phrase (СОХРАНИТЬ В БЕЗОПАСНОМ МЕСТЕ)**:
```
lizard used clinic document next kit whisper danger fossil error mother tonight
```

### Меры безопасности

1. **Немедленно создайте резервную копию**
   ```bash
   # Скопируйте keypair в безопасное место
   scp root@159.203.114.210:/root/TUSD/contracts/solana/mainnet-deployment/mainnet-program-keypair.json ./BACKUP_SECURE_LOCATION/
   ```

2. **Запишите seed phrase оффлайн**
   - Запишите на бумаге
   - Храните в сейфе или защищенном месте
   - НЕ сохраняйте в облачных хранилищах без шифрования

3. **Ограничьте доступ к серверу**
   ```bash
   chmod 600 /root/TUSD/contracts/solana/mainnet-deployment/mainnet-program-keypair.json
   ```

## Предварительные требования для Mainnet

### 1. Аудит безопасности
- ✅ Код проверен на reentrancy атаки
- ✅ Overflow/underflow защита
- ⚠️  ТРЕБУЕТСЯ: Внешний security audit перед Mainnet
- ⚠️  ТРЕБУЕТСЯ: Исправить 3 CRITICAL issues из audit report

### 2. Финансирование deployer wallet
```bash
# Mainnet deployment стоит ~5-10 SOL
# Deployer wallet: GjLe629pUMhnHWAPWGzbiVHbRR5gvPNHd3d4zujy3ccw

# Проверить баланс на Mainnet
solana balance GjLe629pUMhnHWAPWGzbiVHbRR5gvPNHd3d4zujy3ccw --url mainnet-beta

# Пополнить wallet через централизованную биржу или DEX
```

### 3. Тестирование на Devnet
- [ ] Деплой на devnet успешен
- [ ] Все функции протестированы
- [ ] Frontend интегрирован с devnet
- [ ] Indexer работает корректно
- [ ] Load testing пройден

## Процесс Mainnet Deployment

### Шаг 1: Финальная проверка кода

```bash
# Проверить что все критические issues исправлены
cd /root/TUSD/contracts/solana/solana-contracts
grep -n TODO|FIXME|XXX programs/solana-contracts/src/lib.rs
```

### Шаг 2: Обновить Anchor.toml

```bash
nano /root/TUSD/contracts/solana/solana-contracts/Anchor.toml
```

Изменить:
```toml
[programs.mainnet]
solana_contracts = 9W9SLrhGaXVVbtu2BioTCMaqaTsPesJBumcrMHWaJ8uc

[provider]
cluster = mainnet-beta
wallet = ~/.config/solana/deployer-mainnet.json  # Создать отдельный для mainnet!
```

### Шаг 3: Компиляция для Mainnet

```bash
cd /root/TUSD/contracts/solana/solana-contracts

# Очистка
rm -rf target/
cargo clean

# Сборка (требует Rust 1.82+ и Anchor 0.32.1)
anchor build --verifiable

# Проверка размера программы (должна быть < 400KB для экономии)
ls -lh target/deploy/solana_contracts.so
```

### Шаг 4: Deployment на Mainnet

```bash
# Настроить Solana CLI на mainnet
solana config set --url mainnet-beta
solana config set --keypair ~/.config/solana/deployer-mainnet.json

# Проверить баланс (минимум 5 SOL)
solana balance

# Deploy программы
solana program deploy \
  target/deploy/solana_contracts.so \
  --program-id /root/TUSD/contracts/solana/mainnet-deployment/mainnet-program-keypair.json \
  --upgrade-authority ~/.config/solana/deployer-mainnet.json

# Сохранить Program ID
echo 9W9SLrhGaXVVbtu2BioTCMaqaTsPesJBumcrMHWaJ8uc > deployed-mainnet-program-id.txt
```

### Шаг 5: Создание Boost Token на Mainnet

```bash
# Создать SPL Token для Boost механики
spl-token create-token --decimals 9 --url mainnet-beta

# Сохранить Token Mint Address
# ПРИМЕР: BoostTokenMint1111111111111111111111111111

# Создать token account
spl-token create-account <BOOST_TOKEN_MINT> --url mainnet-beta

# Опционально: выпустить начальный supply
spl-token mint <BOOST_TOKEN_MINT> 1000000000 --url mainnet-beta
```

### Шаг 6: Верификация Deployment

```bash
# Проверить программу на Mainnet
solana program show 9W9SLrhGaXVVbtu2BioTCMaqaTsPesJBumcrMHWaJ8uc --url mainnet-beta

# Должно показать:
# - Program ID
# - Owner: BPFLoaderUpgradeab1e11111111111111111111111
# - Upgrade Authority: <DEPLOYER_PUBKEY>
# - Executable: Yes
```

### Шаг 7: Обновление Backend/Frontend

```bash
# Обновить Indexer .env
nano /root/TUSD/apps/indexer/.env

# Изменить на Mainnet:
SOLANA_PROGRAM_ID=9W9SLrhGaXVVbtu2BioTCMaqaTsPesJBumcrMHWaJ8uc
SOLANA_BOOST_MINT_ADDRESS=<BOOST_TOKEN_MINT_FROM_STEP_5>
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_NETWORK=mainnet-beta

# Перезапустить сервисы
systemctl restart tusd-indexer
systemctl restart tusd-webapp
```

## Управление программой после deployment

### Обновление программы

```bash
# При необходимости обновить логику
anchor build --verifiable

# Upgrade программы (требует upgrade authority)
solana program upgrade \
  target/deploy/solana_contracts.so \
  9W9SLrhGaXVVbtu2BioTCMaqaTsPesJBumcrMHWaJ8uc \
  --upgrade-authority ~/.config/solana/deployer-mainnet.json \
  --url mainnet-beta
```

### Отзыв upgrade authority (НЕОБРАТИМО!)

```bash
# ТОЛЬКО после полного тестирования!
# Это сделает программу иммутабельной
solana program set-upgrade-authority \
  9W9SLrhGaXVVbtu2BioTCMaqaTsPesJBumcrMHWaJ8uc \
  --final \
  --url mainnet-beta
```

## Стоимость Mainnet deployment

| Операция | Стоимость (SOL) |
|----------|----------------|
| Program deployment | ~3-5 SOL |
| SPL Token creation | ~0.01 SOL |
| Token account | ~0.002 SOL |
| Transaction fees | ~0.001 SOL/tx |
| **TOTAL** | **~5-10 SOL** |

## Мониторинг после deployment

```bash
# Проверить статус программы
solana program show 9W9SLrhGaXVVbtu2BioTCMaqaTsPesJBumcrMHWaJ8uc --url mainnet-beta

# Мониторинг транзакций
# Использовать Solana Explorer: https://explorer.solana.com/address/9W9SLrhGaXVVbtu2BioTCMaqaTsPesJBumcrMHWaJ8uc

# Проверить логи Indexer
journalctl -u tusd-indexer -f
```

## Rollback план

В случае критических проблем:

1. **Если upgrade authority еще доступен**:
   ```bash
   # Откатить на предыдущую версию
   solana program upgrade <PREVIOUS_VERSION>.so \
     9W9SLrhGaXVVbtu2BioTCMaqaTsPesJBumcrMHWaJ8uc \
     --url mainnet-beta
   ```

2. **Если программа иммутабельная**:
   - Деплой новой версии с новым Program ID
   - Обновить Frontend/Backend конфигурацию
   - Миграция данных пользователей

## Чеклист перед Mainnet

- [ ] Security audit завершен
- [ ] Все критические issues исправлены
- [ ] Devnet тестирование пройдено
- [ ] Load testing выполнен
- [ ] Backup keypair создан
- [ ] Deployer wallet пополнен (>10 SOL)
- [ ] Документация обновлена
- [ ] Команда готова к мониторингу 24/7
- [ ] Rollback план подготовлен

---

**Создано**: 20 Noyabr, 2025 yil, Payshanba
**Server**: 159.203.114.210
**Program ID**: 9W9SLrhGaXVVbtu2BioTCMaqaTsPesJBumcrMHWaJ8uc
**Network**: Mainnet-Beta (NOT YET DEPLOYED)

**⚠️  ВАЖНО**: Этот документ содержит seed phrase. Храните в безопасном месте!
