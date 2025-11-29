"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTron } from "@/providers/TronProvider";
import { ExternalLink, Loader2 } from "lucide-react";

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  installed: boolean;
  connect: () => Promise<string>;
}

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect?: (address: string, walletType: string) => void;
}

export function WalletConnectModal({
  isOpen,
  onClose,
  onConnect,
}: WalletConnectModalProps) {
  const { connect: connectTron, isConnected, address } = useTron();
  const [wallets, setWallets] = useState<WalletOption[]>([]);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectWallets = () => {
      const detected: WalletOption[] = [];

      // TronLink
      detected.push({
        id: "tronlink",
        name: "TronLink",
        icon: "/icons/tronlink.svg",
        installed:
          typeof window !== "undefined" && !!(window as any).tronLink,
        connect: connectTronLink,
      });

      // Trust Wallet (via TronWeb)
      detected.push({
        id: "trustwallet",
        name: "Trust Wallet",
        icon: "/icons/trustwallet.svg",
        installed:
          typeof window !== "undefined" &&
          !!(window as any).trustwallet?.tronWeb,
        connect: connectTrustWallet,
      });

      setWallets(detected);
    };

    if (isOpen) {
      detectWallets();
      setError(null);
    }
  }, [isOpen]);

  // Auto-close if already connected
  useEffect(() => {
    if (isConnected && address && isOpen) {
      onConnect?.(address, "tronlink");
      onClose();
    }
  }, [isConnected, address, isOpen, onClose, onConnect]);

  const connectTronLink = async (): Promise<string> => {
    const tronLink = (window as any).tronLink;

    if (!tronLink) {
      throw new Error(
        "TronLink not installed. Please install the TronLink extension."
      );
    }

    // Request connection
    const res = await tronLink.request({ method: "tron_requestAccounts" });

    if (res.code !== 200) {
      throw new Error("User rejected the connection");
    }

    // Get address
    const tronWeb = (window as any).tronWeb;
    if (!tronWeb || !tronWeb.ready) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const connectedAddress = (window as any).tronWeb?.defaultAddress?.base58;

    if (!connectedAddress) {
      throw new Error("Failed to get wallet address");
    }

    return connectedAddress;
  };

  const connectTrustWallet = async (): Promise<string> => {
    const trustWallet = (window as any).trustwallet;

    if (!trustWallet?.tronWeb) {
      throw new Error("Trust Wallet not detected");
    }

    const tronWeb = trustWallet.tronWeb;
    const connectedAddress = tronWeb.defaultAddress?.base58;

    if (!connectedAddress) {
      throw new Error("Failed to get address from Trust Wallet");
    }

    return connectedAddress;
  };

  const handleConnect = async (wallet: WalletOption) => {
    if (!wallet.installed) {
      // Open install link
      const installUrls: Record<string, string> = {
        tronlink: "https://www.tronlink.org/",
        trustwallet: "https://trustwallet.com/",
      };
      window.open(installUrls[wallet.id], "_blank");
      return;
    }

    setConnecting(wallet.id);
    setError(null);

    try {
      // Use the TronProvider connect function for TronLink
      if (wallet.id === "tronlink") {
        await connectTron();
      } else {
        const connectedAddress = await wallet.connect();
        onConnect?.(connectedAddress, wallet.id);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "Connection error");
    } finally {
      setConnecting(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            Connect TRON Wallet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleConnect(wallet)}
              disabled={connecting !== null}
              className={`
                w-full flex items-center gap-4 p-4 rounded-xl border transition-all
                ${
                  wallet.installed
                    ? "border-gray-600 hover:border-red-500 hover:bg-gray-800"
                    : "border-gray-700 opacity-60"
                }
                ${connecting === wallet.id ? "bg-gray-800" : ""}
              `}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  wallet.id === "tronlink"
                    ? "bg-gradient-to-br from-red-500 to-orange-500"
                    : "bg-gradient-to-br from-blue-500 to-purple-500"
                }`}
              >
                <span className="text-white font-bold text-lg">
                  {wallet.name[0]}
                </span>
              </div>
              <div className="flex-1 text-left">
                <div className="text-white font-medium">{wallet.name}</div>
                <div className="text-sm text-gray-400">
                  {wallet.installed ? (
                    "Detected"
                  ) : (
                    <span className="flex items-center gap-1">
                      Not installed - click to install{" "}
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
              {connecting === wallet.id && (
                <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="mt-6 text-center text-gray-500 text-sm">
          By connecting a wallet, you agree to the platform terms of use
        </div>
      </DialogContent>
    </Dialog>
  );
}
