"use client";

import dynamic from "next/dynamic";

// Dynamically import MultiWalletProvider with SSR disabled
const MultiWalletProvider = dynamic(
  () => import("@/providers/MultiWalletProvider").then((mod) => mod.MultiWalletProvider),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading wallet providers...</p>
      </div>
    ),
  }
);

export function WalletProviderWrapper({ children }: { children: React.ReactNode }) {
  return <MultiWalletProvider>{children}</MultiWalletProvider>;
}
