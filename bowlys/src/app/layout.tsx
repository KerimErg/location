import type { Metadata, Viewport } from "next";
import { Montserrat, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import { PanierProvider } from "@/lib/panier";
import { Panier } from "@/components/Panier";
import { Notification } from "@/components/Notification";
import { BarreCommande } from "@/components/BarreCommande";
import { RetourHaut } from "@/components/RetourHaut";

const titre = Montserrat({ subsets: ["latin", "latin-ext"], weight: ["500", "600", "700", "800"], variable: "--font-titre", display: "swap" });
const texte = Nunito_Sans({ subsets: ["latin", "latin-ext"], weight: ["400", "600", "700"], variable: "--font-texte", display: "swap" });

const villeTitre = site.restaurant ? ` à ${site.restaurant.ville}` : "";

export const metadata: Metadata = {
  ...(site.url ? { metadataBase: new URL(site.url) } : {}),
  title: { default: `${site.nom} — Lahmacun${villeTitre}`, template: `%s · ${site.nom}` },
  description: site.description,
  applicationName: site.nom,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: site.nom,
    title: `${site.nom} — Le lahmacun autrement.`,
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "BOWLY'S Lahmacun" }],
  },
  icons: { icon: "/favicon.png" },
};

export const viewport: Viewport = { themeColor: "#8C020A", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${titre.variable} ${texte.variable}`}>
      <body>
        <a href="#contenu" className="sr-only left-4 top-4 z-[100] rounded-full bg-rouge px-5 py-3 font-bold text-white focus:not-sr-only focus:fixed">
          Aller au contenu
        </a>
        <RetourHaut />
        <div className="barre-progression" aria-hidden="true" />
        <PanierProvider>
          {children}
          <Panier />
          <BarreCommande />
          <Notification />
        </PanierProvider>
      </body>
    </html>
  );
}
