import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Bandeau, Specialites, Menus, Concept, Contact } from "@/components/Sections";
import { Carte } from "@/components/Carte";
import { Footer } from "@/components/Footer";
import { site } from "@/config/site";
import { CATEGORIES, PRODUITS } from "@/data/menu";

/** Données structurées schema.org : publiées seulement avec des informations réelles. */
function DonneesStructurees() {
  if (!site.restaurant) return null;
  const r = site.restaurant;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: site.nom,
    servesCuisine: ["Turque", "Street food"],
    priceRange: "€",
    address: { "@type": "PostalAddress", streetAddress: r.rue, postalCode: r.codePostal, addressLocality: r.ville, addressCountry: r.pays },
    hasMenu: {
      "@type": "Menu",
      hasMenuSection: CATEGORIES.map((c) => ({
        "@type": "MenuSection",
        name: c.nom,
        hasMenuItem: PRODUITS.filter((p) => p.categorie === c.id).map((p) => ({
          "@type": "MenuItem", name: p.nom, description: p.description,
          offers: { "@type": "Offer", price: p.prix.toFixed(2), priceCurrency: "EUR" },
        })),
      })),
    },
  };
  if (site.url) data.url = site.url;
  if (site.telephone) data.telephone = site.telephone;
  if (site.email) data.email = site.email;
  const sameAs = [site.reseaux.instagram, site.reseaux.tiktok].filter(Boolean);
  if (sameAs.length) data.sameAs = sameAs;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function Accueil() {
  return (
    <>
      <Header transparent />
      <main id="contenu">
        <Hero />
        <Bandeau />
        <Specialites />
        <Menus />
        <Carte />
        <Concept />
        <Contact />
      </main>
      <Footer />
      <DonneesStructurees />
    </>
  );
}
