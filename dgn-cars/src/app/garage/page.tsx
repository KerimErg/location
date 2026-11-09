import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FileCheck2, Gauge, ShieldCheck, Sparkles, Wrench, Zap } from "lucide-react";
import { PHOTOS } from "@/config/photos";
import { SITE } from "@/config/site";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/section-title";
import { Stagger, StaggerItem } from "@/components/motion";

export const metadata: Metadata = { title: "Le garage", description: "DGN Cars, vendeur de voitures d'occasion à Rocourt (Liège) : notre méthode de sélection et de préparation." };

const CHECKS = [
  { icon: Gauge, t: "Historique vérifié", d: "Kilométrage contrôlé via Car-Pass, factures et carnet d'entretien relus." },
  { icon: Wrench, t: "Entretien à jour", d: "Vidange, filtres et niveaux faits si nécessaire avant la vente." },
  { icon: ShieldCheck, t: "Sécurité", d: "Freins, pneus, éclairage, direction et suspensions contrôlés." },
  { icon: Zap, t: "Électronique", d: "Lecture des codes défauts, batterie testée, équipements essayés." },
  { icon: Sparkles, t: "Préparation esthétique", d: "Nettoyage intérieur et extérieur complet avant chaque visite." },
  { icon: FileCheck2, t: "Documents prêts", d: "Contrôle technique « vente », Car-Pass, conformité et immatriculation." },
];

export default function GaragePage() {
  return (
    <>
      <PageHeader eyebrow="DGN Cars · Rocourt" title={<>Moins de voitures,<br />mieux choisies</>} image={PHOTOS.workshop} imageAlt="Appoint d'huile moteur à l'atelier">
        Nous préférons un stock resserré de véhicules que nous connaissons parfaitement plutôt qu&apos;un parking rempli de voitures que personne n&apos;a regardées.
      </PageHeader>

      <section className="container-page py-16 md:py-24">
        <SectionTitle eyebrow="Préparation" title="Ce que nous contrôlons avant chaque vente" />
        <Stagger as="ul" className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {CHECKS.map((c) => (
            <StaggerItem as="li" key={c.t} className="flex gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center bg-ink"><c.icon className="size-6 text-signal" strokeWidth={1.75} /></span>
              <div>
                <h3 className="text-2xl">{c.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.d}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section id="garanties" className="scroll-mt-32 border-y bg-card py-16 md:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div className="relative min-h-[320px]"><Image src={PHOTOS.engine} alt="Compartiment moteur" fill className="object-cover" sizes="50vw" /></div>
          <div>
            <SectionTitle align="left" eyebrow="Garanties" title="Car-Pass et garantie, noir sur blanc" className="mb-6 md:mb-6" />
            <div className="mt-6 space-y-4 text-muted-foreground">
              <p><strong className="text-foreground">Car-Pass :</strong> chaque véhicule est vendu avec son Car-Pass, document officiel belge qui retrace l&apos;historique du kilométrage.</p>
              <p><strong className="text-foreground">Garantie légale :</strong> pour un achat par un particulier, la garantie légale d&apos;un an s&apos;applique sur nos véhicules d&apos;occasion, sauf mention contraire sur l&apos;annonce.</p>
              <p><strong className="text-foreground">Contrôle technique :</strong> le contrôle « vente » est réalisé avant la livraison et vous est remis avec les documents d&apos;immatriculation.</p>
            </div>
            <Button asChild size="lg" className="mt-8 bg-signal text-signal-foreground"><Link href="/stock">Voir le stock</Link></Button>
          </div>
        </div>
      </section>

      <section className="container-page py-16 md:py-24">
        <div className="grid gap-6 border p-7 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <p className="font-display text-3xl font-bold uppercase md:text-4xl">{SITE.legalName}</p>
            <p className="mt-2 text-muted-foreground">{SITE.address.street}, {SITE.address.postalCode} {SITE.address.city} · TVA {SITE.vat}</p>
          </div>
          <Button asChild size="lg" variant="outline"><Link href="/contact?objet=rendez-vous">Prendre rendez-vous</Link></Button>
        </div>
      </section>
    </>
  );
}
