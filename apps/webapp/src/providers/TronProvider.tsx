"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type TronWeb from "tronweb";

interface TronContextType {
  tronWeb: any | null;
  isConnected: boolean;
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isLoading: boolean;
  error: string | null;
}

const TronContext = createContext<TronContextType | undefined>(undefined);

interface TronProviderProps {
  children: ReactNode;
}

export const TronProvider: React.FC<TronProviderProps> = ({ children }) => {
  const [tronWeb, setTronWeb] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize TronWeb
  useEffect(() => {
    const initTronWeb = async () => {
      // Only run on client side
      if (typeof window === "undefined") return;

      try {
        // Check if TronLink is available
        if (window.tronWeb && window.tronWeb.ready) {
          setTronWeb(window.tronWeb);
          setIsConnected(true);
          setAddress(window.tronWeb.defaultAddress.base58);
        } else {
          // For now, just set a placeholder
          setTronWeb(null);
        }
      } catch (err) {
        console.error("Failed to initialize TronWeb:", err);
        setError("Failed to initialize TronWeb");
      }
    };

    initTronWeb();
  }, []);

  const connect = async () => {
    // Only run on client side
    if (typeof window === "undefined") return;

    setIsLoading(true);
    setError(null);

    try {
      if (window.tronWeb && window.tronWeb.ready) {
        // Request account access
        const accounts = await window.tronWeb.request({
          method: "tron_requestAccounts",
        });

        if (accounts && accounts.length > 0) {
          setTronWeb(window.tronWeb);
          setIsConnected(true);
          setAddress(accounts[0]);
        } else {
          throw new Error("No accounts found");
        }
      } else {
        throw new Error("TronLink not found. Please install TronLink extension.");
      }
    } catch (err) {
      console.error("Failed to connect to TronLink:", err);
      setError(err instanceof Error ? err.message : "Failed to connect to TronLink");
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
    setTronWeb(null);
  };

  const value: TronContextType = {
    tronWeb,
    isConnected,
    address,
    connect,
    disconnect,
    isLoading,
    error,
  };

  return <TronContext.Provider value={value}>{children}</TronContext.Provider>;
};

export const useTron = (): TronContextType => {
  const context = useContext(TronContext);
  if (context === undefined) {
    throw new Error("useTron must be used within a TronProvider");
  }
  return context;
};

// Extend Window interface for TronLink
declare global {
  interface Window {
    tronWeb: any;
  }
}
