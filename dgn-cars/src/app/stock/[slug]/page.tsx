import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, FileCheck2, MessageCircle, Phone, ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SITE } from "@/config/site";
import { BODY, FUEL, GEARBOX, kwToHp } from "@/lib/labels";
import { eur, km, num, regDate, year } from "@/lib/format";
import { DEFAULT_RATE, monthlyPayment } from "@/lib/finance";
import { Gallery } from "@/components/vehicles/gallery";
import { StatusTag, VehicleCard } from "@/components/vehicles/vehicle-card";
import { TestDriveForm } from "@/components/forms/test-drive-form";
import { FavoriteButton } from "@/components/favorites";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const v = await prisma.vehicle.findUnique({ where: { slug: (await params).slug } });
  if (!v) return {};
  const title = `${v.make} ${v.model} ${v.version} — ${year(v.firstRegistration)}, ${km(v.mileage)}`;
  return { title, description: `${title}. ${eur(v.price)} TVAC. ${v.description}`, openGraph: { images: v.images.slice(0, 1) } };
}

export default async function VehiclePage({ params }: Props) {
  const v = await prisma.vehicle.findUnique({ where: { slug: (await params).slug } });
  if (!v) notFound();
  const similar = await prisma.vehicle.findMany({
    where: { id: { not: v.id }, status: { not: "VENDU" }, OR: [{ body: v.body }, { make: v.make }, { price: { gte: v.price * 0.8, lte: v.price * 1.2 } }] },
    take: 3,
    orderBy: { createdAt: "desc" },
  });
  const name = `${v.make} ${v.model}`;
  const monthly = Math.round(monthlyPayment(v.price * 0.8, DEFAULT_RATE, 60));
  const sold = v.status === "VENDU";

  const specs: [string, string][] = [
    ["1re immatriculation", regDate(v.firstRegistration)],
    ["Kilométrage", km(v.mileage)],
    ["Carburant", FUEL[v.fuel]],
    ["Boîte", GEARBOX[v.gearbox]],
    ["Puissance", `${v.powerKw} kW · ${kwToHp(v.powerKw)} ch`],
    ...(v.engineCc ? ([["Cylindrée", `${num(v.engineCc)} cm³`]] as [string, string][]) : []),
    ["Norme", v.euroNorm],
    ...(v.co2 !== null ? ([["CO₂ (WLTP)", `${v.co2} g/km`]] as [string, string][]) : []),
    ["Carrosserie", BODY[v.body]],
    ["Portes / places", `${v.doors} / ${v.seats}`],
    ["Couleur", v.color],
    ["Propriétaires", String(v.owners)],
    ["Car-Pass", v.carPass ? "Oui, fourni" : "—"],
    ["Garantie", v.warrantyMonths ? `${v.warrantyMonths} mois` : "Vendu sans garantie"],
    ["Référence", v.reference],
  ];

  const ld = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${name} ${v.version}`,
    brand: { "@type": "Brand", name: v.make },
    model: v.model,
    vehicleModelDate: String(year(v.firstRegistration)),
    mileageFromOdometer: { "@type": "QuantitativeValue", value: v.mileage, unitCode: "KMT" },
    fuelType: FUEL[v.fuel],
    vehicleTransmission: GEARBOX[v.gearbox],
    color: v.color,
    image: v.images,
    offers: {
      "@type": "Offer",
      price: v.price,
      priceCurrency: "EUR",
      availability: sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      seller: { "@type": "AutoDealer", name: SITE.name },
    },
  };

  return (
    <div className="pb-24">
      <div className="container-page">
        <Link href="/stock" className="inline-flex items-center gap-2 py-5 font-mono text-xs tracking-wide uppercase hover:underline"><ArrowLeft className="size-4" /> Retour au stock</Link>
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          <div className="min-w-0">
            <Gallery images={v.images} alt={`${name} ${v.version}`} sold={sold} />
            <p className="mt-2 font-mono text-[0.68rem] text-muted-foreground uppercase">{v.images.length} photo{v.images.length > 1 ? "s" : ""} · photos du véhicule</p>

            <section className="mt-12">
              <h2 className="text-3xl md:text-4xl">Fiche technique</h2>
              <table className="mt-5 w-full border-t text-sm">
                <tbody>
                  {specs.map(([k, val]) => (
                    <tr key={k} className="border-b">
                      <th scope="row" className="w-1/2 py-3 pr-4 text-left font-normal text-muted-foreground">{k}</th>
                      <td className="py-3 font-mono">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="mt-12">
              <h2 className="text-3xl md:text-4xl">Équipements</h2>
              <ul className="mt-5 grid gap-x-8 sm:grid-cols-2">
                {v.options.map((o) => (
                  <li key={o} className="flex items-start gap-2.5 border-b py-3 text-sm"><Check className="mt-0.5 size-4 shrink-0" strokeWidth={2} /> {o}</li>
                ))}
              </ul>
            </section>

            <section className="mt-12">
              <h2 className="text-3xl md:text-4xl">Le mot du vendeur</h2>
              <p className="mt-4 max-w-2xl leading-relaxed whitespace-pre-line">{v.description}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {v.carPassUrl ? (
                  <a href={v.carPassUrl} target="_blank" rel="noopener" className="flex items-center gap-3 border p-4 text-sm hover:bg-muted"><FileCheck2 className="size-6 shrink-0" strokeWidth={1.5} /> <span>Consulter le Car-Pass de ce véhicule <ArrowUpRight className="inline size-4" /></span></a>
                ) : (
                  <p className="flex items-center gap-3 border p-4 text-sm"><FileCheck2 className="size-6 shrink-0" strokeWidth={1.5} /> Car-Pass et contrôle technique « vente » remis à la livraison</p>
                )}
                <p className="flex items-center gap-3 border p-4 text-sm"><ShieldCheck className="size-6 shrink-0" strokeWidth={1.5} /> Préparé à l&apos;atelier : entretien, freins, pneus, éclairage</p>
              </div>
              {v.externalUrl && <a href={v.externalUrl} target="_blank" rel="noopener" className="mt-4 inline-flex items-center gap-1 text-sm underline">Voir aussi l&apos;annonce sur AutoScout24 <ArrowUpRight className="size-4" /></a>}
            </section>
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="border bg-card">
              <div className="border-b p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow">{v.make} · {v.reference}</p>
                    <h1 className="mt-2 text-5xl">{v.model}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">{v.version}</p>
                  </div>
                  <FavoriteButton id={v.id} className="border" />
                </div>
                <p className="mt-4 font-mono text-xs">{year(v.firstRegistration)} · {km(v.mileage)} · {FUEL[v.fuel]} · {GEARBOX[v.gearbox]}</p>
              </div>
              <div className="border-b p-6">
                <StatusTag status={v.status} className="mb-3 inline-block" />
                {v.previousPrice && v.previousPrice > v.price && <p className="font-mono text-sm text-muted-foreground line-through">{eur(v.previousPrice)}</p>}
                <p className="font-display text-6xl leading-none font-bold">{eur(v.price)}</p>
                <p className="mt-2 font-mono text-[0.7rem] tracking-wide text-muted-foreground uppercase">TVAC{v.vatDeductible ? " · TVA déductible pour les pros" : ""}</p>
                {!sold && (
                  <Link href={`/financement?vehicule=${v.id}`} className="mt-4 block border-l-4 border-signal bg-background p-3 text-sm hover:underline">
                    Dès <strong className="font-mono">{eur(monthly)}/mois</strong> sur 60 mois avec 20 % d&apos;acompte — simuler →
                  </Link>
                )}
              </div>
              <div className="p-6">
                {sold ? (
                  <p className="text-sm">Ce véhicule est vendu. <Link className="underline" href="/stock">Voir les véhicules disponibles</Link> ou <Link className="underline" href="/contact?objet=recherche">confiez-nous votre recherche</Link>.</p>
                ) : (
                  <>
                    <p className="mb-4 font-display text-2xl font-bold uppercase">Réserver un essai</p>
                    <TestDriveForm vehicleId={v.id} vehicleName={name} />
                  </>
                )}
                <div className="mt-5 grid gap-2">
                  {SITE.phone.href && <a href={`tel:${SITE.phone.href}`} className="flex h-11 items-center justify-center gap-2 border text-sm font-semibold uppercase hover:bg-muted"><Phone className="size-4" /> {SITE.phone.display}</a>}
                  {SITE.mobile.href && <a href={`tel:${SITE.mobile.href}`} className="flex h-11 items-center justify-center gap-2 border text-sm font-semibold uppercase hover:bg-muted"><Phone className="size-4" /> {SITE.mobile.display}</a>}
                  {SITE.whatsapp && (
                    <a href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Bonjour, je suis intéressé par la ${name} (${v.reference}).`)}`} target="_blank" rel="noopener" className="flex h-11 items-center justify-center gap-2 border text-sm font-semibold uppercase hover:bg-muted"><MessageCircle className="size-4" /> WhatsApp</a>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="mt-20 border-t border-foreground pt-5">
            <p className="eyebrow">Dans le même esprit</p>
            <h2 className="mt-3 mb-8 text-4xl">Véhicules similaires</h2>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{similar.map((s) => <VehicleCard key={s.id} v={s} />)}</div>
          </section>
        )}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </div>
  );
}
