"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Clock, Info, Calculator, Zap } from "lucide-react";

export default function PoolsPage() {
  const [selectedPool, setSelectedPool] = useState<number | null>(null);
  const [depositAmount, setDepositAmount] = useState(1000);
  const [boostPercentage, setBoostPercentage] = useState(0);

  const pools = [
    {
      id: 1,
      name: "12 месяцев",
      apy: 18,
      lockMonths: 12,
      minDeposit: 100,
      maxDeposit: 100000,
      description: "Краткосрочные инвестиции с умеренной доходностью",
      features: ["Ежедневные выплаты", "Возможность залога", "Низкий риск"],
    },
    {
      id: 2,
      name: "24 месяца",
      apy: 24,
      lockMonths: 24,
      minDeposit: 500,
      maxDeposit: 500000,
      description: "Среднесрочные инвестиции с повышенной доходностью",
      features: ["Ежедневные выплаты", "Возможность залога", "Средний риск"],
    },
    {
      id: 3,
      name: "36 месяцев",
      apy: 30,
      lockMonths: 36,
      minDeposit: 1000,
      maxDeposit: 1000000,
      description: "Долгосрочные инвестиции с максимальной доходностью",
      features: ["Ежедневные выплаты", "Возможность залога", "Высокий риск"],
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

            {pools.map((pool) => (
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
                    <Badge variant="outline" className="text-lg font-bold">
                      {pool.apy}% APY
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Минимальный депозит</p>
                      <p className="font-semibold">{formatCurrency(pool.minDeposit)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Максимальный депозит</p>
                      <p className="font-semibold">{formatCurrency(pool.maxDeposit)}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium">Особенности:</p>
                    <ul className="space-y-1">
                      {pool.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
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
                      <div className="flex justify-between text-lg font-bold">
                        <span>Эффективный APY:</span>
                        <span className="text-blue-600">{effectiveAPY.toFixed(1)}%</span>
                      </div>
                    </div>

                    <div className="border-t pt-2">
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
                        <p>• Награды начисляются ежедневно</p>
                        <p>• Возможность залога под 60% стоимости</p>
                        <p>• Досрочное погашение недоступно</p>
                      </div>
                    </div>
                  </div>
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
  );
}
