// Force dynamic rendering to avoid SSR issues
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./wallet-styles.css";
import { Navigation } from "@/components/navigation";
import { Providers } from "@/components/providers";
import { SkipToContent } from "@/components/a11y/a11y-provider";
import { AnnouncerProvider } from "@/components/a11y/announcer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wexel - Децентрализованные векселя",
  description:
    "Инвестируйте в стабильные активы с высокой доходностью. Получайте NFT-векселя, торгуйте ими на маркетплейсе и используйте как залог.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <SkipToContent />
        <AnnouncerProvider>
          <Providers>
            <Navigation />
            <main id="main-content">{children}</main>
          </Providers>
        </AnnouncerProvider>
      </body>
    </html>
  );
}
