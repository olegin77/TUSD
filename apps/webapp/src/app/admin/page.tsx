"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
interface DashboardStats {
  totalValueLocked: string;
  totalUsers: number;
  totalWexels: number;
  activeWexels: number;
  collateralizedWexels: number;
  totalRewardsPaid: string;
  averageAPY: number;
  systemHealth: "healthy" | "warning" | "error";
}
export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchDashboardStats();
  }, []);
  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/v1/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Fallback mock data for development
      setStats({
        totalValueLocked: "$12,450,000",
        totalUsers: 2847,
        totalWexels: 5621,
        activeWexels: 4892,
        collateralizedWexels: 1234,
        totalRewardsPaid: "$2,340,000",
        averageAPY: 21.5,
        systemHealth: "healthy",
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Fallback mock data already set above
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (!stats) {
        <p className="text-gray-600">Не удалось загрузить статистику</p>
  const statCards = [
    {
      title: "Total Value Locked",
      value: stats.totalValueLocked,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
      title: "Всего пользователей",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      title: "Всего векселей",
      value: stats.totalWexels.toLocaleString(),
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      title: "Активные векселя",
      value: stats.activeWexels.toLocaleString(),
      icon: Activity,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      title: "В залоге",
      value: stats.collateralizedWexels.toLocaleString(),
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      title: "Выплачено наград",
      value: stats.totalRewardsPaid,
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
  ];
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Панель администратора</h1>
        <p className="text-gray-600 mt-2">Обзор платформы Wexel</p>
      {/* System Health */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {stats.systemHealth === "healthy" ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : stats.systemHealth === "warning" ? (
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            ) : (
              <AlertCircle className="h-8 w-8 text-red-600" />
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Статус системы</h2>
              <p className="text-gray-600">
                {stats.systemHealth === "healthy"
                  ? "Все системы работают нормально"
                  : stats.systemHealth === "warning"
                    ? "Обнаружены предупреждения"
                    : "Критические ошибки"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Средний APY</p>
            <p className="text-2xl font-bold text-gray-900">{stats.averageAPY}%</p>
        </div>
      </Card>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </Card>
          );
        })}
      {/* Quick Actions */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/admin/pools"
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center"
          >
            <p className="font-medium text-blue-900">Управление пулами</p>
          </a>
            href="/admin/oracles"
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center"
            <p className="font-medium text-purple-900">Настройка оракулов</p>
            href="/admin/users"
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center"
            <p className="font-medium text-green-900">Просмотр пользователей</p>
            href="/admin/settings"
            className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-center"
            <p className="font-medium text-orange-900">Глобальные настройки</p>
    </div>
  );
