"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Coins, Shield, TrendingUp, Lock, BarChart3, Zap, Globe } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Мультичейн поддержка",
    description: "Solana (SPL/Anchor) и Tron (TRC‑20/TRC‑721/TVM)",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Coins,
    title: "Депозиты в USDT",
    description: "APY ≥18% с возможностью блокировки на 12-36 месяцев",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Zap,
    title: "Буст-монеты",
    description: "До +5% APY при добавлении SPL-токенов",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: BarChart3,
    title: "NFT-вексели",
    description: "Уникальные токены с метаданными депозита",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Lock,
    title: "Залоговая система",
    description: "LTV 60% с перераспределением доходности",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: Globe,
    title: "Маркетплейс",
    description: "Торговля векселями между пользователями",
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    icon: Shield,
    title: "Безопасность",
    description: "Мультисиг, timelock, аудит контрактов",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    icon: TrendingUp,
    title: "Высокая доходность",
    description: "До 36% годовых с возможностью буста",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
];

export function Features() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Почему выбирают нас</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Современная DeFi платформа с уникальными возможностями и максимальной безопасностью для
            ваших инвестиций
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center">
                <div
                  className={`w-12 h-12 mx-auto mb-4 rounded-lg ${feature.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
