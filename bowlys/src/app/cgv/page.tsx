import type { Metadata } from "next";
import { PageLegale, AC } from "@/components/PageLegale";

export const metadata: Metadata = { title: "Conditions générales de vente", robots: { index: false } };

export default function CGV() {
  return (
    <PageLegale titre="Conditions générales de vente">
      <section>
        <h2>Statut actuel</h2>
        <p>La commande et le paiement en ligne ne sont pas encore ouverts. Les présentes conditions s&apos;appliqueront dès leur activation.</p>
      </section>
      <section>
        <h2>Vendeur</h2>
        <p><AC>raison sociale, adresse, SIREN, contact</AC></p>
      </section>
      <section>
        <h2>Produits et prix</h2>
        <p>Les prix sont indiqués en euros toutes taxes comprises. Les informations sur les allergènes sont disponibles <AC>sur chaque fiche produit / au comptoir</AC>.</p>
      </section>
      <section>
        <h2>Commande, paiement et retrait</h2>
        <p>Modalités de validation : <AC>à définir</AC>. Moyens de paiement : <AC>prestataire et moyens acceptés</AC>. Retrait : <AC>délais et conditions</AC>. Livraison : <AC>si proposée, zones, frais et délais</AC>.</p>
      </section>
      <section>
        <h2>Droit de rétractation</h2>
        <p>Conformément à l&apos;article L221-28 du Code de la consommation, le droit de rétractation ne s&apos;applique pas aux denrées périssables. <AC>à faire valider par votre conseil</AC></p>
      </section>
      <section>
        <h2>Réclamations et médiation</h2>
        <p><AC>contact service client et médiateur de la consommation</AC></p>
      </section>
    </PageLegale>
  );
}
