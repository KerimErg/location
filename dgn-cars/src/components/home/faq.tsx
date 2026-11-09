import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const FAQ = [
  { q: "Les véhicules sont-ils livrés avec un Car-Pass ?", a: "Oui. Chaque véhicule est vendu avec son Car-Pass, qui certifie l'historique du kilométrage. Vous pouvez le consulter avant l'achat, lors de votre visite." },
  { q: "Quelle garantie est incluse ?", a: "Nos véhicules bénéficient de la garantie légale d'un an pour un achat par un particulier, sauf mention contraire sur l'annonce. Une extension peut être proposée selon le modèle." },
  { q: "Pourquoi les visites se font-elles sur rendez-vous ?", a: "Pour vous recevoir sans attente et préparer le véhicule avant votre arrivée : il est propre, chargé et disponible pour un essai. Réservez un créneau en ligne, nous confirmons par téléphone." },
  { q: "Reprenez-vous mon ancien véhicule ?", a: "Oui, toutes marques, même s'il n'est pas en parfait état. Remplissez le formulaire de reprise : nous vous faisons une première estimation, confirmée après inspection sur place." },
  { q: "Puis-je financer mon achat ?", a: "Oui, via un prêt à tempérament avec nos partenaires financiers, sous réserve d'acceptation de votre dossier. Utilisez notre simulateur pour estimer votre mensualité." },
  { q: "Que faut-il pour immatriculer le véhicule ?", a: "Nous vous remettons le certificat d'immatriculation, le certificat de conformité, le Car-Pass et le contrôle technique « vente ». Votre assureur se charge ensuite de la demande d'immatriculation auprès de la DIV." },
  { q: "Les prix sont-ils négociables ?", a: "Nos prix sont calculés au plus juste selon le marché belge. Une reprise ou un paiement comptant peuvent toutefois faire évoluer l'offre : parlons-en lors de votre visite." },
];

export function Faq() {
  return (
    <Accordion type="single" collapsible className="border-t">
      {FAQ.map((f, i) => (
        <AccordionItem key={i} value={`q${i}`}>
          <AccordionTrigger className="py-6 font-display text-xl font-semibold uppercase hover:text-foreground hover:underline md:text-2xl">
            {f.q}
          </AccordionTrigger>
          <AccordionContent className="text-base">{f.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
