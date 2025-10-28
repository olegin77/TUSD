import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { MultiWalletProvider } from "@/providers/MultiWalletProvider";
import { Providers } from "@/components/providers";
import { SkipToContent } from "@/components/a11y/a11y-provider";
import { Announcer } from "@/components/a11y/announcer";

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
        <Announcer />
        <MultiWalletProvider>
          <Providers>
            <Navigation />
            <main id="main-content">{children}</main>
          </Providers>
        </MultiWalletProvider>
      </body>
    </html>
  );
}
