import type { Metadata } from "next";
import { PageLegale } from "@/components/PageLegale";

export const metadata: Metadata = { title: "Cookies", robots: { index: false } };

export default function Cookies() {
  return (
    <PageLegale titre="Cookies et traceurs">
      <section>
        <h2>Aucun cookie publicitaire ni de mesure d&apos;audience</h2>
        <p>Ce site n&apos;utilise ni cookie publicitaire, ni outil de suivi, ni réseau social intégré. Aucun bandeau de consentement n&apos;est donc nécessaire.</p>
      </section>
      <section>
        <h2>Stockage strictement nécessaire</h2>
        <p>Le panier est enregistré dans le stockage local de votre navigateur (clé « bowlys-panier-v1 ») pour conserver votre sélection. Il n&apos;est pas transmis. Vous pouvez le supprimer à tout moment en vidant le panier ou les données de navigation.</p>
        <p>Si un outil de statistiques est ajouté plus tard, il devra être sans cookie (ex. Plausible) ou soumis à votre consentement, et cette page sera mise à jour.</p>
      </section>
    </PageLegale>
  );
}
