"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import dynamic from "next/dynamic";
import { A11yProvider } from "@/components/a11y/a11y-provider";
import { MultiWalletProvider } from "@/providers/MultiWalletProvider";

// Dynamically import React Query Devtools with no SSR
const ReactQueryDevtools = dynamic(
  () => import("@tanstack/react-query-devtools").then((mod) => mod.ReactQueryDevtools),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <MultiWalletProvider>
        <A11yProvider>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </A11yProvider>
      </MultiWalletProvider>
    </QueryClientProvider>
  );
}
