import type { Metadata, Viewport } from "next";
import { Nunito, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import { PanierProvider } from "@/lib/panier";
import { Panier } from "@/components/Panier";
import { Notification } from "@/components/Notification";
import { BarreCommande } from "@/components/BarreCommande";

const nunito = Nunito({ subsets: ["latin", "latin-ext"], weight: ["700", "800", "900"], variable: "--font-nunito", display: "swap" });
const nunitoSans = Nunito_Sans({ subsets: ["latin", "latin-ext"], weight: ["400", "600", "700"], variable: "--font-nunito-sans", display: "swap" });

const villeTitre = site.restaurant ? ` à ${site.restaurant.ville}` : "";

export const metadata: Metadata = {
  ...(site.url ? { metadataBase: new URL(site.url) } : {}),
  title: { default: `${site.nom} — Manti & Lahmacun${villeTitre}`, template: `%s · ${site.nom}` },
  description: site.description,
  applicationName: site.nom,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: site.nom,
    title: `${site.nom} — La street food turque, autrement.`,
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "BOWLY'S, Manti & Lahmacun" }],
  },
  icons: { icon: "/logo/bowlys-icone.png" },
};

export const viewport: Viewport = { themeColor: "#0057E7", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${nunito.variable} ${nunitoSans.variable}`}>
      <body>
        <a href="#contenu" className="sr-only left-4 top-4 z-[100] rounded-full bg-bleu px-5 py-3 font-bold text-white focus:not-sr-only focus:fixed">
          Aller au contenu
        </a>
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
