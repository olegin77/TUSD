"use client";

import dynamic from "next/dynamic";
import { PageTransition } from "@/components/ui/page-transition";

// Dynamically import WalletConnect with no SSR to prevent wallet adapter from being bundled in server chunks
const WalletConnect = dynamic(
  () => import("@/components/wallet/WalletConnect").then((mod) => mod.WalletConnect),
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center p-8">Loading wallet...</div>,
  }
);

export default function WalletPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <WalletConnect />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
