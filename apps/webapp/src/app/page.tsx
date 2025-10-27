"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Shield, 
  Zap,
  DollarSign,
  Users,
  BarChart3,
  ArrowRight,
  Star,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Высокая доходность",
      description: "До 30% годовых с возможностью буста до 5%",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Безопасность",
      description: "Аудит кода, мультиподпись, временные блокировки",
      icon: Shield,
      color: "text-blue-600"
    },
    {
      title: "NFT векселя",
      description: "Торгуемые NFT-токены с уникальными характеристиками",
      icon: Zap,
      color: "text-purple-600"
    }
  ];

  const stats = [
    { label: "Общий объем заблокированных средств", value: "$2.5M", change: "+15%" },
    { label: "Активных пользователей", value: "1,247", change: "+8%" },
    { label: "Создано векселей", value: "3,891", change: "+12%" },
    { label: "Средняя доходность", value: "24.5%", change: "+2%" }
  ];

  const pools = [
    {
      id: 1,
      name: "12 месяцев",
      apy: 18,
      duration: 365,
      minDeposit: 1000,
      maxDeposit: 50000,
      features: ["Базовый APY", "NFT вексель"]
    },
    {
      id: 2,
      name: "24 месяца",
      apy: 24,
      duration: 730,
      minDeposit: 5000,
      maxDeposit: 100000,
      features: ["Базовый APY", "NFT вексель", "Возможность буста"]
    },
    {
      id: 3,
      name: "36 месяцев",
      apy: 30,
      duration: 1095,
      minDeposit: 10000,
      maxDeposit: 200000,
      features: ["Базовый APY", "NFT вексель", "Максимальный буст", "Приоритетная поддержка"]
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Децентрализованные векселя нового поколения
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Инвестируйте в стабильные активы с высокой доходностью. 
              Получайте NFT-векселя, торгуйте ими на маркетплейсе и используйте как залог.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pools">
                <Button size="lg" className="w-full sm:w-auto">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Начать инвестировать
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Посмотреть маркетплейс
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
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <Badge variant="outline" className="text-green-600">
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Почему выбирают Wexel?
            </h2>
            <p className="text-xl text-gray-600">
              Инновационная платформа для безопасных и прибыльных инвестиций
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer transition-all ${
                  activeFeature === index ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
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

      {/* Pools Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Инвестиционные пулы
            </h2>
            <p className="text-xl text-gray-600">
              Выберите подходящий пул для ваших инвестиций
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pools.map((pool) => (
              <Card key={pool.id} className="relative">
                {pool.id === 2 && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Популярный
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{pool.name}</CardTitle>
                  <CardDescription>
                    Доходность до {pool.apy}% годовых
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-green-600 mb-2">
                      {pool.apy}%
                    </p>
                    <p className="text-sm text-gray-500">APY</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Срок:</span>
                      <span className="font-medium">{pool.duration} дней</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Мин. депозит:</span>
                      <span className="font-medium">{formatCurrency(pool.minDeposit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Макс. депозит:</span>
                      <span className="font-medium">{formatCurrency(pool.maxDeposit)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Возможности:</p>
                    {pool.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link href="/pools">
                    <Button className="w-full">
                      Выбрать пул
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Как это работает?
            </h2>
            <p className="text-xl text-gray-600">
              Простой процесс инвестирования в несколько шагов
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Выберите пул</h3>
              <p className="text-gray-600">
                Выберите подходящий инвестиционный пул с нужной доходностью и сроком
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Внесите депозит</h3>
              <p className="text-gray-600">
                Внесите USDT и получите NFT-вексель с уникальными характеристиками
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Получайте доход</h3>
              <p className="text-gray-600">
                Получайте ежедневные награды и торгуйте векселями на маркетплейсе
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              Готовы начать инвестировать?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Присоединяйтесь к тысячам инвесторов, которые уже получают стабильный доход
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pools">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Начать инвестировать
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600">
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
              <h3 className="text-lg font-semibold mb-4">Wexel</h3>
              <p className="text-gray-400">
                Децентрализованная платформа для инвестиций в векселя нового поколения.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Продукт</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/pools" className="hover:text-white">Пулы</Link></li>
                <li><Link href="/marketplace" className="hover:text-white">Маркетплейс</Link></li>
                <li><Link href="/dashboard" className="hover:text-white">Дашборд</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Документация</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Контакты</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Сообщество</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Telegram</a></li>
                <li><a href="#" className="hover:text-white">Twitter</a></li>
                <li><a href="#" className="hover:text-white">Discord</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Wexel. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
