# 🔑 Информация об SSH ключе для DigitalOcean

## 📋 Основная информация

### Локальные файлы ключа

**Приватный ключ:**

- Путь: `/home/noda/.ssh/id_rsa_do_deploy_usdx-wexel`
- Права доступа: `600` (rw-------)
- Размер: 3401 байт
- Дата создания: 29 октября 2025, 20:33

**Публичный ключ:**

- Путь: `/home/noda/.ssh/id_rsa_do_deploy_usdx-wexel.pub`
- Права доступа: `644` (rw-r--r--)
- Размер: 757 байт
- Дата создания: 29 октября 2025, 20:33

### Технические характеристики

**Тип ключа:** RSA 4096 бит

**Fingerprint (SHA256):**

```
xlRffAf/mqUudjUAY+CsN50G5NPSwYm3IGbjfN0eAms
```

**Комментарий:**

```
do-deploy-usdx-wexel-1761752020
```

### Публичный ключ

```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCl8yygA08ZiPUfiE9Lbh0FZ9w08JVowZxq6R5oPYBHKKCT4yopwTpSyV0/sjzJbpkS+nICLflEOJjTSMb6hvzL0/8D17zaO2HiPuE4qy4+hkEqw7+K6GbF6Zb3d7apayfLsJPcTRomsTkr4Vh4swWE3pY66yi4nwEgdme010cMhJIDHiAzfIwc5B3dZsH1Dzahzq1GiSIGLnP1k9okrS6WroMpDJTQBt+L9kiol5wwg6FB7bb1eJ4SkEzQcBC/WR4prpNrh3JtLWoK2iU3hKWCCrYuvS2z6+q1fZbZz1NxmcBeDM2sqzidAlnsFsa9pGIlaFGx4oys5emZbL3fF8XChB3DmLxh95hrVBtZVbjRqAMR6Svm0rGMYVT6nRg2c2jM41HLCCoaUC88SUD/mxHyRhs3dxiQ0kAyrS1PTbsaGUMI0zxoxvz5o02ntBxCBI4O+t5NCtbvkFbpyEZeQgeXLfUm2xzib6HhZg9qcKtwRo0Q7QFQlH0a/SpSDSI3/Jwf3gZZLFJ3BxD/Ivh+PSQ16e7RDTnwZv0GtMKuNe1j4Xg7i1ZZiXhK2OZKl1QhE0gTyLVEQKerYYewqNBI4Iw3W4pFkOk/+8MtaBBQFZFpxb0ypjqSweEVn1w6/dF5dNMjlLoZ6UsT/PZDXv72PKab9it/WIv4EHN0V66Jz/cklQ== do-deploy-usdx-wexel-1761752020
```

---

## 🌐 В DigitalOcean

**Статус:** ✅ Добавлен в DigitalOcean

**ID ключа:** `51662735`

**Статус:** Активен

**Добавлен:** 29 октября 2025

---

## 🔌 Использование

### Подключение к серверу

```bash
ssh -i ~/.ssh/id_rsa_do_deploy_usdx-wexel root@134.209.173.236
```

### Для выполнения команд через SSH

```bash
ssh -i ~/.ssh/id_rsa_do_deploy_usdx-wexel -o StrictHostKeyChecking=no root@134.209.173.236 "команда"
```

### Копирование файлов (SCP)

```bash
# Копирование на сервер
scp -i ~/.ssh/id_rsa_do_deploy_usdx-wexel файл.txt root@134.209.173.236:/path/

# Копирование с сервера
scp -i ~/.ssh/id_rsa_do_deploy_usdx-wexel root@134.209.173.236:/path/файл.txt ./
```

---

## 🔐 Безопасность

### ⚠️ ВАЖНО:

1. **Приватный ключ НИКОГДА не должен передаваться третьим лицам**
2. **Файл приватного ключа должен иметь права 600** (rw-------)
3. **Не коммитьте приватный ключ в Git**
4. **Не отправляйте ключ в открытом виде**

### Проверка прав доступа

```bash
# Проверить права
ls -la ~/.ssh/id_rsa_do_deploy_usdx-wexel

# Исправить права если нужно
chmod 600 ~/.ssh/id_rsa_do_deploy_usdx-wexel
chmod 644 ~/.ssh/id_rsa_do_deploy_usdx-wexel.pub
```

---

## 🔄 Управление ключом

### Просмотр ключей в DigitalOcean

```bash
export DO_API_TOKEN="your_token"
curl -s -X GET \
  -H "Authorization: Bearer $DO_API_TOKEN" \
  "https://api.digitalocean.com/v2/account/keys" | jq '.ssh_keys'
```

### Удаление ключа из DigitalOcean (если нужно)

```bash
export DO_API_TOKEN="your_token"
curl -X DELETE \
  -H "Authorization: Bearer $DO_API_TOKEN" \
  "https://api.digitalocean.com/v2/account/keys/51662735"
```

### Просмотр ключа в DigitalOcean Dashboard

**URL:** https://cloud.digitalocean.com/account/security

---

## 📝 Примечания

1. **Автоматическая генерация:** Ключ был сгенерирован автоматически скриптом `deploy-do.sh`
2. **Использование:** Ключ используется для автоматического подключения к серверам при деплое
3. **Безопасность:** Храните приватный ключ в безопасном месте
4. **Резервная копия:** Рекомендуется создать резервную копию приватного ключа

---

## 🛠️ Устранение проблем

### Проблема: Connection refused

**Решение:**

```bash
# Проверить что ключ имеет правильные права
chmod 600 ~/.ssh/id_rsa_do_deploy_usdx-wexel

# Проверить что ключ добавлен в DigitalOcean
curl -s -X GET -H "Authorization: Bearer $DO_API_TOKEN" \
  "https://api.digitalocean.com/v2/account/keys" | grep "xlRffAf"
```

### Проблема: Permission denied

**Решение:**

```bash
# Проверить права доступа
ls -la ~/.ssh/

# Добавить ключ в ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa_do_deploy_usdx-wexel
```

### Проблема: Key not found

**Решение:**
Ключ должен быть добавлен в DigitalOcean при создании дроплета.
Если нет - добавьте вручную через Dashboard или API.

---

**Дата создания:** 2025-10-29  
**Последнее обновление:** 2025-10-29
