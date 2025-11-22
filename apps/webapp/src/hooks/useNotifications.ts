"use client";

import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface NotificationEvent {
  type: string;
  data: any;
  timestamp: Date;
}

/**
 * Hook for managing real-time notifications via WebSocket
 */
export function useNotifications(walletAddress?: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);

  // Initialize socket connection
  useEffect(() => {
    if (typeof window === "undefined") return;

    const socketUrl = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001";
    const newSocket = io(`${socketUrl}/notifications`, {
      transports: ["websocket"],
      autoConnect: true,
    });

    newSocket.on("connect", () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Subscribe to user notifications when wallet connects
  useEffect(() => {
    if (socket && isConnected && walletAddress) {
      socket.emit("subscribe:user", { walletAddress });
      console.log("Subscribed to user notifications:", walletAddress);
    }
  }, [socket, isConnected, walletAddress]);

  // Subscribe to wexel notifications
  const subscribeToWexel = useCallback(
    (wexelId: number) => {
      if (socket && isConnected) {
        socket.emit("subscribe:wexel", { wexelId });
        console.log("Subscribed to wexel:", wexelId);
      }
    },
    [socket, isConnected]
  );

  // Subscribe to marketplace notifications
  const subscribeToMarketplace = useCallback(() => {
    if (socket && isConnected) {
      socket.emit("subscribe:marketplace");
      console.log("Subscribed to marketplace");
    }
  }, [socket, isConnected]);

  // Unsubscribe from channel
  const unsubscribe = useCallback(
    (channel: string) => {
      if (socket && isConnected) {
        socket.emit("unsubscribe", { channel });
        console.log("Unsubscribed from:", channel);
      }
    },
    [socket, isConnected]
  );

  // Listen for wexel events
  useEffect(() => {
    if (!socket) return;

    const handleWexelCreated = (data: any) => {
      console.log("Wexel created:", data);
      addNotification("wexel:created", data);
    };

    const handleBoostApplied = (data: any) => {
      console.log("Boost applied:", data);
      addNotification("wexel:boost_applied", data);
    };

    const handleRewardsAccrued = (data: any) => {
      console.log("Rewards accrued:", data);
      addNotification("wexel:rewards_accrued", data);
    };

    const handleClaimed = (data: any) => {
      console.log("Claimed:", data);
      addNotification("wexel:claimed", data);
    };

    const handleCollateralized = (data: any) => {
      console.log("Collateralized:", data);
      addNotification("wexel:collateralized", data);
    };

    const handleLoanRepaid = (data: any) => {
      console.log("Loan repaid:", data);
      addNotification("wexel:loan_repaid", data);
    };

    const handleRedeemed = (data: any) => {
      console.log("Redeemed:", data);
      addNotification("wexel:redeemed", data);
    };

    // Marketplace events
    const handleListingCreated = (data: any) => {
      console.log("Listing created:", data);
      addNotification("marketplace:listing_created", data);
    };

    const handleListingSold = (data: any) => {
      console.log("Listing sold:", data);
      addNotification("marketplace:listing_sold", data);
    };

    const handleListingCancelled = (data: any) => {
      console.log("Listing cancelled:", data);
      addNotification("marketplace:listing_cancelled", data);
    };

    socket.on("wexel:created", handleWexelCreated);
    socket.on("wexel:boost_applied", handleBoostApplied);
    socket.on("wexel:rewards_accrued", handleRewardsAccrued);
    socket.on("wexel:claimed", handleClaimed);
    socket.on("wexel:collateralized", handleCollateralized);
    socket.on("wexel:loan_repaid", handleLoanRepaid);
    socket.on("wexel:redeemed", handleRedeemed);
    socket.on("marketplace:listing_created", handleListingCreated);
    socket.on("marketplace:listing_sold", handleListingSold);
    socket.on("marketplace:listing_cancelled", handleListingCancelled);

    return () => {
      socket.off("wexel:created", handleWexelCreated);
      socket.off("wexel:boost_applied", handleBoostApplied);
      socket.off("wexel:rewards_accrued", handleRewardsAccrued);
      socket.off("wexel:claimed", handleClaimed);
      socket.off("wexel:collateralized", handleCollateralized);
      socket.off("wexel:loan_repaid", handleLoanRepaid);
      socket.off("wexel:redeemed", handleRedeemed);
      socket.off("marketplace:listing_created", handleListingCreated);
      socket.off("marketplace:listing_sold", handleListingSold);
      socket.off("marketplace:listing_cancelled", handleListingCancelled);
    };
  }, [socket]);

  const addNotification = (type: string, data: any) => {
    setNotifications((prev) => [
      { type, data, timestamp: new Date() },
      ...prev.slice(0, 49), // Keep last 50 notifications
    ]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    isConnected,
    notifications,
    subscribeToWexel,
    subscribeToMarketplace,
    unsubscribe,
    clearNotifications,
  };
}
