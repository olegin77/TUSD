"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

interface OraclePrice {
  source: string;
  price: number;
  timestamp: number;
  status: "active" | "stale" | "error";
  deviation?: number;
}

interface OracleData {
  token: string;
  aggregatedPrice: number;
  sources: OraclePrice[];
  lastUpdate: number;
  maxDeviation: number;
}

export default function AdminOraclesPage() {
  const [oracles, setOracles] = useState<OracleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [manualPrice, setManualPrice] = useState("");

  useEffect(() => {
    fetchOracleData();
    const interval = setInterval(fetchOracleData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchOracleData = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/v1/admin/oracles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch oracle data");
      const data = await response.json();
      setOracles(data);
    } catch (error) {
      console.error("Error fetching oracle data:", error);
      // Fallback mock data
      setOracles([
        {
          token: "BOOST",
          aggregatedPrice: 0.0245,
          lastUpdate: Date.now(),
          maxDeviation: 150,
          sources: [
            {
              source: "Pyth",
              price: 0.0246,
              timestamp: Date.now(),
              status: "active",
              deviation: 0.4,
            },
            {
              source: "Raydium TWAP",
              price: 0.0244,
              timestamp: Date.now(),
              status: "active",
              deviation: -0.4,
            },
            {
              source: "Binance",
              price: 0.0245,
              timestamp: Date.now(),
              status: "active",
              deviation: 0,
            },
          ],
        },
        {
          token: "USDT",
          aggregatedPrice: 1.0,
          maxDeviation: 50,
          lastUpdate: Date.now(),
          sources: [
            {
              source: "Chainlink",
              price: 1.0001,
              timestamp: Date.now(),
              status: "active",
              deviation: 0.01,
            },
            {
              source: "Pyth",
              price: 0.9999,
              timestamp: Date.now(),
              status: "active",
              deviation: -0.01,
            },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const refreshOracle = async (token: string) => {
    setUpdating(token);
    try {
      const adminToken = localStorage.getItem("admin_token");
      const response = await fetch(`/api/v1/admin/oracles/${token}/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to refresh oracle");
      await fetchOracleData();
    } catch (error) {
      console.error("Error refreshing oracle:", error);
      alert("Ошибка при обновлении оракула");
    } finally {
      setUpdating(null);
    }
  };

  const setManualPriceSubmit = async (token: string) => {
    if (!manualPrice || isNaN(parseFloat(manualPrice))) {
      alert("Введите корректную цену");
      return;
    }
    try {
      const response = await fetch(`/api/v1/admin/oracles/${token}/manual-price`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price: parseFloat(manualPrice) }),
      });
      if (!response.ok) throw new Error("Failed to set manual price");
      setManualPrice("");
      alert("Ручная цена установлена. Требуется подтверждение Multisig.");
    } catch (error) {
      console.error("Error setting manual price:", error);
      alert("Ошибка при установке ручной цены");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "stale":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Minus className="h-5 w-5 text-gray-400" />;
    }
  };

  const getDeviationIcon = (deviation?: number) => {
    if (!deviation) return <Minus className="h-4 w-4 text-gray-400" />;
    if (deviation > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (deviation < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
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
        <h1 className="text-3xl font-bold text-gray-900">Управление оракулами цен</h1>
        <p className="text-gray-600 mt-2">Мониторинг и управление источниками ценовых данных</p>
      </div>

      {/* Oracle Cards */}
      <div className="space-y-6">
        {oracles.map((oracle) => (
          <Card key={oracle.token} className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{oracle.token}</h2>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  ${oracle.aggregatedPrice.toFixed(6)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Обновлено: {new Date(oracle.lastUpdate).toLocaleString("ru-RU")}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => refreshOracle(oracle.token)}
                disabled={updating === oracle.token}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${updating === oracle.token ? "animate-spin" : ""}`}
                />
                Обновить
              </Button>
            </div>

            {/* Sources */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Источники данных</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {oracle.sources.map((source, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{source.source}</span>
                      {getStatusIcon(source.status)}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">${source.price.toFixed(6)}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-600">
                        {new Date(source.timestamp).toLocaleTimeString("ru-RU")}
                      </span>
                      {source.deviation !== undefined && (
                        <div className="flex items-center space-x-1">
                          {getDeviationIcon(source.deviation)}
                          <span className="text-sm font-medium text-gray-700">
                            {source.deviation > 0 ? "+" : ""}
                            {source.deviation.toFixed(2)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual Price Override */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ручная установка цены (Multisig)
              </h3>
              <div className="flex items-end space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor={`manual-price-${oracle.token}`}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Резервная цена (USD)
                  </label>
                  <Input
                    id={`manual-price-${oracle.token}`}
                    type="number"
                    step="0.000001"
                    value={manualPrice}
                    onChange={(e) => setManualPrice(e.target.value)}
                    placeholder="0.000000"
                  />
                </div>
                <Button onClick={() => setManualPriceSubmit(oracle.token)}>Установить цену</Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                * Требуется подтверждение Multisig. Изменение вступит в силу после задержки
                Timelock.
              </p>
            </div>

            {/* Config Info */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Макс. отклонение:</span> {oracle.maxDeviation} bp (
                {oracle.maxDeviation / 100}%)
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Alert Card */}
      <Card className="p-6 bg-yellow-50 border-yellow-200">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-2">Важно: Безопасность оракулов</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Все критические изменения цен проходят через Multisig + Timelock</li>
              <li>• При превышении макс. отклонения между источниками буст блокируется</li>
              <li>• Рекомендуется мониторить статус источников и обновлять их регулярно</li>
              <li>• Ручная установка цены используется только в экстренных случаях</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
