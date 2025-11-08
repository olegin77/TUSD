"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ExternalLink, FileText, Lock, TrendingUp } from "lucide-react";

interface WexelData {
  id: number;
  owner_address: string;
  pool_id: number;
  principal_usd: number;
  apy_base_bp: number;
  apy_boost_bp: number;
  start_ts: string;
  end_ts: string;
  is_collateralized: boolean;
  total_claimed_usd: number;
  status: "active" | "completed" | "liquidated";
}

// Force dynamic rendering for this page - disable static generation

export default function AdminWexelsPage() {
  const [wexels, setWexels] = useState<WexelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredWexels, setFilteredWexels] = useState<WexelData[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchWexels();
  }, []);

  useEffect(() => {
    let filtered = wexels;
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (wexel) =>
          wexel.id.toString().includes(query) || wexel.owner_address.toLowerCase().includes(query)
      );
    }
    // Filter by status
    if (filterStatus !== "all") {
      if (filterStatus === "collateralized") {
        filtered = filtered.filter((w) => w.is_collateralized);
      } else {
        filtered = filtered.filter((w) => w.status === filterStatus);
      }
    }
    setFilteredWexels(filtered);
  }, [searchQuery, filterStatus, wexels]);

  const fetchWexels = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
      const response = await fetch("/api/v1/admin/wexels", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch wexels");
      const data = await response.json();
      setWexels(data);
      setFilteredWexels(data);
    } catch (error) {
      console.error("Error fetching wexels:", error);
      // Fallback mock data
      const mockWexels: WexelData[] = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        owner_address: `${Math.random().toString(36).substring(2, 15)}...${Math.random().toString(36).substring(2, 6)}`,
        pool_id: Math.floor(Math.random() * 3) + 1,
        principal_usd: Math.floor(Math.random() * 50000) + 1000,
        apy_base_bp: [1800, 2400, 3600][Math.floor(Math.random() * 3)],
        apy_boost_bp: Math.floor(Math.random() * 500),
        start_ts: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        end_ts: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        is_collateralized: Math.random() > 0.7,
        total_claimed_usd: Math.floor(Math.random() * 10000),
        status: ["active", "completed", "liquidated"][Math.floor(Math.random() * 3)] as any,
      }));
      setWexels(mockWexels);
      setFilteredWexels(mockWexels);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
            Активен
          </span>
        );
      case "completed":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
            Завершён
          </span>
        );
      case "liquidated":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
            Ликвидирован
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
            Неизвестно
          </span>
        );
    }
  };

  const calculateDaysRemaining = (endTs: string) => {
    const days = Math.floor((new Date(endTs).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Управление векселями</h1>
        <p className="text-gray-600 mt-2">Просмотр и мониторинг всех векселей платформы</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Всего векселей</p>
          <p className="text-2xl font-bold text-gray-900">{wexels.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Активные</p>
          <p className="text-2xl font-bold text-green-600">
            {wexels.filter((w) => w.status === "active").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">В залоге</p>
          <p className="text-2xl font-bold text-orange-600">
            {wexels.filter((w) => w.is_collateralized).length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600 mb-1">Общий объём</p>
          <p className="text-2xl font-bold text-blue-600">
            ${wexels.reduce((sum, w) => sum + w.principal_usd, 0).toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Поиск по ID или адресу владельца..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              Все
            </Button>
            <Button
              variant={filterStatus === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("active")}
            >
              Активные
            </Button>
            <Button
              variant={filterStatus === "collateralized" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("collateralized")}
            >
              В залоге
            </Button>
            <Button
              variant={filterStatus === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("completed")}
            >
              Завершённые
            </Button>
          </div>
        </div>
      </Card>

      {/* Wexels Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Владелец
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пул
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Сумма
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  APY
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дней до погашения
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Выплачено
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWexels.map((wexel) => (
                <tr key={wexel.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900">#{wexel.id}</span>
                      {wexel.is_collateralized && <Lock className="h-4 w-4 text-orange-600" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-xs text-gray-600">{wexel.owner_address}</code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Pool #{wexel.pool_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${wexel.principal_usd.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {((wexel.apy_base_bp + wexel.apy_boost_bp) / 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {calculateDaysRemaining(wexel.end_ts)} дней
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${wexel.total_claimed_usd.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(wexel.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredWexels.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-600">Векселя не найдены</p>
          </div>
        )}
      </Card>
    </div>
  );
}
