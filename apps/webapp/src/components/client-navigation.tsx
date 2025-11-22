"use client";

import dynamic from "next/dynamic";

// Dynamically import Navigation with no SSR to prevent wallet adapter from loading on server
const Navigation = dynamic(
  () => import("@/components/navigation").then((mod) => ({ default: mod.Navigation })),
  {
    ssr: false,
  }
);

export function ClientNavigation() {
  return <Navigation />;
}
