import axios from "axios";
import type {
  AuthResponse,
  LoginRequest,
  User,
  Pool,
  Wexel,
  Stats,
  UserStats,
  RewardsCalculation,
  TokenPrice,
} from "@/types";

// Export unused types for potential future use
export type {
  ClaimRewardsRequest,
  CollateralizeRequest,
  RepayLoanRequest,
  UpdatePriceRequest,
  CalculateBoostRequest,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        // Use Next.js router instead of window.location for client-side navigation
        import("next/navigation").then(({ redirect }) => {
          redirect("/login");
        });
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (data: LoginRequest): Promise<AuthResponse> =>
    api.post("/auth/login", data).then((res) => res.data),

  getProfile: (): Promise<User> => api.get("/auth/profile").then((res) => res.data),

  verify: (): Promise<{ valid: boolean; user: User }> =>
    api.post("/auth/verify").then((res) => res.data),
};

// Pools API (deprecated - use vaultsApi)
export const poolsApi = {
  getAll: (): Promise<Pool[]> => api.get("/api/v1/pools").then((res) => res.data),

  getById: (id: number): Promise<Pool> => api.get(`/api/v1/pools/${id}`).then((res) => res.data),

  getStats: (): Promise<Stats> => api.get("/api/v1/pools/stats").then((res) => res.data),

  create: (data: any): Promise<Pool> => api.post("/api/v1/pools", data).then((res) => res.data),

  update: (id: number, data: any): Promise<Pool> =>
    api.patch(`/api/v1/pools/${id}`, data).then((res) => res.data),
};

// Vaults API (TAKARA rebrand)
export interface Vault {
  id: number;
  name: string;
  type: "VAULT_1" | "VAULT_2" | "VAULT_3";
  duration_months: number;
  min_entry_amount: number;
  base_usdt_apy: number;
  boosted_usdt_apy: number;
  takara_apr: number;
  boost_token_symbol: string;
  boost_ratio: number;
  boost_discount: number;
  boost_fixed_price: number | null;
  batch_number: number;
  batch_status: "COLLECTING" | "FILLED" | "COMPLETED";
  current_liquidity: number;
  target_liquidity: number;
  is_active: boolean;
}

export interface VaultYield {
  vaultId: number;
  name: string;
  type: string;
  durationMonths: number;
  minEntryAmount: number;
  usdtYield: {
    baseApy: number;
    boostedApy: number;
    frequencyMultipliers: {
      MONTHLY: number;
      QUARTERLY: number;
      YEARLY: number;
    };
  };
  takaraYield: {
    apr: number;
    internalPrice: number;
  };
  boostCondition: {
    tokenSymbol: string;
    ratio: number;
    discount: number;
    fixedPrice: number | null;
  };
  batch: {
    number: number;
    status: string;
    currentLiquidity: number;
    targetLiquidity: number;
    progress: number;
  };
}

export const vaultsApi = {
  getAll: (): Promise<Vault[]> => api.get("/api/v1/vaults").then((res) => res.data),

  getById: (id: number): Promise<Vault> => api.get(`/api/v1/vaults/${id}`).then((res) => res.data),

  getYields: (): Promise<VaultYield[]> => api.get("/api/v1/vaults/yields").then((res) => res.data),

  create: (data: Partial<Vault>): Promise<Vault> =>
    api.post("/api/v1/vaults", data).then((res) => res.data),

  update: (id: number, data: Partial<Vault>): Promise<Vault> =>
    api.patch(`/api/v1/vaults/${id}`, data).then((res) => res.data),

  seed: (): Promise<{ message: string }> =>
    api.post("/api/v1/vaults/seed").then((res) => res.data),

  calculateUsdtYield: (params: {
    amount: number;
    baseApy: number;
    boostedApy: number;
    hasBoosted: boolean;
    frequency: "MONTHLY" | "QUARTERLY" | "YEARLY";
  }) =>
    api
      .get("/api/v1/vaults/calculate/usdt", { params })
      .then((res) => res.data),

  calculateTakaraYield: (params: { amount: number; takaraApr: number }) =>
    api
      .get("/api/v1/vaults/calculate/takara", { params })
      .then((res) => res.data),

  checkLaikaBoost: (params: {
    depositAmount: number;
    laikaBalance: number;
    laikaPrice: number;
    discountRate?: number;
  }) =>
    api
      .get("/api/v1/vaults/check/laika-boost", { params })
      .then((res) => res.data),

  checkTakaraBoost: (params: {
    depositAmount: number;
    takaraBalance: number;
    fixedPrice?: number;
  }) =>
    api
      .get("/api/v1/vaults/check/takara-boost", { params })
      .then((res) => res.data),
};

// Wexels API
export const wexelsApi = {
  getMy: (): Promise<Wexel[]> => api.get("/api/v1/wexels").then((res) => res.data),

  getById: (id: string): Promise<Wexel> => api.get(`/api/v1/wexels/${id}`).then((res) => res.data),

  calculateRewards: (id: string): Promise<RewardsCalculation> =>
    api.get(`/api/v1/wexels/${id}/rewards`).then((res) => res.data),

  claimRewards: (id: string, txHash: string): Promise<any> =>
    api.post(`/api/v1/wexels/${id}/claim`, { txHash }).then((res) => res.data),
};

// Users API
export const usersApi = {
  getProfile: (): Promise<User> => api.get("/users/profile").then((res) => res.data),

  getStats: (): Promise<UserStats> => api.get("/users/stats").then((res) => res.data),

  updateProfile: (data: Partial<User>): Promise<User> =>
    api.patch("/users/profile", data).then((res) => res.data),

  linkWallet: (data: { walletType: "solana" | "tron"; address: string }): Promise<User> =>
    api.post("/users/link-wallet", data).then((res) => res.data),
};

// Oracles API
export const oraclesApi = {
  getPrice: (tokenMint: string): Promise<TokenPrice> =>
    api.get(`/api/v1/oracles/price`, { params: { mint: tokenMint } }).then((res) => res.data),

  getTokens: (): Promise<TokenPrice[]> => api.get("/api/v1/oracles/tokens").then((res) => res.data),

  getHealth: (): Promise<{ status: string }> =>
    api.get("/api/v1/oracles/health").then((res) => res.data),
};

// Health check
export const healthApi = {
  check: (): Promise<{ status: string; timestamp: string; service: string }> =>
    api.get("/health").then((res) => res.data),
};

export default api;
