import { WalletProviderWrapper } from "@/components/wallet-provider-wrapper";

// Force dynamic rendering for wallet pages to prevent SSR/SSG
export const dynamic = 'force-dynamic';

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return <WalletProviderWrapper>{children}</WalletProviderWrapper>;
}
