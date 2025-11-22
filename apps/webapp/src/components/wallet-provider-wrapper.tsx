"use client";

import React from "react";
import dynamic from "next/dynamic";

// Import wallet providers with correct named export
const WalletProviders = dynamic(
  () => import("./wallet-providers").then((mod) => ({ default: mod.WalletProviders })),
  { ssr: false }
);

export function WalletProviderWrapper({ children }: { children: React.ReactNode }) {
  return <WalletProviders>{children}</WalletProviders>;
}
