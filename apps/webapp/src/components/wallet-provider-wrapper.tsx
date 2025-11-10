"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTron } from "@/providers/TronProvider";
import { MultiWalletProvider } from "@/contexts/multi-wallet-context";

// Import wallet providers with correct named export
const WalletProviders = dynamic(
  () => import("./wallet-providers").then((mod) => ({ default: mod.WalletProviders })),
  { ssr: false }
);

interface InnerWrapperProps {
  children: React.ReactNode;
}

// This component is inside the Solana/Tron providers and can use their hooks
function InnerWrapper({ children }: InnerWrapperProps) {
  const solanaWallet = useWallet();
  const tronWallet = useTron();

  return (
    <MultiWalletProvider
      solanaConnected={solanaWallet.connected}
      solanaAddress={solanaWallet.publicKey?.toString() || null}
      tronConnected={tronWallet.isConnected}
      tronAddress={tronWallet.address}
      onDisconnect={() => {
        if (solanaWallet.connected) {
          solanaWallet.disconnect();
        }
      }}
    >
      {children}
    </MultiWalletProvider>
  );
}

export function WalletProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <WalletProviders>
      <InnerWrapper>{children}</InnerWrapper>
    </WalletProviders>
  );
}
