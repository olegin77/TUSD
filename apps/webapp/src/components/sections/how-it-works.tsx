"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Coins, Zap, FileText, Lock, TrendingUp } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Wallet,
    title: "Подключите кошелёк",
    description: "Solana (Phantom, Solflare) или Tron (TronLink)",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    step: "02",
    icon: Coins,
    title: "Разместите USDT",
    description: "Выберите пул с APY от 18% до 36%",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    step: "03",
    icon: Zap,
    title: "Добавьте буст",
    description: "До +5% APY при добавлении SPL-токенов",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    step: "04",
    icon: FileText,
    title: "Получите NFT-вексель",
    description: "Уникальный токен с метаданными депозита",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    step: "05",
    icon: Lock,
    title: "Заложите (опционально)",
    description: "Получите 60% от стоимости в кредит",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    step: "06",
    icon: TrendingUp,
    title: "Получайте доходность",
    description: "Ежедневные начисления и выплаты",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Как это работает</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Простой процесс инвестирования в несколько шагов
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 relative"
            >
              <CardHeader className="text-center">
                <div className="relative mb-4">
                  <div
                    className={`w-16 h-16 mx-auto rounded-full ${step.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <step.icon className={`h-8 w-8 ${step.color}`} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  {step.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
