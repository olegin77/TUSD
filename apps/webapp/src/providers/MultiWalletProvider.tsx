"use client";

import React, { useState, ReactNode, useEffect } from "react";
import { TronProvider } from "./TronProvider";

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
      Promise.all([
        import("./WalletProvider"),
        import("./SolanaWalletIntegration"),
      ]).then(([walletProviderMod, solanaIntegrationMod]) => {
        setWalletProvider(() => walletProviderMod.WalletContextProvider);
        setSolanaIntegration(() => solanaIntegrationMod.SolanaWalletIntegration);
        setIsReady(true);
      });
    }
  }, []);

  if (!isClient || !isReady || !WalletProvider || !SolanaIntegration) {
    return (
      <TronProvider>
        <div className="min-h-screen flex items-center justify-center">
          <p>Initializing wallet providers...</p>
        </div>
      </TronProvider>
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
