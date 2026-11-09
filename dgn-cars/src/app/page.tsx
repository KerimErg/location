import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarClock, FileCheck2, HandCoins, KeyRound, Repeat2, ShieldCheck, Wrench } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SITE, fullAddress, mapsUrl } from "@/config/site";
import { RATING } from "@/config/reviews";
import { PHOTOS } from "@/config/photos";
import { Button } from "@/components/ui/button";
import { QuickSearch } from "@/components/vehicles/quick-search";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { SectionTitle } from "@/components/section-title";
import { Faq, FAQ } from "@/components/home/faq";
import { GarageMapLazy } from "@/components/map-lazy";
import { Reviews } from "@/components/home/reviews";

export const dynamic = "force-dynamic";

const PROMISES = [
  { icon: FileCheck2, title: "Car-Pass fourni", text: "Kilométrage certifié, historique consultable avant l'achat." },
  { icon: ShieldCheck, title: "Garantie 12 mois", text: "Garantie légale d'un an incluse pour les particuliers." },
  { icon: Wrench, title: "Préparé à l'atelier", text: "Entretien à jour, contrôle des points de sécurité, nettoyage complet." },
  { icon: Repeat2, title: "Reprise toutes marques", text: "Estimation rapide, déduite directement du prix de vente." },
];

const STEPS = [
  { title: "Choisissez en ligne", text: "Photos, équipements, kilométrage et prix TVAC : tout est sur l'annonce." },
  { title: "Réservez un créneau", text: "On vous rappelle pour confirmer et préparer le véhicule avant votre venue." },
  { title: "Essai & inspection", text: "Essai sur route, Car-Pass et factures d'entretien à votre disposition." },
  { title: "Repartez", text: "Documents d'immatriculation prêts, reprise et financement réglés sur place." },
];

export default async function Home() {
  const [latest, makes, count] = await Promise.all([
    prisma.vehicle.findMany({ where: { status: { not: "VENDU" } }, orderBy: [{ featured: "desc" }, { createdAt: "desc" }], take: 6 }),
    prisma.vehicle.findMany({ where: { status: { not: "VENDU" } }, select: { make: true }, distinct: ["make"], orderBy: { make: "asc" } }),
    prisma.vehicle.count({ where: { status: { not: "VENDU" } } }),
  ]);

  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

  return (
    <>
      {/* HERO — bannière pleine largeur */}
      <section className="relative isolate overflow-hidden bg-ink text-[#eceae5]">
        <Image src={PHOTOS.hero} alt="Rangée de voitures exposées sur un parc de vente" fill priority sizes="100vw" className="-z-20 object-cover object-[70%_60%]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/75 to-ink/5" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-ink to-transparent" />
        <div className="container-page flex min-h-[78svh] flex-col justify-center py-20 lg:min-h-[720px] lg:pb-32">
          <p className="eyebrow text-[#c4c8cc]">Achat · Vente · Reprise — Rocourt, Liège</p>
          <h1 className="mt-5 max-w-3xl text-[3.4rem] sm:text-7xl xl:text-[6.6rem]">
            Des occasions
            <br />
            contrôlées.
            <br />
            <span className="bg-signal px-2 text-signal-foreground">Sans surprise.</span>
          </h1>
          <p className="mt-7 max-w-md text-base text-[#c4c8cc] md:text-lg">
            {count} véhicules en stock, entretenus, passés au contrôle technique et vendus avec Car-Pass et garantie 12 mois. Noté {RATING.average.toLocaleString("fr-BE")}/5 par {RATING.count} clients.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-signal text-signal-foreground"><Link href="/stock">Voir le stock <ArrowRight /></Link></Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 bg-black/20 text-white backdrop-blur-sm hover:bg-white/10"><Link href="/reprise">Faire estimer ma voiture</Link></Button>
          </div>
        </div>
        <p className="absolute right-4 bottom-3 font-mono text-[0.6rem] tracking-wider text-white/45 uppercase lg:bottom-14">Photo : Pexels</p>
      </section>

      <div className="container-page relative z-10 -mt-px lg:-mt-10">
        <QuickSearch makes={makes.map((m) => m.make)} count={count} className="shadow-lift" />
      </div>

      {/* PROMESSES */}
      <section className="container-page py-16 md:py-20">
        <ul className="grid border-t border-l sm:grid-cols-2 lg:grid-cols-4">
          {PROMISES.map((p, i) => (
            <li key={p.title} className="border-r border-b p-6 md:p-8">
              <div className="flex items-center justify-between">
                <p.icon className="size-7" strokeWidth={1.5} />
                <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-8 text-2xl">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* STOCK */}
      <section className="container-page pb-20 md:pb-28">
        <SectionTitle index="01" label="Stock" title="Arrivages récents">
          Mis à jour chaque semaine. Un véhicule vous intéresse ? Réservez une visite, il sera prêt à l&apos;essai.
        </SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {latest.map((v, i) => <VehicleCard key={v.id} v={v} priority={i < 3} />)}
        </div>
        <div className="mt-10 flex justify-center">
          <Button asChild size="lg" variant="outline"><Link href="/stock">Tout le stock — {count} véhicules <ArrowRight /></Link></Button>
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-y bg-card py-20 md:py-28">
        <div className="container-page">
          <SectionTitle index="02" label="Achat" title="Comment se passe un achat chez nous" />
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
            <ol className="border-t">
              {STEPS.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[56px_1fr] gap-4 border-b py-6">
                  <span className="font-display text-4xl font-bold text-steel">{i + 1}</span>
                  <div>
                    <h3 className="text-2xl">{s.title}</h3>
                    <p className="mt-1 text-muted-foreground">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="relative min-h-[360px]">
              <Image src={PHOTOS.workshop} alt="Appoint d'huile moteur à l'atelier" fill className="object-cover" sizes="(min-width:1024px) 50vw, 100vw" />
              <div className="absolute right-0 bottom-0 max-w-xs bg-signal p-5 text-signal-foreground">
                <p className="font-display text-2xl font-bold uppercase">Préparation atelier</p>
                <p className="mt-1 text-sm">Entretien, contrôle des freins, pneus et éclairage avant chaque vente.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container-page py-20 md:py-28">
        <SectionTitle index="03" label="Services" title="Reprise et financement, réglés en une visite" />
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { href: "/reprise", icon: HandCoins, title: "Reprise de votre véhicule", text: "Toutes marques, même avec un peu de kilomètres. Estimation sous 24 h ouvrables, déduite du prix de votre prochaine voiture.", img: PHOTOS.hands, alt: "Remise des clés d'une voiture entre vendeur et client" },
            { href: "/financement", icon: CalendarClock, title: "Financement", text: "Prêt à tempérament de 24 à 72 mois avec nos partenaires. Simulez votre mensualité en ligne.", img: PHOTOS.engine, alt: "Compartiment moteur, capot ouvert" },
          ].map((s) => (
            <Link key={s.href} href={s.href} className="group grid border bg-card sm:grid-cols-[1fr_200px] lg:grid-cols-[1fr_240px]">
              <div className="flex flex-col p-7">
                <s.icon className="size-7" strokeWidth={1.5} />
                <h3 className="mt-8 text-3xl">{s.title}</h3>
                <p className="mt-3 text-muted-foreground">{s.text}</p>
                <span className="mt-auto flex items-center gap-2 pt-8 font-display text-lg font-semibold uppercase group-hover:underline">En savoir plus <ArrowUpRight className="size-5" /></span>
              </div>
              <div className="relative hidden sm:block">
                <Image src={s.img} alt={s.alt} fill className="object-cover grayscale transition group-hover:grayscale-0" sizes="240px" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Reviews />

      {/* VISITE */}
      <section className="container-page py-20 md:py-28">
        <SectionTitle index="05" label="Visite" title="Nous trouver à Rocourt" />
        <div className="grid border lg:grid-cols-[400px_1fr]">
          <div className="flex flex-col gap-8 p-7">
            <div>
              <p className="eyebrow">Adresse</p>
              <p className="mt-2 font-display text-2xl font-semibold uppercase">{SITE.address.street}</p>
              <p className="text-muted-foreground">{SITE.address.postalCode} {SITE.address.city}</p>
              <a href={mapsUrl} target="_blank" rel="noopener" className="mt-2 inline-flex items-center gap-1 text-sm underline">Itinéraire <ArrowUpRight className="size-4" /></a>
            </div>
            <div>
              <p className="eyebrow">Horaires</p>
              <table className="mt-2 w-full text-sm">
                <tbody>
                  {SITE.hours.map((h) => (
                    <tr key={h.days} className="border-b last:border-0"><td className="py-2">{h.days}</td><td className="py-2 text-right font-mono text-xs">{h.hours}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button asChild size="lg" className="mt-auto bg-signal text-signal-foreground"><Link href="/contact?objet=rendez-vous"><KeyRound /> Réserver une visite</Link></Button>
          </div>
          <div className="relative z-0 h-[360px] border-t lg:h-auto lg:border-t-0 lg:border-l">
            <GarageMapLazy />
          </div>
        </div>
        <p className="mt-3 font-mono text-xs text-muted-foreground">{fullAddress}</p>
      </section>

      {/* FAQ */}
      <section className="border-t bg-card py-20 md:py-28">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow">06 — Questions fréquentes</p>
            <h2 className="mt-5 text-4xl md:text-6xl">Avant de venir</h2>
            <p className="mt-4 text-muted-foreground">Une autre question ? <Link href="/contact" className="underline">Écrivez-nous</Link>, nous répondons le jour même.</p>
          </div>
          <Faq />
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </>
  );
}
