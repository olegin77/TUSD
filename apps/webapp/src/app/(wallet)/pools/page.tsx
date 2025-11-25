"use client";

import { useState, useEffect } from "react";
import { PageTransition } from "@/components/ui/page-transition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Clock, Info, Calculator, Zap, Coins, Sparkles, TrendingUp } from "lucide-react";
import { takaraApi, PoolYield } from "@/lib/api/takara";
import Link from "next/link";

// Force dynamic rendering for this page - disable static generation

export default function PoolsPage() {
  const [selectedPool, setSelectedPool] = useState<number | null>(null);
  const [depositAmount, setDepositAmount] = useState(1000);
  const [boostPercentage, setBoostPercentage] = useState(0);
  const [poolYields, setPoolYields] = useState<PoolYield[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch pool yields from API
  useEffect(() => {
    const fetchYields = async () => {
      try {
        const yields = await takaraApi.getPoolYields();
        setPoolYields(yields);
      } catch (error) {
        console.error("Failed to fetch pool yields:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchYields();
  }, []);

  // Build pools from API data or fallback to defaults
  const pools = poolYields.length > 0 ? poolYields.map((py) => ({
    id: py.poolId,
    name: `${py.lockMonths} месяцев`,
    apy: py.usdtYield.baseApy,
    maxApy: py.usdtYield.maxApyMonthly,
    laikaBoost: py.usdtYield.maxLaikaBoost,
    takaraApr: py.takaraYield.apr,
    lockMonths: py.lockMonths,
    minDeposit: py.minEntryAmount,
    maxDeposit: py.minEntryAmount * 1000,
    description: py.lockMonths === 12
      ? "Краткосрочные инвестиции с умеренной доходностью"
      : py.lockMonths === 24
        ? "Среднесрочные инвестиции с повышенной доходностью"
        : "Долгосрочные инвестиции с максимальной доходностью",
    features: ["USDT награды", "Takara майнинг", "Laika буст"],
  })) : [
    {
      id: 1,
      name: "12 месяцев",
      apy: 18,
      maxApy: 23,
      laikaBoost: 5,
      takaraApr: 30,
      lockMonths: 12,
      minDeposit: 100,
      maxDeposit: 100000,
      description: "Краткосрочные инвестиции с умеренной доходностью",
      features: ["USDT награды", "Takara майнинг", "Laika буст"],
    },
    {
      id: 2,
      name: "24 месяца",
      apy: 24,
      maxApy: 31,
      laikaBoost: 7,
      takaraApr: 50,
      lockMonths: 24,
      minDeposit: 500,
      maxDeposit: 500000,
      description: "Среднесрочные инвестиции с повышенной доходностью",
      features: ["USDT награды", "Takara майнинг", "Laika буст"],
    },
    {
      id: 3,
      name: "36 месяцев",
      apy: 30,
      maxApy: 40,
      laikaBoost: 10,
      takaraApr: 75,
      lockMonths: 36,
      minDeposit: 1000,
      maxDeposit: 1000000,
      description: "Долгосрочные инвестиции с максимальной доходностью",
      features: ["USDT награды", "Takara майнинг", "Laika буст"],
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateBoostTarget = (amount: number) => {
    return Math.floor(amount * 0.3); // 30% от суммы депозита
  };

  const calculateBoostValue = (amount: number, percentage: number) => {
    return Math.floor(amount * 0.3 * (percentage / 100));
  };

  const calculateAPY = (baseAPY: number, boostValue: number, depositAmount: number) => {
    const boostAPY = Math.min(5, (boostValue / depositAmount) * 100 * 5); // Максимум 5%
    return baseAPY + boostAPY;
  };

  const calculateDailyReward = (amount: number, apy: number) => {
    return (amount * apy) / 100 / 365;
  };

  const selectedPoolData = selectedPool ? pools.find((p) => p.id === selectedPool) : null;
  const boostTarget = calculateBoostTarget(depositAmount);
  const boostValue = calculateBoostValue(depositAmount, boostPercentage);
  const effectiveAPY = selectedPoolData
    ? calculateAPY(selectedPoolData.apy, boostValue, depositAmount)
    : 0;
  const dailyReward = calculateDailyReward(depositAmount, effectiveAPY);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Инвестиционные пулы</h1>
            <p className="text-gray-600">Выберите подходящий пул для ваших инвестиций</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Pools List */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-semibold">Доступные пулы</h2>
              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                </div>
              ) : pools.map((pool) => (
                <Card
                  key={pool.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedPool === pool.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedPool(pool.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{pool.name}</CardTitle>
                        <CardDescription>{pool.description}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className="text-lg font-bold bg-green-50 border-green-300 text-green-700">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {pool.apy}% APY
                        </Badge>
                        <Badge variant="outline" className="text-sm font-medium bg-amber-50 border-amber-300 text-amber-700">
                          <Coins className="h-3 w-3 mr-1" />
                          +{pool.takaraApr}% Takara
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Yield Summary */}
                    <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gradient-to-r from-green-50 to-amber-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Базовый APY</p>
                        <p className="font-bold text-green-600">{pool.apy}%</p>
                      </div>
                      <div className="text-center border-x border-gray-200">
                        <p className="text-xs text-gray-500">Laika буст</p>
                        <p className="font-bold text-purple-600">+{pool.laikaBoost}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Макс. APY</p>
                        <p className="font-bold text-blue-600">{pool.maxApy}%</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Минимальный депозит</p>
                        <p className="font-semibold">{formatCurrency(pool.minDeposit)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Takara APR</p>
                        <p className="font-semibold text-amber-600">{pool.takaraApr}%</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Награды:</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          USDT
                        </Badge>
                        <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                          <Coins className="h-3 w-3 mr-1" />
                          Takara
                        </Badge>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Laika буст
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Investment Calculator */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Калькулятор инвестиций</h2>
              {selectedPoolData ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calculator className="h-5 w-5 mr-2" />
                      {selectedPoolData.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Deposit Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="deposit-amount">Сумма депозита (USDT)</Label>
                      <Input
                        id="deposit-amount"
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(Number(e.target.value))}
                        min={selectedPoolData.minDeposit}
                        max={selectedPoolData.maxDeposit}
                      />
                      <p className="text-xs text-gray-500">
                        От {formatCurrency(selectedPoolData.minDeposit)} до{" "}
                        {formatCurrency(selectedPoolData.maxDeposit)}
                      </p>
                    </div>

                    {/* Boost Configuration */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <Label>Буст-монета (опционально)</Label>
                      </div>
                      <div className="space-y-2">
                        <Label>Процент от целевого буста: {boostPercentage}%</Label>
                        <Slider
                          value={[boostPercentage]}
                          onValueChange={(value) => setBoostPercentage(value[0])}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>0%</span>
                          <span>100%</span>
                        </div>
                      </div>
                      <div className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm">
                          <strong>Целевой буст:</strong> {formatCurrency(boostTarget)}
                        </p>
                        <p className="text-sm">
                          <strong>Текущий буст:</strong> {formatCurrency(boostValue)}
                        </p>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold">Расчет доходности</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Базовый APY:</span>
                          <span className="font-semibold">{selectedPoolData.apy}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Буст APY:</span>
                          <span className="font-semibold">
                            +{(effectiveAPY - selectedPoolData.apy).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Эффективный APY:</span>
                        <span className="text-blue-600">{effectiveAPY.toFixed(1)}%</span>
                      </div>
                      <div className="border-t pt-2 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Ежедневная награда:</span>
                          <span className="font-semibold">{formatCurrency(dailyReward)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Месячная награда:</span>
                          <span className="font-semibold">{formatCurrency(dailyReward * 30)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Годовая награда:</span>
                          <span className="font-semibold">{formatCurrency(dailyReward * 365)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button className="w-full" size="lg">
                        Создать депозит
                      </Button>
                      <Button variant="outline" className="w-full">
                        Подключить кошелек
                      </Button>
                    </div>

                    {/* Info */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Info className="h-4 w-4 text-blue-500 mt-0.5" />
                        <div className="text-xs text-gray-600">
                          <p>• USDT награды (TRC20 на TRON)</p>
                          <p>• Takara майнинг (SPL на Solana)</p>
                          <p>• Laika буст: +APY за холд токенов</p>
                        </div>
                      </div>
                    </div>

                    {/* Link to Calculator */}
                    <Link href="/calculator">
                      <Button variant="outline" className="w-full mt-4 border-amber-300 text-amber-700 hover:bg-amber-50">
                        <Calculator className="h-4 w-4 mr-2" />
                        Детальный калькулятор доходности
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Выберите пул для расчета инвестиций</p>
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
