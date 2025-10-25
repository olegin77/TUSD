"use client";

import { useQuery } from "@tanstack/react-query";
import { poolsApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export function Stats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["pools", "stats"],
    queryFn: poolsApi.getStats,
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-muted rounded animate-pulse mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">{stats?.totalPools || 0}</div>
            <div className="text-muted-foreground">Активных пулов</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">
              {formatCurrency(stats?.totalLiquidity || 0)}
            </div>
            <div className="text-muted-foreground">Общая ликвидность</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">{stats?.totalWexels || 0}</div>
            <div className="text-muted-foreground">Выпущено векселей</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">{stats?.totalUsers || 0}</div>
            <div className="text-muted-foreground">Пользователей</div>
          </div>
        </div>
      </div>
    </section>
  );
}
