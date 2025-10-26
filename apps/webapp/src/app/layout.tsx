import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { A11yProvider, SkipToContent } from "@/components/a11y/a11y-provider";
import { AnnouncerProvider } from "@/components/a11y/announcer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "USDX/Wexel Platform",
  description: "Децентрализованная платформа приёма ликвидности с поддержкой Solana и Tron",
  keywords: ["DeFi", "Solana", "Tron", "USDT", "NFT", "Yield"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <A11yProvider>
          <AnnouncerProvider>
            <SkipToContent />
            <Providers>
              <main id="main-content" tabIndex={-1}>
                {children}
              </main>
              <Toaster />
            </Providers>
          </AnnouncerProvider>
        </A11yProvider>
      </body>
    </html>
  );
}
