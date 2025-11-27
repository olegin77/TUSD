import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./wallet-styles.css";
import { ClientNavigation } from "@/components/client-navigation";
import { Providers } from "@/components/providers";
import { SkipToContent } from "@/components/a11y/a11y-provider";
import { AnnouncerProvider } from "@/components/a11y/announcer";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

// Force dynamic rendering for entire application - disable static generation
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "TAKARA - Cross-Chain Investment Platform",
  description:
    "Инвестируйте в кросс-чейн хранилища с высокой доходностью. USDT депозиты на TRON, награды в USDT + Takara токены на Solana.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <SkipToContent />
        <AnnouncerProvider>
          <Providers>
            <ClientNavigation />
            <main id="main-content">{children}</main>
          </Providers>
        </AnnouncerProvider>
      </body>
    </html>
  );
}
