"use client";

import { useQuery } from "@tanstack/react-query";
import { takaraApi } from "@/lib/api/takara";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { TrendingUp, Lock, Coins, Vault, Zap } from "lucide-react";
import Link from "next/link";

// Vault configuration per fix.md (FINAL VALUES!)
// These are the CORRECT APY values - DO NOT CHANGE!
const VAULT_CONFIG: Record<
  number,
  {
    name: string;
    boostToken: string;
    baseApy: number;
    boostApy: number;
    maxApy: number;
    takaraApr: number;
  }
> = {
  1: {
    name: "Starter",
    boostToken: "LAIKA",
    baseApy: 4.5, // 4.5% base
    boostApy: 4.0, // +4% with LAIKA boost
    maxApy: 8.5, // 8.5% max monthly
    takaraApr: 30, // 30% Takara mining
  },
  2: {
    name: "Advanced",
    boostToken: "TAKARA",
    baseApy: 7.0, // 7% base
    boostApy: 6.0, // +6% with TAKARA boost
    maxApy: 13.0, // 13% max monthly
    takaraApr: 30, // 30% Takara mining
  },
  3: {
    name: "Whale",
    boostToken: "TAKARA",
    baseApy: 8.0, // 8% base
    boostApy: 7.0, // +7% with TAKARA boost
    maxApy: 15.0, // 15% max monthly
    takaraApr: 40, // 40% Takara mining
  },
};

// Frequency multipliers per master.md
const FREQUENCY_MULTIPLIERS = {
  MONTHLY: 1.0,
  QUARTERLY: 1.15,
  YEARLY: 1.3,
};

export function Vaults() {
  const { data: vaults, isLoading } = useQuery({
    queryKey: ["vaults"],
    queryFn: takaraApi.getPoolYields,
  });

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              <Vault className="h-8 w-8 text-amber-600" />
              TAKARA Хранилища
            </h2>
            <p className="text-xl text-muted-foreground">
              Выберите подходящее хранилище для инвестирования
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

  // Default vaults with correct APY values per fix.md
  const displayVaults = vaults?.length
    ? vaults
    : [
        {
          vaultId: 1,
          durationMonths: 12,
          minEntryAmount: 100,
          boostToken: "LAIKA",
          usdtYield: { baseApy: 4.5, boostApy: 4.0, maxApy: 8.5, maxApyYearly: 11.05 },
          takaraYield: { apr: 30 },
          batchInfo: {
            currentBatch: 1,
            status: "COLLECTING",
            currentLiquidity: 0,
            targetLiquidity: 100000,
          },
        },
        {
          vaultId: 2,
          durationMonths: 30,
          minEntryAmount: 1500,
          boostToken: "TAKARA",
          usdtYield: { baseApy: 7.0, boostApy: 6.0, maxApy: 13.0, maxApyYearly: 16.9 },
          takaraYield: { apr: 30 },
          batchInfo: {
            currentBatch: 1,
            status: "COLLECTING",
            currentLiquidity: 0,
            targetLiquidity: 100000,
          },
        },
        {
          vaultId: 3,
          durationMonths: 36,
          minEntryAmount: 5000,
          boostToken: "TAKARA",
          usdtYield: { baseApy: 8.0, boostApy: 7.0, maxApy: 15.0, maxApyYearly: 19.5 },
          takaraYield: { apr: 40 },
          batchInfo: {
            currentBatch: 1,
            status: "COLLECTING",
            currentLiquidity: 0,
            targetLiquidity: 100000,
          },
        },
      ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Vault className="h-8 w-8 text-amber-600" />
            TAKARA Хранилища
          </h2>
          <p className="text-xl text-muted-foreground">
            Кросс-чейн инвестиционные хранилища с высокой доходностью
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayVaults.map((vault) => {
            // Get vault ID (handle both API response formats)
            const vaultId = ("vaultId" in vault ? vault.vaultId : vault.poolId) || 1;
            const config = VAULT_CONFIG[vaultId] || VAULT_CONFIG[1];

            // Get APY from API or use config defaults
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const yieldData = vault.usdtYield as any;
            const baseApy = yieldData?.baseApy ?? config.baseApy;
            const boostApy = yieldData?.boostApy ?? yieldData?.maxLaikaBoost ?? config.boostApy;
            const maxApy = yieldData?.maxApy ?? baseApy + boostApy;
            const maxApyYearly = yieldData?.maxApyYearly ?? maxApy * FREQUENCY_MULTIPLIERS.YEARLY;
            const takaraApr = vault.takaraYield?.apr ?? config.takaraApr;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const vaultAny = vault as any;
            const durationMonths = vaultAny.durationMonths ?? vaultAny.lockMonths ?? 12;
            const boostToken = vaultAny.boostToken ?? config.boostToken;

            // Calculate batch progress
            const batchInfo = vaultAny.batchInfo ?? {
              currentLiquidity: 0,
              targetLiquidity: 100000,
            };
            const batchProgress =
              batchInfo.targetLiquidity > 0
                ? (batchInfo.currentLiquidity / batchInfo.targetLiquidity) * 100
                : 0;

            return (
              <Card
                key={vaultId}
                className="group hover:shadow-lg transition-all duration-300 border-amber-100"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{config.name}</CardTitle>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      {durationMonths} мес
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    {boostToken} Boost | Срок {durationMonths} месяцев
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Batch Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Batch {batchInfo.currentBatch || 1}</span>
                      <span>{batchProgress.toFixed(0)}% заполнено</span>
                    </div>
                    <Progress value={batchProgress} className="h-2" />
                  </div>

                  {/* APY Display */}
                  <div className="space-y-2 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Базовый APY</span>
                      <span className="font-medium">{baseApy.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-green-600">
                      <span className="text-sm">+ {boostToken} boost</span>
                      <span className="font-medium">+{boostApy.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between border-t pt-2">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Макс. APY</span>
                      </div>
                      <span className="text-xl font-bold text-green-600">
                        до {maxApyYearly.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-muted-foreground">Мин. депозит</span>
                    </div>
                    <span className="font-semibold">
                      ${vaultAny.minEntryAmount?.toLocaleString() ?? 100}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-amber-500" />
                      <span className="text-sm text-muted-foreground">Takara APR</span>
                    </div>
                    <span className="font-semibold text-amber-600">{takaraApr}%</span>
                  </div>

                  <div className="pt-4 border-t">
                    <Link href="/pools">
                      <Button
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                        size="lg"
                      >
                        Инвестировать
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Keep old name for backward compatibility
export { Vaults as Pools };
