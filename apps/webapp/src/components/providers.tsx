"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import wallet provider wrapper with no SSR
const WalletProviderWrapper = dynamic(
  () => import("./wallet-provider-wrapper").then((mod) => ({ default: mod.WalletProviderWrapper })),
  { ssr: false }
);

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

  console.log('[Providers] Initializing application providers');

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProviderWrapper>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </WalletProviderWrapper>
    </QueryClientProvider>
  );
}
