"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  boostService,
  BoostCalculation,
  BoostHistory,
  BoostStats,
  ApplyBoostRequest,
} from "@/lib/api/boost";

export const useBoostCalculation = (
  wexelId: number,
  tokenMint: string,
  amount: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["boost-calculation", wexelId, tokenMint, amount],
    queryFn: () => boostService.calculateBoost(wexelId, tokenMint, amount),
    enabled: enabled && !!wexelId && !!tokenMint && !!amount,
    staleTime: 30 * 1000, // 30 seconds
    retry: 3,
  });
};

export const useBoostHistory = (wexelId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["boost-history", wexelId],
    queryFn: () => boostService.getBoostHistory(wexelId),
    enabled: enabled && !!wexelId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useBoostStats = (wexelId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["boost-stats", wexelId],
    queryFn: () => boostService.getBoostStats(wexelId),
    enabled: enabled && !!wexelId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 30 * 1000, // 30 seconds
    retry: 3,
  });
};

export const useApplyBoost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ wexelId, boostRequest }: { wexelId: number; boostRequest: ApplyBoostRequest }) =>
      boostService.applyBoost(wexelId, boostRequest),
    onSuccess: (_, { wexelId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["boost-stats", wexelId] });
      queryClient.invalidateQueries({ queryKey: ["boost-history", wexelId] });
      queryClient.invalidateQueries({ queryKey: ["wexel", wexelId] });
    },
  });
};

export const useValidateToken = (tokenMint: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["validate-token", tokenMint],
    queryFn: () => boostService.validateToken(tokenMint),
    enabled: enabled && !!tokenMint,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
  });
};

// Hook for boost utilities
export const useBoostUtils = () => {
  const formatAmount = (amount: bigint, decimals: number = 6): string => {
    return boostService.formatAmount(amount, decimals);
  };

  const parseAmount = (amount: string, decimals: number = 6): bigint => {
    return boostService.parseAmount(amount, decimals);
  };

  const formatCurrency = (amount: number, currency: string = "USD"): string => {
    return boostService.formatCurrency(amount, currency);
  };

  const formatPercentage = (value: number, decimals: number = 2): string => {
    return boostService.formatPercentage(value, decimals);
  };

  const calculateBoostProgress = (currentValue: number, targetValue: number): number => {
    return boostService.calculateBoostProgress(currentValue, targetValue);
  };

  return {
    formatAmount,
    parseAmount,
    formatCurrency,
    formatPercentage,
    calculateBoostProgress,
  };
};
