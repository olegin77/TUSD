"use client";

import { useState, useCallback, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { authApi, WalletType, WalletLoginRequest } from "@/lib/api/auth";
import bs58 from "bs58";

export const useWalletAuth = () => {
  const { publicKey, signMessage, connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isAuth, setIsAuth] = useState(false);

  /**
   * Sign in with Solana wallet
   */
  const signInWithSolana = useCallback(async () => {
    if (!publicKey || !signMessage) {
      setError("Wallet not connected");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const walletAddress = publicKey.toString();

      // 1. Get nonce message
      const { message } = await authApi.getNonce(walletAddress);

      // 2. Sign message with wallet
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = await signMessage(messageBytes);
      const signature = bs58.encode(signatureBytes);

      // 3. Login with signature
      const loginData: WalletLoginRequest = {
        walletAddress,
        signature,
        message,
        walletType: WalletType.SOLANA,
      };

      const response = await authApi.walletLogin(loginData);

      if (response.success) {
        setUser(response.user);
        return true;
      }

      setError("Login failed");
      return false;
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError(err.message || "Failed to sign in");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, signMessage]);

  /**
   * Logout
   */
  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  /**
   * Load user profile
   */
  const loadProfile = useCallback(async () => {
    if (!authApi.isAuthenticated()) {
      return;
    }

    try {
      const profile = await authApi.getProfile();
      setUser(profile);
    } catch (err) {
      console.error("Failed to load profile:", err);
      // Token might be expired, logout
      logout();
    }
  }, [logout]);

  // Check auth status on mount (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAuth(authApi.isAuthenticated());
    }
  }, []);

  return {
    user,
    isLoading,
    error,
    isAuthenticated: isAuth,
    signInWithSolana,
    logout,
    loadProfile,
    connected,
  };
};
