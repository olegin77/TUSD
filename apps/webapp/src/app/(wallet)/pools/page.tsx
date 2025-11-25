"use client";

import { useState, useEffect } from "react";
import { PageTransition } from "@/components/ui/page-transition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Info, Calculator, Zap, Coins, Sparkles, TrendingUp, Lock, Wallet } from "lucide-react";
import { takaraApi, PoolYield } from "@/lib/api/takara";
import Link from "next/link";

// Payout frequency multipliers from TZ
const FREQUENCY_MULTIPLIERS = {
  MONTHLY: 1.0,
  QUARTERLY: 1.15,
  YEARLY: 1.30,
};

// Laika boost requirement: 40% of deposit value
const LAIKA_BOOST_REQUIREMENT = 0.40;

export default function PoolsPage() {
  const [selectedPool, setSelectedPool] = useState<number | null>(null);
  const [depositAmount, setDepositAmount] = useState(100);
  const [payoutFrequency, setPayoutFrequency] = useState<"MONTHLY" | "QUARTERLY" | "YEARLY">("MONTHLY");
  const [laikaBalance, setLaikaBalance] = useState(0);
  const [laikaPrice, setLaikaPrice] = useState(0.05); // Default price
  const [poolYields, setPoolYields] = useState<PoolYield[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch pool yields and Laika price from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [yields, priceData] = await Promise.all([
          takaraApi.getPoolYields(),
          takaraApi.getLaikaPrice(),
        ]);
        setPoolYields(yields);
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

  // Build pools from API data or fallback to TZ defaults
  const pools =
    poolYields.length > 0
      ? poolYields.map((py) => ({
          id: py.poolId,
          name: `${py.lockMonths} ${py.lockMonths === 12 ? "месяцев" : py.lockMonths === 24 ? "месяца" : "месяцев"}`,
          baseApy: py.usdtYield.baseApy,
          laikaBoostMax: py.usdtYield.maxLaikaBoost,
          takaraApr: py.takaraYield.apr,
          lockMonths: py.lockMonths,
          minDeposit: py.minEntryAmount,
          description: getPoolDescription(py.lockMonths),
          network: "TRON",
        }))
      : [
          // TZ fallback values
          {
            id: 1,
            name: "12 месяцев",
            baseApy: 4,
            laikaBoostMax: 2,
            takaraApr: 30,
            lockMonths: 12,
            minDeposit: 100,
            description: "Начальный уровень. Депозит от $100. Идеален для знакомства с платформой.",
            network: "TRON",
          },
          {
            id: 2,
            name: "24 месяца",
            baseApy: 4,
            laikaBoostMax: 3,
            takaraApr: 50,
            lockMonths: 24,
            minDeposit: 1500,
            description: "Средний уровень. Депозит от $1,500. Повышенная доходность в Takara.",
            network: "TRON",
          },
          {
            id: 3,
            name: "36 месяцев",
            baseApy: 4,
            laikaBoostMax: 4,
            takaraApr: 75,
            lockMonths: 36,
            minDeposit: 5000,
            description: "Премиум уровень. Депозит от $5,000. Максимальный APR в Takara.",
            network: "TRON",
          },
        ];

  function getPoolDescription(months: number): string {
    switch (months) {
      case 12:
        return "Начальный уровень. Депозит от $100. Идеален для знакомства с платформой.";
      case 24:
        return "Средний уровень. Депозит от $1,500. Повышенная доходность в Takara.";
      case 36:
        return "Премиум уровень. Депозит от $5,000. Максимальный APR в Takara.";
      default:
        return "Cross-chain доходность: USDT на TRON + Takara на Solana";
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

  // Calculate Laika boost eligibility (TZ: 40% of deposit in Laika at discounted price)
  const calculateLaikaRequirement = (depositUsd: number) => {
    return depositUsd * LAIKA_BOOST_REQUIREMENT;
  };

  const isLaikaBoostEligible = (depositUsd: number, userLaikaBalance: number, discountedPrice: number) => {
    const laikaValueUsd = userLaikaBalance * discountedPrice;
    const requiredUsd = calculateLaikaRequirement(depositUsd);
    return laikaValueUsd >= requiredUsd;
  };

  // Calculate effective USDT APY with frequency multiplier
  const calculateEffectiveApy = (
    baseApy: number,
    laikaBoostMax: number,
    hasBoost: boolean,
    frequency: keyof typeof FREQUENCY_MULTIPLIERS
  ) => {
    const totalApy = baseApy + (hasBoost ? laikaBoostMax : 0);
    return totalApy * FREQUENCY_MULTIPLIERS[frequency];
  };

  // Calculate rewards
  const selectedPoolData = selectedPool ? pools.find((p) => p.id === selectedPool) : null;
  const laikaRequiredUsd = calculateLaikaRequirement(depositAmount);
  const laikaRequiredTokens = laikaPrice > 0 ? laikaRequiredUsd / laikaPrice : 0;
  const hasLaikaBoost = isLaikaBoostEligible(depositAmount, laikaBalance, laikaPrice);

  const effectiveApy = selectedPoolData
    ? calculateEffectiveApy(
        selectedPoolData.baseApy,
        selectedPoolData.laikaBoostMax,
        hasLaikaBoost,
        payoutFrequency
      )
    : 0;

  // USDT daily reward
  const dailyUsdtReward = selectedPoolData ? (depositAmount * effectiveApy / 100) / 365 : 0;

  // Takara daily reward (in tokens, based on internal price)
  const takaraInternalPrice = 0.10; // Example internal price
  const dailyTakaraReward = selectedPoolData
    ? (depositAmount * selectedPoolData.takaraApr / 100 / 365) / takaraInternalPrice
    : 0;

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cross-Chain Инвестиционные Пулы</h1>
            <p className="text-gray-600">
              Гибридная система доходности: депозиты в USDT (TRC20 на TRON), награды в USDT + Takara (SPL на Solana)
            </p>
          </div>

          {/* Info Banner */}
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">Как работает Cross-Chain доходность:</p>
                  <ul className="text-blue-800 space-y-1">
                    <li>• <strong>Депозит:</strong> USDT TRC20 на блокчейне TRON</li>
                    <li>• <strong>Награды USDT:</strong> Базовый APY 4% + до {pools[2]?.laikaBoostMax || 4}% буст от Laika</li>
                    <li>• <strong>Награды Takara:</strong> Майнинг токенов на Solana (60% от Total Supply в пуле)</li>
                    <li>• <strong>Laika Boost:</strong> Требуется 40% от суммы депозита в токенах Laika (цена со скидкой -15%)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pools List */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Доступные пулы
              </h2>
              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                </div>
              ) : (
                pools.map((pool) => (
                  <Card
                    key={pool.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedPool === pool.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => {
                      setSelectedPool(pool.id);
                      setDepositAmount(pool.minDeposit);
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl flex items-center gap-2">
                            <Lock className="h-4 w-4 text-gray-500" />
                            {pool.name}
                          </CardTitle>
                          <CardDescription>{pool.description}</CardDescription>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge
                            variant="outline"
                            className="text-lg font-bold bg-green-50 border-green-300 text-green-700"
                          >
                            <TrendingUp className="h-4 w-4 mr-1" />
                            {pool.baseApy}% APY
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-sm font-medium bg-amber-50 border-amber-300 text-amber-700"
                          >
                            <Coins className="h-3 w-3 mr-1" />
                            {pool.takaraApr}% Takara APR
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Yield Summary */}
                      <div className="grid grid-cols-4 gap-2 mb-4 p-3 bg-gradient-to-r from-green-50 via-blue-50 to-amber-50 rounded-lg">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Базовый APY</p>
                          <p className="font-bold text-green-600">{pool.baseApy}%</p>
                        </div>
                        <div className="text-center border-x border-gray-200">
                          <p className="text-xs text-gray-500">Laika Boost</p>
                          <p className="font-bold text-purple-600">+{pool.laikaBoostMax}%</p>
                        </div>
                        <div className="text-center border-r border-gray-200">
                          <p className="text-xs text-gray-500">Макс. USDT APY</p>
                          <p className="font-bold text-blue-600">
                            {((pool.baseApy + pool.laikaBoostMax) * 1.30).toFixed(1)}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Takara APR</p>
                          <p className="font-bold text-amber-600">{pool.takaraApr}%</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Минимальный депозит</p>
                          <p className="font-semibold">{formatCurrency(pool.minDeposit)} USDT</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Сеть депозита</p>
                          <p className="font-semibold text-red-600">{pool.network} (TRC20)</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Награды:</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            USDT (TRC20)
                          </Badge>
                          <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                            <Coins className="h-3 w-3 mr-1" />
                            Takara (Solana)
                          </Badge>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Laika Boost
                          </Badge>
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
              {selectedPoolData ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lock className="h-5 w-5 mr-2" />
                      {selectedPoolData.name}
                    </CardTitle>
                    <CardDescription>
                      Мин. депозит: {formatCurrency(selectedPoolData.minDeposit)}
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
                        onChange={(e) => setDepositAmount(Math.max(selectedPoolData.minDeposit, Number(e.target.value)))}
                        min={selectedPoolData.minDeposit}
                      />
                      <p className="text-xs text-gray-500">
                        Минимум: {formatCurrency(selectedPoolData.minDeposit)}
                      </p>
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

                    {/* Laika Boost */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-purple-500" />
                        <Label>Laika Boost (Solana)</Label>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-500">Ваш баланс Laika токенов</Label>
                        <Input
                          type="number"
                          value={laikaBalance}
                          onChange={(e) => setLaikaBalance(Number(e.target.value))}
                          placeholder="0"
                        />
                      </div>
                      <div className={`p-3 rounded-lg ${hasLaikaBoost ? "bg-green-50 border border-green-200" : "bg-yellow-50 border border-yellow-200"}`}>
                        <p className="text-sm font-medium mb-2">
                          {hasLaikaBoost ? "✅ Буст активен!" : "⚠️ Условие буста:"}
                        </p>
                        <p className="text-xs text-gray-600">
                          Требуется: {formatCurrency(laikaRequiredUsd)} в Laika
                        </p>
                        <p className="text-xs text-gray-600">
                          ≈ {laikaRequiredTokens.toFixed(0)} LAIKA (цена: ${laikaPrice.toFixed(4)})
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Формула: 40% от депозита × цена Laika со скидкой 15%
                        </p>
                      </div>
                    </div>

                    {/* Results - USDT */}
                    <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-800">Доход в USDT (TRC20)</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Базовый APY:</span>
                          <span className="font-semibold">{selectedPoolData.baseApy}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Laika Boost:</span>
                          <span className={`font-semibold ${hasLaikaBoost ? "text-green-600" : "text-gray-400"}`}>
                            {hasLaikaBoost ? `+${selectedPoolData.laikaBoostMax}%` : "0%"}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Множитель ({payoutFrequency}):</span>
                          <span className="font-semibold">×{FREQUENCY_MULTIPLIERS[payoutFrequency]}</span>
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
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Takara APR:</span>
                          <span className="font-semibold">{selectedPoolData.takaraApr}%</span>
                        </div>
                      </div>
                      <div className="text-sm space-y-1 border-t border-amber-300 pt-2">
                        <div className="flex justify-between">
                          <span>Ежедневно:</span>
                          <span>{dailyTakaraReward.toFixed(2)} TAKARA</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ежемесячно:</span>
                          <span>{(dailyTakaraReward * 30).toFixed(2)} TAKARA</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>За год:</span>
                          <span>{(dailyTakaraReward * 365).toFixed(2)} TAKARA</span>
                        </div>
                      </div>
                      <p className="text-xs text-amber-700">
                        * Майнинг из пула 60% от Total Supply
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700" size="lg">
                        Создать депозит в USDT
                      </Button>
                      <Button variant="outline" className="w-full">
                        Подключить TRON кошелек
                      </Button>
                    </div>

                    {/* Info */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                        <div className="text-xs text-gray-600 space-y-1">
                          <p>• <strong>Депозит:</strong> USDT TRC20 на TRON</p>
                          <p>• <strong>USDT награды:</strong> TRC20 на TRON</p>
                          <p>• <strong>Takara награды:</strong> SPL на Solana</p>
                          <p>• <strong>Laika буст:</strong> 40% от депозита в Laika</p>
                        </div>
                      </div>
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
                    <p className="text-gray-500">Выберите пул для расчета доходности</p>
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
