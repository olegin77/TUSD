"use client";

// Force dynamic rendering to avoid SSR issues
export const dynamic = "force-dynamic";

import { MultiWalletProvider } from "@/providers/MultiWalletProvider";

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return <MultiWalletProvider>{children}</MultiWalletProvider>;
}
