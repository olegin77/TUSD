"use client";

import React, { useState, ReactNode, useEffect } from "react";
import { TronProvider } from "./TronProvider";
import { MultiWalletContext } from "@/contexts/multi-wallet-context";

// Check if we're on the client side
const isClient = typeof window !== "undefined";

interface MultiWalletProviderProps {
  children: ReactNode;
}

export const MultiWalletProvider: React.FC<MultiWalletProviderProps> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [WalletProvider, setWalletProvider] = useState<any>(null);
  const [SolanaIntegration, setSolanaIntegration] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Dynamically import both WalletProvider and SolanaWalletIntegration only on client side
      Promise.all([import("./WalletProvider"), import("./SolanaWalletIntegration")]).then(
        ([walletProviderMod, solanaIntegrationMod]) => {
          setWalletProvider(() => walletProviderMod.WalletContextProvider);
          setSolanaIntegration(() => solanaIntegrationMod.SolanaWalletIntegration);
          setIsReady(true);
        }
      );
    }
  }, []);

  // Provide stub context during SSR/loading to prevent "useMultiWallet must be used within a MultiWalletProvider" errors
  if (!isClient || !isReady || !WalletProvider || !SolanaIntegration) {
    const stubValue = {
      activeWallet: null,
      setActiveWallet: () => {},
      isConnected: false,
      address: null,
      disconnect: () => {},
    };
    return (
      <MultiWalletContext.Provider value={stubValue}>
        <TronProvider>{children}</TronProvider>
      </MultiWalletContext.Provider>
    );
  }

  return (
    <WalletProvider>
      <TronProvider>
        <SolanaIntegration>{children}</SolanaIntegration>
      </TronProvider>
    </WalletProvider>
  );
};
