"use client";

import React from 'react';
import { usePrice, usePriceUtils } from '@/hooks/useOracle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, AlertCircle, RefreshCw } from 'lucide-react';

interface PriceDisplayProps {
  tokenMint: string;
  tokenName?: string;
  tokenSymbol?: string;
  showSource?: boolean;
  showTimestamp?: boolean;
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  tokenMint,
  tokenName = 'Token',
  tokenSymbol = 'TKN',
  showSource = true,
  showTimestamp = false,
  className = '',
}) => {
  const { data: price, isLoading, error, refetch } = usePrice(tokenMint);
  const { formatPrice } = usePriceUtils();

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-20" />
        </CardContent>
      </Card>
    );
  }

  if (error || !price) {
    return (
      <Card className={`border-red-200 ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="font-medium">{tokenName}</span>
            </div>
            <Badge variant="outline" className="text-red-600 border-red-600">
              Error
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <span className="text-red-600 text-sm">Price unavailable</span>
            <button
              onClick={() => refetch()}
              className="p-1 hover:bg-red-50 rounded"
            >
              <RefreshCw className="h-4 w-4 text-red-500" />
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'pyth':
        return 'bg-purple-100 text-purple-800';
      case 'coingecko':
        return 'bg-blue-100 text-blue-800';
      case 'binance':
        return 'bg-yellow-100 text-yellow-800';
      case 'jupiter':
        return 'bg-green-100 text-green-800';
      case 'aggregated':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceName = (source: string) => {
    switch (source) {
      case 'pyth':
        return 'Pyth';
      case 'coingecko':
        return 'CoinGecko';
      case 'binance':
        return 'Binance';
      case 'jupiter':
        return 'Jupiter';
      case 'aggregated':
        return 'Aggregated';
      default:
        return source;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {tokenSymbol.charAt(0)}
            </div>
            <div>
              <CardTitle className="text-lg">{tokenName}</CardTitle>
              <p className="text-sm text-gray-500">{tokenSymbol}</p>
            </div>
          </div>
          {showSource && (
            <Badge className={getSourceColor(price.source)}>
              {getSourceName(price.source)}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">
              {formatPrice(price.priceUsd)}
            </span>
            <button
              onClick={() => refetch()}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <RefreshCw className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          
          {showTimestamp && (
            <p className="text-xs text-gray-500">
              Updated: {new Date(price.timestamp).toLocaleTimeString()}
            </p>
          )}

          {price.confidence && (
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Confidence:</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${price.confidence * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {Math.round(price.confidence * 100)}%
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface PriceListProps {
  tokenMints: string[];
  tokenMap?: Record<string, { name: string; symbol: string }>;
  className?: string;
}

export const PriceList: React.FC<PriceListProps> = ({
  tokenMints,
  tokenMap = {},
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {tokenMints.map((mint) => {
        const tokenInfo = tokenMap[mint] || { name: 'Unknown Token', symbol: 'UNK' };
        return (
          <PriceDisplay
            key={mint}
            tokenMint={mint}
            tokenName={tokenInfo.name}
            tokenSymbol={tokenInfo.symbol}
            showSource={true}
            showTimestamp={true}
          />
        );
      })}
    </div>
  );
};