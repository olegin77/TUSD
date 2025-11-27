"use client";

import { useQuery } from "@tanstack/react-query";
import { vaultsApi } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export function Stats() {
  const { data: vaults, isLoading } = useQuery({
    queryKey: ["vaults", "yields"],
    queryFn: vaultsApi.getYields,
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

  // Calculate totals from vaults
  const totalVaults = vaults?.length || 3;
  const totalLiquidity =
    vaults?.reduce((sum, v) => sum + (v.batch?.currentLiquidity || 0), 0) || 145000;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">{totalVaults}</div>
            <div className="text-muted-foreground">Активных хранилищ</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">
              {formatCurrency(totalLiquidity)}
            </div>
            <div className="text-muted-foreground">Общая ликвидность</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">до 13%</div>
            <div className="text-muted-foreground">Максимальный APY</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">до 40%</div>
            <div className="text-muted-foreground">Takara APR</div>
          </div>
        </div>
      </div>
    </section>
  );
}
