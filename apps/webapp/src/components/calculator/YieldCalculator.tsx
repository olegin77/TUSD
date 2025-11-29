"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Vault {
  id: number;
  name: string;
  type: string;
  durationMonths: number;
  minDeposit: number;
  baseApy: number;
  boostedApy: number;
  takaraApr: number;
  boostToken: "LAIKA" | "TAKARA";
  boostRatio: number;
  boostDiscount?: number;
  boostPriceFixed?: number;
}

interface YieldCalculatorProps {
  vault: Vault;
  isOpen: boolean;
  onClose: () => void;
}

type PayoutFrequency = "MONTHLY" | "QUARTERLY" | "YEARLY";

const FREQUENCY_MULTIPLIERS: Record<PayoutFrequency, number> = {
  MONTHLY: 1.0,
  QUARTERLY: 1.15,
  YEARLY: 1.3,
};

const FREQUENCY_LABELS: Record<PayoutFrequency, string> = {
  MONTHLY: "Monthly (x1.0)",
  QUARTERLY: "Quarterly (x1.15)",
  YEARLY: "Yearly (x1.30)",
};

export function YieldCalculator({ vault, isOpen, onClose }: YieldCalculatorProps) {
  const [depositAmount, setDepositAmount] = useState<number>(vault.minDeposit);
  const [enableBoost, setEnableBoost] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<PayoutFrequency>("MONTHLY");
  const [laikaPrice, setLaikaPrice] = useState<number>(0.05);

  // Calculations
  const calculations = useMemo(() => {
    // Base APY
    const baseApy = vault.baseApy;
    const boostApyValue = vault.boostedApy - vault.baseApy;

    // Boost APY (if enabled)
    const boostApy = enableBoost ? boostApyValue : 0;

    // Total APY without multiplier
    const totalApyBase = baseApy + boostApy;

    // Frequency multiplier
    const multiplier = FREQUENCY_MULTIPLIERS[frequency];

    // Effective APY with multiplier
    const effectiveApy = totalApyBase * multiplier;

    // USDT income
    const dailyUsdt = (depositAmount * effectiveApy) / 100 / 365;
    const monthlyUsdt = dailyUsdt * 30;
    const yearlyUsdt = (depositAmount * effectiveApy) / 100;
    const totalUsdt = yearlyUsdt * (vault.durationMonths / 12);

    // Takara Mining
    const takaraApr = vault.takaraApr;
    const yearlyTakaraValue = (depositAmount * takaraApr) / 100;
    const yearlyTakaraTokens = yearlyTakaraValue / 0.1;
    const dailyTakara = yearlyTakaraTokens / 365;
    const weeklyTakara = dailyTakara * 7;
    const totalTakara = yearlyTakaraTokens * (vault.durationMonths / 12);

    // Required boost tokens
    let requiredBoostTokens = 0;
    let requiredBoostValue = 0;

    if (enableBoost) {
      if (vault.boostToken === "LAIKA") {
        requiredBoostValue = depositAmount * (vault.boostRatio || 0.4);
        const effectivePrice = laikaPrice * (1 - (vault.boostDiscount || 0.15));
        requiredBoostTokens = requiredBoostValue / effectivePrice;
      } else {
        requiredBoostValue = depositAmount * (vault.boostRatio || 1.0);
        requiredBoostTokens = requiredBoostValue / (vault.boostPriceFixed || 0.1);
      }
    }

    return {
      baseApy,
      boostApy,
      boostApyValue,
      totalApyBase,
      multiplier,
      effectiveApy,
      dailyUsdt,
      monthlyUsdt,
      yearlyUsdt,
      totalUsdt,
      takaraApr,
      dailyTakara,
      weeklyTakara,
      yearlyTakaraTokens,
      totalTakara,
      requiredBoostTokens,
      requiredBoostValue,
    };
  }, [depositAmount, enableBoost, frequency, vault, laikaPrice]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            Yield Calculator - {vault.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Deposit Amount */}
          <div>
            <Label className="text-gray-400 text-sm mb-2 block">
              Deposit Amount (USDT)
            </Label>
            <Input
              type="number"
              value={depositAmount}
              onChange={(e) =>
                setDepositAmount(Math.max(vault.minDeposit, Number(e.target.value)))
              }
              min={vault.minDeposit}
              className="bg-gray-800 border-gray-700 text-white"
            />
            <p className="text-gray-500 text-xs mt-1">
              Minimum: ${vault.minDeposit.toLocaleString()}
            </p>
          </div>

          {/* Payout Frequency */}
          <div>
            <Label className="text-gray-400 text-sm mb-2 block">
              Payout Frequency
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(FREQUENCY_MULTIPLIERS) as PayoutFrequency[]).map(
                (freq) => (
                  <button
                    key={freq}
                    onClick={() => setFrequency(freq)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      frequency === freq
                        ? "bg-amber-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {FREQUENCY_LABELS[freq]}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Boost */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enableBoost}
                onChange={(e) => setEnableBoost(e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 bg-gray-800 text-amber-600"
              />
              <span className="text-white">
                Enable {vault.boostToken} Boost (+{calculations.boostApyValue.toFixed(1)}%
                APY)
              </span>
            </label>

            {enableBoost && (
              <div className="mt-3 p-4 bg-gray-800 rounded-lg">
                <p className="text-gray-400 text-sm">
                  Required {vault.boostToken}:
                </p>
                <p className="text-white text-lg font-bold">
                  {calculations.requiredBoostTokens.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}{" "}
                  {vault.boostToken}
                </p>
                <p className="text-gray-500 text-xs">
                  = ${calculations.requiredBoostValue.toLocaleString()}{" "}
                  {vault.boostToken === "LAIKA"
                    ? `(price ${laikaPrice} with 15% discount)`
                    : "(fixed price $0.10)"}
                </p>

                {vault.boostToken === "LAIKA" && (
                  <div className="mt-2 flex items-center gap-2">
                    <label className="text-gray-500 text-xs">
                      Current Laika price:
                    </label>
                    <Input
                      type="number"
                      value={laikaPrice}
                      onChange={(e) => setLaikaPrice(Number(e.target.value))}
                      step="0.001"
                      className="w-24 px-2 py-1 bg-gray-700 border-gray-600 text-white text-sm"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-white font-semibold mb-4">Yield Calculation</h3>

            {/* APY Summary */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-gray-400 text-sm">Base APY</p>
                <p className="text-2xl font-bold text-white">
                  {calculations.baseApy}%
                </p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-gray-400 text-sm">{vault.boostToken} Boost</p>
                <p className="text-2xl font-bold text-green-400">
                  {enableBoost ? `+${calculations.boostApy.toFixed(1)}%` : "0%"}
                </p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-gray-400 text-sm">Multiplier</p>
                <p className="text-2xl font-bold text-blue-400">
                  x{calculations.multiplier}
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 rounded-lg">
                <p className="text-gray-400 text-sm">Total APY</p>
                <p className="text-2xl font-bold text-amber-400">
                  {calculations.effectiveApy.toFixed(2)}%
                </p>
              </div>
            </div>

            {/* USDT Income */}
            <div className="mb-6">
              <h4 className="text-gray-400 text-sm mb-3">USDT Income (TRC20)</h4>
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 bg-gray-800 rounded-lg text-center">
                  <p className="text-gray-500 text-xs">Daily</p>
                  <p className="text-white font-semibold">
                    ${calculations.dailyUsdt.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg text-center">
                  <p className="text-gray-500 text-xs">Monthly</p>
                  <p className="text-white font-semibold">
                    ${calculations.monthlyUsdt.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg text-center">
                  <p className="text-gray-500 text-xs">Yearly</p>
                  <p className="text-white font-semibold">
                    ${calculations.yearlyUsdt.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-green-600/20 border border-green-500/30 rounded-lg text-center">
                  <p className="text-gray-500 text-xs">
                    {vault.durationMonths} months
                  </p>
                  <p className="text-green-400 font-bold">
                    ${calculations.totalUsdt.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Takara Mining */}
            <div>
              <h4 className="text-gray-400 text-sm mb-3">
                Takara Mining (SPL) - {calculations.takaraApr}% APR
              </h4>
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 bg-gray-800 rounded-lg text-center">
                  <p className="text-gray-500 text-xs">Daily</p>
                  <p className="text-purple-400 font-semibold">
                    {calculations.dailyTakara.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg text-center">
                  <p className="text-gray-500 text-xs">Weekly</p>
                  <p className="text-purple-400 font-semibold">
                    {calculations.weeklyTakara.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-gray-800 rounded-lg text-center">
                  <p className="text-gray-500 text-xs">Yearly</p>
                  <p className="text-purple-400 font-semibold">
                    {calculations.yearlyTakaraTokens.toFixed(0)}
                  </p>
                </div>
                <div className="p-3 bg-purple-600/20 border border-purple-500/30 rounded-lg text-center">
                  <p className="text-gray-500 text-xs">
                    {vault.durationMonths} months
                  </p>
                  <p className="text-purple-400 font-bold">
                    {calculations.totalTakara.toFixed(0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold"
          >
            Create Deposit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
