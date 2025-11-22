"use client";

import React from "react";
import { useBoostHistory, useBoostUtils } from "@/hooks/useBoost";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { History, TrendingUp, Clock, DollarSign, Zap, AlertCircle } from "lucide-react";

interface BoostHistoryProps {
  wexelId: number;
}

export const BoostHistory: React.FC<BoostHistoryProps> = ({ wexelId }) => {
  const { data: history, isLoading, error } = useBoostHistory(wexelId);
  const { formatAmount, formatCurrency, formatPercentage } = useBoostUtils();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>История бустов</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>История бустов</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Не удалось загрузить историю бустов</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!history || history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="h-5 w-5" />
            <span>История бустов</span>
          </CardTitle>
          <CardDescription>История применения буст-монет для этого векселя</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Бусты еще не применялись</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <History className="h-5 w-5" />
          <span>История бустов</span>
        </CardTitle>
        <CardDescription>История применения буст-монет для этого векселя</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((boost, index) => (
            <div
              key={boost.id.toString()}
              className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm">
                    {formatAmount(BigInt(Math.round(boost.amount * 1e6)))} токенов
                  </span>
                  <Badge variant="outline" className="text-xs">
                    +{formatPercentage(boost.apyBoostBp / 100)} APY
                  </Badge>
                </div>

                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-3 w-3" />
                    <span>{formatCurrency(boost.valueUsd)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>{formatCurrency(boost.priceUsd)} за токен</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {new Date(boost.createdAt).toLocaleDateString("ru-RU", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(boost.createdAt).toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
