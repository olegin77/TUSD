"use client";

import { useState, useEffect } from "react";
import { PageTransition } from "@/components/ui/page-transition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  Info,
  Calculator,
  Zap,
  Coins,
  Sparkles,
  TrendingUp,
  Lock,
  Wallet,
  Vault,
} from "lucide-react";
import { takaraApi, PoolYield } from "@/lib/api/takara";
import Link from "next/link";

// Payout frequency multipliers from TZ
const FREQUENCY_MULTIPLIERS = {
  MONTHLY: 1.0,
  QUARTERLY: 1.15,
  YEARLY: 1.3,
};

// Laika boost requirement: 40% of deposit value
const LAIKA_BOOST_REQUIREMENT = 0.4;

// Takara internal price
const TAKARA_INTERNAL_PRICE = 0.1;

// Vault type labels
const VAULT_LABELS: Record<string, string> = {
  VAULT_1: "Starter",
  VAULT_2: "Advanced",
  VAULT_3: "Whale",
};

export default function VaultsPage() {
  const [selectedVault, setSelectedVault] = useState<number | null>(null);
  const [depositAmount, setDepositAmount] = useState(100);
  const [payoutFrequency, setPayoutFrequency] = useState<"MONTHLY" | "QUARTERLY" | "YEARLY">(
    "MONTHLY"
  );
  const [laikaBalance, setLaikaBalance] = useState(0);
  const [takaraBalance, setTakaraBalance] = useState(0);
  const [laikaPrice, setLaikaPrice] = useState(0.05);
  const [vaultYields, setVaultYields] = useState<PoolYield[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch vault yields and Laika price from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [yields, priceData] = await Promise.all([
          takaraApi.getPoolYields(),
          takaraApi.getLaikaPrice(),
        ]);
        setVaultYields(yields);
        if (priceData?.discountedPrice) {
          setLaikaPrice(priceData.discountedPrice);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Build vaults from API data or fallback to TZ defaults
  const vaults =
    vaultYields.length > 0
      ? vaultYields.map((vy: any) => ({
          id: vy.id || vy.poolId,
          name: VAULT_LABELS[`VAULT_${vy.id || vy.poolId}`] || `Vault ${vy.id || vy.poolId}`,
          type: `VAULT_${vy.id || vy.poolId}`,
          baseApy: vy.base_usdt_apy || vy.usdtYield?.baseApy,
          boostedApy: vy.boosted_usdt_apy
            ? vy.boosted_usdt_apy - (vy.base_usdt_apy || 7)
            : vy.usdtYield?.maxLaikaBoost + vy.base_usdt_apy || vy.usdtYield?.baseApy,
          takaraApr: vy.takara_apr || vy.takaraYield?.apr,
          durationMonths: vy.duration_months || vy.lockMonths,
          minDeposit: vy.min_entry_amount || vy.minEntryAmount,
          description: getVaultDescription(vy.id || vy.poolId),
          boostToken: vy.id || vy.poolId === 1 ? "LAIKA" : "TAKARA",
          boostRatio: vy.id || vy.poolId === 1 ? 0.4 : 1.0,
          boostDiscount: vy.id || vy.poolId === 1 ? 0.15 : 0,
          // Mock batch data
          batchNumber: 1,
          currentLiquidity: 45000,
          targetLiquidity: 100000,
        }))
      : [
          // fix.md specification defaults
          {
            id: 1,
            name: "Starter",
            type: "VAULT_1",
            baseApy: 4.5,
            boostedApy: 8.5,
            takaraApr: 30,
            durationMonths: 12,
            minDeposit: 100,
            description: "Laika Boost. Срок 12 мес. Депозит от $100.",
            boostToken: "LAIKA",
            boostRatio: 0.4,
            boostDiscount: 0.15,
            batchNumber: 1,
            currentLiquidity: 45000,
            targetLiquidity: 100000,
          },
          {
            id: 2,
            name: "Advanced",
            type: "VAULT_2",
            baseApy: 7,
            boostedApy: 13,
            takaraApr: 30,
            durationMonths: 30,
            minDeposit: 1500,
            description: "Takara Boost. Срок 30 мес. Депозит от $1,500.",
            boostToken: "TAKARA",
            boostRatio: 1.0,
            boostDiscount: 0,
            batchNumber: 1,
            currentLiquidity: 72000,
            targetLiquidity: 100000,
          },
          {
            id: 3,
            name: "Whale",
            type: "VAULT_3",
            baseApy: 8,
            boostedApy: 15,
            takaraApr: 40,
            durationMonths: 36,
            minDeposit: 5000,
            description: "Takara Boost. Срок 36 мес. Депозит от $5,000.",
            boostToken: "TAKARA",
            boostRatio: 1.0,
            boostDiscount: 0,
            batchNumber: 1,
            currentLiquidity: 28000,
            targetLiquidity: 100000,
          },
        ];

  function getVaultDescription(vaultId: number): string {
    switch (vaultId) {
      case 1:
        return "Laika Boost. Срок 12 мес. Депозит от $100. Идеален для начинающих.";
      case 2:
        return "Takara Boost. Срок 30 мес. Депозит от $1,500. Оптимальный баланс.";
      case 3:
        return "Takara Boost. Срок 36 мес. Депозит от $5,000. Максимальная доходность.";
      default:
        return "Cross-chain хранилище: USDT на TRON + Takara на Solana";
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate Laika boost eligibility (Vault 1)
  const calculateLaikaRequirement = (depositUsd: number) => {
    return depositUsd * LAIKA_BOOST_REQUIREMENT;
  };

  const isLaikaBoostEligible = (
    depositUsd: number,
    userLaikaBalance: number,
    discountedPrice: number
  ) => {
    const laikaValueUsd = userLaikaBalance * discountedPrice;
    const requiredUsd = calculateLaikaRequirement(depositUsd);
    return laikaValueUsd >= requiredUsd;
  };

  // Calculate Takara boost eligibility (Vault 2, 3)
  const isTakaraBoostEligible = (depositUsd: number, userTakaraBalance: number) => {
    const takaraValueUsd = userTakaraBalance * TAKARA_INTERNAL_PRICE;
    return takaraValueUsd >= depositUsd; // 1:1 ratio
  };

  // Calculate effective USDT APY with frequency multiplier
  const calculateEffectiveApy = (
    baseApy: number,
    boostedApy: number,
    hasBoost: boolean,
    frequency: keyof typeof FREQUENCY_MULTIPLIERS
  ) => {
    const apy = hasBoost ? boostedApy : baseApy;
    return apy * FREQUENCY_MULTIPLIERS[frequency];
  };

  // Calculate rewards
  const selectedVaultData = selectedVault ? vaults.find((v) => v.id === selectedVault) : null;

  // Boost checks
  const laikaRequiredUsd = selectedVaultData ? calculateLaikaRequirement(depositAmount) : 0;
  const laikaRequiredTokens = laikaPrice > 0 ? laikaRequiredUsd / laikaPrice : 0;
  const takaraRequiredTokens = depositAmount / TAKARA_INTERNAL_PRICE;

  const hasBoost = selectedVaultData
    ? selectedVaultData.boostToken === "LAIKA"
      ? isLaikaBoostEligible(depositAmount, laikaBalance, laikaPrice)
      : isTakaraBoostEligible(depositAmount, takaraBalance)
    : false;

  const effectiveApy = selectedVaultData
    ? calculateEffectiveApy(
        selectedVaultData.baseApy,
        selectedVaultData.boostedApy,
        hasBoost,
        payoutFrequency
      )
    : 0;

  // USDT daily reward
  const dailyUsdtReward = selectedVaultData ? (depositAmount * effectiveApy) / 100 / 365 : 0;

  // Takara daily reward (in tokens)
  const dailyTakaraReward = selectedVaultData
    ? (depositAmount * selectedVaultData.takaraApr) / 100 / 365 / TAKARA_INTERNAL_PRICE
    : 0;

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Vault className="h-8 w-8 text-amber-600" />
              TAKARA Хранилища (Vaults)
            </h1>
            <p className="text-gray-600">
              Кросс-чейн инвестиционные хранилища: депозиты в USDT (TRC20 на TRON), награды в USDT +
              Takara (SPL на Solana)
            </p>
          </div>

          {/* Info Banner */}
          <Card className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-900 mb-1">Как работают TAKARA Хранилища:</p>
                  <ul className="text-amber-800 space-y-1">
                    <li>
                      <strong>Депозит:</strong> USDT TRC20 на блокчейне TRON
                    </li>
                    <li>
                      <strong>Батч-система:</strong> Каждое хранилище собирает $100,000 перед
                      стартом начислений
                    </li>
                    <li>
                      <strong>USDT награды:</strong> Базовый APY + буст от Laika/Takara токенов
                    </li>
                    <li>
                      <strong>Takara Mining:</strong> 30-40% APR в токенах Takara (60% Total Supply
                      в пуле)
                    </li>
                    <li>
                      <strong>Claim Takara:</strong> 1 раз в неделю для Vault 1
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Vaults List */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Доступные хранилища
              </h2>
              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                </div>
              ) : (
                vaults.map((vault) => (
                  <Card
                    key={vault.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedVault === vault.id ? "ring-2 ring-amber-500" : ""
                    }`}
                    onClick={() => {
                      setSelectedVault(vault.id);
                      setDepositAmount(vault.minDeposit);
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl flex items-center gap-2">
                            <Lock className="h-4 w-4 text-gray-500" />
                            {vault.name}{" "}
                            <Badge variant="outline" className="ml-2">
                              Batch {vault.batchNumber}
                            </Badge>
                          </CardTitle>
                          <CardDescription>{vault.description}</CardDescription>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge
                            variant="outline"
                            className="text-lg font-bold bg-green-50 border-green-300 text-green-700"
                          >
                            <TrendingUp className="h-4 w-4 mr-1" />
                            до {vault.boostedApy}% APY
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-sm font-medium bg-amber-50 border-amber-300 text-amber-700"
                          >
                            <Coins className="h-3 w-3 mr-1" />
                            {vault.takaraApr}% Takara APR
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Batch Progress Bar */}
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">Заполнение батча:</span>
                          <span className="font-semibold">
                            {formatCurrency(vault.currentLiquidity)} /{" "}
                            {formatCurrency(vault.targetLiquidity)}
                          </span>
                        </div>
                        <Progress
                          value={(vault.currentLiquidity / vault.targetLiquidity) * 100}
                          className="h-3"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {((vault.currentLiquidity / vault.targetLiquidity) * 100).toFixed(1)}%
                          заполнено
                        </p>
                      </div>

                      {/* Yield Summary */}
                      <div className="grid grid-cols-4 gap-2 mb-4 p-3 bg-gradient-to-r from-green-50 via-blue-50 to-amber-50 rounded-lg">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Базовый APY</p>
                          <p className="font-bold text-green-600">{vault.baseApy}%</p>
                        </div>
                        <div className="text-center border-x border-gray-200">
                          <p className="text-xs text-gray-500">{vault.boostToken} Boost</p>
                          <p className="font-bold text-purple-600">
                            +{(vault.boostedApy - vault.baseApy).toFixed(1)}%
                          </p>
                        </div>
                        <div className="text-center border-r border-gray-200">
                          <p className="text-xs text-gray-500">Макс. APY (×1.3)</p>
                          <p className="font-bold text-blue-600">
                            {(vault.boostedApy * 1.3).toFixed(1)}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Takara APR</p>
                          <p className="font-bold text-amber-600">{vault.takaraApr}%</p>
                        </div>
                      </div>

                      {/* Boost Condition */}
                      <div className="p-3 bg-purple-50 rounded-lg mb-4">
                        <p className="text-sm font-medium text-purple-800 mb-1">
                          Условие буста ({vault.boostToken}):
                        </p>
                        <p className="text-xs text-purple-700">
                          {vault.boostToken === "LAIKA" ? (
                            <>
                              Хранить Laika на сумму <strong>40%</strong> от депозита (рыночная цена
                              с дисконтом <strong>-15%</strong>)
                            </>
                          ) : (
                            <>
                              Хранить Takara в соотношении <strong>1:1</strong> к депозиту
                              (фиксированный курс <strong>$0.10</strong>)
                            </>
                          )}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Мин. депозит</p>
                          <p className="font-semibold">{formatCurrency(vault.minDeposit)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Срок</p>
                          <p className="font-semibold">{vault.durationMonths} мес</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Сеть</p>
                          <p className="font-semibold text-red-600">TRON (TRC20)</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Investment Calculator */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Калькулятор доходности
              </h2>
              {selectedVaultData ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lock className="h-5 w-5 mr-2" />
                      {selectedVaultData.name}
                    </CardTitle>
                    <CardDescription>
                      {selectedVaultData.durationMonths} мес | Мин:{" "}
                      {formatCurrency(selectedVaultData.minDeposit)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Deposit Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="deposit-amount">Сумма депозита (USDT TRC20)</Label>
                      <Input
                        id="deposit-amount"
                        type="number"
                        value={depositAmount}
                        onChange={(e) =>
                          setDepositAmount(
                            Math.max(selectedVaultData.minDeposit, Number(e.target.value))
                          )
                        }
                        min={selectedVaultData.minDeposit}
                      />
                    </div>

                    {/* Payout Frequency */}
                    <div className="space-y-2">
                      <Label>Частота выплат (множитель APY)</Label>
                      <Select
                        value={payoutFrequency}
                        onValueChange={(v) => setPayoutFrequency(v as typeof payoutFrequency)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MONTHLY">Ежемесячно (×1.0)</SelectItem>
                          <SelectItem value="QUARTERLY">Ежеквартально (×1.15)</SelectItem>
                          <SelectItem value="YEARLY">Ежегодно (×1.30)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Boost Section */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-purple-500" />
                        <Label>{selectedVaultData.boostToken} Boost</Label>
                      </div>
                      {selectedVaultData.boostToken === "LAIKA" ? (
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">Ваш баланс Laika</Label>
                          <Input
                            type="number"
                            value={laikaBalance}
                            onChange={(e) => setLaikaBalance(Number(e.target.value))}
                            placeholder="0"
                          />
                          <div
                            className={`p-3 rounded-lg ${hasBoost ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"}`}
                          >
                            <p className="text-sm font-medium mb-2">
                              {hasBoost ? "Буст активен!" : "Условие буста:"}
                            </p>
                            <p className="text-xs text-gray-600">
                              Требуется: {formatCurrency(laikaRequiredUsd)} в Laika
                            </p>
                            <p className="text-xs text-gray-600">
                              ≈ {laikaRequiredTokens.toFixed(0)} LAIKA (цена: $
                              {laikaPrice.toFixed(4)} со скидкой 15%)
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label className="text-xs text-gray-500">Ваш баланс Takara</Label>
                          <Input
                            type="number"
                            value={takaraBalance}
                            onChange={(e) => setTakaraBalance(Number(e.target.value))}
                            placeholder="0"
                          />
                          <div
                            className={`p-3 rounded-lg ${hasBoost ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"}`}
                          >
                            <p className="text-sm font-medium mb-2">
                              {hasBoost ? "Буст активен!" : "Условие буста:"}
                            </p>
                            <p className="text-xs text-gray-600">
                              Требуется: {formatCurrency(depositAmount)} в Takara (1:1)
                            </p>
                            <p className="text-xs text-gray-600">
                              ≈ {takaraRequiredTokens.toFixed(0)} TAKARA (курс: $0.10)
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Results - USDT */}
                    <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-800">Доход в USDT (TRC20)</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Базовый APY:</span>
                          <span className="font-semibold">{selectedVaultData.baseApy}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>{selectedVaultData.boostToken} Boost:</span>
                          <span
                            className={`font-semibold ${hasBoost ? "text-green-600" : "text-gray-400"}`}
                          >
                            {hasBoost
                              ? `+${(selectedVaultData.boostedApy - selectedVaultData.baseApy).toFixed(1)}%`
                              : "0%"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Множитель ({payoutFrequency}):</span>
                          <span className="font-semibold">
                            ×{FREQUENCY_MULTIPLIERS[payoutFrequency]}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t border-green-300 pt-2">
                        <span>Итого APY:</span>
                        <span className="text-green-700">{effectiveApy.toFixed(2)}%</span>
                      </div>
                      <div className="text-sm space-y-1 border-t border-green-300 pt-2">
                        <div className="flex justify-between">
                          <span>Ежедневно:</span>
                          <span>{formatCurrency(dailyUsdtReward)} USDT</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ежемесячно:</span>
                          <span>{formatCurrency(dailyUsdtReward * 30)} USDT</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>За год:</span>
                          <span>{formatCurrency(dailyUsdtReward * 365)} USDT</span>
                        </div>
                      </div>
                    </div>

                    {/* Results - Takara */}
                    <div className="space-y-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h3 className="font-semibold text-amber-800">Майнинг Takara (Solana SPL)</h3>
                      <div className="flex justify-between text-sm">
                        <span>Takara APR:</span>
                        <span className="font-semibold">{selectedVaultData.takaraApr}%</span>
                      </div>
                      <div className="text-sm space-y-1 border-t border-amber-300 pt-2">
                        <div className="flex justify-between">
                          <span>Ежедневно:</span>
                          <span>{dailyTakaraReward.toFixed(2)} TAKARA</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Еженедельно:</span>
                          <span>{(dailyTakaraReward * 7).toFixed(2)} TAKARA</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>За год:</span>
                          <span>{(dailyTakaraReward * 365).toFixed(2)} TAKARA</span>
                        </div>
                      </div>
                      {selectedVaultData.type === "VAULT_1" && (
                        <p className="text-xs text-amber-700 mt-2">
                          * Claim доступен 1 раз в неделю
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                        size="lg"
                      >
                        Создать депозит в {selectedVaultData.name}
                      </Button>
                      <Button variant="outline" className="w-full">
                        Подключить TRON кошелек
                      </Button>
                    </div>

                    {/* Link to Calculator */}
                    <Link href="/calculator">
                      <Button
                        variant="outline"
                        className="w-full mt-4 border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        Детальный калькулятор Takara
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Выберите хранилище для расчета доходности</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
