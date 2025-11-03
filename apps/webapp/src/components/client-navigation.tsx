"use client";

import dynamic from "next/dynamic";

// Dynamically import Navigation with no SSR to prevent wallet adapter from loading on server
const Navigation = dynamic(
  () => import("@/components/navigation").then((mod) => ({ default: mod.Navigation })),
  {
    ssr: false,
    loading: () => (
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="hidden md:flex items-center space-x-8">
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </nav>
    ),
  }
);

export function ClientNavigation() {
  return <Navigation />;
}
