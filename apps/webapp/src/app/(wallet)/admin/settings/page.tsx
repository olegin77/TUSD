"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, Shield, AlertTriangle, Save } from "lucide-react";

interface GlobalSettings {
  marketplace_fee_bp: number;
  multisig_address: string;
  timelock_address: string;
  pause_guardian_address: string;
  system_paused: boolean;
  kyc_required: boolean;
  min_deposit_global: number;
}

// Force dynamic rendering for this page - disable static generation
export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState<Partial<GlobalSettings>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/v1/admin/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch settings");
      const data = await response.json();
      setSettings(data);
      setEditForm(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
      // Fallback mock data
      const mockSettings: GlobalSettings = {
        marketplace_fee_bp: 250,
        multisig_address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        timelock_address: "9xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        pause_guardian_address: "8xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
        system_paused: false,
        kyc_required: false,
        min_deposit_global: 100,
      };
      setSettings(mockSettings);
      setEditForm(mockSettings);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/v1/admin/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });
      if (!response.ok) throw new Error("Failed to save settings");
      alert("Настройки сохранены успешно");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Ошибка при сохранении настроек");
    } finally {
      setSaving(false);
    }
  };

  const toggleSystemPause = async () => {
    const confirmed = confirm(
      `Вы уверены, что хотите ${editForm.system_paused ? "возобновить" : "приостановить"} работу системы?`
    );
    if (!confirmed) return;
    setEditForm({ ...editForm, system_paused: !editForm.system_paused });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Не удалось загрузить настройки</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Глобальные настройки</h1>
          <p className="text-gray-600 mt-2">Управление параметрами платформы</p>
        </div>
        <Button onClick={saveSettings} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Сохранение..." : "Сохранить изменения"}
        </Button>
      </div>

      {/* System Status */}
      <Card
        className={`p-6 ${editForm.system_paused ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Shield
              className={`h-8 w-8 ${editForm.system_paused ? "text-red-600" : "text-green-600"}`}
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Статус системы</h2>
              <p className={`${editForm.system_paused ? "text-red-800" : "text-green-800"}`}>
                {editForm.system_paused ? "Система приостановлена" : "Система работает нормально"}
              </p>
            </div>
          </div>
          <Button
            variant={editForm.system_paused ? "default" : "destructive"}
            onClick={toggleSystemPause}
          >
            {editForm.system_paused ? "Возобновить работу" : "Приостановить систему"}
          </Button>
        </div>
      </Card>

      {/* Marketplace Settings */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Настройки маркетплейса
        </h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="marketplace_fee"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Комиссия маркетплейса (базисные пункты)
            </label>
            <Input
              id="marketplace_fee"
              type="number"
              value={editForm.marketplace_fee_bp}
              onChange={(e) =>
                setEditForm({ ...editForm, marketplace_fee_bp: parseInt(e.target.value) })
              }
            />
            <p className="text-sm text-gray-600 mt-1">
              Текущая комиссия: {(editForm.marketplace_fee_bp || 0) / 100}% от суммы сделки
            </p>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Настройки безопасности
        </h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="multisig" className="block text-sm font-medium text-gray-700 mb-2">
              Адрес Multisig
            </label>
            <Input
              id="multisig"
              type="text"
              value={editForm.multisig_address}
              onChange={(e) => setEditForm({ ...editForm, multisig_address: e.target.value })}
              className="font-mono text-sm"
            />
          </div>

          <div>
            <label htmlFor="timelock" className="block text-sm font-medium text-gray-700 mb-2">
              Адрес Timelock
            </label>
            <Input
              id="timelock"
              type="text"
              value={editForm.timelock_address}
              onChange={(e) => setEditForm({ ...editForm, timelock_address: e.target.value })}
              className="font-mono text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="pause_guardian"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Адрес Pause Guardian
            </label>
            <Input
              id="pause_guardian"
              type="text"
              value={editForm.pause_guardian_address}
              onChange={(e) => setEditForm({ ...editForm, pause_guardian_address: e.target.value })}
              className="font-mono text-sm"
            />
          </div>
        </div>
      </Card>

      {/* Compliance Settings */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Настройки комплаенса</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Обязательное KYC</p>
              <p className="text-sm text-gray-600">
                Требовать прохождение KYC для всех пользователей
              </p>
            </div>
            <Button
              variant={editForm.kyc_required ? "default" : "outline"}
              onClick={() => setEditForm({ ...editForm, kyc_required: !editForm.kyc_required })}
            >
              {editForm.kyc_required ? "Включено" : "Выключено"}
            </Button>
          </div>

          <div>
            <label htmlFor="min_deposit" className="block text-sm font-medium text-gray-700 mb-2">
              Минимальный депозит (USD)
            </label>
            <Input
              id="min_deposit"
              type="number"
              value={editForm.min_deposit_global}
              onChange={(e) =>
                setEditForm({ ...editForm, min_deposit_global: parseInt(e.target.value) })
              }
            />
          </div>
        </div>
      </Card>

      {/* Warning */}
      <Card className="p-6 bg-yellow-50 border-yellow-200">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 mb-2">Важные предупреждения</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Изменение адресов безопасности требует подтверждения через Multisig</li>
              <li>• Приостановка системы блокирует создание новых депозитов и буст-операции</li>
              <li>• Существующие векселя продолжают начислять награды даже при приостановке</li>
              <li>• Изменение комиссий применяется только к новым сделкам</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
