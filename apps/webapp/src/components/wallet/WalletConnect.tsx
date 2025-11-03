"use client";

import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTron } from "@/providers/TronProvider";
import { useMultiWallet } from "@/contexts/multi-wallet-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, WalletIcon, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface WalletOptionProps {
  type: "solana" | "tron";
  name: string;
  description: string;
  icon: React.ReactNode;
  isConnected: boolean;
  isLoading: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  address?: string | null;
}

const WalletOption: React.FC<WalletOptionProps> = ({
  type,
  name,
  description,
  icon,
  isConnected,
  isLoading,
  onConnect,
  onDisconnect,
  address,
}) => {
  return (
    <Card className={`transition-all ${isConnected ? "ring-2 ring-green-500" : "hover:shadow-md"}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon}
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          {isConnected && <CheckCircle className="h-5 w-5 text-green-500" />}
        </div>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Адрес:</span>
              <Badge variant="outline" className="font-mono text-xs">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "N/A"}
              </Badge>
            </div>
            <Button
              variant="outline"
              onClick={onDisconnect}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <WalletIcon className="h-4 w-4 mr-2" />
              )}
              Отключить
            </Button>
          </div>
        ) : (
          <Button onClick={onConnect} className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Wallet className="h-4 w-4 mr-2" />
            )}
            Подключить {name}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export const WalletConnect: React.FC = () => {
  const { activeWallet, setActiveWallet, isConnected, disconnect } = useMultiWallet();
  const solanaWallet = useWallet();
  const tronWallet = useTron();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleSolanaConnect = async () => {
    setIsConnecting(true);
    try {
      await solanaWallet.connect();
      setActiveWallet("solana");
    } catch (error) {
      console.error("Failed to connect Solana wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleTronConnect = async () => {
    setIsConnecting(true);
    try {
      await tronWallet.connect();
      setActiveWallet("tron");
    } catch (error) {
      console.error("Failed to connect Tron wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Подключите кошелек</h2>
        <p className="text-gray-600">Выберите кошелек для подключения к платформе Wexel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WalletOption
          type="solana"
          name="Solana"
          description="Phantom, Solflare и другие"
          icon={
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
              S
            </div>
          }
          isConnected={solanaWallet.connected}
          isLoading={isConnecting && activeWallet === "solana"}
          onConnect={handleSolanaConnect}
          onDisconnect={handleDisconnect}
          address={solanaWallet.publicKey?.toString()}
        />

        <WalletOption
          type="tron"
          name="Tron"
          description="TronLink и другие"
          icon={
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
              T
            </div>
          }
          isConnected={tronWallet.isConnected}
          isLoading={isConnecting && activeWallet === "tron"}
          onConnect={handleTronConnect}
          onDisconnect={handleDisconnect}
          address={tronWallet.address}
        />
      </div>

      {tronWallet.error && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">{tronWallet.error}</span>
        </div>
      )}

      {isConnected && (
        <div className="text-center">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Кошелек подключен
          </Badge>
        </div>
      )}
    </div>
  );
};
