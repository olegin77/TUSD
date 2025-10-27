"use client";

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { oracleService, PriceData } from '@/lib/api/oracles';

export const usePrice = (tokenMint: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['price', tokenMint],
    queryFn: () => oracleService.getPrice(tokenMint),
    enabled: enabled && !!tokenMint,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useSupportedTokens = () => {
  return useQuery({
    queryKey: ['supported-tokens'],
    queryFn: () => oracleService.getSupportedTokens(),
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 3,
  });
};

export const useOracleHealth = () => {
  return useQuery({
    queryKey: ['oracle-health'],
    queryFn: () => oracleService.getHealth(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

export const useMultiplePrices = (tokenMints: string[]) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['prices', tokenMints],
    queryFn: async () => {
      const prices = await Promise.allSettled(
        tokenMints.map(mint => oracleService.getPrice(mint))
      );

      const result: Record<string, PriceData | null> = {};
      
      prices.forEach((price, index) => {
        const tokenMint = tokenMints[index];
        if (price.status === 'fulfilled') {
          result[tokenMint] = price.value;
        } else {
          result[tokenMint] = null;
        }
      });

      return result;
    },
    enabled: tokenMints.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 30 * 1000, // 30 seconds
    retry: 3,
  });
};

// Hook for price formatting utilities
export const usePriceUtils = () => {
  const formatPrice = (price: number, decimals: number = 2): string => {
    return oracleService.formatPrice(price, decimals);
  };

  const calculatePriceChange = (currentPrice: number, previousPrice: number) => {
    return oracleService.calculatePriceChange(currentPrice, previousPrice);
  };

  return {
    formatPrice,
    calculatePriceChange,
  };
};