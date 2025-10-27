"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WalletContextProvider } from './WalletProvider';
import { TronProvider, useTron } from './TronProvider';
import { useWallet } from '@solana/wallet-adapter-react';

export type WalletType = 'solana' | 'tron';

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
  const solanaWallet = useWallet();
  const tronWallet = useTron();

  const isConnected = 
    (activeWallet === 'solana' && solanaWallet.connected) ||
    (activeWallet === 'tron' && tronWallet.isConnected);

  const address = 
    activeWallet === 'solana' ? solanaWallet.publicKey?.toString() || null :
    activeWallet === 'tron' ? tronWallet.address :
    null;

  const disconnect = () => {
    if (activeWallet === 'solana') {
      solanaWallet.disconnect();
    } else if (activeWallet === 'tron') {
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

  return (
    <MultiWalletContext.Provider value={value}>
      {children}
    </MultiWalletContext.Provider>
  );
};

export const MultiWalletProvider: React.FC<MultiWalletProviderProps> = ({ children }) => {
  return (
    <WalletContextProvider>
      <TronProvider>
        <MultiWalletContent>
          {children}
        </MultiWalletContent>
      </TronProvider>
    </WalletContextProvider>
  );
};

export const useMultiWallet = (): MultiWalletContextType => {
  const context = useContext(MultiWalletContext);
  if (context === undefined) {
    throw new Error('useMultiWallet must be used within a MultiWalletProvider');
  }
  return context;
};