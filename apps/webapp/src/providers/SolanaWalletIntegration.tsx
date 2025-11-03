"use client";

import React, { useState, ReactNode } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTron } from "./TronProvider";
import { MultiWalletContext, MultiWalletContextType } from "@/contexts/multi-wallet-context";

export const SolanaWalletIntegration: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeWallet, setActiveWallet] = useState<MultiWalletContextType["activeWallet"]>(null);
  const solanaWallet = useWallet();
  const tronWallet = useTron();

  const isConnected =
    (activeWallet === "solana" && solanaWallet.connected) ||
    (activeWallet === "tron" && tronWallet.isConnected);

  const address =
    activeWallet === "solana"
      ? solanaWallet.publicKey?.toString() || null
      : activeWallet === "tron"
        ? tronWallet.address
        : null;

  const disconnect = () => {
    if (activeWallet === "solana") {
      solanaWallet.disconnect();
    } else if (activeWallet === "tron") {
      tronWallet.disconnect();
    }
    setActiveWallet(null);
  };

  const value: MultiWalletContextType = {
    activeWallet,
    setActiveWallet,
    isConnected,
    address,
    disconnect,
  };

  return <MultiWalletContext.Provider value={value}>{children}</MultiWalletContext.Provider>;
};
