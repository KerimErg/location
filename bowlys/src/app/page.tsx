import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Bienvenue, Specialites, Galerie, NousTrouver } from "@/components/Sections";
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
  if (site.horaires) {
    const jours: Record<string, string> = { lundi: "Monday", mardi: "Tuesday", mercredi: "Wednesday", jeudi: "Thursday", vendredi: "Friday", samedi: "Saturday", dimanche: "Sunday" };
    data.openingHoursSpecification = Object.entries(site.horaires).flatMap(([j, plages]) =>
      plages.map((p) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: jours[j], opens: p.ouverture, closes: p.fermeture })),
    );
  }
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
        <Bienvenue />
        <Specialites />
        <Galerie />
        <NousTrouver />
      </main>
      <Footer />
      <DonneesStructurees />
    </>
  );
}
