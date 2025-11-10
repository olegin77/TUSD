"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type WalletType = "solana" | "tron" | null;

export interface MultiWalletContextType {
  activeWallet: WalletType;
  setActiveWallet: (wallet: WalletType) => void;
  isConnected: boolean;
  address: string | null;
  disconnect: () => void;
}

const MultiWalletContext = createContext<MultiWalletContextType | undefined>(undefined);

export const useMultiWallet = (): MultiWalletContextType => {
  const context = useContext(MultiWalletContext);
  if (!context) {
    throw new Error("useMultiWallet must be used within a MultiWalletProvider");
  }
  return context;
};

interface MultiWalletProviderProps {
  children: React.ReactNode;
  solanaConnected?: boolean;
  solanaAddress?: string | null;
  tronConnected?: boolean;
  tronAddress?: string | null;
  onDisconnect?: () => void;
}

export const MultiWalletProvider: React.FC<MultiWalletProviderProps> = ({
  children,
  solanaConnected = false,
  solanaAddress = null,
  tronConnected = false,
  tronAddress = null,
  onDisconnect,
}) => {
  const [activeWallet, setActiveWallet] = useState<WalletType>(null);

  // Determine if connected based on active wallet
  const isConnected = activeWallet === "solana" ? solanaConnected : activeWallet === "tron" ? tronConnected : false;

  // Get address based on active wallet
  const address = activeWallet === "solana" ? solanaAddress : activeWallet === "tron" ? tronAddress : null;

  const disconnect = useCallback(() => {
    setActiveWallet(null);
    if (onDisconnect) {
      onDisconnect();
    }
  }, [onDisconnect]);

  const value: MultiWalletContextType = {
    activeWallet,
    setActiveWallet,
    isConnected,
    address,
    disconnect,
  };

  return <MultiWalletContext.Provider value={value}>{children}</MultiWalletContext.Provider>;
};
