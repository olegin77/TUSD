"use client";

import { useState } from "react";
import { Bell, X, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface NotificationCenterProps {
  walletAddress?: string;
}

export function NotificationCenter({ walletAddress }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected, notifications, clearNotifications } =
    useNotifications(walletAddress);

  const unreadCount = notifications.length;

  const getIcon = (type: string) => {
    if (type.includes("claimed")) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (type.includes("error")) return <AlertCircle className="h-4 w-4 text-red-500" />;
    return <TrendingUp className="h-4 w-4 text-blue-500" />;
  };

  const formatType = (type: string) => {
    return type
      .split(":")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
        {!isConnected && (
          <div className="absolute bottom-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <Card className="absolute right-0 mt-2 w-96 max-h-96 overflow-y-auto z-50 shadow-lg">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold">Notifications</h3>
                {!isConnected && (
                  <Badge variant="destructive" className="text-xs">
                    Disconnected
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearNotifications}
                  >
                    Clear all
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <CardContent className="p-0">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification, index) => (
                    <div
                      key={index}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        {getIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {formatType(notification.type)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.data.wexelId && (
                              <span>Wexel #{notification.data.wexelId}</span>
                            )}
                            {notification.data.amountUsd && (
                              <span className="ml-2">
                                ${(parseFloat(notification.data.amountUsd) / 1000000).toFixed(2)}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
