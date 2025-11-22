"use client";

import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";

export function getWalletAdapters() {
  // Only load and instantiate wallet adapters on the client side
  if (typeof window === "undefined") {
    return [];
  }

  return [new PhantomWalletAdapter(), new SolflareWalletAdapter()];
}
