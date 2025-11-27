"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Shield,
  Zap,
  DollarSign,
  BarChart3,
  ArrowRight,
  Star,
  CheckCircle,
  Coins,
  Vault,
  Globe,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Cross-Chain доходность",
      description: "USDT депозиты на TRON, награды в USDT + Takara на Solana",
      icon: Globe,
      color: "text-amber-600",
    },
    {
      title: "Батч-система",
      description: "Каждый vault собирает $100k для старта начислений",
      icon: Shield,
      color: "text-blue-600",
    },
    {
      title: "Takara Mining",
      description: "30-40% APR в токенах Takara из 60% mining pool",
      icon: Coins,
      color: "text-purple-600",
    },
  ];

  const stats = [
    { label: "Общий объем в хранилищах", value: "$2.5M", change: "+15%" },
    { label: "Активных инвесторов", value: "1,247", change: "+8%" },
    { label: "Выпущено векселей", value: "3,891", change: "+12%" },
    { label: "Средняя доходность", value: "до 10.9%", change: "+2%" },
  ];

  const vaults = [
    {
      id: 1,
      name: "Starter",
      type: "VAULT_1",
      maxApy: 8.4,
      durationMonths: 12,
      minDeposit: 100,
      takaraApr: 30,
      boostToken: "LAIKA",
      boostCondition: "40% от депозита (-15% market)",
      features: ["Laika Boost", "Takara Mining 30%", "Claim 1/week"],
      batchProgress: 45,
    },
    {
      id: 2,
      name: "Advanced",
      type: "VAULT_2",
      maxApy: 10.4,
      durationMonths: 30,
      minDeposit: 1500,
      takaraApr: 30,
      boostToken: "TAKARA",
      boostCondition: "1:1 @ $0.10",
      features: ["Takara Boost", "Takara Mining 30%", "Frequency Multipliers"],
      batchProgress: 72,
      popular: true,
    },
    {
      id: 3,
      name: "Whale",
      type: "VAULT_3",
      maxApy: 13.0,
      durationMonths: 36,
      minDeposit: 5000,
      takaraApr: 40,
      boostToken: "TAKARA",
      boostCondition: "1:1 @ $0.10",
      features: ["Takara Boost", "Takara Mining 40%", "Max Yield"],
      batchProgress: 28,
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 to-orange-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-amber-100 text-amber-800 border-amber-300">
              Cross-Chain Investment Platform
            </Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-4">
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                TAKARA
              </span>
              Хранилища
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Кросс-чейн инвестиционная платформа: депозиты в USDT (TRC20 на TRON), награды в USDT +
              токены Takara (SPL на Solana). До 13% APY + 40% Takara APR.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/vaults">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                >
                  <Vault className="h-5 w-5 mr-2" />
                  Открыть хранилища
                </Button>
              </Link>
              <Link href="/calculator">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Калькулятор доходности
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center border-amber-100">
                <CardContent className="p-6">
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    {stat.change}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Почему выбирают TAKARA?</h2>
            <p className="text-xl text-gray-600">
              Инновационная кросс-чейн платформа с двойной доходностью
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all border-amber-100 ${
                  activeFeature === index ? "ring-2 ring-amber-500 shadow-lg" : "hover:shadow-md"
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <CardContent className="p-8 text-center">
                  <feature.icon className={`h-12 w-12 mx-auto mb-4 ${feature.color}`} />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vaults Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
              <Vault className="h-10 w-10 text-amber-600" />
              Инвестиционные хранилища
            </h2>
            <p className="text-xl text-gray-600">Выберите хранилище для ваших инвестиций</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vaults.map((vault) => (
              <Card key={vault.id} className="relative border-amber-100">
                {vault.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-amber-600 text-white px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Популярный
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{vault.name}</CardTitle>
                  <CardDescription>
                    {vault.boostToken} Boost | {vault.durationMonths} мес
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Batch Progress */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Batch 1</span>
                      <span>{vault.batchProgress}% заполнено</span>
                    </div>
                    <Progress value={vault.batchProgress} className="h-2" />
                  </div>

                  <div className="text-center">
                    <p className="text-4xl font-bold text-green-600 mb-1">до {vault.maxApy}%</p>
                    <p className="text-sm text-gray-500">MAX APY (×1.3)</p>
                    <Badge className="mt-2 bg-amber-100 text-amber-800 border-amber-300">
                      <Coins className="h-3 w-3 mr-1" />+{vault.takaraApr}% Takara APR
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Мин. депозит:</span>
                      <span className="font-medium">{formatCurrency(vault.minDeposit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Буст условие:</span>
                      <span className="font-medium text-sm">{vault.boostCondition}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Возможности:</p>
                    {vault.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link href="/vaults">
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
                      Выбрать {vault.name}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Как это работает?</h2>
            <p className="text-xl text-gray-600">Простой процесс кросс-чейн инвестирования</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Выберите хранилище</h3>
              <p className="text-gray-600">
                Starter, Advanced или Whale — каждое с уникальными условиями
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Депозит USDT (TRON)</h3>
              <p className="text-gray-600">Внесите USDT TRC20 и получите NFT-вексель</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Активируйте буст</h3>
              <p className="text-gray-600">
                Храните Laika или Takara токены для максимальной доходности
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-amber-600">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Получайте награды</h3>
              <p className="text-gray-600">USDT на TRON + Takara токены на Solana</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-orange-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Готовы начать зарабатывать?</h2>
            <p className="text-xl mb-8 opacity-90">
              Присоединяйтесь к кросс-чейн инвесторам TAKARA
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/vaults">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  <Vault className="h-5 w-5 mr-2" />
                  Открыть хранилища
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-amber-600"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Открыть дашборд
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                TAKARA
              </h3>
              <p className="text-gray-400">
                Кросс-чейн инвестиционная платформа: USDT на TRON + Takara на Solana.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Продукт</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/vaults" className="hover:text-white">
                    Хранилища
                  </Link>
                </li>
                <li>
                  <Link href="/marketplace" className="hover:text-white">
                    Маркетплейс
                  </Link>
                </li>
                <li>
                  <Link href="/calculator" className="hover:text-white">
                    Калькулятор
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Документация
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Контакты
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Сообщество</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Telegram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TAKARA. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
