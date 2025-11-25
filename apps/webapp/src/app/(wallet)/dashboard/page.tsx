"use client";

import { useState, useEffect } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageTransition } from "@/components/ui/page-transition";
import { Wallet, TrendingUp, DollarSign, Clock, Shield, BarChart3, Plus, Eye, Coins, Pickaxe, Sparkles } from "lucide-react";
import { takaraApi, TakaraMiningStats, LaikaPrice } from "@/lib/api/takara";

// Force dynamic rendering for this page - disable static generation

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [miningStats, setMiningStats] = useState<TakaraMiningStats | null>(null);
  const [laikaPrice, setLaikaPrice] = useState<LaikaPrice | null>(null);
  const [takaraLoading, setTakaraLoading] = useState(true);

  // Fetch Takara data
  useEffect(() => {
    const fetchTakaraData = async () => {
      try {
        const [stats, price] = await Promise.all([
          takaraApi.getMiningStats(),
          takaraApi.getLaikaPrice(),
        ]);
        setMiningStats(stats);
        setLaikaPrice(price);
      } catch (error) {
        console.error("Failed to fetch Takara data:", error);
      } finally {
        setTakaraLoading(false);
      }
    };
    fetchTakaraData();
  }, []);

  // Mock data - в реальном приложении будет загружаться из API
  const portfolioData = {
    totalDeposits: 50000,
    totalRewards: 2500,
    pendingRewards: 150,
    activeWexels: 3,
    totalValue: 52500,
  };
  const wexels = [
    {
      id: 1,
      pool: "12 месяцев",
      apy: 18,
      boost: 5,
      principal: 20000,
      rewards: 1200,
      status: "active",
      daysLeft: 180,
    },
    {
      id: 2,
      pool: "24 месяца",
      apy: 24,
      boost: 3,
      principal: 15000,
      rewards: 800,
      status: "collateralized",
      daysLeft: 300,
    },
    {
      id: 3,
      pool: "36 месяцев",
      apy: 30,
      boost: 0,
      principal: 15000,
      rewards: 500,
      status: "active",
      daysLeft: 450,
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

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Дашборд</h1>
            <p className="text-gray-600">Обзор вашего портфеля и активных инвестиций</p>
          </div>
          {/* Portfolio Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Общий депозит</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(portfolioData.totalDeposits)}
                </div>
                <p className="text-xs text-muted-foreground">+12% с прошлого месяца</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Заработано наград</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(portfolioData.totalRewards)}
                </div>
                <p className="text-xs text-muted-foreground">+8% с прошлого месяца</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">К выплате</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(portfolioData.pendingRewards)}
                </div>
                <p className="text-xs text-muted-foreground">Доступно для вывода</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Активные векселя</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{portfolioData.activeWexels}</div>
                <p className="text-xs text-muted-foreground">В портфеле</p>
              </CardContent>
            </Card>
          </div>
          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Обзор</TabsTrigger>
              <TabsTrigger value="wexels">Мои векселя</TabsTrigger>
              <TabsTrigger value="analytics">Аналитика</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Быстрые действия</CardTitle>
                  <CardDescription>Управляйте своими инвестициями</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                      <Plus className="h-6 w-6" />
                      <span>Новый депозит</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                    >
                      <Shield className="h-6 w-6" />
                      <span>Заложить вексель</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                    >
                      <BarChart3 className="h-6 w-6" />
                      <span>Маркетплейс</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Последняя активность</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Депозит создан</p>
                          <p className="text-sm text-gray-500">Вексель #1234 - $20,000</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">2 часа назад</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">Награды начислены</p>
                          <p className="text-sm text-gray-500">+$45.20 к векселю #1234</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">1 день назад</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Takara Mining Section */}
              <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pickaxe className="h-5 w-5 text-amber-600" />
                    Takara Mining
                  </CardTitle>
                  <CardDescription>
                    Майнинг токенов Takara за ваши депозиты
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {takaraLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                    </div>
                  ) : miningStats ? (
                    <div className="space-y-6">
                      {/* Mining Status */}
                      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${miningStats.isMiningActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                          <span className="font-medium">
                            {miningStats.isMiningActive ? 'Майнинг активен' : 'Майнинг завершен'}
                          </span>
                        </div>
                        <Badge variant={miningStats.isMiningActive ? "default" : "secondary"}>
                          {miningStats.percentDistributed}% распределено
                        </Badge>
                      </div>

                      {/* Mining Stats Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <Coins className="h-4 w-4" />
                            Всего Takara
                          </div>
                          <p className="text-xl font-bold text-gray-900">
                            {miningStats.totalSupply.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <Pickaxe className="h-4 w-4" />
                            Пул майнинга
                          </div>
                          <p className="text-xl font-bold text-amber-600">
                            {miningStats.miningPoolTotal.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <TrendingUp className="h-4 w-4" />
                            Распределено
                          </div>
                          <p className="text-xl font-bold text-green-600">
                            {miningStats.miningPoolDistributed.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-4 bg-white rounded-lg shadow-sm">
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <DollarSign className="h-4 w-4" />
                            Цена Takara
                          </div>
                          <p className="text-xl font-bold text-blue-600">
                            ${miningStats.internalPriceUsd.toFixed(4)}
                          </p>
                        </div>
                      </div>

                      {/* Laika Boost Info */}
                      {laikaPrice && (
                        <div className="p-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-5 w-5 text-purple-600" />
                              <span className="font-medium text-purple-900">Laika Boost</span>
                            </div>
                            <Badge className="bg-purple-600">-{laikaPrice.discountPercent}% скидка</Badge>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-purple-700">Рыночная цена</p>
                              <p className="text-lg font-bold text-purple-900">
                                ${laikaPrice.marketPrice.toFixed(6)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-purple-700">Со скидкой</p>
                              <p className="text-lg font-bold text-green-600">
                                ${laikaPrice.discountedPrice.toFixed(6)}
                              </p>
                            </div>
                          </div>
                          <p className="mt-2 text-xs text-purple-600">
                            Держите Laika токены на 40% от депозита для получения бонуса к APY
                          </p>
                        </div>
                      )}

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Прогресс майнинга</span>
                          <span className="font-medium">{miningStats.miningPoolRemaining.toLocaleString()} осталось</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                            style={{ width: `${parseFloat(miningStats.percentDistributed)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Pickaxe className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p>Данные о майнинге недоступны</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="wexels" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Мои векселя</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {wexels.map((wexel) => (
                      <div key={wexel.id} className="border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">Вексель #{wexel.id}</h3>
                            <p className="text-sm text-gray-500">Пул: {wexel.pool}</p>
                          </div>
                          <Badge variant={wexel.status === "active" ? "default" : "secondary"}>
                            {wexel.status === "active" ? "Активен" : "В залоге"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Основная сумма</p>
                            <p className="font-semibold">{formatCurrency(wexel.principal)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">APY</p>
                            <p className="font-semibold">
                              {wexel.apy}% + {wexel.boost}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Заработано</p>
                            <p className="font-semibold">{formatCurrency(wexel.rewards)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Дней до погашения</p>
                            <p className="font-semibold">{wexel.daysLeft}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            Подробнее
                          </Button>
                          {wexel.status === "active" && (
                            <Button size="sm" variant="outline">
                              <Shield className="h-4 w-4 mr-2" />
                              Заложить
                            </Button>
                          )}
                          <Button size="sm">Получить награды</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Аналитика портфеля</CardTitle>
                  <CardDescription>Графики и статистика ваших инвестиций</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">Графики будут добавлены позже</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageTransition>
  );
}
