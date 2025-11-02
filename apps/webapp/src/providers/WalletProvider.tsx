"use client";

import React, { FC, ReactNode, useState, useEffect } from "react";

interface WalletContextProviderProps {
  children: ReactNode;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  const [WalletComponents, setWalletComponents] = useState<any>(null);
  const [endpoint, setEndpoint] = useState<string>("");
  const [wallets, setWallets] = useState<any[]>([]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    // Dynamically import ALL wallet adapter components
    Promise.all([
      import("@solana/wallet-adapter-react"),
      import("@solana/wallet-adapter-base"),
      import("@solana/wallet-adapter-react-ui"),
      import("@solana/web3.js"),
      import("./WalletAdapters"),
    ]).then(async ([reactAdapter, baseAdapter, uiAdapter, web3, walletAdaptersModule]) => {
      // Set up endpoint
      const network = baseAdapter.WalletAdapterNetwork.Devnet;
      const rpcEndpoint = web3.clusterApiUrl(network);
      setEndpoint(rpcEndpoint);

      // Get wallet adapters
      const adapters = await walletAdaptersModule.getWalletAdapters();
      setWallets(adapters);

      // Store components
      setWalletComponents({
        ConnectionProvider: reactAdapter.ConnectionProvider,
        WalletProvider: reactAdapter.WalletProvider,
        WalletModalProvider: uiAdapter.WalletModalProvider,
      });
    });
  }, []);

  // Show loading state until everything is loaded
  if (!WalletComponents || !endpoint) {
    return <div className="flex items-center justify-center p-4">Loading wallet providers...</div>;
  }

  const { ConnectionProvider, WalletProvider, WalletModalProvider } = WalletComponents;

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
