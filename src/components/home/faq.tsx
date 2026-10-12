import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/section-heading";

export const FAQ_ITEMS = [
  { q: "Quels documents dois-je présenter au comptoir ?", a: "Un permis de conduire valide depuis au moins 2 ans (3 ans pour la catégorie Premium), une pièce d'identité et une carte bancaire au nom du conducteur principal pour le dépôt de garantie." },
  { q: "Quel est l'âge minimum pour louer ?", a: "21 ans pour la plupart de nos véhicules et 25 ans pour la catégorie Premium. Aucun supplément jeune conducteur n'est appliqué chez TestLocation." },
  { q: "Le kilométrage est-il vraiment illimité ?", a: "Oui, sur l'ensemble des véhicules de tourisme et électriques. Les utilitaires bénéficient de 250 km/jour inclus, puis 0,29 €/km." },
  { q: "Comment fonctionne l'annulation gratuite ?", a: "Vous pouvez annuler sans frais depuis votre espace client jusqu'à 48 h avant l'heure de prise en charge. Le remboursement est effectué sous 5 jours ouvrés." },
  { q: "Puis-je restituer le véhicule dans une autre agence ?", a: "Oui, la location aller simple est possible entre toutes nos agences françaises moyennant un forfait de 49 €, affiché clairement avant le paiement." },
  { q: "Quel est le montant du dépôt de garantie ?", a: "Il dépend de la catégorie (800 € à 2 500 €). Il s'agit d'une simple empreinte bancaire, libérée dans les 7 jours suivant la restitution." },
  { q: "Que faire en cas de panne ou d'accident ?", a: "Contactez notre assistance 24/7 au 01 84 60 12 00. Un dépanneur intervient partout en Europe et un véhicule de remplacement vous est proposé." },
];

export function Faq() {
  return (
    <section id="faq" className="bg-surface py-20 md:py-28">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
        <SectionHeading eyebrow="FAQ" title="Questions fréquentes" description="Vous ne trouvez pas votre réponse ? Notre équipe vous répond 24/7 au 01 84 60 12 00." />
        <Accordion type="single" collapsible className="rounded-3xl border bg-background px-6 shadow-soft md:px-8">
          {FAQ_ITEMS.map((f, i) => (
            <AccordionItem key={i} value={`q${i}`}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
