import type { Metadata } from "next";
import { PageLegale, AC } from "@/components/PageLegale";

export const metadata: Metadata = { title: "Politique de confidentialité", robots: { index: false } };

export default function Confidentialite() {
  return (
    <PageLegale titre="Politique de confidentialité">
      <section>
        <h2>Responsable du traitement</h2>
        <p><AC>raison sociale, adresse et contact du responsable</AC></p>
      </section>
      <section>
        <h2>Données traitées aujourd&apos;hui</h2>
        <p>Le site ne crée pas de compte client et n&apos;envoie actuellement aucune commande. Le contenu de votre panier est conservé uniquement dans votre navigateur (stockage local) pour que vous ne le perdiez pas ; il n&apos;est transmis à personne. Les informations saisies à l&apos;étape « Vos coordonnées » restent dans votre navigateur et ne sont pas envoyées.</p>
      </section>
      <section>
        <h2>Lorsque la commande en ligne sera activée</h2>
        <p>Données collectées : prénom, téléphone, contenu de la commande <AC>et adresse si livraison</AC>. Finalité : préparer et remettre votre commande. Base légale : exécution du contrat. Durée de conservation : <AC>durée</AC>. Destinataires : <AC>restaurant, prestataire de paiement, plateforme de commande</AC>. Les données bancaires sont traitées uniquement par le prestataire de paiement et ne sont jamais stockées par BOWLY&apos;S.</p>
      </section>
      <section>
        <h2>Vos droits</h2>
        <p>Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de limitation et d&apos;opposition. Contact : <AC>e-mail dédié</AC>. Vous pouvez également saisir la CNIL (cnil.fr).</p>
      </section>
    </PageLegale>
  );
}
