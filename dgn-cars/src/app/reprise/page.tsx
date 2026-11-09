import type { Metadata } from "next";
import { PHOTOS } from "@/config/photos";
import { PageHeader } from "@/components/page-header";
import { TradeInForm } from "@/components/forms/trade-in-form";

export const metadata: Metadata = { title: "Reprise de votre véhicule", description: "Faites estimer votre voiture : reprise toutes marques à Liège, déduite du prix de votre prochaine occasion." };

const STEPS = [
  ["Décrivez votre véhicule", "Plaque, kilométrage et état : 2 minutes suffisent."],
  ["Première estimation", "Nous vous répondons sous 24 h ouvrables, par téléphone ou e-mail."],
  ["Inspection sur place", "Rapide contrôle à Rocourt, puis offre définitive écrite."],
  ["Déduite du prix", "Le montant est déduit de votre achat, ou réglé par virement."],
];

export default function TradeInPage() {
  return (
    <>
      <PageHeader eyebrow="Services · Reprise" title={<>Reprise de votre<br />véhicule</>} image={PHOTOS.hands} imageAlt="Mains d'un mécanicien avec une clé sur un moteur">
        Toutes marques, même kilométrées ou à réparer. Une offre claire, sans engagement.
      </PageHeader>
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1fr_340px] lg:py-20">
        <TradeInForm />
        <aside>
          <p className="eyebrow">Comment ça marche</p>
          <ol className="mt-4 border-t">
            {STEPS.map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[40px_1fr] gap-3 border-b py-5">
                <span className="font-display text-3xl font-bold text-steel">{i + 1}</span>
                <div><p className="font-display text-xl font-bold uppercase">{t}</p><p className="text-sm text-muted-foreground">{d}</p></div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-muted-foreground">Prévoyez lors de l&apos;inspection : certificat d&apos;immatriculation, certificat de conformité, Car-Pass, carnet d&apos;entretien et toutes les clés.</p>
        </aside>
      </div>
    </>
  );
}
