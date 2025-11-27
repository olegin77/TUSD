"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Edit2, Save, X, Plus, Vault } from "lucide-react";

interface VaultData {
  id: number;
  name: string;
  type: string;
  duration_months: number;
  min_entry_amount: number;
  base_usdt_apy: number;
  boosted_usdt_apy: number;
  takara_apr: number;
  boost_token_symbol: string;
  boost_ratio: number;
  boost_discount: number;
  batch_number: number;
  batch_status: string;
  current_liquidity: number;
  target_liquidity: number;
  is_active: boolean;
}

export default function AdminVaultsPage() {
  const [vaults, setVaults] = useState<VaultData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<VaultData>>({});

  useEffect(() => {
    fetchVaults();
  }, []);

  const fetchVaults = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
      const response = await fetch("/api/v1/vaults", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch vaults");
      const data = await response.json();
      setVaults(data);
    } catch (error) {
      console.error("Error fetching vaults:", error);
      // Fallback mock data matching TZ
      setVaults([
        {
          id: 1,
          name: "Starter",
          type: "VAULT_1",
          duration_months: 12,
          min_entry_amount: 100,
          base_usdt_apy: 4.0,
          boosted_usdt_apy: 8.4,
          takara_apr: 30,
          boost_token_symbol: "LAIKA",
          boost_ratio: 0.4,
          boost_discount: 0.15,
          batch_number: 1,
          batch_status: "COLLECTING",
          current_liquidity: 45000,
          target_liquidity: 100000,
          is_active: true,
        },
        {
          id: 2,
          name: "Advanced",
          type: "VAULT_2",
          duration_months: 30,
          min_entry_amount: 1500,
          base_usdt_apy: 4.0,
          boosted_usdt_apy: 8.0,
          takara_apr: 30,
          boost_token_symbol: "TAKARA",
          boost_ratio: 1.0,
          boost_discount: 0,
          batch_number: 1,
          batch_status: "COLLECTING",
          current_liquidity: 72000,
          target_liquidity: 100000,
          is_active: true,
        },
        {
          id: 3,
          name: "Whale",
          type: "VAULT_3",
          duration_months: 36,
          min_entry_amount: 5000,
          base_usdt_apy: 6.0,
          boosted_usdt_apy: 10.0,
          takara_apr: 40,
          boost_token_symbol: "TAKARA",
          boost_ratio: 1.0,
          boost_discount: 0,
          batch_number: 1,
          batch_status: "COLLECTING",
          current_liquidity: 28000,
          target_liquidity: 100000,
          is_active: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (vault: VaultData) => {
    setEditingId(vault.id);
    setEditForm(vault);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
      const response = await fetch(`/api/v1/vaults/${editingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (!response.ok) throw new Error("Failed to update vault");
      await fetchVaults();
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error("Error updating vault:", error);
      alert("Ошибка при обновлении хранилища");
    }
  };

  const seedVaults = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
      const response = await fetch("/api/v1/vaults/seed", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to seed vaults");
      await fetchVaults();
      alert("Хранилища по умолчанию созданы");
    } catch (error) {
      console.error("Error seeding vaults:", error);
      alert("Ошибка при создании хранилищ");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Vault className="h-8 w-8 text-amber-600" />
            Управление хранилищами (Vaults)
          </h1>
          <p className="text-gray-600 mt-2">Настройка параметров TAKARA хранилищ</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={seedVaults}>
            Создать по умолчанию
          </Button>
          <Button className="bg-amber-600 hover:bg-amber-700">
            <Plus className="h-4 w-4 mr-2" />
            Добавить хранилище
          </Button>
        </div>
      </div>

      {/* Vaults Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vaults.map((vault) => (
          <Card key={vault.id} className="p-6 border-amber-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">{vault.name}</h3>
                <Badge variant="outline" className="mt-1">
                  {vault.type}
                </Badge>
              </div>
              <Badge className={vault.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {vault.is_active ? "Активен" : "Неактивен"}
              </Badge>
            </div>

            {/* Batch Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Batch {vault.batch_number}</span>
                <span className="text-gray-500">{vault.batch_status}</span>
              </div>
              <Progress value={(vault.current_liquidity / vault.target_liquidity) * 100} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>${vault.current_liquidity.toLocaleString()}</span>
                <span>${vault.target_liquidity.toLocaleString()}</span>
              </div>
            </div>

            {/* Vault Stats */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Срок:</span>
                <span className="font-medium">{vault.duration_months} мес</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Мин. депозит:</span>
                <span className="font-medium">${vault.min_entry_amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Базовый APY:</span>
                <span className="font-medium text-green-600">{vault.base_usdt_apy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Boosted APY:</span>
                <span className="font-medium text-green-600">{vault.boosted_usdt_apy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Takara APR:</span>
                <span className="font-medium text-amber-600">{vault.takara_apr}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Буст токен:</span>
                <span className="font-medium">{vault.boost_token_symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Буст условие:</span>
                <span className="font-medium">
                  {vault.boost_token_symbol === "LAIKA"
                    ? `${vault.boost_ratio * 100}% (-${vault.boost_discount * 100}%)`
                    : `1:1 @ $0.10`}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full" onClick={() => startEdit(vault)}>
                <Edit2 className="h-4 w-4 mr-2" />
                Редактировать
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card className="p-6 bg-amber-50 border-amber-200">
        <h3 className="font-semibold text-amber-900 mb-2">TAKARA Vault Matrix (TZ)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-amber-800">
          <div>
            <p className="font-medium">Vault 1: Starter</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>12 мес, от $100</li>
              <li>MAX APY: 8.4%</li>
              <li>Laika Boost: 40% @ -15%</li>
              <li>Takara APR: 30%</li>
            </ul>
          </div>
          <div>
            <p className="font-medium">Vault 2: Advanced</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>30 мес, от $1,500</li>
              <li>Base: 4%, Boosted: 8%</li>
              <li>Takara Boost: 1:1 @ $0.10</li>
              <li>Takara APR: 30%</li>
            </ul>
          </div>
          <div>
            <p className="font-medium">Vault 3: Whale</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>36 мес, от $5,000</li>
              <li>Base: 6%, Boosted: 10%</li>
              <li>Takara Boost: 1:1 @ $0.10</li>
              <li>Takara APR: 40%</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
