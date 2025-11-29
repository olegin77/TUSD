# 🔧 TAKARA PLATFORM — CRITICAL FIXES & ADMIN PANEL

**Role:** Senior Full-Stack Developer  
**Priority:** CRITICAL  
**Repository:** https://github.com/olegin77/TUSD  
**Production:** https://143.198.17.162

---

## 📋 ОБЗОР ПРОБЛЕМ (из скриншота и тестирования)

### ❌ Критические баги:

1. **Кнопка "Подключить TRON кошелек"** — НЕ РАБОТАЕТ
   - Не открывается модальное окно выбора кошелька
   - Нет интеграции с TronLink, Trust Wallet, MetaMask

2. **Калькулятор доходности** — НЕ РАБОТАЕТ
   - Кнопка "Детальный калькулятор Takara" не функционирует
   - Расчёты в правой панели могут быть неточными

3. **"до APY" в карточках** — ЗАНИЖЕН
   - Нужно показывать MAX APY с учётом максимального множителя (x1.3)
   - Advanced: должно быть "до 16.9% APY" (не 13%)
   - Whale: должно быть "до 19.5% APY" (не 15%)

4. **Админ-панель** — НЕ ФУНКЦИОНАЛЬНА или ОТСУТСТВУЕТ

---

## 🎯 ЧАСТЬ 1: ИСПРАВЛЕНИЕ ПОДКЛЮЧЕНИЯ КОШЕЛЬКА

### 1.1 Текущая проблема

Кнопка "Подключить TRON кошелек" не вызывает никакого действия. Нужно:
- Определять установленные кошельки
- Показывать модальное окно выбора
- Подключаться к выбранному кошельку
- Сохранять состояние подключения

### 1.2 Требуемая реализация

#### Компонент WalletConnectModal:

```tsx
// components/wallet/WalletConnectModal.tsx

'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  installed: boolean;
  connect: () => Promise<string>;
}

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string, walletType: string) => void;
}

export function WalletConnectModal({ isOpen, onClose, onConnect }: WalletConnectModalProps) {
  const [wallets, setWallets] = useState<WalletOption[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Определяем доступные кошельки
    const detectWallets = () => {
      const detected: WalletOption[] = [];

      // TronLink
      detected.push({
        id: 'tronlink',
        name: 'TronLink',
        icon: '/icons/tronlink.svg',
        installed: typeof window !== 'undefined' && !!(window as any).tronLink,
        connect: connectTronLink,
      });

      // Trust Wallet (через TronWeb)
      detected.push({
        id: 'trustwallet',
        name: 'Trust Wallet',
        icon: '/icons/trustwallet.svg',
        installed: typeof window !== 'undefined' && 
          !!(window as any).trustwallet?.tronWeb,
        connect: connectTrustWallet,
      });

      // MetaMask (для Tron через snap или bridge - если поддерживается)
      // Обычно MetaMask не поддерживает Tron напрямую, но можно добавить
      
      setWallets(detected);
    };

    if (isOpen) {
      detectWallets();
    }
  }, [isOpen]);

  const connectTronLink = async (): Promise<string> => {
    const tronLink = (window as any).tronLink;
    
    if (!tronLink) {
      throw new Error('TronLink не установлен. Пожалуйста, установите расширение TronLink.');
    }

    // Запросить подключение
    const res = await tronLink.request({ method: 'tron_requestAccounts' });
    
    if (res.code !== 200) {
      throw new Error('Пользователь отклонил подключение');
    }

    // Получить адрес
    const tronWeb = (window as any).tronWeb;
    if (!tronWeb || !tronWeb.ready) {
      // Подождать инициализации
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const address = (window as any).tronWeb?.defaultAddress?.base58;
    
    if (!address) {
      throw new Error('Не удалось получить адрес кошелька');
    }

    return address;
  };

  const connectTrustWallet = async (): Promise<string> => {
    const trustWallet = (window as any).trustwallet;
    
    if (!trustWallet?.tronWeb) {
      throw new Error('Trust Wallet не обнаружен');
    }

    const tronWeb = trustWallet.tronWeb;
    const address = tronWeb.defaultAddress?.base58;
    
    if (!address) {
      throw new Error('Не удалось получить адрес из Trust Wallet');
    }

    return address;
  };

  const handleConnect = async (wallet: WalletOption) => {
    if (!wallet.installed) {
      // Открыть ссылку на установку
      const installUrls: Record<string, string> = {
        tronlink: 'https://www.tronlink.org/',
        trustwallet: 'https://trustwallet.com/',
      };
      window.open(installUrls[wallet.id], '_blank');
      return;
    }

    setConnecting(wallet.id);
    setError(null);

    try {
      const address = await wallet.connect();
      onConnect(address, wallet.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ошибка подключения');
    } finally {
      setConnecting(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            Подключить TRON кошелек
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleConnect(wallet)}
              disabled={connecting !== null}
              className={`
                w-full flex items-center gap-4 p-4 rounded-xl border transition-all
                ${wallet.installed 
                  ? 'border-gray-600 hover:border-blue-500 hover:bg-gray-800' 
                  : 'border-gray-700 opacity-60'}
                ${connecting === wallet.id ? 'bg-gray-800' : ''}
              `}
            >
              <img 
                src={wallet.icon} 
                alt={wallet.name} 
                className="w-10 h-10 rounded-lg"
              />
              <div className="flex-1 text-left">
                <div className="text-white font-medium">{wallet.name}</div>
                <div className="text-sm text-gray-400">
                  {wallet.installed ? 'Обнаружен' : 'Не установлен — нажмите для установки'}
                </div>
              </div>
              {connecting === wallet.id && (
                <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full" />
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="mt-6 text-center text-gray-500 text-sm">
          Подключая кошелек, вы соглашаетесь с условиями использования платформы
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

#### Hook для управления кошельком:

```tsx
// hooks/useTronWallet.ts

'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';

interface TronWalletState {
  address: string | null;
  walletType: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  balance: string | null;
}

interface TronWalletContextType extends TronWalletState {
  connect: () => void;
  disconnect: () => void;
  openConnectModal: () => void;
}

const TronWalletContext = createContext<TronWalletContextType | null>(null);

export function TronWalletProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TronWalletState>({
    address: null,
    walletType: null,
    isConnected: false,
    isConnecting: false,
    balance: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Восстановить подключение из localStorage
  useEffect(() => {
    const savedAddress = localStorage.getItem('tron_address');
    const savedWalletType = localStorage.getItem('tron_wallet_type');
    
    if (savedAddress && savedWalletType) {
      // Проверить что кошелёк всё ещё подключен
      verifyConnection(savedAddress, savedWalletType);
    }
  }, []);

  const verifyConnection = async (address: string, walletType: string) => {
    try {
      const tronWeb = (window as any).tronWeb;
      if (tronWeb && tronWeb.defaultAddress?.base58 === address) {
        setState(prev => ({
          ...prev,
          address,
          walletType,
          isConnected: true,
        }));
        fetchBalance(address);
      } else {
        // Кошелёк отключен
        disconnect();
      }
    } catch {
      disconnect();
    }
  };

  const fetchBalance = async (address: string) => {
    try {
      const tronWeb = (window as any).tronWeb;
      if (!tronWeb) return;

      // USDT TRC20 контракт
      const USDT_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
      const contract = await tronWeb.contract().at(USDT_CONTRACT);
      const balance = await contract.balanceOf(address).call();
      const formatted = (Number(balance) / 1e6).toFixed(2);
      
      setState(prev => ({ ...prev, balance: formatted }));
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  };

  const handleConnect = useCallback((address: string, walletType: string) => {
    localStorage.setItem('tron_address', address);
    localStorage.setItem('tron_wallet_type', walletType);
    
    setState({
      address,
      walletType,
      isConnected: true,
      isConnecting: false,
      balance: null,
    });

    fetchBalance(address);
  }, []);

  const disconnect = useCallback(() => {
    localStorage.removeItem('tron_address');
    localStorage.removeItem('tron_wallet_type');
    
    setState({
      address: null,
      walletType: null,
      isConnected: false,
      isConnecting: false,
      balance: null,
    });
  }, []);

  const openConnectModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <TronWalletContext.Provider
      value={{
        ...state,
        connect: openConnectModal,
        disconnect,
        openConnectModal,
      }}
    >
      {children}
      <WalletConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnect={handleConnect}
      />
    </TronWalletContext.Provider>
  );
}

export function useTronWallet() {
  const context = useContext(TronWalletContext);
  if (!context) {
    throw new Error('useTronWallet must be used within TronWalletProvider');
  }
  return context;
}
```

#### Обновить кнопку подключения:

```tsx
// components/ConnectWalletButton.tsx

'use client';

import { useTronWallet } from '@/hooks/useTronWallet';

export function ConnectWalletButton() {
  const { isConnected, address, balance, openConnectModal, disconnect } = useTronWallet();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-white text-sm font-medium">
            {address.slice(0, 6)}...{address.slice(-4)}
          </div>
          {balance && (
            <div className="text-gray-400 text-xs">{balance} USDT</div>
          )}
        </div>
        <button
          onClick={disconnect}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors"
        >
          Отключить
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={openConnectModal}
      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl text-white font-medium transition-all"
    >
      Подключить TRON кошелек
    </button>
  );
}
```

### 1.3 Checklist для кошелька

- [ ] Создать компонент WalletConnectModal
- [ ] Создать hook useTronWallet
- [ ] Создать TronWalletProvider и обернуть приложение
- [ ] Обновить кнопку "Подключить TRON кошелек"
- [ ] Добавить иконки кошельков в /public/icons/
- [ ] Тестировать с TronLink
- [ ] Тестировать с Trust Wallet
- [ ] Сохранение состояния в localStorage
- [ ] Отображение адреса и баланса после подключения

---

## 🧮 ЧАСТЬ 2: ИСПРАВЛЕНИЕ КАЛЬКУЛЯТОРА

### 2.1 Текущие проблемы

1. Кнопка "Детальный калькулятор Takara" не работает
2. Возможно неправильные расчёты в правой панели
3. Нет интерактивности — нельзя менять параметры

### 2.2 Требуемая реализация

#### Полноценный калькулятор:

```tsx
// components/calculator/YieldCalculator.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Vault {
  id: number;
  name: string;
  type: string;
  durationMonths: number;
  minEntryUsdt: number;
  baseApyPercent: number;      // 4.5, 7, 8
  boostApyPercent: number;     // 4, 6, 7
  maxApyPercent: number;       // 8.5, 13, 15
  takaraMiningAprPercent: number; // 30, 30, 40
  boostToken: 'LAIKA' | 'TAKARA';
  boostRatio: number;          // 0.4 или 1.0
  boostPriceFixed?: number;    // 0.10 для Takara
  boostPriceDiscount?: number; // 0.15 для Laika
}

interface CalculatorProps {
  vault: Vault;
  isOpen: boolean;
  onClose: () => void;
}

type PayoutFrequency = 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

const FREQUENCY_MULTIPLIERS: Record<PayoutFrequency, number> = {
  MONTHLY: 1.0,
  QUARTERLY: 1.15,
  YEARLY: 1.30,
};

const FREQUENCY_LABELS: Record<PayoutFrequency, string> = {
  MONTHLY: 'Ежемесячно (x1.0)',
  QUARTERLY: 'Ежеквартально (x1.15)',
  YEARLY: 'Ежегодно (x1.30)',
};

export function YieldCalculator({ vault, isOpen, onClose }: CalculatorProps) {
  const [depositAmount, setDepositAmount] = useState<number>(vault.minEntryUsdt);
  const [enableBoost, setEnableBoost] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<PayoutFrequency>('MONTHLY');
  const [laikaPrice, setLaikaPrice] = useState<number>(0.05); // Для Vault 1

  // Расчёты
  const calculations = useMemo(() => {
    // Base APY
    const baseApy = vault.baseApyPercent;
    
    // Boost APY (если включён)
    const boostApy = enableBoost ? vault.boostApyPercent : 0;
    
    // Total APY без множителя
    const totalApyBase = baseApy + boostApy;
    
    // Множитель частоты
    const multiplier = FREQUENCY_MULTIPLIERS[frequency];
    
    // Effective APY с множителем
    const effectiveApy = totalApyBase * multiplier;
    
    // Доход в USDT
    const dailyUsdt = (depositAmount * effectiveApy / 100) / 365;
    const monthlyUsdt = dailyUsdt * 30;
    const yearlyUsdt = depositAmount * effectiveApy / 100;
    const totalUsdt = yearlyUsdt * (vault.durationMonths / 12);
    
    // Takara Mining
    const takaraApr = vault.takaraMiningAprPercent;
    const yearlyTakaraValue = depositAmount * takaraApr / 100; // в USD эквиваленте
    const yearlyTakaraTokens = yearlyTakaraValue / 0.10; // по курсу $0.10
    const dailyTakara = yearlyTakaraTokens / 365;
    const weeklyTakara = dailyTakara * 7;
    const totalTakara = yearlyTakaraTokens * (vault.durationMonths / 12);
    
    // Требуемый буст
    let requiredBoostTokens = 0;
    let requiredBoostValue = 0;
    
    if (enableBoost) {
      if (vault.boostToken === 'LAIKA') {
        // Laika: 40% от депозита, с дисконтом 15%
        requiredBoostValue = depositAmount * vault.boostRatio;
        const effectivePrice = laikaPrice * (1 - (vault.boostPriceDiscount || 0.15));
        requiredBoostTokens = requiredBoostValue / effectivePrice;
      } else {
        // Takara: 1:1, фикс курс $0.10
        requiredBoostValue = depositAmount * vault.boostRatio;
        requiredBoostTokens = requiredBoostValue / (vault.boostPriceFixed || 0.10);
      }
    }
    
    return {
      baseApy,
      boostApy,
      totalApyBase,
      multiplier,
      effectiveApy,
      dailyUsdt,
      monthlyUsdt,
      yearlyUsdt,
      totalUsdt,
      takaraApr,
      dailyTakara,
      weeklyTakara,
      yearlyTakaraTokens,
      totalTakara,
      requiredBoostTokens,
      requiredBoostValue,
    };
  }, [depositAmount, enableBoost, frequency, vault, laikaPrice]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            Калькулятор доходности — {vault.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Сумма депозита */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Сумма депозита (USDT)
            </label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Math.max(vault.minEntryUsdt, Number(e.target.value)))}
              min={vault.minEntryUsdt}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            />
            <p className="text-gray-500 text-xs mt-1">
              Минимум: ${vault.minEntryUsdt.toLocaleString()}
            </p>
          </div>

          {/* Частота выплат */}
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Частота выплат USDT
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(FREQUENCY_MULTIPLIERS) as PayoutFrequency[]).map((freq) => (
                <button
                  key={freq}
                  onClick={() => setFrequency(freq)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    frequency === freq
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {FREQUENCY_LABELS[freq]}
                </button>
              ))}
            </div>
          </div>

          {/* Буст */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enableBoost}
                onChange={(e) => setEnableBoost(e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-white">
                Включить {vault.boostToken} Boost (+{vault.boostApyPercent}% APY)
              </span>
            </label>
            
            {enableBoost && (
              <div className="mt-3 p-4 bg-gray-800 rounded-lg">
                <p className="text-gray-400 text-sm">
                  Требуется {vault.boostToken}:
                </p>
                <p className="text-white text-lg font-bold">
                  {calculations.requiredBoostTokens.toLocaleString(undefined, { maximumFractionDigits: 0 })} {vault.boostToken}
                </p>
                <p className="text-gray-500 text-xs">
                  ≈ ${calculations.requiredBoostValue.toLocaleString()} 
                  {vault.boostToken === 'LAIKA' 
                    ? ` (курс ${laikaPrice} с дисконтом 15%)`
                    : ' (фикс. курс $0.10)'
                  }
                </p>
                
                {vault.boostToken === 'LAIKA' && (
                  <div className="mt-2">
                    <label className="text-gray-500 text-xs">Текущая цена Laika:</label>
                    <input
                      type="number"
                      value={laikaPrice}
                      onChange={(e) => setLaikaPrice(Number(e.target.value))}
                      step="0.001"
                      className="w-24 ml-2 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Результаты */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-white font-semibold mb-4">Расчёт доходности</h3>
            
            {/* APY Summary */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-gray-400 text-sm">Базовый APY</p>
                <p className="text-2xl font-bold text-white">{calculations.baseApy}%</p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-gray-400 text-sm">{vault.boostToken} Boost</p>
                <p className="text-2xl font-bold text-green-400">
                  {enableBoost ? `+${calculations.boostApy}%` : '0%'}
                </p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-gray-400 text-sm">Множитель</p>
                <p className="text-2xl font-bold text-blue-400">x{calculations.multiplier}</p>
              </div>
              <div className="p-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-lg">
                <p className="text-gray-400 text-sm">Итого APY</p>
                <p className="text-2xl font-bold text-yellow-400">{calculations.effectiveApy.toFixed(2)}%</p>
              </div>
            </div>

            {/* USDT Income */}
            <div className="mb-6">
              <h4 className="text-gray-400 text-sm mb-3">Доход в USDT (TRC20)</h4>
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 bg-gray-800 rounded-lg text-center">
                  <p className="text-gray-500 text-xs">Ежедневно</p>
                  <p className="text-white font-semibold">${calculations.dailyUsdt.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg text-center">
                  <p className="text-gray-500 text-xs">Ежемесячно</p>
                  <p className="text-white font-semibold">${calculations.monthlyUsdt.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg text-center">
                  <p className="text-gray-500 text-xs">За год</p>
                  <p className="text-white font-semibold">${calculations.yearlyUsdt.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-green-600/20 border border-green-500/30 rounded-lg text-center">
                  <p className="text-gray-500 text-xs">За {vault.durationMonths} мес.</p>
                  <p className="text-green-400 font-bold">${calculations.totalUsdt.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Takara Mining */}
            <div>
              <h4 className="text-gray-400 text-sm mb-3">
                Майнинг Takara (SPL) — {calculations.takaraApr}% APR
              </h4>
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 bg-gray-800 rounded-lg text-center">
                  <p className="text-gray-500 text-xs">Ежедневно</p>
                  <p className="text-purple-400 font-semibold">{calculations.dailyTakara.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg text-center">
                  <p className="text-gray-500 text-xs">Еженедельно</p>
                  <p className="text-purple-400 font-semibold">{calculations.weeklyTakara.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg text-center">
                  <p className="text-gray-500 text-xs">За год</p>
                  <p className="text-purple-400 font-semibold">{calculations.yearlyTakaraTokens.toFixed(0)}</p>
                </div>
                <div className="p-3 bg-purple-600/20 border border-purple-500/30 rounded-lg text-center">
                  <p className="text-gray-500 text-xs">За {vault.durationMonths} мес.</p>
                  <p className="text-purple-400 font-bold">{calculations.totalTakara.toFixed(0)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl text-white font-semibold transition-all"
          >
            Создать депозит
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

#### Интеграция кнопки "Детальный калькулятор":

```tsx
// В компоненте VaultCard или VaultDetails

const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

// Кнопка
<button
  onClick={() => setIsCalculatorOpen(true)}
  className="w-full py-3 border border-blue-500 text-blue-500 hover:bg-blue-500/10 rounded-xl font-medium transition-all"
>
  📊 Детальный калькулятор Takara
</button>

// Модалка
<YieldCalculator
  vault={vault}
  isOpen={isCalculatorOpen}
  onClose={() => setIsCalculatorOpen(false)}
/>
```

### 2.3 Checklist для калькулятора

- [ ] Создать компонент YieldCalculator
- [ ] Добавить все расчёты согласно формулам
- [ ] Подключить кнопку "Детальный калькулятор"
- [ ] Обновить правую панель на странице vaults
- [ ] Тестировать расчёты для всех vault'ов
- [ ] Проверить edge cases (мин. сумма, макс. значения)

---

## 📊 ЧАСТЬ 3: ИСПРАВЛЕНИЕ ОТОБРАЖЕНИЯ APY

### 3.1 Проблема

На скриншоте видно:
- Advanced показывает "до 13% APY" — это MAX APY без множителя
- Whale показывает "до 15% APY" — это MAX APY без множителя

**ВОПРОС:** Что показывать в бейдже "до X% APY"?

**ВАРИАНТ А:** MAX APY = Base + Boost (без множителя)
- Advanced: 7% + 6% = 13%
- Whale: 8% + 7% = 15%

**ВАРИАНТ Б:** MAX APY с максимальным множителем x1.3
- Advanced: 13% × 1.3 = 16.9%
- Whale: 15% × 1.3 = 19.5%

### 3.2 Рекомендация

Показывать **ВАРИАНТ Б** — максимально возможный APY, так как это привлекательнее для пользователя и честно (это действительно максимум).

### 3.3 Реализация

```tsx
// components/vaults/VaultCard.tsx

interface VaultCardProps {
  vault: {
    name: string;
    baseApyPercent: number;
    boostApyPercent: number;
    // ... other fields
  };
}

export function VaultCard({ vault }: VaultCardProps) {
  // Максимальный APY = (base + boost) * максимальный множитель (1.3)
  const maxApyWithMultiplier = (vault.baseApyPercent + vault.boostApyPercent) * 1.3;
  
  return (
    <div className="...">
      {/* Badge */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1 rounded-full">
        <span className="text-white font-semibold">
          до {maxApyWithMultiplier.toFixed(1)}% APY
        </span>
      </div>
      
      {/* Details */}
      <div className="grid grid-cols-4 gap-2">
        <div>
          <span className="text-gray-400">Базовый APY</span>
          <span className="text-green-400">{vault.baseApyPercent}%</span>
        </div>
        <div>
          <span className="text-gray-400">{vault.boostToken} Boost</span>
          <span className="text-green-400">+{vault.boostApyPercent}%</span>
        </div>
        <div>
          <span className="text-gray-400">Макс. APY (×1.3)</span>
          <span className="text-yellow-400">{maxApyWithMultiplier.toFixed(1)}%</span>
        </div>
        {/* ... */}
      </div>
    </div>
  );
}
```

### 3.4 Обновить значения в БД (если ещё не сделано)

```typescript
// Правильные значения:

// Vault 1: Starter
baseApyPercent: 4.5,    // Start APY
boostApyPercent: 4.0,   // Laika Boost
maxApyPercent: 8.5,     // Base + Boost
maxApyWithMultiplier: 11.05,  // 8.5 * 1.3

// Vault 2: Advanced
baseApyPercent: 7.0,    // Start APY
boostApyPercent: 6.0,   // Takara Boost
maxApyPercent: 13.0,    // Base + Boost
maxApyWithMultiplier: 16.9,   // 13 * 1.3

// Vault 3: Whale
baseApyPercent: 8.0,    // Start APY
boostApyPercent: 7.0,   // Takara Boost
maxApyPercent: 15.0,    // Base + Boost
maxApyWithMultiplier: 19.5,   // 15 * 1.3
```

---

## 🔧 ЧАСТЬ 4: АДМИН-ПАНЕЛЬ

### 4.1 Требования к админ-панели

Создать полноценную админ-панель с функционалом:

1. **Dashboard (Обзор)**
   - Общая статистика платформы
   - Количество пользователей
   - Общий TVL (Total Value Locked)
   - Количество активных депозитов
   - Графики

2. **Управление Vaults**
   - Просмотр всех vaults
   - Редактирование APY (base, boost, max)
   - Редактирование условий буста
   - Редактирование min entry, duration
   - Включение/выключение vault

3. **Управление Batches**
   - Просмотр всех batches по каждому vault
   - Текущее заполнение
   - История заполненных batches
   - Ручное закрытие batch (если нужно)

4. **Депозиты**
   - Список всех депозитов
   - Фильтры по статусу, vault, пользователю
   - Детали каждого депозита
   - История транзакций

5. **Пользователи**
   - Список пользователей
   - Кошельки (Tron, Solana)
   - Депозиты пользователя
   - История claims

6. **Claims**
   - История всех claims
   - Pending claims
   - Статусы выплат

7. **Настройки**
   - Глобальные параметры
   - Treasury addresses
   - Token addresses
   - Feature flags

### 4.2 Структура админ-панели

```
/admin
├── /                     # Dashboard
├── /vaults               # Управление Vaults
│   ├── /                 # Список vaults
│   └── /[id]            # Редактирование vault
├── /batches              # Управление Batches
├── /deposits             # Все депозиты
│   └── /[id]            # Детали депозита
├── /users                # Пользователи
│   └── /[id]            # Профиль пользователя
├── /claims               # История claims
└── /settings             # Настройки
```

### 4.3 Backend API для админки

```typescript
// Создать новые endpoints в NestJS:

// src/modules/admin/admin.module.ts
// src/modules/admin/admin.controller.ts
// src/modules/admin/admin.service.ts

// Guards для защиты админ endpoints
// src/common/guards/admin.guard.ts
```

#### Admin Controller:

```typescript
// src/modules/admin/admin.controller.ts

import { Controller, Get, Put, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '@/common/guards/admin.guard';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ========== DASHBOARD ==========
  
  @Get('stats')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // ========== VAULTS ==========
  
  @Get('vaults')
  async getAllVaults() {
    return this.adminService.getAllVaults();
  }

  @Get('vaults/:id')
  async getVault(@Param('id') id: string) {
    return this.adminService.getVault(+id);
  }

  @Put('vaults/:id')
  async updateVault(
    @Param('id') id: string,
    @Body() updateDto: UpdateVaultDto,
  ) {
    return this.adminService.updateVault(+id, updateDto);
  }

  // ========== DEPOSITS ==========
  
  @Get('deposits')
  async getAllDeposits(
    @Query('status') status?: string,
    @Query('vaultId') vaultId?: string,
    @Query('userId') userId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getAllDeposits({
      status,
      vaultId: vaultId ? +vaultId : undefined,
      userId,
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
    });
  }

  @Get('deposits/:id')
  async getDeposit(@Param('id') id: string) {
    return this.adminService.getDeposit(+id);
  }

  // ========== USERS ==========
  
  @Get('users')
  async getAllUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getAllUsers({
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
      search,
    });
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    return this.adminService.getUser(id);
  }

  // ========== CLAIMS ==========
  
  @Get('claims')
  async getAllClaims(
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getAllClaims({
      status,
      type,
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
    });
  }

  // ========== SETTINGS ==========
  
  @Get('settings')
  async getSettings() {
    return this.adminService.getSettings();
  }

  @Put('settings')
  async updateSettings(@Body() updateDto: UpdateSettingsDto) {
    return this.adminService.updateSettings(updateDto);
  }
}
```

#### Admin Service:

```typescript
// src/modules/admin/admin.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalDeposits,
      activeDeposits,
      totalValueLocked,
      totalClaims,
      pendingClaims,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.deposit.count(),
      this.prisma.deposit.count({ where: { status: 'ACTIVE' } }),
      this.prisma.deposit.aggregate({
        where: { status: 'ACTIVE' },
        _sum: { amountUsdt: true },
      }),
      this.prisma.claim.count(),
      this.prisma.claim.count({ where: { txConfirmed: false } }),
    ]);

    // Deposits by vault
    const depositsByVault = await this.prisma.deposit.groupBy({
      by: ['vaultId'],
      _count: true,
      _sum: { amountUsdt: true },
    });

    // Recent activity
    const recentDeposits = await this.prisma.deposit.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { vault: true },
    });

    return {
      totalUsers,
      totalDeposits,
      activeDeposits,
      totalValueLocked: totalValueLocked._sum.amountUsdt || 0,
      totalClaims,
      pendingClaims,
      depositsByVault,
      recentDeposits,
    };
  }

  async getAllVaults() {
    return this.prisma.vault.findMany({
      include: {
        _count: {
          select: { deposits: true },
        },
        batches: {
          where: { isActive: true },
        },
      },
    });
  }

  async updateVault(id: number, data: UpdateVaultDto) {
    return this.prisma.vault.update({
      where: { id },
      data: {
        // APY fields
        baseApyBps: data.baseApyPercent ? Math.round(data.baseApyPercent * 100) : undefined,
        boostApyBps: data.boostApyPercent ? Math.round(data.boostApyPercent * 100) : undefined,
        maxApyBps: data.maxApyPercent ? Math.round(data.maxApyPercent * 100) : undefined,
        
        // Other fields
        minEntryUsdt: data.minEntryUsdt,
        durationMonths: data.durationMonths,
        takaraMiningAprBps: data.takaraMiningAprPercent 
          ? Math.round(data.takaraMiningAprPercent * 100) 
          : undefined,
        
        // Boost config
        boostRatio: data.boostRatio,
        boostPriceFixed: data.boostPriceFixed,
        boostPriceDiscount: data.boostPriceDiscount,
        
        // Status
        isActive: data.isActive,
      },
    });
  }

  // ... другие методы
}
```

### 4.4 Frontend Admin Pages

#### Admin Layout:

```tsx
// app/admin/layout.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/vaults', label: 'Vaults', icon: '🏦' },
  { href: '/admin/deposits', label: 'Депозиты', icon: '💰' },
  { href: '/admin/users', label: 'Пользователи', icon: '👥' },
  { href: '/admin/claims', label: 'Claims', icon: '📤' },
  { href: '/admin/settings', label: 'Настройки', icon: '⚙️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Проверка авторизации админа
    const checkAuth = async () => {
      // TODO: Реальная проверка
      const isAdmin = localStorage.getItem('admin_token');
      if (!isAdmin) {
        router.push('/admin/login');
      } else {
        setIsAuthorized(true);
      }
    };
    checkAuth();
  }, [router]);

  if (!isAuthorized) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white">TAKARA Admin</h1>
        </div>
        <nav className="px-4">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
```

#### Vaults Management Page:

```tsx
// app/admin/vaults/page.tsx

'use client';

import { useState, useEffect } from 'react';

interface Vault {
  id: number;
  name: string;
  type: string;
  baseApyBps: number;
  boostApyBps: number;
  maxApyBps: number;
  takaraMiningAprBps: number;
  minEntryUsdt: number;
  durationMonths: number;
  boostToken: string;
  boostRatio: number;
  isActive: boolean;
  _count: { deposits: number };
}

export default function AdminVaultsPage() {
  const [vaults, setVaults] = useState<Vault[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVault, setEditingVault] = useState<Vault | null>(null);

  useEffect(() => {
    fetchVaults();
  }, []);

  const fetchVaults = async () => {
    try {
      const res = await fetch('/api/admin/vaults');
      const data = await res.json();
      setVaults(data);
    } catch (error) {
      console.error('Error fetching vaults:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (vault: Vault) => {
    try {
      await fetch(`/api/admin/vaults/${vault.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseApyPercent: vault.baseApyBps / 100,
          boostApyPercent: vault.boostApyBps / 100,
          maxApyPercent: vault.maxApyBps / 100,
          takaraMiningAprPercent: vault.takaraMiningAprBps / 100,
          minEntryUsdt: vault.minEntryUsdt,
          durationMonths: vault.durationMonths,
          boostRatio: vault.boostRatio,
          isActive: vault.isActive,
        }),
      });
      
      setEditingVault(null);
      fetchVaults();
    } catch (error) {
      console.error('Error saving vault:', error);
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Управление Vaults</h1>

      <div className="space-y-6">
        {vaults.map((vault) => (
          <div key={vault.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">{vault.name}</h2>
                <p className="text-gray-400">{vault._count.deposits} депозитов</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm ${
                  vault.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {vault.isActive ? 'Активен' : 'Отключен'}
                </span>
                <button
                  onClick={() => setEditingVault(vault)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
                >
                  Редактировать
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Базовый APY</p>
                <p className="text-white text-lg font-semibold">{(vault.baseApyBps / 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">{vault.boostToken} Boost</p>
                <p className="text-green-400 text-lg font-semibold">+{(vault.boostApyBps / 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Max APY</p>
                <p className="text-yellow-400 text-lg font-semibold">{(vault.maxApyBps / 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Takara APR</p>
                <p className="text-purple-400 text-lg font-semibold">{(vault.takaraMiningAprBps / 100).toFixed(0)}%</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Мин. депозит</p>
                <p className="text-white text-lg font-semibold">${vault.minEntryUsdt.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Срок</p>
                <p className="text-white text-lg font-semibold">{vault.durationMonths} мес.</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Boost Ratio</p>
                <p className="text-white text-lg font-semibold">{vault.boostRatio * 100}%</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Boost Token</p>
                <p className="text-white text-lg font-semibold">{vault.boostToken}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingVault && (
        <VaultEditModal
          vault={editingVault}
          onSave={handleSave}
          onClose={() => setEditingVault(null)}
        />
      )}
    </div>
  );
}

// Модальное окно редактирования
function VaultEditModal({ vault, onSave, onClose }: {
  vault: Vault;
  onSave: (vault: Vault) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    baseApyPercent: vault.baseApyBps / 100,
    boostApyPercent: vault.boostApyBps / 100,
    takaraMiningAprPercent: vault.takaraMiningAprBps / 100,
    minEntryUsdt: vault.minEntryUsdt,
    durationMonths: vault.durationMonths,
    boostRatio: vault.boostRatio,
    isActive: vault.isActive,
  });

  const handleSubmit = () => {
    onSave({
      ...vault,
      baseApyBps: Math.round(form.baseApyPercent * 100),
      boostApyBps: Math.round(form.boostApyPercent * 100),
      maxApyBps: Math.round((form.baseApyPercent + form.boostApyPercent) * 100),
      takaraMiningAprBps: Math.round(form.takaraMiningAprPercent * 100),
      minEntryUsdt: form.minEntryUsdt,
      durationMonths: form.durationMonths,
      boostRatio: form.boostRatio,
      isActive: form.isActive,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold text-white mb-6">
          Редактировать {vault.name}
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Базовый APY (%)</label>
              <input
                type="number"
                step="0.1"
                value={form.baseApyPercent}
                onChange={(e) => setForm({ ...form, baseApyPercent: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Boost APY (%)</label>
              <input
                type="number"
                step="0.1"
                value={form.boostApyPercent}
                onChange={(e) => setForm({ ...form, boostApyPercent: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Takara Mining APR (%)</label>
            <input
              type="number"
              step="1"
              value={form.takaraMiningAprPercent}
              onChange={(e) => setForm({ ...form, takaraMiningAprPercent: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Мин. депозит ($)</label>
              <input
                type="number"
                value={form.minEntryUsdt}
                onChange={(e) => setForm({ ...form, minEntryUsdt: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Срок (мес.)</label>
              <input
                type="number"
                value={form.durationMonths}
                onChange={(e) => setForm({ ...form, durationMonths: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Boost Ratio</label>
            <select
              value={form.boostRatio}
              onChange={(e) => setForm({ ...form, boostRatio: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
            >
              <option value={0.4}>40% (Laika)</option>
              <option value={1.0}>100% (Takara 1:1)</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800"
              />
              <span className="text-white">Vault активен</span>
            </label>
          </div>

          {/* Preview */}
          <div className="p-4 bg-gray-800 rounded-lg">
            <p className="text-gray-400 text-sm">Preview Max APY:</p>
            <p className="text-yellow-400 text-xl font-bold">
              {(form.baseApyPercent + form.boostApyPercent).toFixed(1)}% 
              <span className="text-gray-500 text-sm ml-2">
                (с множителем x1.3: {((form.baseApyPercent + form.boostApyPercent) * 1.3).toFixed(1)}%)
              </span>
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
          >
            Отмена
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 4.5 Checklist для админ-панели

- [ ] Создать AdminModule в NestJS
- [ ] Создать AdminController с endpoints
- [ ] Создать AdminService с логикой
- [ ] Добавить AdminGuard для защиты endpoints
- [ ] Создать admin layout
- [ ] Создать Dashboard page
- [ ] Создать Vaults management page
- [ ] Создать Deposits list page
- [ ] Создать Users list page
- [ ] Создать Claims list page
- [ ] Создать Settings page
- [ ] Добавить авторизацию админа
- [ ] Тестирование всех функций

---

## ✅ ЧАСТЬ 5: ПОЛНЫЙ CHECKLIST

### Критические исправления:

- [ ] **Кнопка кошелька** — создать WalletConnectModal, hook, интеграция
- [ ] **Калькулятор** — создать полноценный YieldCalculator
- [ ] **APY в бейджах** — показывать MAX с множителем x1.3
- [ ] **APY в БД** — обновить seed с правильными значениями:
  - Vault 1: 4.5% / 4% / 8.5%
  - Vault 2: 7% / 6% / 13%
  - Vault 3: 8% / 7% / 15%

### Админ-панель:

- [ ] Backend API для админки
- [ ] Dashboard со статистикой
- [ ] Управление Vaults (просмотр, редактирование APY)
- [ ] Список депозитов с фильтрами
- [ ] Список пользователей
- [ ] История claims
- [ ] Настройки платформы

### Общее:

- [ ] Провести полный аудит после исправлений
- [ ] Проверить все кнопки работают
- [ ] Проверить все формы отправляются
- [ ] Проверить console на ошибки
- [ ] Проверить расчёты калькулятора
- [ ] Проверить отображение APY везде

---

## 🚨 ВАЖНО

1. **Кошелёк должен работать!** Пользователь должен видеть выбор кошельков и успешно подключаться
2. **Калькулятор должен работать!** Все расчёты должны быть интерактивными и точными
3. **APY должны быть правильными везде** — в БД, API, карточках, калькуляторе
4. **Админка должна быть функциональной** — минимум просмотр и редактирование vaults

---

**END OF TASK DOCUMENT**

