"use client";

import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues
const WalletStatus = dynamic(() => import("./WalletStatus").then(mod => ({ default: mod.WalletStatus })), {
  ssr: false,
  loading: () => (
    <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
  )
});

export function WalletStatusWrapper() {
  return <WalletStatus />;
}