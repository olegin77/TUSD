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

  const initTronWeb = async () => {
    if (typeof window === 'undefined') return;
    
    // Wait for TronLink to inject
    let attempts = 0;
    while (!window.tronLink && !window.tronWeb && attempts < 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    if (window.tronLink || window.tronWeb) {
      try {
        // Use tronLink if available, fallback to tronWeb
        const tron = window.tronLink || window.tronWeb;
        setTronWeb(tron);
        
        // Check if already connected
        if (tron.ready || (tron.defaultAddress && tron.defaultAddress.base58)) {
          const addr = tron.defaultAddress?.base58 || tron.address;
          if (addr) {
            setAddress(addr);
            setIsConnected(true);
          }
        }
      } catch (error) {
        console.log("TronLink initialization pending...");
      }
    }
  };

  useEffect(() => {
    initTronWeb();
    
    // Listen for account changes
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('message', (e) => {
        if (e.data?.message?.action === 'accountsChanged') {
          initTronWeb();
        }
      });
    }
  }, []);

  const connect = async () => {
    if (!tronWeb && !window.tronLink && !window.tronWeb) {
      // Open TronLink installation page in new tab
      window.open('https://www.tronlink.org/', '_blank');
      throw new Error("Please install TronLink extension and refresh the page");
    }

    try {
      // Request account access
      const tron = window.tronLink || window.tronWeb;
      
      if (window.tronLink?.request) {
        const result = await window.tronLink.request({ method: 'tron_requestAccounts' });
        if (result?.code === 200) {
          await initTronWeb();
        }
      } else if (tron) {
        // Fallback for older versions
        await new Promise(resolve => setTimeout(resolve, 1000));
        await initTronWeb();
      }
    } catch (error) {
      console.error("Failed to connect to TronLink:", error);
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

// Add type declarations
declare global {
  interface Window {
    tronWeb?: any;
    tronLink?: any;
  }
}
