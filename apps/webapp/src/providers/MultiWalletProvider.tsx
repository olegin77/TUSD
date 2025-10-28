"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import dynamic from "next/dynamic";
import { TronProvider, useTron } from "./TronProvider";

// Import wallet hook conditionally to avoid SSR issues
let useWallet: any;
if (typeof window !== "undefined") {
  import("@solana/wallet-adapter-react").then((mod) => {
    useWallet = mod.useWallet;
  });
}

// Dynamic import of WalletContextProvider to avoid SSR issues with Solana wallet adapters
const WalletContextProvider = dynamic(
  () => import("./WalletProvider").then((mod) => mod.WalletContextProvider),
  {
    ssr: false,
    loading: () => <div>Loading wallet...</div>,
  }
);

export type WalletType = "solana" | "tron";

interface MultiWalletContextType {
  activeWallet: WalletType | null;
  setActiveWallet: (wallet: WalletType | null) => void;
  isConnected: boolean;
  address: string | null;
  disconnect: () => void;
}

const MultiWalletContext = createContext<MultiWalletContextType | undefined>(undefined);

interface MultiWalletProviderProps {
  children: ReactNode;
}

const MultiWalletContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeWallet, setActiveWallet] = useState<WalletType | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Dynamically import useWallet hook after mount
  const [solanaHook, setSolanaHook] = useState<any>(null);
  
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      import("@solana/wallet-adapter-react").then((mod) => {
        setSolanaHook(() => mod.useWallet);
      });
    }
  }, []);
  
  // Use the hook only if available
  const solanaWallet = solanaHook ? solanaHook() : { connected: false, publicKey: null, disconnect: () => {} };
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

export const MultiWalletProvider: React.FC<MultiWalletProviderProps> = ({ children }) => {
  return (
    <WalletContextProvider>
      <TronProvider>
        <MultiWalletContent>{children}</MultiWalletContent>
      </TronProvider>
    </WalletContextProvider>
  );
};

export const useMultiWallet = (): MultiWalletContextType => {
  const context = useContext(MultiWalletContext);
  if (context === undefined) {
    throw new Error("useMultiWallet must be used within a MultiWalletProvider");
  }
  return context;
};
