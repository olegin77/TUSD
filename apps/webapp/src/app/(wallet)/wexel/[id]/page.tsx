"use client";

import { useState, useEffect } from "react";
import { PageTransition } from "@/components/ui/page-transition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  TrendingUp,
  Shield,
  DollarSign,
  Zap,
  Copy,
  ExternalLink,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

// Force dynamic rendering for this page - disable static generation

export default function WexelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [wexelId, setWexelId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    params.then((p) => setWexelId(p.id));
  }, [params]);

  // Mock data - в реальном приложении будет загружаться из API
  const wexel = {
    id: parseInt(wexelId) || 0,
    owner: "0x1234...5678",
    pool: {
      id: 1,
      name: "24 месяца",
      duration: 730,
      apy: 24,
      minDeposit: 1000,
      maxDeposit: 100000,
    },
    principal: 15000,
    apyBase: 24,
    apyBoost: 3,
    startDate: "2024-01-15",
    endDate: "2026-01-15",
    daysLeft: 300,
    isCollateralized: false,
    totalClaimed: 2500,
    totalRewards: 4500,
    status: "active",
    nftMint: "0xabcd...efgh",
    createdAt: "2024-01-15T10:30:00Z",
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const copyToClipboard = (text: string) => {
    if (typeof window === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(text);
  };

  const calculateDailyReward = () => {
    const totalApy = wexel.apyBase + wexel.apyBoost;
    const dailyRate = totalApy / 365 / 100;
    return wexel.principal * dailyRate;
  };

  const calculateRemainingRewards = () => {
    return wexel.totalRewards - wexel.totalClaimed;
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад к маркетплейсу
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Вексель #{wexel.id}</h1>
                <p className="text-gray-600">
                  Создан {formatDate(wexel.createdAt)} • Владелец: {wexel.owner}
                </p>
              </div>
              <div className="flex space-x-2">
                <Badge variant={wexel.isCollateralized ? "secondary" : "default"}>
                  {wexel.isCollateralized ? "В залоге" : "Свободен"}
                </Badge>
                <Badge variant="outline">{wexel.status}</Badge>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Обзор</TabsTrigger>
                  <TabsTrigger value="rewards">Награды</TabsTrigger>
                  <TabsTrigger value="history">История</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Basic Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Основная информация</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Пул</p>
                          <p className="font-semibold">{wexel.pool.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Основная сумма</p>
                          <p className="font-semibold">{formatCurrency(wexel.principal)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">APY</p>
                          <div className="flex items-center space-x-1">
                            <span className="font-semibold">{wexel.apyBase}%</span>
                            {wexel.apyBoost > 0 && (
                              <Badge variant="outline" className="text-xs">
                                +{wexel.apyBoost}%
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Общий APY</p>
                          <p className="font-semibold text-green-600">
                            {wexel.apyBase + wexel.apyBoost}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Timeline */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Временная линия</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Начало</p>
                            <p className="text-sm text-gray-500">{formatDate(wexel.startDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Текущий момент</p>
                            <p className="text-sm text-gray-500">
                              {wexel.daysLeft} дней до погашения
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="font-medium">Погашение</p>
                            <p className="text-sm text-gray-500">{formatDate(wexel.endDate)}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* NFT Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>NFT информация</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">NFT Mint Address</p>
                          <p className="font-mono text-sm">{wexel.nftMint}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(wexel.nftMint)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="rewards" className="space-y-6">
                  {/* Rewards Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Сводка по наградам</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {formatCurrency(wexel.totalRewards)}
                          </p>
                          <p className="text-sm text-gray-500">Общие награды</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">
                            {formatCurrency(wexel.totalClaimed)}
                          </p>
                          <p className="text-sm text-gray-500">Получено</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-orange-600">
                            {formatCurrency(calculateRemainingRewards())}
                          </p>
                          <p className="text-sm text-gray-500">Осталось</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Daily Rewards */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Ежедневные награды</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">
                          {formatCurrency(calculateDailyReward())}
                        </p>
                        <p className="text-sm text-gray-500">в день</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Claim Button */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <p className="text-lg font-semibold mb-2">
                          Доступно к получению: {formatCurrency(calculateRemainingRewards())}
                        </p>
                      </div>
                      <Button size="lg" className="w-full">
                        Получить награды
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-6">
                  {/* Transaction History */}
                  <Card>
                    <CardHeader>
                      <CardTitle>История транзакций</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <div>
                              <p className="font-medium">Создание векселя</p>
                              <p className="text-sm text-gray-500">{formatDate(wexel.createdAt)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(wexel.principal)}</p>
                            <p className="text-sm text-gray-500">Депозит</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <TrendingUp className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="font-medium">Получение наград</p>
                              <p className="text-sm text-gray-500">2024-01-20</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">+{formatCurrency(500)}</p>
                            <p className="text-sm text-gray-500">Награды</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Zap className="h-5 w-5 text-yellow-500" />
                            <div>
                              <p className="font-medium">Применение буста</p>
                              <p className="text-sm text-gray-500">2024-01-25</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-yellow-600">+{wexel.apyBoost}%</p>
                            <p className="text-sm text-gray-500">APY Boost</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Actions */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Быстрые действия</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" size="lg">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Купить вексель
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Shield className="h-4 w-4 mr-2" />
                    Заложить вексель
                  </Button>
                  <Button variant="outline" className="w-full">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Выставить на продажу
                  </Button>
                </CardContent>
              </Card>

              {/* Price Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Ценовая информация</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Цена продажи:</span>
                      <span className="font-semibold">{formatCurrency(16500)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Основная сумма:</span>
                      <span className="font-semibold">{formatCurrency(wexel.principal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Премия:</span>
                      <span className="font-semibold text-green-600">+{formatCurrency(1500)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between">
                      <span className="text-gray-500">Доходность:</span>
                      <span className="font-semibold text-green-600">10%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Warning */}
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-orange-800">Предупреждение о рисках</p>
                      <p className="text-sm text-orange-700 mt-1">
                        Инвестиции в DeFi связаны с рисками. Убедитесь, что вы понимаете все риски
                        перед покупкой.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
