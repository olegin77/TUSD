"use client";

import { WalletConnect } from "@/components/wallet/WalletConnect";
import { PageTransition } from "@/components/ui/page-transition";
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
