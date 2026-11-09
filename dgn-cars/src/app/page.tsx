import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileCheck2, KeyRound, Repeat2, ShieldCheck, Star, Wrench } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SITE, fullAddress, mapsUrl } from "@/config/site";
import { PHOTOS } from "@/config/photos";
import { RATING } from "@/config/reviews";
import { Button } from "@/components/ui/button";
import { QuickSearch } from "@/components/vehicles/quick-search";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { SectionTitle } from "@/components/section-title";
import { Faq, FAQ } from "@/components/home/faq";
import { Hero } from "@/components/home/hero";
import { Reviews } from "@/components/home/reviews";
import { GarageMapLazy } from "@/components/map-lazy";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

export const dynamic = "force-dynamic";

const PROMISES = [
  { icon: FileCheck2, title: "Car-Pass fourni", text: "Le kilométrage de chaque voiture est certifié. Vous consultez l'historique avant d'acheter." },
  { icon: ShieldCheck, title: "Garantie 12 mois", text: "Garantie incluse pour les particuliers, pour rouler sans arrière-pensée." },
  { icon: Wrench, title: "Entretien et contrôle technique", text: "Vidange, filtres et contrôle technique faits avant la remise des clés." },
  { icon: Repeat2, title: "Reprise de votre voiture", text: "Estimation rapide, déduite directement du prix de votre prochaine voiture." },
];

const STEPS = [
  { title: "Choisissez en ligne", text: "Photos, équipements, kilométrage et prix : tout est sur l'annonce.", img: PHOTOS.stepSearch, alt: "Personne consultant des annonces sur son smartphone" },
  { title: "Visitez le showroom", text: "Sur rendez-vous : la voiture est prête à votre arrivée.", img: PHOTOS.showroom, alt: "Le showroom DGN Cars et son enseigne lumineuse" },
  { title: "Essayez-la", text: "Essai sur route, Car-Pass et factures d'entretien sous les yeux.", img: PHOTOS.stepDrive, alt: "Conducteur au volant pendant un essai" },
  { title: "Repartez avec vos clés", text: "Documents prêts, reprise et financement réglés sur place.", img: PHOTOS.hands, alt: "Remise des clés entre vendeur et client" },
];

export default async function Home() {
  const [selection, makes, count] = await Promise.all([
    prisma.vehicle.findMany({ where: { status: { not: "VENDU" } }, orderBy: [{ position: "asc" }, { price: "desc" }], take: 6 }),
    prisma.vehicle.findMany({ where: { status: { not: "VENDU" } }, select: { make: true }, distinct: ["make"], orderBy: { make: "asc" } }),
    prisma.vehicle.count({ where: { status: { not: "VENDU" } } }),
  ]);

  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

  return (
    <>
      <Hero />

      <div className="container-page relative z-10 -mt-14">
        <Reveal>
          <QuickSearch makes={makes.map((m) => m.make)} count={count} className="shadow-lift" />
        </Reveal>
      </div>

      {/* POURQUOI NOUS */}
      <section className="container-page py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image src={PHOTOS.workshop} alt="Appoint d'huile moteur à l'atelier" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="absolute -right-3 -bottom-6 bg-signal px-6 py-5 text-white shadow-lift sm:-right-6">
              <p className="font-display text-5xl leading-none font-bold">{RATING.average.toLocaleString("fr-BE")}<span className="text-2xl">/5</span></p>
              <p className="mt-1 flex items-center gap-1 text-sm"><Star className="size-4 fill-current" /> {RATING.count} avis clients</p>
            </div>
          </Reveal>
          <div>
            <SectionTitle align="left" eyebrow="Pourquoi DGN Cars" title="Des occasions sans mauvaise surprise" className="mb-10 md:mb-10">
              Chaque voiture est vérifiée, entretenue et vendue avec ses papiers en règle. Vous savez exactement ce que vous achetez.
            </SectionTitle>
            <Stagger as="ul" className="grid gap-7 sm:grid-cols-2">
              {PROMISES.map((p) => (
                <StaggerItem as="li" key={p.title} className="flex gap-4">
                  <span className="flex size-12 shrink-0 items-center justify-center bg-ink text-white">
                    <p.icon className="size-6 text-signal" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="text-xl normal-case">{p.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.text}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* SÉLECTION */}
      <section className="border-t bg-card py-20 md:py-28">
        <div className="container-page">
          <SectionTitle eyebrow="Notre stock" title="La sélection du moment">
            {count} voitures disponibles à Rocourt, des SUV aux citadines.
          </SectionTitle>
          <Stagger className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {selection.map((v, i) => (
              <StaggerItem key={v.id}>
                <VehicleCard v={v} priority={i < 3} />
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal className="mt-12 flex justify-center">
            <Button asChild size="lg" className="h-14 bg-ink px-8 text-white hover:bg-ink/90"><Link href="/stock">Voir les {count} voitures <ArrowRight /></Link></Button>
          </Reveal>
        </div>
      </section>

      {/* ÉTAPES */}
      <section className="container-page py-20 md:py-28">
        <SectionTitle eyebrow="Comment ça marche" title="Votre voiture en toute simplicité" />
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <StaggerItem key={s.title} className="group relative aspect-[3/4] overflow-hidden bg-ink">
              <Image src={s.img} alt={s.alt} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover opacity-90 transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <span className="mb-4 block h-1 w-10 bg-signal transition-all duration-500 group-hover:w-20" />
                <h3 className="text-3xl">{s.title}</h3>
                <p className="mt-2 text-sm text-white/80">{s.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* SERVICES */}
      <section className="container-page pb-20 md:pb-28">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { href: "/reprise", title: "Reprise de votre voiture", text: "Toutes marques. Estimation rapide, déduite du prix de votre prochaine voiture.", cta: "Faire estimer ma voiture", img: PHOTOS.serviceEstimate, alt: "Mécanicien évaluant une voiture avec une tablette" },
            { href: "/financement", title: "Financement sur mesure", text: "Prêt à tempérament de 24 à 72 mois. Simulez votre mensualité en ligne.", cta: "Simuler ma mensualité", img: PHOTOS.serviceFinance, alt: "Mains sur le volant d'une voiture" },
          ].map((s, i) => (
            <Reveal key={s.href} delay={i * 0.1}>
              <Link href={s.href} className="group relative flex min-h-[420px] items-end overflow-hidden bg-ink p-8 text-white md:min-h-[520px] md:p-10">
                <Image src={s.img} alt={s.alt} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition duration-700 ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                <div className="relative max-w-md">
                  <h3 className="text-4xl md:text-5xl">{s.title}</h3>
                  <p className="mt-3 text-white/80">{s.text}</p>
                  <span className="mt-6 inline-flex items-center gap-2 border-b-2 border-signal pb-1 font-display text-lg font-semibold uppercase">
                    {s.cta} <ArrowUpRight className="size-5 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <Reviews />

      {/* VISITE */}
      <section className="container-page py-20 md:py-28">
        <SectionTitle eyebrow="Nous trouver" title="Le showroom à Rocourt">
          Visites et essais uniquement sur rendez-vous, 7 jours sur 7.
        </SectionTitle>
        <Reveal className="grid overflow-hidden border lg:grid-cols-[400px_1fr]">
          <div className="flex flex-col gap-8 bg-card p-7">
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
        </Reveal>
        <p className="mt-3 font-mono text-xs text-muted-foreground">{fullAddress}</p>
      </section>

      {/* FAQ */}
      <section className="border-t bg-card py-20 md:py-28">
        <div className="container-page max-w-4xl">
          <SectionTitle eyebrow="Questions fréquentes" title="Avant de venir">
            Une autre question ? <Link href="/contact" className="underline">Écrivez-nous</Link>, nous répondons le jour même.
          </SectionTitle>
          <Reveal><Faq /></Reveal>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </>
  );
}
