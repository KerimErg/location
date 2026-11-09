import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE, fullAddress } from "@/config/site";

const PAGES: Record<string, { title: string; sections: [string, string][] }> = {
  "mentions-legales": {
    title: "Mentions légales",
    sections: [
      ["Éditeur", `${SITE.legalName} — ${fullAddress}, ${SITE.address.country}. Numéro d'entreprise / TVA : ${SITE.vat}.`],
      ["Contact", "Via le formulaire de contact du site ou aux coordonnées indiquées en pied de page."],
      ["Hébergement", "À compléter : nom et adresse de l'hébergeur du site."],
      ["Photos", "Photos d'illustration issues d'Unsplash, utilisées conformément à la licence Unsplash. Fonds de carte © contributeurs OpenStreetMap."],
    ],
  },
  "conditions-de-vente": {
    title: "Conditions générales de vente",
    sections: [
      ["Prix", "Les prix affichés sont exprimés en euros, TVA comprise (TVAC), hors frais d'immatriculation et taxe de mise en circulation."],
      ["Annonces", "Les informations des annonces sont fournies de bonne foi. Les photos peuvent être non contractuelles. Seul le bon de commande signé engage les parties."],
      ["Réservation", "Un véhicule est réservé à la signature du bon de commande et au versement d'un acompte."],
      ["Garantie", "Les ventes à des consommateurs bénéficient de la garantie légale de conformité, d'une durée d'un an pour les biens d'occasion lorsque cette réduction a été convenue, sauf mention contraire."],
      ["Car-Pass", "Un Car-Pass est remis pour chaque véhicule, conformément à la loi belge."],
      ["Litiges", "Droit belge applicable. En cas de litige, les tribunaux de l'arrondissement judiciaire de Liège sont compétents, sans préjudice des règles protectrices du consommateur."],
    ],
  },
  "vie-privee": {
    title: "Politique de vie privée",
    sections: [
      ["Responsable du traitement", `${SITE.legalName}, ${fullAddress}.`],
      ["Données collectées", "Nom, téléphone, e-mail et informations transmises via les formulaires (essai, reprise, financement, contact)."],
      ["Finalité", "Répondre à vos demandes et assurer le suivi commercial. Aucune revente de données à des tiers. Les demandes de financement peuvent être transmises au prêteur partenaire avec votre accord."],
      ["Conservation", "Les demandes sont conservées au maximum 3 ans après le dernier contact."],
      ["Vos droits", "Conformément au RGPD, vous pouvez demander l'accès, la rectification ou l'effacement de vos données via le formulaire de contact. Vous pouvez également introduire une plainte auprès de l'Autorité de protection des données."],
      ["Cookies", "Le site n'utilise que des cookies techniques. Vos favoris sont enregistrés uniquement sur votre appareil."],
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = PAGES[(await params).slug];
  return p ? { title: p.title } : {};
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const page = PAGES[(await params).slug];
  if (!page) notFound();
  return (
    <div className="container-page max-w-3xl pt-12 pb-24">
      <p className="eyebrow">Informations légales</p>
      <h1 className="mt-3 text-5xl md:text-6xl">{page.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">Modèle à faire valider par votre conseil juridique.</p>
      <div className="mt-10 border-t">
        {page.sections.map(([h, t]) => (
          <section key={h} className="grid gap-2 border-b py-6 md:grid-cols-[200px_1fr]">
            <h2 className="font-display text-xl">{h}</h2>
            <p className="leading-relaxed text-muted-foreground">{t}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
