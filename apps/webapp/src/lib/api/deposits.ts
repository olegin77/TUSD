import api from "../api";

export interface CreateDepositDto {
  poolId: number;
  userAddress: string;
  amountUsd: string;
}

export interface ConfirmDepositDto {
  txHash: string;
  wexelId?: string;
}

export interface ApplyBoostToDepositDto {
  tokenMint: string;
  amount: string;
  valueUsd: string;
  apyBoostBp: number;
  priceUsd: string;
}

export const depositsApi = {
  /**
   * Initialize a new deposit
   */
  create: async (data: CreateDepositDto) => {
    const response = await api.post("/api/v1/deposits", data);
    return response.data;
  },

  /**
   * Confirm deposit after on-chain transaction
   */
  confirm: async (id: number, data: ConfirmDepositDto) => {
    const response = await api.post(`/api/v1/deposits/${id}/confirm`, data);
    return response.data;
  },

  /**
   * Apply boost to a deposit
   */
  applyBoost: async (id: number, data: ApplyBoostToDepositDto) => {
    const response = await api.post(`/api/v1/deposits/${id}/boost`, data);
    return response.data;
  },

  /**
   * Get all deposits for a user
   */
  getAll: async (userAddress?: string) => {
    const params = userAddress ? { userAddress } : {};
    const response = await api.get("/api/v1/deposits", { params });
    return response.data;
  },

  /**
   * Get deposit by ID
   */
  getById: async (id: number) => {
    const response = await api.get(`/api/v1/deposits/${id}`);
    return response.data;
  },
};
