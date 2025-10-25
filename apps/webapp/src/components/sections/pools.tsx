"use client";

import { useQuery } from "@tanstack/react-query";
import { poolsApi } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { Clock, TrendingUp, Lock } from "lucide-react";

export function Pools() {
  const { data: pools, isLoading } = useQuery({
    queryKey: ["pools"],
    queryFn: poolsApi.getAll,
  });

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Доступные пулы</h2>
            <p className="text-xl text-muted-foreground">
              Выберите подходящий пул для инвестирования
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-10 bg-muted rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Доступные пулы</h2>
          <p className="text-xl text-muted-foreground">
            Выберите подходящий пул для инвестирования
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pools?.map((pool) => (
            <Card key={pool.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Пул #{pool.id}</CardTitle>
                  <Badge variant="secondary">{pool.lockMonths} мес</Badge>
                </div>
                <CardDescription>Блокировка на {pool.lockMonths} месяцев</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">APY</span>
                  </div>
                  <span className="text-2xl font-bold text-green-500">
                    {formatPercentage(pool.apyBaseBp / 100)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Мин. депозит</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(pool.minDepositUsd)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-muted-foreground">Буст</span>
                  </div>
                  <span className="font-semibold">
                    до +{formatPercentage(pool.boostMaxBp / 100)}
                  </span>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-2">
                    Общая ликвидность: {formatCurrency(pool.totalLiquidity)}
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    Векселей: {pool.totalWexels}
                  </div>
                  <Button className="w-full" size="lg">
                    Инвестировать
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
