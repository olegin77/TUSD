"use client";

import { useMultiWallet } from "@/providers/MultiWalletProvider";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { useTron } from "@/providers/TronProvider";

export const useWallet = () => {
  const multiWallet = useMultiWallet();
  const solanaWallet = useSolanaWallet();
  const tronWallet = useTron();

  const getWalletInfo = () => {
    if (multiWallet.activeWallet === "solana" && solanaWallet.connected) {
      return {
        type: "solana" as const,
        address: solanaWallet.publicKey?.toString() || null,
        connected: true,
        wallet: solanaWallet,
      };
    }

    if (multiWallet.activeWallet === "tron" && tronWallet.isConnected) {
      return {
        type: "tron" as const,
        address: tronWallet.address,
        connected: true,
        wallet: tronWallet,
      };
    }

    return {
      type: null,
      address: null,
      connected: false,
      wallet: null,
    };
  };

  const signMessage = async (message: string) => {
    const walletInfo = getWalletInfo();

    if (!walletInfo.connected || !walletInfo.wallet) {
      throw new Error("Wallet not connected");
    }

    if (walletInfo.type === "solana") {
      const solanaWallet = walletInfo.wallet as any;
      if (!solanaWallet.signMessage) {
        throw new Error("Wallet does not support message signing");
      }

      const messageBytes = new TextEncoder().encode(message);
      const signature = await solanaWallet.signMessage(messageBytes);
      return {
        signature: Array.from(signature),
        publicKey: walletInfo.address,
      };
    }

    if (walletInfo.type === "tron") {
      const tronWallet = walletInfo.wallet as any;
      if (!tronWallet.tronWeb.trx.signMessage) {
        throw new Error("Wallet does not support message signing");
      }

      const signature = await tronWallet.tronWeb.trx.signMessage(message);
      return {
        signature,
        publicKey: walletInfo.address,
      };
    }

    throw new Error("Unsupported wallet type");
  };

  const sendTransaction = async (transaction: any) => {
    const walletInfo = getWalletInfo();

    if (!walletInfo.connected || !walletInfo.wallet) {
      throw new Error("Wallet not connected");
    }

    if (walletInfo.type === "solana") {
      const solanaWallet = walletInfo.wallet as any;
      if (!solanaWallet.sendTransaction) {
        throw new Error("Wallet does not support sending transactions");
      }

      return await solanaWallet.sendTransaction(transaction);
    }

    if (walletInfo.type === "tron") {
      const tronWallet = walletInfo.wallet as any;
      if (!tronWallet.tronWeb.trx.sendTransaction) {
        throw new Error("Wallet does not support sending transactions");
      }

      return await tronWallet.tronWeb.trx.sendTransaction(transaction);
    }

    throw new Error("Unsupported wallet type");
  };

  return {
    ...multiWallet,
    getWalletInfo,
    signMessage,
    sendTransaction,
    solanaWallet,
    tronWallet,
  };
};
