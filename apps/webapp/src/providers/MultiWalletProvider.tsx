"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { TronProvider, useTron } from "./TronProvider";

// Check if we're on the client side
const isClient = typeof window !== "undefined";

// Dynamic imports to avoid SSR issues
let WalletContextProvider: any;
let useWallet: any;

if (isClient) {
  // Only import on client side
  import("./WalletProvider").then((mod) => {
    WalletContextProvider = mod.WalletContextProvider;
  });
  import("@solana/wallet-adapter-react").then((mod) => {
    useWallet = mod.useWallet;
  });
}

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
  const solanaWallet = solanaHook
    ? solanaHook()
    : { connected: false, publicKey: null, disconnect: () => {} };
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
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Wait for client-side imports to complete
    const checkReady = setInterval(() => {
      if (WalletContextProvider) {
        setIsReady(true);
        clearInterval(checkReady);
      }
    }, 100);
    
    return () => clearInterval(checkReady);
  }, []);
  
  if (!isClient || !isReady) {
    return (
      <TronProvider>
        <div className="min-h-screen flex items-center justify-center">
          <p>Initializing wallet providers...</p>
        </div>
      </TronProvider>
    );
  }
  
  const Provider = WalletContextProvider;
  
  return (
    <Provider>
      <TronProvider>
        <MultiWalletContent>{children}</MultiWalletContent>
      </TronProvider>
    </Provider>
  );
};

export const useMultiWallet = (): MultiWalletContextType => {
  const context = useContext(MultiWalletContext);
  if (context === undefined) {
    throw new Error("useMultiWallet must be used within a MultiWalletProvider");
  }
  return context;
};
