"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import dynamic from "next/dynamic";
import { A11yProvider } from "@/components/a11y/a11y-provider";

// Dynamically import wallet providers with no SSR
const MultiWalletProvider = dynamic(
  () => import("@/providers/MultiWalletProvider").then((mod) => mod.MultiWalletProvider),
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
