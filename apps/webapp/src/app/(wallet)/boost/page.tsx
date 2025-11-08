"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamicImport from "next/dynamic";
import { PageTransition } from "@/components/ui/page-transition";
import { useBoostStats } from "@/hooks/useBoost";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Zap, TrendingUp, Target, DollarSign, Info, AlertCircle } from "lucide-react";

// Force dynamic rendering for this page - disable static generation

// Dynamic imports to avoid SSR issues
const BoostApplication = dynamicImport(
  () =>
    import("@/components/boost/BoostApplication").then((mod) => ({
      default: mod.BoostApplication,
    })),
  { ssr: false }
);
const BoostHistory = dynamicImport(
  () => import("@/components/boost/BoostHistory").then((mod) => ({ default: mod.BoostHistory })),
  { ssr: false }
);

// Mock data for demonstration
const MOCK_WEXEL_ID = 1;
const MOCK_PRINCIPAL_USD = 10000;
const MOCK_CURRENT_APY_BOOST_BP = 200; // 2%
const MOCK_MAX_APY_BOOST_BP = 500; // 5%

export default function BoostPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("apply");
  const { data: boostStats, isLoading } = useBoostStats(MOCK_WEXEL_ID);

  const stats = boostStats || {
    wexelId: BigInt(MOCK_WEXEL_ID),
    principalUsd: MOCK_PRINCIPAL_USD,
    currentApyBoostBp: MOCK_CURRENT_APY_BOOST_BP,
    maxApyBoostBp: MOCK_MAX_APY_BOOST_BP,
    totalBoostValue: 2000,
    targetValueUsd: 3000,
    remainingCapacity: 1000,
    boostProgress: 66.67,
    isMaxBoost: false,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Система буст-монет</h1>
              <p className="text-xl text-gray-600">
                Увеличьте доходность ваших векселей с помощью буст-токенов
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-500">Основная сумма</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {formatCurrency(stats.principalUsd)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-500">Текущий буст APY</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    +{formatPercentage(stats.currentApyBoostBp / 100)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    <span className="text-sm font-medium text-gray-500">Прогресс буста</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{formatPercentage(stats.boostProgress)}</span>
                      <span>{formatCurrency(stats.targetValueUsd)}</span>
                    </div>
                    <Progress value={stats.boostProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-500">Осталось места</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600 mt-2">
                    {formatCurrency(stats.remainingCapacity)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="apply">Применить буст</TabsTrigger>
                <TabsTrigger value="history">История бустов</TabsTrigger>
              </TabsList>

              <TabsContent value="apply" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <BoostApplication
                    wexelId={MOCK_WEXEL_ID}
                    principalUsd={stats.principalUsd}
                    currentApyBoostBp={stats.currentApyBoostBp}
                    maxApyBoostBp={stats.maxApyBoostBp}
                    onBoostApplied={() => {
                      // Refresh stats
                      router.refresh();
                    }}
                  />

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Info className="h-5 w-5 text-blue-500" />
                        <span>Как работает буст</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-blue-600">1</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">Выберите токен</p>
                            <p className="text-xs text-gray-500">
                              Выберите поддерживаемый токен для буста
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-blue-600">2</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">Укажите количество</p>
                            <p className="text-xs text-gray-500">
                              Введите количество токенов для добавления
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-blue-600">3</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">Получите буст APY</p>
                            <p className="text-xs text-gray-500">
                              До +{formatPercentage(stats.maxApyBoostBp / 100)} дополнительного APY
                            </p>
                          </div>
                        </div>
                      </div>

                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          <div className="space-y-1">
                            <p>
                              • Максимальный буст: {formatPercentage(stats.maxApyBoostBp / 100)} APY
                            </p>
                            <p>• Целевое значение: {formatPercentage(30)} от основной суммы</p>
                            <p>• Цены обновляются в реальном времени</p>
                            <p>• Буст применяется немедленно</p>
                          </div>
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="history">
                <BoostHistory wexelId={MOCK_WEXEL_ID} />
              </TabsContent>
            </Tabs>

            {/* Supported Tokens */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Поддерживаемые токены</CardTitle>
                <CardDescription>
                  Список токенов, которые можно использовать для буста
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">S</span>
                    </div>
                    <div>
                      <p className="font-medium">Solana (SOL)</p>
                      <p className="text-xs text-gray-500">
                        So11111111111111111111111111111111111111112
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">U</span>
                    </div>
                    <div>
                      <p className="font-medium">USD Coin (USDC)</p>
                      <p className="text-xs text-gray-500">
                        EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">T</span>
                    </div>
                    <div>
                      <p className="font-medium">Tether USD (USDT)</p>
                      <p className="text-xs text-gray-500">
                        Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
