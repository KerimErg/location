import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});
const sora = localFont({
  src: "../../node_modules/@fontsource-variable/sora/files/sora-latin-wght-normal.woff2",
  variable: "--font-sora",
  weight: "100 800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: { default: "TestLocation — Location de voitures premium", template: "%s · TestLocation" },
  description:
    "Louez une citadine, un SUV, un utilitaire ou un véhicule premium en quelques clics. Kilométrage illimité, annulation gratuite, assistance 24/7.",
  openGraph: { type: "website", locale: "fr_FR", siteName: "TestLocation" },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning className={`${inter.variable} ${sora.variable}`}>
      <body className="min-h-dvh font-sans">
        <Providers>
          <Header />
          <main className="min-h-dvh">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
