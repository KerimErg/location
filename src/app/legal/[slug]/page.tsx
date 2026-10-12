import type { Metadata } from "next";
import { notFound } from "next/navigation";

const PAGES: Record<string, { title: string; sections: [string, string][] }> = {
  cgv: {
    title: "Conditions générales de location",
    sections: [
      ["1. Objet", "Les présentes conditions régissent la location de véhicules par TestLocation SAS à tout client particulier ou professionnel."],
      ["2. Conducteur", "Le conducteur doit être âgé d'au moins 21 ans (25 ans pour la catégorie Premium) et titulaire d'un permis valide depuis 2 ans (3 ans pour la catégorie Premium)."],
      ["3. Prix et paiement", "Les prix sont indiqués TTC. Le montant total est réglé lors de la réservation. Un dépôt de garantie est demandé au retrait du véhicule sous forme d'empreinte bancaire."],
      ["4. Annulation", "L'annulation est gratuite jusqu'à 48 heures avant l'heure de prise en charge. Au-delà, 1 jour de location reste dû. En cas de non-présentation, le montant total est conservé."],
      ["5. Kilométrage et carburant", "Le kilométrage est illimité pour les véhicules de tourisme. Les utilitaires bénéficient de 250 km/jour. Le véhicule est remis avec le plein (ou chargé à 80 % minimum) et doit être restitué dans le même état."],
      ["6. Assurance et franchise", "La protection Essentielle (responsabilité civile, assistance) est incluse avec une franchise de 1 500 €. Les protections Sérénité et Intégrale réduisent la franchise à 500 € et 0 €."],
      ["7. Restitution", "Le véhicule est restitué à la date, à l'heure et dans l'agence prévues. Tout retard supérieur à 59 minutes entraîne la facturation d'une journée supplémentaire."],
    ],
  },
  confidentialite: {
    title: "Politique de confidentialité",
    sections: [
      ["Données collectées", "Identité, coordonnées, numéro de permis et données de réservation, strictement nécessaires à l'exécution du contrat de location."],
      ["Finalités", "Gestion des réservations, relation client, obligations légales et, avec votre consentement, envoi d'offres commerciales."],
      ["Conservation", "Les données sont conservées pendant la durée de la relation commerciale puis archivées conformément aux obligations légales (10 ans pour les pièces comptables)."],
      ["Vos droits", "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité. Contact : dpo@testlocation.fr."],
      ["Cookies", "Le site n'utilise que des cookies techniques nécessaires à son fonctionnement (session, préférences d'affichage)."],
    ],
  },
  "mentions-legales": {
    title: "Mentions légales",
    sections: [
      ["Éditeur", "TestLocation SAS — 20 boulevard Diderot, 75012 Paris — RCS Paris 000 000 000 — contact@testlocation.fr — 01 84 60 12 00."],
      ["Directeur de la publication", "Le président de TestLocation SAS."],
      ["Hébergement", "Renseignez ici les coordonnées de votre hébergeur."],
      ["Cartographie", "Fonds de carte © contributeurs OpenStreetMap, sous licence ODbL."],
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = PAGES[(await params).slug];
  return page ? { title: page.title } : {};
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const page = PAGES[(await params).slug];
  if (!page) notFound();
  return (
    <div className="container-page max-w-3xl pt-32 pb-24">
      <h1 className="text-3xl font-bold md:text-5xl">{page.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">Document type de démonstration — à faire valider par votre conseil juridique.</p>
      <div className="mt-10 space-y-8">
        {page.sections.map(([h, p]) => (
          <section key={h}>
            <h2 className="text-xl font-semibold">{h}</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{p}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
