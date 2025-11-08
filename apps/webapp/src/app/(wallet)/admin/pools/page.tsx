"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Save, X, Plus } from "lucide-react";

interface Pool {
  id: number;
  apy_base_bp: number;
  lock_months: number;
  boost_target_bp: number;
  boost_max_bp: number;
  min_deposit_usd?: number;
  total_liquidity?: number;
}

// Force dynamic rendering for this page - disable static generation

export default function AdminPoolsPage() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Pool>>({});

  useEffect(() => {
    fetchPools();
  }, []);

  const fetchPools = async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
      const response = await fetch("/api/v1/pools", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch pools");
      const data = await response.json();
      setPools(data);
    } catch (error) {
      console.error("Error fetching pools:", error);
      // Fallback mock data
      setPools([
        {
          id: 1,
          apy_base_bp: 1800,
          lock_months: 12,
          boost_target_bp: 3000,
          boost_max_bp: 500,
          min_deposit_usd: 100,
          total_liquidity: 1250000,
        },
        {
          id: 2,
          apy_base_bp: 2400,
          lock_months: 24,
          boost_target_bp: 3000,
          boost_max_bp: 500,
          min_deposit_usd: 100,
          total_liquidity: 3450000,
        },
        {
          id: 3,
          apy_base_bp: 3600,
          lock_months: 36,
          boost_target_bp: 3000,
          boost_max_bp: 500,
          min_deposit_usd: 100,
          total_liquidity: 7750000,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (pool: Pool) => {
    setEditingId(pool.id);
    setEditForm(pool);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    try {
      const response = await fetch(`/api/v1/admin/pools/${editingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });
      if (!response.ok) throw new Error("Failed to update pool");
      await fetchPools();
      setEditingId(null);
      setEditForm({});
    } catch (error) {
      console.error("Error updating pool:", error);
      alert("Ошибка при обновлении пула");
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Управление пулами</h1>
          <p className="text-gray-600 mt-2">Настройка параметров пулов ликвидности</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Добавить пул
        </Button>
      </div>

      {/* Pools Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  APY базовый (%)
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Срок (мес)
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Буст цель (%)
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Буст макс (%)
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min депозит
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TVL
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pools.map((pool) => (
                <tr key={pool.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {pool.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === pool.id ? (
                      <Input
                        type="number"
                        value={editForm.apy_base_bp}
                        onChange={(e) =>
                          setEditForm({ ...editForm, apy_base_bp: parseInt(e.target.value) })
                        }
                        className="w-24"
                      />
                    ) : (
                      `${pool.apy_base_bp / 100}%`
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === pool.id ? (
                      <Input
                        type="number"
                        value={editForm.lock_months}
                        onChange={(e) =>
                          setEditForm({ ...editForm, lock_months: parseInt(e.target.value) })
                        }
                        className="w-24"
                      />
                    ) : (
                      pool.lock_months
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === pool.id ? (
                      <Input
                        type="number"
                        value={editForm.boost_target_bp}
                        onChange={(e) =>
                          setEditForm({ ...editForm, boost_target_bp: parseInt(e.target.value) })
                        }
                        className="w-24"
                      />
                    ) : (
                      `${pool.boost_target_bp / 100}%`
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {editingId === pool.id ? (
                      <Input
                        type="number"
                        value={editForm.boost_max_bp}
                        onChange={(e) =>
                          setEditForm({ ...editForm, boost_max_bp: parseInt(e.target.value) })
                        }
                        className="w-24"
                      />
                    ) : (
                      `${pool.boost_max_bp / 100}%`
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${pool.min_deposit_usd?.toLocaleString() || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${pool.total_liquidity?.toLocaleString() || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingId === pool.id ? (
                      <div className="flex items-center justify-end space-x-2">
                        <Button size="sm" variant="ghost" onClick={saveEdit}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => startEdit(pool)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Info Card */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Важная информация</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Базисные пункты (bp): 100 bp = 1%</li>
          <li>• Изменения применяются только к новым депозитам</li>
          <li>• Для существующих векселей параметры остаются неизменными</li>
          <li>• Рекомендуется использовать Multisig для критических изменений</li>
        </ul>
      </Card>
    </div>
  );
}
