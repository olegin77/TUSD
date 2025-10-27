import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface BoostCalculation {
  tokenMint: string;
  amount: bigint;
  priceUsd: number;
  valueUsd: number;
  apyBoostBp: number;
  maxBoostBp: number;
  targetValueUsd: number;
  isValid: boolean;
  error?: string;
}

export interface BoostHistory {
  id: bigint;
  tokenMint: string;
  amount: number;
  valueUsd: number;
  apyBoostBp: number;
  priceUsd: number;
  createdAt: Date;
}

export interface BoostStats {
  wexelId: bigint;
  principalUsd: number;
  currentApyBoostBp: number;
  maxApyBoostBp: number;
  totalBoostValue: number;
  targetValueUsd: number;
  remainingCapacity: number;
  boostProgress: number;
  isMaxBoost: boolean;
}

export interface ApplyBoostRequest {
  tokenMint: string;
  amount: string;
  priceUsd: number;
  valueUsd: number;
  apyBoostBp: number;
  txHash?: string;
}

export class BoostService {
  private static instance: BoostService;
  private baseURL: string;

  private constructor() {
    this.baseURL = `${API_BASE_URL}/api/v1/wexels`;
  }

  public static getInstance(): BoostService {
    if (!BoostService.instance) {
      BoostService.instance = new BoostService();
    }
    return BoostService.instance;
  }

  async calculateBoost(
    wexelId: number,
    tokenMint: string,
    amount: string,
  ): Promise<BoostCalculation | null> {
    try {
      const response = await axios.get<{ success: boolean; data: BoostCalculation }>(
        `${this.baseURL}/${wexelId}/boost/calculate`,
        {
          params: { tokenMint, amount },
        }
      );

      if (response.data.success) {
        return response.data.data;
      }

      return null;
    } catch (error) {
      console.error('Failed to calculate boost:', error);
      return null;
    }
  }

  async getBoostHistory(wexelId: number): Promise<BoostHistory[]> {
    try {
      const response = await axios.get<{ success: boolean; data: BoostHistory[] }>(
        `${this.baseURL}/${wexelId}/boost/history`
      );

      if (response.data.success) {
        return response.data.data;
      }

      return [];
    } catch (error) {
      console.error('Failed to fetch boost history:', error);
      return [];
    }
  }

  async getBoostStats(wexelId: number): Promise<BoostStats | null> {
    try {
      const response = await axios.get<{ success: boolean; data: BoostStats }>(
        `${this.baseURL}/${wexelId}/boost/stats`
      );

      if (response.data.success) {
        return response.data.data;
      }

      return null;
    } catch (error) {
      console.error('Failed to fetch boost stats:', error);
      return null;
    }
  }

  async applyBoost(wexelId: number, boostRequest: ApplyBoostRequest): Promise<boolean> {
    try {
      const response = await axios.post<{ success: boolean; message: string }>(
        `${this.baseURL}/${wexelId}/boost/apply`,
        boostRequest
      );

      return response.data.success;
    } catch (error) {
      console.error('Failed to apply boost:', error);
      return false;
    }
  }

  async validateToken(tokenMint: string): Promise<boolean> {
    try {
      const response = await axios.get<{ success: boolean; data: { isValid: boolean } }>(
        `${this.baseURL}/boost/validate-token`,
        {
          params: { tokenMint },
        }
      );

      if (response.data.success) {
        return response.data.data.isValid;
      }

      return false;
    } catch (error) {
      console.error('Failed to validate token:', error);
      return false;
    }
  }

  // Helper methods
  formatAmount(amount: bigint, decimals: number = 6): string {
    const divisor = BigInt(10 ** decimals);
    const wholePart = amount / divisor;
    const fractionalPart = amount % divisor;
    
    if (fractionalPart === 0n) {
      return wholePart.toString();
    }
    
    const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
    const trimmedFractional = fractionalStr.replace(/0+$/, '');
    
    if (trimmedFractional === '') {
      return wholePart.toString();
    }
    
    return `${wholePart}.${trimmedFractional}`;
  }

  parseAmount(amount: string, decimals: number = 6): bigint {
    const [wholePart, fractionalPart = ''] = amount.split('.');
    const paddedFractional = fractionalPart.padEnd(decimals, '0').slice(0, decimals);
    return BigInt(wholePart) * BigInt(10 ** decimals) + BigInt(paddedFractional);
  }

  formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  formatPercentage(value: number, decimals: number = 2): string {
    return `${value.toFixed(decimals)}%`;
  }

  calculateBoostProgress(currentValue: number, targetValue: number): number {
    if (targetValue === 0) return 0;
    return Math.min((currentValue / targetValue) * 100, 100);
  }
}

export const boostService = BoostService.getInstance();