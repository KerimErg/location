import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SITE, fullAddress } from "@/config/site";
import "./globals.css";

const archivo = localFont({ src: "../../node_modules/@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2", variable: "--font-archivo", weight: "100 900", display: "swap" });
const barlow = localFont({
  src: [
    { path: "../../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-500-normal.woff2", weight: "500" },
    { path: "../../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-600-normal.woff2", weight: "600" },
    { path: "../../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff2", weight: "700" },
  ],
  variable: "--font-barlow",
  display: "swap",
});
const plex = localFont({
  src: [
    { path: "../../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2", weight: "400" },
    { path: "../../node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2", weight: "500" },
  ],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — Voitures d'occasion à Liège (Rocourt)`, template: `%s · ${SITE.name}` },
  description: `Voitures d'occasion contrôlées avec Car-Pass et garantie 12 mois. Reprise, financement, essais sur rendez-vous — ${fullAddress}.`,
  openGraph: { type: "website", locale: "fr_BE", siteName: SITE.name, images: ["/images/banniere.webp"] },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#1c1f22" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  name: SITE.name,
  url: SITE.url,
  vatID: SITE.vat,
  sameAs: [SITE.instagram],
  address: { "@type": "PostalAddress", streetAddress: SITE.address.street, postalCode: SITE.address.postalCode, addressLocality: "Liège", addressCountry: "BE" },
  geo: { "@type": "GeoCoordinates", latitude: SITE.address.lat, longitude: SITE.address.lng },
  ...(SITE.phone.href ? { telephone: SITE.phone.href } : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-BE" suppressHydrationWarning className={`${archivo.variable} ${barlow.variable} ${plex.variable}`}>
      <body className="min-h-dvh font-sans">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
