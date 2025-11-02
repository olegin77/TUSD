"use client";

export async function getWalletAdapters() {
  // Only load and instantiate wallet adapters on the client side
  if (typeof window === "undefined") {
    return [];
  }

  // Dynamically import the wallet adapters only on client side
  const { PhantomWalletAdapter, SolflareWalletAdapter } = await import("@solana/wallet-adapter-wallets");

  return [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ];
}
