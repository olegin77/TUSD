"use client";

import React, { ReactNode } from "react";
import { TronProvider } from "./TronProvider";
import { WalletContextProvider } from "./WalletProvider";
import { SolanaWalletIntegration } from "./SolanaWalletIntegration";

interface MultiWalletProviderProps {
  children: ReactNode;
}

export const MultiWalletProvider: React.FC<MultiWalletProviderProps> = ({ children }) => {
  return (
    <WalletContextProvider>
      <TronProvider>
        <SolanaWalletIntegration>{children}</SolanaWalletIntegration>
      </TronProvider>
    </WalletContextProvider>
  );
};
