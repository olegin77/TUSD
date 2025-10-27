"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  TrendingUp,
  Eye,
} from "lucide-react";

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("apy");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("buy");

  // Mock data - в реальном приложении будет загружаться из API
  const listings = [
    {
      id: 1,
      wexelId: 1234,
      seller: "0x1234...5678",
      pool: "24 месяца",
      apy: 24,
      boost: 3,
      principal: 15000,
      askPrice: 16500,
      daysLeft: 300,
      status: "active",
      isCollateralized: false,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      wexelId: 1235,
      seller: "0x2345...6789",
      pool: "36 месяцев",
      apy: 30,
      boost: 5,
      principal: 25000,
      askPrice: 28000,
      daysLeft: 450,
      status: "active",
      isCollateralized: false,
      createdAt: "2024-01-20",
    },
    {
      id: 3,
      wexelId: 1236,
      seller: "0x3456...7890",
      pool: "12 месяцев",
      apy: 18,
      boost: 2,
      principal: 10000,
      askPrice: 10800,
      daysLeft: 180,
      status: "active",
      isCollateralized: true,
      createdAt: "2024-01-25",
    },
  ];

  const myListings = [
    {
      id: 4,
      wexelId: 1237,
      pool: "24 месяца",
      apy: 24,
      boost: 4,
      principal: 20000,
      askPrice: 22000,
      daysLeft: 350,
      status: "active",
      views: 15,
      createdAt: "2024-01-28",
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU");
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.wexelId.toString().includes(searchTerm) ||
      listing.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || listing.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case "apy":
        return b.apy - a.apy;
      case "price":
        return a.askPrice - b.askPrice;
      case "daysLeft":
        return a.daysLeft - b.daysLeft;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Маркетплейс векселей</h1>
          <p className="text-gray-600">Покупайте и продавайте векселя Wexel</p>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Купить векселя</TabsTrigger>
            <TabsTrigger value="sell">Мои объявления</TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Поиск по ID векселя или адресу продавца..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Сортировка" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apy">По APY</SelectItem>
                        <SelectItem value="price">По цене</SelectItem>
                        <SelectItem value="daysLeft">По сроку</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Статус" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все</SelectItem>
                        <SelectItem value="active">Активные</SelectItem>
                        <SelectItem value="sold">Проданные</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Listings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedListings.map((listing) => (
                <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Вексель #{listing.wexelId}</CardTitle>
                      <Badge variant={listing.isCollateralized ? "secondary" : "default"}>
                        {listing.isCollateralized ? "В залоге" : "Свободен"}
                      </Badge>
                    </div>
                    <CardDescription>Продавец: {listing.seller}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Pool Info */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Пул:</span>
                      <span className="font-medium">{listing.pool}</span>
                    </div>

                    {/* APY Info */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">APY:</span>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">{listing.apy}%</span>
                        {listing.boost > 0 && (
                          <Badge variant="outline" className="text-xs">
                            +{listing.boost}%
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Principal */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Основная сумма:</span>
                      <span className="font-medium">{formatCurrency(listing.principal)}</span>
                    </div>

                    {/* Ask Price */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Цена продажи:</span>
                      <span className="font-bold text-lg">{formatCurrency(listing.askPrice)}</span>
                    </div>

                    {/* Days Left */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Дней до погашения:</span>
                      <span className="font-medium">{listing.daysLeft}</span>
                    </div>

                    {/* Created Date */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Создано:</span>
                      <span className="font-medium">{formatDate(listing.createdAt)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Подробнее
                      </Button>
                      <Button size="sm" className="flex-1">
                        Купить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {sortedListings.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Векселя не найдены</h3>
                  <p className="text-gray-500">Попробуйте изменить параметры поиска</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sell" className="space-y-6">
            {/* Create New Listing */}
            <Card>
              <CardHeader>
                <CardTitle>Создать объявление</CardTitle>
                <CardDescription>Выставьте свой вексель на продажу</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Выберите вексель</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите вексель для продажи" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wexel1">Вексель #1237 - $20,000</SelectItem>
                        <SelectItem value="wexel2">Вексель #1238 - $15,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Цена продажи (USDT)</label>
                    <Input type="number" placeholder="Введите цену" />
                  </div>
                </div>

                <div className="mt-4">
                  <Button>Создать объявление</Button>
                </div>
              </CardContent>
            </Card>

            {/* My Listings */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Мои объявления</h2>

              {myListings.map((listing) => (
                <Card key={listing.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">Вексель #{listing.wexelId}</h3>
                        <p className="text-sm text-gray-500">Пул: {listing.pool}</p>
                      </div>
                      <Badge variant="outline">{listing.status}</Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">APY</p>
                        <p className="font-semibold">
                          {listing.apy}% + {listing.boost}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Основная сумма</p>
                        <p className="font-semibold">{formatCurrency(listing.principal)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Цена продажи</p>
                        <p className="font-semibold">{formatCurrency(listing.askPrice)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Просмотры</p>
                        <p className="font-semibold">{listing.views}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Просмотреть
                      </Button>
                      <Button variant="outline" size="sm">
                        Редактировать
                      </Button>
                      <Button variant="destructive" size="sm">
                        Удалить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {myListings.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Нет активных объявлений</h3>
                    <p className="text-gray-500">Создайте первое объявление для продажи векселя</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
