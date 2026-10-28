import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloating } from "@/components/WhatsAppFloating";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://hittech.ma"),
  title: {
    default: "Hit Tech — Boutique Technologique & Produits Innovants",
    template: "%s | Hit Tech",
  },
  description:
    "Hit Tech : Sélection de smartphones, ordinateurs portables, tablettes et accessoires audio haute performance sous garantie constructeur.",
  keywords: [
    "Hit Tech",
    "boutique tech",
    "smartphones",
    "pc portables",
    "audio haute fidélité",
    "gadgets",
  ],
  authors: [{ name: "Hit Tech" }],
  openGraph: {
    title: "Hit Tech — Boutique Technologique & Produits Innovants",
    description:
      "Sélection haut de gamme de produits tech : smartphones, ordinateurs portables, audio et accessoires.",
    url: "/",
    siteName: "Hit Tech",
    locale: "fr_FR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var theme = localStorage.getItem('hit-tech-theme');
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.remove('light');
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            })()`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-black text-zinc-100 antialiased selection:bg-white selection:text-black">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <WhatsAppFloating />
      </body>
    </html>
  );
}
