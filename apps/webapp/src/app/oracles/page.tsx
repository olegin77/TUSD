"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { PageTransition } from "@/components/ui/page-transition";
import { PriceList } from "@/components/oracle/PriceDisplay";
import { useSupportedTokens, useOracleHealth } from "@/hooks/useOracle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, RefreshCw, Activity } from "lucide-react";

const TOKEN_MAP: Record<string, { name: string; symbol: string }> = {
  So11111111111111111111111111111111111111112: {
    name: "Solana",
    symbol: "SOL",
  },
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
    name: "USD Coin",
    symbol: "USDC",
  },
  Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: {
    name: "Tether USD",
    symbol: "USDT",
  },
};

export default function OraclesPage() {
  const [customTokenMint, setCustomTokenMint] = useState("");
  const [customTokens, setCustomTokens] = useState<string[]>([]);

  const { data: supportedTokens, isLoading: tokensLoading } = useSupportedTokens();
  const { data: health, isLoading: healthLoading, refetch: refetchHealth } = useOracleHealth();

  const handleAddCustomToken = () => {
    if (customTokenMint && !customTokens.includes(customTokenMint)) {
      setCustomTokens([...customTokens, customTokenMint]);
      setCustomTokenMint("");
    }
  };

  const handleRemoveCustomToken = (mint: string) => {
    setCustomTokens(customTokens.filter((token) => token !== mint));
  };

  const allTokens = [...(supportedTokens || []), ...customTokens];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Система оракулов цен</h1>
              <p className="text-xl text-gray-600">
                Получайте актуальные цены токенов из множества источников
              </p>
            </div>

            {/* Health Status */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>Статус системы</span>
                    </CardTitle>
                    <CardDescription>Мониторинг доступности источников цен</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchHealth()}
                    disabled={healthLoading}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${healthLoading ? "animate-spin" : ""}`} />
                    Обновить
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {healthLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-gray-500">Загрузка...</span>
                  </div>
                ) : health ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {health.status === "healthy" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="font-medium">
                          {health.status === "healthy" ? "Система работает" : "Проблемы с системой"}
                        </span>
                      </div>
                      <Badge variant="outline">{health.availableSources} источников доступно</Badge>
                      <Badge variant="outline">{health.totalTokens} токенов поддерживается</Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                      Обновлено: {new Date(health.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-sm">Не удалось получить статус системы</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add Custom Token */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Добавить пользовательский токен</CardTitle>
                <CardDescription>Введите адрес токена для получения цены</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Label htmlFor="token-mint">Адрес токена</Label>
                    <Input
                      id="token-mint"
                      placeholder="Введите адрес токена (mint address)"
                      value={customTokenMint}
                      onChange={(e) => setCustomTokenMint(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddCustomToken} disabled={!customTokenMint}>
                      Добавить
                    </Button>
                  </div>
                </div>
                {customTokens.length > 0 && (
                  <div className="mt-4">
                    <Label>Пользовательские токены:</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {customTokens.map((mint) => (
                        <Badge key={mint} variant="outline" className="flex items-center space-x-1">
                          <span className="font-mono text-xs">
                            {mint.slice(0, 8)}...{mint.slice(-8)}
                          </span>
                          <button
                            onClick={() => handleRemoveCustomToken(mint)}
                            className="ml-1 hover:text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Price Display */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Цены токенов</h2>
              {tokensLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <PriceList tokenMints={allTokens} tokenMap={TOKEN_MAP} />
              )}
            </div>

            {/* Sources Info */}
            <Card>
              <CardHeader>
                <CardTitle>Источники цен</CardTitle>
                <CardDescription>
                  Мы используем несколько источников для обеспечения точности цен
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-purple-600 font-bold">P</span>
                    </div>
                    <h3 className="font-semibold">Pyth Network</h3>
                    <p className="text-sm text-gray-500">Децентрализованные оракулы</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-blue-600 font-bold">CG</span>
                    </div>
                    <h3 className="font-semibold">CoinGecko</h3>
                    <p className="text-sm text-gray-500">Агрегатор цен</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-yellow-600 font-bold">B</span>
                    </div>
                    <h3 className="font-semibold">Binance</h3>
                    <p className="text-sm text-gray-500">Криптобиржа</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-green-600 font-bold">J</span>
                    </div>
                    <h3 className="font-semibold">Jupiter</h3>
                    <p className="text-sm text-gray-500">DEX агрегатор</p>
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
