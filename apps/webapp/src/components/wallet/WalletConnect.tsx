"use client";

import React, { useState, useCallback } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useTron } from "@/providers/TronProvider";
import { useMultiWallet } from "@/contexts/multi-wallet-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, ChevronRight, ExternalLink, AlertCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export function WalletConnect() {
  const { setActiveWallet } = useMultiWallet();
  const { setVisible: setSolanaModalVisible } = useWalletModal();
  const { connect: connectTron } = useTron();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSolanaConnect = useCallback(async () => {
    console.log("Opening Solana wallet modal...");
    setIsConnecting(true);
    setError(null);
    try {
      setActiveWallet("solana");
      setSolanaModalVisible(true);
    } catch (error) {
      console.error("Solana connection error:", error);
      setError("Failed to open Solana wallet modal");
      toast.error("Failed to open wallet modal");
    } finally {
      setIsConnecting(false);
    }
  }, [setActiveWallet, setSolanaModalVisible]);

  const handleTronConnect = useCallback(async () => {
    console.log("Connecting to TronLink...");
    setIsConnecting(true);
    setError(null);
    try {
      setActiveWallet("tron");
      await connectTron();
      toast.success("TronLink connected!");
    } catch (error: any) {
      console.error("TronLink connection error:", error);
      setError(error.message || "Failed to connect TronLink");
      toast.error(error.message || "Failed to connect TronLink");

      // Reset active wallet on error
      setActiveWallet(null);
    } finally {
      setIsConnecting(false);
    }
  }, [setActiveWallet, connectTron]);

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Connect Wallet</h2>
        <p className="text-muted-foreground">Choose a wallet to connect to Wexel platform</p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <Card
        className="cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={handleSolanaConnect}
      >
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <div>
              <h3 className="font-semibold">Solana</h3>
              <p className="text-sm text-muted-foreground">Phantom, Solflare & more</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </CardContent>
      </Card>

      <Card
        className="cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={handleTronConnect}
      >
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            <div>
              <h3 className="font-semibold">Tron</h3>
              <p className="text-sm text-muted-foreground">TronLink & more</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </CardContent>
      </Card>

      {isConnecting && (
        <div className="text-center text-sm text-muted-foreground">Connecting...</div>
      )}

      <div className="text-center text-xs text-muted-foreground mt-6">
        Don't have a wallet?{" "}
        <a
          href="https://phantom.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline inline-flex items-center gap-1"
        >
          Get Phantom <ExternalLink className="w-3 h-3" />
        </a>
        {" or "}
        <a
          href="https://www.tronlink.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline inline-flex items-center gap-1"
        >
          Get TronLink <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
