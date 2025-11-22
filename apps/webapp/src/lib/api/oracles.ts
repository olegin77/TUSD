import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface PriceData {
  tokenMint: string;
  priceUsd: number;
  source: string;
  timestamp: number;
  confidence?: number;
}

export interface OracleResponse<T> {
  success: boolean;
  data: T;
}

export class OracleService {
  private static instance: OracleService;
  private baseURL: string;

  private constructor() {
    this.baseURL = `${API_BASE_URL}/api/v1/oracles`;
  }

  public static getInstance(): OracleService {
    if (!OracleService.instance) {
      OracleService.instance = new OracleService();
    }
    return OracleService.instance;
  }

  async getPrice(tokenMint: string): Promise<PriceData | null> {
    try {
      const response = await axios.get<OracleResponse<PriceData>>(
        `${this.baseURL}/price?mint=${tokenMint}`
      );

      if (response.data.success) {
        return response.data.data;
      }

      return null;
    } catch (error) {
      console.error("Failed to fetch price:", error);
      return null;
    }
  }

  async getSupportedTokens(): Promise<string[]> {
    try {
      const response = await axios.get<OracleResponse<{ tokens: string[] }>>(
        `${this.baseURL}/tokens`
      );

      if (response.data.success) {
        return response.data.data.tokens;
      }

      return [];
    } catch (error) {
      console.error("Failed to fetch supported tokens:", error);
      return [];
    }
  }

  async getHealth(): Promise<{
    status: string;
    availableSources: number;
    totalTokens: number;
    timestamp: string;
  } | null> {
    try {
      const response = await axios.get<
        OracleResponse<{
          status: string;
          availableSources: number;
          totalTokens: number;
          timestamp: string;
        }>
      >(`${this.baseURL}/health`);

      if (response.data.success) {
        return response.data.data;
      }

      return null;
    } catch (error) {
      console.error("Failed to fetch oracle health:", error);
      return null;
    }
  }

  // Helper method to format price for display
  formatPrice(price: number, decimals: number = 2): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(price);
  }

  // Helper method to calculate price change
  calculatePriceChange(
    currentPrice: number,
    previousPrice: number
  ): {
    absolute: number;
    percentage: number;
  } {
    const absolute = currentPrice - previousPrice;
    const percentage = previousPrice > 0 ? (absolute / previousPrice) * 100 : 0;

    return {
      absolute,
      percentage,
    };
  }
}

export const oracleService = OracleService.getInstance();

// Export with consistent naming for API client
export const oraclesApi = oracleService;
