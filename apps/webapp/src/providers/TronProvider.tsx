"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface TronContextType {
  isConnected: boolean;
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  tronWeb: any | null;
}

const TronContext = createContext<TronContextType | null>(null);

export function TronProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [tronWeb, setTronWeb] = useState<any>(null);

  useEffect(() => {
    // Simple check, no waiting
    if (typeof window !== 'undefined' && window.tronWeb) {
      setTronWeb(window.tronWeb);
    }
  }, []);

  const connect = async () => {
    console.log("TronLink connect attempt");
    if (!window.tronWeb && !window.tronLink) {
      alert("Please install TronLink extension");
      return;
    }
    try {
      // Simple connection attempt
      setIsConnected(true);
      setAddress("TronWalletAddress");
    } catch (error) {
      console.error("TronLink error:", error);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
  };

  return (
    <TronContext.Provider value={{ isConnected, address, connect, disconnect, tronWeb }}>
      {children}
    </TronContext.Provider>
  );
}

export const useTron = () => {
  const context = useContext(TronContext);
  if (!context) {
    throw new Error("useTron must be used within a TronProvider");
  }
  return context;
};

declare global {
  interface Window {
    tronWeb?: any;
    tronLink?: any;
  }
}
