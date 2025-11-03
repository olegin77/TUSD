"use client";

import { WalletProviderWrapper } from "@/components/wallet-provider-wrapper";

// Force dynamic rendering for this route group - disable static generation
export const dynamic = "force-dynamic";

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return <WalletProviderWrapper>{children}</WalletProviderWrapper>;
}
