import axios from "axios";
import type {
  AuthResponse,
  LoginRequest,
  User,
  Pool,
  Wexel,
  ClaimRewardsRequest,
  CollateralizeRequest,
  RepayLoanRequest,
  UpdatePriceRequest,
  CalculateBoostRequest,
  Stats,
  UserStats,
  RewardsCalculation,
  TokenPrice,
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
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
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

// Pools API
export const poolsApi = {
  getAll: (): Promise<Pool[]> => api.get("/pools").then((res) => res.data),

  getById: (id: number): Promise<Pool> => api.get(`/pools/${id}`).then((res) => res.data),

  getStats: (): Promise<Stats> => api.get("/pools/stats").then((res) => res.data),

  create: (data: any): Promise<Pool> => api.post("/pools", data).then((res) => res.data),

  update: (id: number, data: any): Promise<Pool> =>
    api.patch(`/pools/${id}`, data).then((res) => res.data),
};

// Wexels API
export const wexelsApi = {
  getMy: (): Promise<Wexel[]> => api.get("/wexels/my").then((res) => res.data),

  getById: (id: string): Promise<Wexel> => api.get(`/wexels/${id}`).then((res) => res.data),

  calculateRewards: (id: string): Promise<RewardsCalculation> =>
    api.get(`/wexels/${id}/rewards`).then((res) => res.data),

  claimRewards: (id: string, data: ClaimRewardsRequest): Promise<any> =>
    api.post(`/wexels/${id}/claim`, data).then((res) => res.data),

  collateralize: (data: CollateralizeRequest): Promise<any> =>
    api.post("/wexels/collateralize", data).then((res) => res.data),

  repayLoan: (data: RepayLoanRequest): Promise<any> =>
    api.post("/wexels/repay-loan", data).then((res) => res.data),
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
  getAllPrices: (): Promise<TokenPrice[]> => api.get("/oracles/prices").then((res) => res.data),

  getPrice: (tokenMint: string): Promise<TokenPrice> =>
    api.get(`/oracles/prices/${tokenMint}`).then((res) => res.data),

  updatePrice: (data: UpdatePriceRequest): Promise<TokenPrice> =>
    api.post("/oracles/prices", data).then((res) => res.data),

  calculateBoost: (data: CalculateBoostRequest): Promise<{ valueUsd: string }> =>
    api.post("/oracles/calculate-boost", data).then((res) => res.data),
};

// Health check
export const healthApi = {
  check: (): Promise<{ status: string; timestamp: string; service: string }> =>
    api.get("/health").then((res) => res.data),
};

export default api;
