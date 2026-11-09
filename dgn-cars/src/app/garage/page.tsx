import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FileCheck2, Gauge, ShieldCheck, Sparkles, Wrench, Zap } from "lucide-react";
import { PHOTOS } from "@/config/photos";
import { SITE } from "@/config/site";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

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
        <div className="mb-10 grid gap-4 border-t border-foreground pt-5 md:grid-cols-[220px_1fr]">
          <p className="eyebrow">01 — Préparation</p>
          <h2 className="max-w-3xl text-4xl md:text-6xl">Ce que nous contrôlons avant chaque vente</h2>
        </div>
        <ul className="grid border-t border-l sm:grid-cols-2 lg:grid-cols-3">
          {CHECKS.map((c, i) => (
            <li key={c.t} className="border-r border-b p-7">
              <div className="flex justify-between"><c.icon className="size-7" strokeWidth={1.5} /><span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span></div>
              <h3 className="mt-8 text-2xl">{c.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="garanties" className="scroll-mt-32 border-y bg-card py-16 md:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div className="relative min-h-[320px]"><Image src={PHOTOS.engine} alt="Compartiment moteur" fill className="object-cover" sizes="50vw" /></div>
          <div>
            <p className="eyebrow">02 — Garanties</p>
            <h2 className="mt-4 text-4xl md:text-5xl">Car-Pass et garantie, noir sur blanc</h2>
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
