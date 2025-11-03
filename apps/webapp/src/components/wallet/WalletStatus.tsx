"use client";

import React from "react";
import { useMultiWallet } from "@/contexts/multi-wallet-context";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge"; // Currently unused
import { Wallet, WalletIcon, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const WalletStatus: React.FC = () => {
  const { activeWallet, isConnected, address, disconnect } = useMultiWallet();

  const walletName = activeWallet === "solana" ? "Solana" : activeWallet === "tron" ? "Tron" : null;

  if (!isConnected || !address) {
    return (
      <Button variant="outline" size="sm">
        <Wallet className="h-4 w-4 mr-2" />
        Подключить кошелек
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {walletName?.charAt(0)}
          </div>
          <span className="hidden sm:inline">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {walletName?.charAt(0)}
            </div>
            <div>
              <p className="font-medium">{walletName} кошелек</p>
              <p className="text-xs text-gray-500 font-mono">
                {address.slice(0, 8)}...{address.slice(-8)}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <WalletIcon className="h-4 w-4 mr-2" />
          Управление кошельком
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnect} className="text-red-600">
          Отключить кошелек
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
