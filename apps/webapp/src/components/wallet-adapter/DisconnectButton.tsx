"use client";

import { useWallet } from "@solana/wallet-adapter-react";

export function DisconnectButton() {
  const { disconnect, connected } = useWallet();

  if (!connected) return null;

  return (
    <button
      onClick={disconnect}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Disconnect
    </button>
  );
}
