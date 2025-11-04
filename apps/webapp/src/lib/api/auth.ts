import api from "../api";

export enum WalletType {
  SOLANA = "solana",
  TRON = "tron",
}

export interface WalletLoginRequest {
  walletAddress: string;
  signature: string;
  message: string;
  walletType: WalletType;
}

export interface WalletLoginResponse {
  success: boolean;
  user: {
    id: string;
    solanaAddress?: string;
    tronAddress?: string;
    email?: string;
    isKycVerified: boolean;
    isActive: boolean;
  };
  token: string;
}

export const authApi = {
  /**
   * Get nonce message for wallet to sign
   */
  getNonce: async (walletAddress: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post("/api/v1/auth/wallet/nonce", { walletAddress });
    return response.data;
  },

  /**
   * Login with wallet signature
   */
  walletLogin: async (data: WalletLoginRequest): Promise<WalletLoginResponse> => {
    const response = await api.post("/api/v1/auth/wallet/login", data);

    // Store token in localStorage (client-side only)
    if (response.data.success && response.data.token && typeof window !== "undefined") {
      localStorage.setItem("access_token", response.data.token);
    }

    return response.data;
  },

  /**
   * Verify wallet ownership
   */
  verifyWallet: async (
    walletAddress: string,
    walletType: WalletType
  ): Promise<{ success: boolean; isOwner: boolean }> => {
    const response = await api.post("/api/v1/auth/wallet/verify", {
      walletAddress,
      walletType,
    });
    return response.data;
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await api.get("/api/v1/auth/profile");
    return response.data;
  },

  /**
   * Logout
   */
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("access_token");
  },
};
