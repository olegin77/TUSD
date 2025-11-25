"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageTransition } from "@/components/ui/page-transition";
import { Calculator, TrendingUp, DollarSign, Coins, Sparkles, Clock, ArrowRight } from "lucide-react";
import { takaraApi, PoolYield, YieldSimulation, PayoutFrequency } from "@/lib/api/takara";

export default function YieldCalculatorPage() {
  const [poolYields, setPoolYields] = useState<PoolYield[]>([]);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);
  const [simulation, setSimulation] = useState<YieldSimulation | null>(null);

  // Form state
  const [depositAmount, setDepositAmount] = useState<string>("10000");
  const [selectedPoolId, setSelectedPoolId] = useState<string>("");
  const [payoutFrequency, setPayoutFrequency] = useState<PayoutFrequency>("MONTHLY");
  const [laikaBalance, setLaikaBalance] = useState<string>("0");

  // Fetch pool yields on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const yields = await takaraApi.getPoolYields();
        setPoolYields(yields);
        if (yields.length > 0) {
          setSelectedPoolId(String(yields[0].poolId));
        }
      } catch (error) {
        console.error("Failed to fetch pool yields:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate yield simulation
  const handleSimulate = async () => {
    if (!depositAmount || !selectedPoolId) return;

    setSimulating(true);
    try {
      const result = await takaraApi.simulateYield({
        depositAmountUsd: parseFloat(depositAmount),
        poolId: parseInt(selectedPoolId),
        payoutFrequency,
        laikaBalance: parseFloat(laikaBalance) || undefined,
      });
      setSimulation(result);
    } catch (error) {
      console.error("Simulation failed:", error);
    } finally {
      setSimulating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const selectedPool = poolYields.find(p => String(p.poolId) === selectedPoolId);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Calculator className="h-8 w-8 text-amber-600" />
              Калькулятор доходности
            </h1>
            <p className="text-gray-600">
              Рассчитайте потенциальный доход от депозита с учетом USDT и Takara наград
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Calculator Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Параметры депозита</CardTitle>
                  <CardDescription>Введите данные для расчета доходности</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Deposit Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Сумма депозита (USD)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="amount"
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        className="pl-10"
                        min="1000"
                        step="100"
                      />
                    </div>
                  </div>

                  {/* Pool Selection */}
                  <div className="space-y-2">
                    <Label>Выберите пул</Label>
                    <Select value={selectedPoolId} onValueChange={setSelectedPoolId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите пул" />
                      </SelectTrigger>
                      <SelectContent>
                        {poolYields.map((pool) => (
                          <SelectItem key={pool.poolId} value={String(pool.poolId)}>
                            Пул {pool.lockMonths} мес. - до {formatPercent(pool.usdtYield.maxApyYearly)} APY
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedPool && (
                      <p className="text-sm text-gray-500">
                        Мин. вход: {formatCurrency(selectedPool.minEntryAmount)} |
                        Takara APR: {formatPercent(selectedPool.takaraYield.apr)}
                      </p>
                    )}
                  </div>

                  {/* Payout Frequency */}
                  <div className="space-y-2">
                    <Label>Частота выплат</Label>
                    <Select value={payoutFrequency} onValueChange={(v) => setPayoutFrequency(v as PayoutFrequency)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MONTHLY">Ежемесячно (1.0x)</SelectItem>
                        <SelectItem value="QUARTERLY">Ежеквартально (1.15x)</SelectItem>
                        <SelectItem value="YEARLY">Ежегодно (1.30x)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Laika Balance */}
                  <div className="space-y-2">
                    <Label htmlFor="laika" className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      Баланс Laika (для буста)
                    </Label>
                    <Input
                      id="laika"
                      type="number"
                      value={laikaBalance}
                      onChange={(e) => setLaikaBalance(e.target.value)}
                      min="0"
                      step="1000"
                    />
                    <p className="text-xs text-gray-500">
                      Держите Laika на 40% от депозита для максимального APY буста
                    </p>
                  </div>

                  <Button
                    onClick={handleSimulate}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    disabled={simulating || !depositAmount || !selectedPoolId}
                  >
                    {simulating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Calculator className="h-4 w-4 mr-2" />
                    )}
                    Рассчитать доход
                  </Button>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-6">
                {simulation ? (
                  <>
                    {/* Summary Card */}
                    <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Результаты расчета</span>
                          <Badge className={simulation.laikaBoostInfo.isEligible ? "bg-green-600" : "bg-gray-500"}>
                            {simulation.laikaBoostInfo.isEligible ? "Буст активен" : "Без буста"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Пул {simulation.lockPeriodMonths} мес. | {formatCurrency(simulation.depositAmount)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-white rounded-lg shadow-sm">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                              <TrendingUp className="h-4 w-4" />
                              USDT APY
                            </div>
                            <p className="text-2xl font-bold text-green-600">
                              {formatPercent(simulation.withBoost?.usdtApy || simulation.withoutBoost.usdtApy)}
                            </p>
                          </div>
                          <div className="p-4 bg-white rounded-lg shadow-sm">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                              <Coins className="h-4 w-4" />
                              Takara APR
                            </div>
                            <p className="text-2xl font-bold text-amber-600">
                              {formatPercent(simulation.withoutBoost.takaraApr)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Monthly Rewards */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Ежемесячные награды
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-5 w-5 text-green-600" />
                              <span className="font-medium">USDT</span>
                            </div>
                            <span className="text-xl font-bold text-green-600">
                              {formatCurrency(simulation.withBoost?.monthlyUsdtReward || simulation.withoutBoost.monthlyUsdtReward)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Coins className="h-5 w-5 text-amber-600" />
                              <span className="font-medium">Takara</span>
                            </div>
                            <span className="text-xl font-bold text-amber-600">
                              {(simulation.withBoost?.monthlyTakaraReward || simulation.withoutBoost.monthlyTakaraReward).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Annual Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Годовая доходность</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                          <p className="text-sm text-gray-600 mb-2">Общий годовой доход (USD)</p>
                          <p className="text-4xl font-bold text-green-700">
                            {formatCurrency(simulation.withBoost?.totalAnnualValue || simulation.withoutBoost.totalAnnualValue)}
                          </p>
                          {simulation.withBoost && simulation.withBoost.additionalAnnualValue > 0 && (
                            <p className="text-sm text-green-600 mt-2">
                              +{formatCurrency(simulation.withBoost.additionalAnnualValue)} благодаря Laika бусту
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Laika Boost Info */}
                    {!simulation.laikaBoostInfo.isEligible && (
                      <Card className="border-purple-200 bg-purple-50">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-purple-900">
                            <Sparkles className="h-5 w-5" />
                            Увеличьте доход с Laika
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <p className="text-sm text-purple-700">
                              Для активации буста нужно: <strong>{simulation.laikaBoostInfo.requiredForBoost.toLocaleString()}</strong> Laika
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-purple-600">Текущий баланс:</span>
                              <span className="font-bold">{simulation.laikaBoostInfo.currentBalance.toLocaleString()}</span>
                              <ArrowRight className="h-4 w-4 text-purple-400" />
                              <span className="text-purple-600">Нужно:</span>
                              <span className="font-bold">{simulation.laikaBoostInfo.requiredForBoost.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-purple-600">
                              Цена Laika со скидкой: {formatCurrency(simulation.laikaBoostInfo.discountedPrice)}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : (
                  <Card className="h-full flex items-center justify-center">
                    <CardContent className="text-center py-16">
                      <Calculator className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500 text-lg">
                        Введите параметры и нажмите "Рассчитать"
                      </p>
                      <p className="text-gray-400 text-sm mt-2">
                        для просмотра потенциальной доходности
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Pool Yields Overview */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Обзор пулов</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {poolYields.map((pool) => (
                <Card key={pool.poolId} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Пул {pool.lockMonths} месяцев</span>
                      <Badge variant="outline">{formatPercent(pool.takaraYield.apr)} Takara</Badge>
                    </CardTitle>
                    <CardDescription>
                      Минимальный вход: {formatCurrency(pool.minEntryAmount)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Базовый APY</span>
                        <span className="font-medium">{formatPercent(pool.usdtYield.baseApy)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Макс. Laika буст</span>
                        <span className="font-medium text-purple-600">+{formatPercent(pool.usdtYield.maxLaikaBoost)}</span>
                      </div>
                      <div className="h-px bg-gray-200"></div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Макс. APY (месячно)</span>
                        <span className="font-bold text-green-600">{formatPercent(pool.usdtYield.maxApyMonthly)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Макс. APY (квартал)</span>
                        <span className="font-bold text-green-600">{formatPercent(pool.usdtYield.maxApyQuarterly)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Макс. APY (год)</span>
                        <span className="font-bold text-green-600">{formatPercent(pool.usdtYield.maxApyYearly)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
