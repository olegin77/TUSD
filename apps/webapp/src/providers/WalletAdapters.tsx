"use client";

import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";

export function getWalletAdapters() {
  return [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ];
}
