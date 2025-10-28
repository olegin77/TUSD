import api from "../api";

export interface OpenCollateralDto {
  txHash?: string;
  userAddress: string;
}

export interface RepayLoanDto {
  repayAmount: string;
  txHash: string;
}

export const collateralApi = {
  /**
   * Open collateral position (pledge wexel, get loan)
   */
  open: async (wexelId: number, data: OpenCollateralDto) => {
    const response = await api.post(`/api/v1/collateral/${wexelId}/open`, data);
    return response.data;
  },

  /**
   * Repay loan and release wexel
   */
  repay: async (wexelId: number, data: RepayLoanDto) => {
    const response = await api.post(`/api/v1/collateral/${wexelId}/repay`, data);
    return response.data;
  },

  /**
   * Get collateral position details
   */
  getPosition: async (wexelId: number) => {
    const response = await api.get(`/api/v1/collateral/${wexelId}`);
    return response.data;
  },

  /**
   * Calculate potential loan amount
   */
  calculateLoan: async (wexelId: number) => {
    const response = await api.get(`/api/v1/collateral/${wexelId}/calculate`);
    return response.data;
  },
};
