"use client";

import React, { useState, useEffect } from "react";
import {
  useBoostCalculation,
  useApplyBoost,
  useValidateToken,
  useBoostUtils,
} from "@/hooks/useBoost";
import { usePrice } from "@/hooks/useOracle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2,
  Info,
  Target,
  DollarSign,
} from "lucide-react";

interface BoostApplicationProps {
  wexelId: number;
  principalUsd: number;
  currentApyBoostBp: number;
  maxApyBoostBp: number;
  onBoostApplied?: () => void;
}

export const BoostApplication: React.FC<BoostApplicationProps> = ({
  wexelId,
  principalUsd,
  currentApyBoostBp,
  maxApyBoostBp,
  onBoostApplied,
}) => {
  const [tokenMint, setTokenMint] = useState("");
  const [amount, setAmount] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);

  const { data: priceData } = usePrice(tokenMint, !!tokenMint);
  const { data: isValidToken } = useValidateToken(tokenMint, !!tokenMint);
  const { data: calculation, isLoading: isCalculationLoading } = useBoostCalculation(
    wexelId,
    tokenMint,
    amount,
    !!tokenMint && !!amount
  );
  const applyBoostMutation = useApplyBoost();
  const { formatAmount, formatCurrency, formatPercentage, calculateBoostProgress } =
    useBoostUtils();

  // Calculate target value (30% of principal)
  const targetValueUsd = principalUsd * 0.3;
  const currentBoostValue = calculation?.valueUsd || 0;
  const totalBoostValue = currentBoostValue + (currentApyBoostBp / 10000) * principalUsd;
  const remainingCapacity = Math.max(0, targetValueUsd - totalBoostValue);
  const boostProgress = calculateBoostProgress(totalBoostValue, targetValueUsd);

  const handleApplyBoost = async () => {
    if (!calculation || !calculation.isValid) return;

    try {
      const success = await applyBoostMutation.mutateAsync({
        wexelId,
        boostRequest: {
          tokenMint: calculation.tokenMint,
          amount: amount,
          priceUsd: calculation.priceUsd,
          valueUsd: calculation.valueUsd,
          apyBoostBp: calculation.apyBoostBp,
        },
      });

      if (success) {
        setTokenMint("");
        setAmount("");
        onBoostApplied?.();
      }
    } catch (error) {
      console.error("Failed to apply boost:", error);
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (value && tokenMint) {
      setIsCalculating(true);
      // Debounce calculation
      setTimeout(() => setIsCalculating(false), 500);
    }
  };

  const isMaxBoost = currentApyBoostBp >= maxApyBoostBp;
  const canApplyBoost = calculation?.isValid && !isMaxBoost && !applyBoostMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <span>Применить буст</span>
        </CardTitle>
        <CardDescription>
          Добавьте токены для увеличения APY до +{formatPercentage(maxApyBoostBp / 100)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Boost Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Текущий буст APY</span>
            <Badge variant="outline" className="text-green-600">
              +{formatPercentage(currentApyBoostBp / 100)}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Прогресс буста</span>
              <span>{formatPercentage(boostProgress)}</span>
            </div>
            <Progress value={boostProgress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {formatCurrency(totalBoostValue)} / {formatCurrency(targetValueUsd)}
              </span>
              <span>Осталось: {formatCurrency(remainingCapacity)}</span>
            </div>
          </div>
        </div>

        {isMaxBoost ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Максимальный буст APY достигнут (+{formatPercentage(maxApyBoostBp / 100)})
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Token Input */}
            <div className="space-y-2">
              <Label htmlFor="token-mint">Адрес токена</Label>
              <Input
                id="token-mint"
                placeholder="Введите адрес токена (mint address)"
                value={tokenMint}
                onChange={(e) => setTokenMint(e.target.value)}
                disabled={applyBoostMutation.isPending}
              />
              {tokenMint && (
                <div className="flex items-center space-x-2 text-sm">
                  {isValidToken === undefined ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isValidToken ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className={isValidToken ? "text-green-600" : "text-red-600"}>
                    {isValidToken === undefined
                      ? "Проверка токена..."
                      : isValidToken
                        ? "Токен поддерживается"
                        : "Токен не поддерживается"}
                  </span>
                </div>
              )}
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount">Количество токенов</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                disabled={!isValidToken || applyBoostMutation.isPending}
              />
              {priceData && amount && (
                <div className="text-sm text-gray-500">
                  ≈ {formatCurrency(Number(amount) * priceData.priceUsd)} USD
                </div>
              )}
            </div>

            {/* Calculation Results */}
            {calculation && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Результат расчета</span>
                  {calculation.isValid ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>

                {calculation.isValid ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Добавленный APY</span>
                      <Badge className="bg-green-100 text-green-800">
                        +{formatPercentage(calculation.apyBoostBp / 100)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Стоимость в USD</span>
                      <span className="font-medium">{formatCurrency(calculation.valueUsd)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Цена токена</span>
                      <span>{formatCurrency(calculation.priceUsd)}</span>
                    </div>
                  </div>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{calculation.error}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Apply Button */}
            <Button onClick={handleApplyBoost} disabled={!canApplyBoost} className="w-full">
              {applyBoostMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              {applyBoostMutation.isPending ? "Применение..." : "Применить буст"}
            </Button>
          </>
        )}

        {/* Info */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1 text-sm">
              <p>• Максимальный буст: {formatPercentage(maxApyBoostBp / 100)} APY</p>
              <p>• Целевое значение: {formatPercentage(30)} от основной суммы</p>
              <p>• Цены обновляются в реальном времени</p>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
