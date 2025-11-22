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
    // Check for TronLink availability
    if (typeof window !== "undefined") {
      const checkTronLink = async () => {
        // Wait for TronLink to inject
        let attempts = 0;
        while (attempts < 10) {
          if (window.tronLink && window.tronLink.ready) {
            const tronWebInstance = window.tronWeb;
            setTronWeb(tronWebInstance);

            // Check if already connected
            if (
              tronWebInstance &&
              tronWebInstance.defaultAddress &&
              tronWebInstance.defaultAddress.base58
            ) {
              setAddress(tronWebInstance.defaultAddress.base58);
              setIsConnected(true);
            }
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }
      };
      checkTronLink();
    }
  }, []);

  const connect = async () => {
    console.log("TronLink connect attempt");

    // Check if TronLink is installed
    if (typeof window === "undefined" || !window.tronLink) {
      const errorMsg = "Please install TronLink extension from https://www.tronlink.org/";
      alert(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      // Request account access
      const response = await window.tronLink.request({
        method: "tron_requestAccounts",
      });

      if (response.code === 200) {
        // Get the connected address
        const tronWebInstance = window.tronWeb;

        if (
          tronWebInstance &&
          tronWebInstance.defaultAddress &&
          tronWebInstance.defaultAddress.base58
        ) {
          const userAddress = tronWebInstance.defaultAddress.base58;
          setTronWeb(tronWebInstance);
          setAddress(userAddress);
          setIsConnected(true);
          console.log("TronLink connected:", userAddress);
        } else {
          throw new Error("Failed to get TronLink address");
        }
      } else if (response.code === 4001) {
        throw new Error("User rejected the connection request");
      } else {
        throw new Error(response.message || "Failed to connect to TronLink");
      }
    } catch (error: any) {
      console.error("TronLink connection error:", error);
      setIsConnected(false);
      setAddress(null);
      throw error;
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
