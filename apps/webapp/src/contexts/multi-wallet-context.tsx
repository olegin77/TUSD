"use client";

import { createContext, useContext } from "react";

export type WalletType = "solana" | "tron";

export interface MultiWalletContextType {
  activeWallet: WalletType | null;
  setActiveWallet: (wallet: WalletType | null) => void;
  isConnected: boolean;
  address: string | null;
  disconnect: () => void;
}

export const MultiWalletContext = createContext<MultiWalletContextType | undefined>(undefined);

export const useMultiWallet = (): MultiWalletContextType => {
  const context = useContext(MultiWalletContext);
  if (context === undefined) {
    throw new Error("useMultiWallet must be used within a MultiWalletProvider");
  }
  return context;
};
