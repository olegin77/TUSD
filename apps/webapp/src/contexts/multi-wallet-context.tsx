"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTron } from "@/providers/TronProvider";

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
}

export const MultiWalletProvider: React.FC<MultiWalletProviderProps> = ({ children }) => {
  const [activeWallet, setActiveWallet] = useState<WalletType>(null);

  // Use wallet hooks directly inside the provider
  const { connected: solanaConnected, publicKey, disconnect: disconnectSolana } = useWallet();
  const { isConnected: tronConnected, address: tronAddress, disconnect: disconnectTron } = useTron();

  // Get the Solana address as string
  const solanaAddress = publicKey?.toBase58() || null;

  // Determine if connected based on active wallet
  const isConnected =
    activeWallet === "solana" ? solanaConnected : activeWallet === "tron" ? tronConnected : false;

  // Get address based on active wallet
  const address =
    activeWallet === "solana" ? solanaAddress : activeWallet === "tron" ? tronAddress : null;

  const disconnect = useCallback(() => {
    if (activeWallet === "solana") {
      disconnectSolana();
    } else if (activeWallet === "tron") {
      disconnectTron();
    }
    setActiveWallet(null);
  }, [activeWallet, disconnectSolana, disconnectTron]);

  const value: MultiWalletContextType = {
    activeWallet,
    setActiveWallet,
    isConnected,
    address,
    disconnect,
  };

  return <MultiWalletContext.Provider value={value}>{children}</MultiWalletContext.Provider>;
};
