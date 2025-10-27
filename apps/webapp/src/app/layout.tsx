import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { MultiWalletProvider } from "@/providers/MultiWalletProvider";
import { Providers } from "@/components/providers";

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
        <MultiWalletProvider>
          <Providers>
            <Navigation />
            {children}
          </Providers>
        </MultiWalletProvider>
      </body>
    </html>
  );
}
