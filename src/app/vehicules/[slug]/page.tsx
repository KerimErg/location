import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, Calendar, Check, DoorOpen, Gauge, Leaf, Palette, Zap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getAgencyOptions } from "@/lib/queries";
import { readSearch, searchToQuery, type SearchParamsRecord } from "@/lib/dates";
import { isVehicleAvailable } from "@/lib/availability";
import { CATEGORY_LABEL } from "@/lib/constants";
import { quote, durationDiscountRate } from "@/lib/pricing";
import { eur, parseImages } from "@/lib/format";
import { BookingPanel } from "@/components/booking/booking-panel";
import { VehicleSpecs } from "@/components/vehicles/vehicle-card";
import { VehicleVisual } from "@/components/vehicles/vehicle-visual";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<SearchParamsRecord> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const v = await prisma.vehicle.findUnique({ where: { slug } });
  return v ? { title: `${v.name} — ${CATEGORY_LABEL[v.category]}`, description: v.description } : {};
}

const EQUIPMENT: Record<string, string[]> = {
  base: ["Climatisation", "Bluetooth & USB-C", "Apple CarPlay / Android Auto", "Régulateur de vitesse", "Radar de recul"],
  PREMIUM: ["Sellerie cuir", "Sièges chauffants", "Affichage tête haute", "Système audio premium", "Caméra 360°"],
  SUV: ["Caméra de recul", "Hayon électrique", "Barres de toit"],
  ELECTRIQUE: ["Câble de recharge Type 2", "Planificateur de recharge", "Pompe à chaleur"],
  UTILITAIRE: ["Cloison de séparation", "Anneaux d'arrimage", "Porte latérale coulissante"],
};

export default async function VehiclePage({ params, searchParams }: Props) {
  const [{ slug }, sParams] = await Promise.all([params, searchParams]);
  const v = await prisma.vehicle.findUnique({ where: { slug } });
  if (!v || !v.active) notFound();

  const search = readSearch(sParams);
  const [agencies, available] = await Promise.all([getAgencyOptions(), isVehicleAvailable(v.id, search.pickupAt, search.returnAt)]);
  const oneWay = !!search.pickupAgency && search.pickupAgency !== search.returnAgency;
  const q = quote({ pricePerDay: v.pricePerDay, pickupAt: search.pickupAt, returnAt: search.returnAt, oneWay });
  const images = parseImages(v.images);
  const query = searchToQuery(search);
  const hasAgency = !!search.pickupAgency;
  const equipment = [...EQUIPMENT.base, ...(EQUIPMENT[v.category] ?? [])];

  return (
    <div className="pt-20 pb-24 md:pt-24">
      <div className="container-page">
        <Link href={`/vehicules?${query}`} className="inline-flex items-center gap-2 py-4 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Retour aux véhicules
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent">{CATEGORY_LABEL[v.category]}</Badge>
              {v.featured && <Badge>Coup de cœur</Badge>}
            </div>
            <h1 className="mt-3 text-4xl font-bold md:text-6xl">{v.name}</h1>
            <p className="mt-1 text-muted-foreground">ou modèle similaire · {v.year}</p>

            <VehicleVisual
              src={images[0]}
              alt={v.name}
              color={v.color}
              category={v.category}
              priority
              sizes="(min-width:1024px) 60vw, 100vw"
              className="mt-8 aspect-[16/9] rounded-3xl border"
            />
            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-3 gap-3">
                {images.slice(1, 4).map((src) => (
                  <VehicleVisual key={src} src={src} alt={v.name} color={v.color} category={v.category} sizes="20vw" className="aspect-[16/10] rounded-2xl border" />
                ))}
              </div>
            )}

            <section className="mt-12">
              <h2 className="text-2xl font-bold">Caractéristiques</h2>
              <div className="mt-6 grid gap-6 rounded-3xl border bg-card p-6 shadow-soft md:p-8">
                <VehicleSpecs v={v} className="text-base sm:grid-cols-4" />
                <ul className="grid gap-4 border-t pt-6 text-sm sm:grid-cols-2 lg:grid-cols-3">
                  <li className="flex items-center gap-3"><Gauge className="size-5 text-primary" /> {v.power} ch</li>
                  <li className="flex items-center gap-3">{v.fuel === "ELECTRIC" ? <Zap className="size-5 text-primary" /> : <Leaf className="size-5 text-primary" />} {v.consumption}</li>
                  <li className="flex items-center gap-3"><DoorOpen className="size-5 text-primary" /> {v.doors} portes</li>
                  <li className="flex items-center gap-3"><Palette className="size-5 text-primary" /> <span className="size-3 rounded-full border" style={{ background: v.color }} /> {v.colorName}</li>
                  <li className="flex items-center gap-3"><Calendar className="size-5 text-primary" /> Modèle {v.year}</li>
                </ul>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-bold">À propos de ce véhicule</h2>
              <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{v.description}</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {equipment.map((e) => (
                  <li key={e} className="flex items-center gap-3 text-sm"><span className="flex size-6 items-center justify-center rounded-full bg-accent text-accent-foreground"><Check className="size-3.5" /></span> {e}</li>
                ))}
              </ul>
            </section>

            <section className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                ["Kilométrage", v.category === "UTILITAIRE" ? "250 km/jour inclus" : "Illimité"],
                ["Dépôt de garantie", eur(v.deposit)],
                ["Âge minimum", v.category === "PREMIUM" ? "25 ans · 3 ans de permis" : "21 ans · 2 ans de permis"],
              ].map(([k, val]) => (
                <div key={k} className="rounded-2xl bg-surface p-5">
                  <p className="text-xs text-muted-foreground">{k}</p>
                  <p className="mt-1 font-display font-semibold">{val}</p>
                </div>
              ))}
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-4">
              <BookingPanel
                stacked
                title="Vos dates"
                submitLabel="Mettre à jour"
                action={`/vehicules/${v.slug}`}
                agencies={agencies}
                className="shadow-soft"
                defaults={{ pickupAgency: search.pickupAgency, returnAgency: search.returnAgency, pickupDate: search.pickupDate, pickupTime: search.pickupTime, returnDate: search.returnDate, returnTime: search.returnTime }}
              />
              <div className="rounded-3xl border bg-card p-6 shadow-soft">
                <div className="flex items-baseline justify-between">
                  <p className="font-display text-3xl font-bold">{eur(q.total)}</p>
                  <p className="text-sm text-muted-foreground">{q.days} jour{q.days > 1 ? "s" : ""}</p>
                </div>
                <dl className="mt-5 space-y-2 border-t pt-5 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">{eur(v.pricePerDay)} × {q.days} jour{q.days > 1 ? "s" : ""}</dt><dd>{eur(q.basePrice)}</dd></div>
                  {q.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400"><dt>Remise durée (-{Math.round(durationDiscountRate(q.days) * 100)} %)</dt><dd>-{eur(q.discount)}</dd></div>
                  )}
                  {q.oneWayFee > 0 && <div className="flex justify-between"><dt className="text-muted-foreground">Forfait aller simple</dt><dd>{eur(q.oneWayFee)}</dd></div>}
                  <div className="flex justify-between"><dt className="text-muted-foreground">Protection Essentielle</dt><dd>Incluse</dd></div>
                </dl>
                {!available ? (
                  <p className="mt-5 flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" /> Ce véhicule est déjà réservé sur ces dates. Essayez d&apos;autres dates ou un modèle similaire.</p>
                ) : !hasAgency ? (
                  <p className="mt-5 flex items-start gap-2 rounded-xl bg-accent p-3 text-sm text-accent-foreground"><AlertCircle className="mt-0.5 size-4 shrink-0" /> Choisissez une agence de départ ci-dessus pour continuer.</p>
                ) : null}
                {available && hasAgency ? (
                  <Button asChild size="lg" className="mt-5 w-full">
                    <Link href={`/reservation/${v.slug}?${query}`}>Réserver ce véhicule <ArrowRight /></Link>
                  </Button>
                ) : (
                  <Button size="lg" className="mt-5 w-full" disabled>Réserver ce véhicule</Button>
                )}
                <p className="mt-3 text-center text-xs text-muted-foreground">Annulation gratuite jusqu&apos;à 48 h avant · Aucun frais caché</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
