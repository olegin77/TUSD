import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./wallet-styles.css";
import { ClientNavigation } from "@/components/client-navigation";
import { Providers } from "@/components/providers";
import { SkipToContent } from "@/components/a11y/a11y-provider";
import { AnnouncerProvider } from "@/components/a11y/announcer";

const inter = localFont({
  src: [
    {
      path: "../../public/fonts/web/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/web/Inter-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/web/Inter-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

// Force dynamic rendering for entire application - disable static generation
export const dynamic = "force-dynamic";

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
            <ClientNavigation />
            <main id="main-content">{children}</main>
          </Providers>
        </AnnouncerProvider>
      </body>
    </html>
  );
}
