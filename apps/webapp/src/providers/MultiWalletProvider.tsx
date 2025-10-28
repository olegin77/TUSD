"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { TronProvider, useTron } from "./TronProvider";

// Check if we're on the client side
const isClient = typeof window !== "undefined";

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
  const [solanaWallet] = useState<{
    connected: boolean;
    publicKey: any;
    disconnect: () => void;
  }>({
    connected: false,
    publicKey: null,
    disconnect: () => {},
  });

  // ESLint cleanup: Removed unused setSolanaWallet
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Dynamically import Solana wallet - handled by WalletProvider when loaded
      import("@solana/wallet-adapter-react").catch((err) => {
        console.error("Failed to load Solana wallet adapter:", err);
      });
    }
  }, []);

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
  const [WalletProvider, setWalletProvider] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Dynamically import WalletProvider only on client side
      import("./WalletProvider").then((mod) => {
        setWalletProvider(() => mod.WalletContextProvider);
        setIsReady(true);
      });
    }
  }, []);

  if (!isClient || !isReady || !WalletProvider) {
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
        <MultiWalletContent>{children}</MultiWalletContent>
      </TronProvider>
    </WalletProvider>
  );
};

export const useMultiWallet = (): MultiWalletContextType => {
  const context = useContext(MultiWalletContext);
  if (context === undefined) {
    throw new Error("useMultiWallet must be used within a MultiWalletProvider");
  }
  return context;
};
