'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

export function ConnectButton() {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  return (
    <button
      onClick={() => setVisible(true)}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
    >
      {connected ? `${publicKey?.toString().slice(0, 8)}...` : 'Connect Wallet'}
    </button>
  );
}
