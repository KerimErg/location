import type { Metadata } from "next";
import Link from "next/link";
import type { Body, Fuel, Prisma } from "@prisma/client";
import { SearchX } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BODY, FUEL } from "@/lib/labels";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { SortSelect, StockFilters } from "@/components/vehicles/stock-filters";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Stock de voitures d'occasion",
  description: "Toutes nos voitures d'occasion disponibles à Rocourt (Liège) : prix TVAC, kilométrage, Car-Pass et garantie.",
};

type SP = Record<string, string | string[] | undefined>;
const one = (p: SP, k: string) => (Array.isArray(p[k]) ? p[k]![0] : (p[k] as string | undefined));
const csv = (p: SP, k: string) => one(p, k)?.split(",").filter(Boolean) ?? [];
const PER_PAGE = 12;

export default async function StockPage({ searchParams }: { searchParams: Promise<SP> }) {
  const p = await searchParams;
  const makes = csv(p, "marque");
  const fuels = csv(p, "carburant").filter((f): f is Fuel => f in FUEL);
  const bodies = csv(p, "carrosserie").filter((b): b is Body => b in BODY);
  const boite = one(p, "boite");
  const prixMax = Number(one(p, "prixMax")) || undefined;
  const kmMax = Number(one(p, "kmMax")) || undefined;
  const anneeMin = Number(one(p, "anneeMin")) || undefined;
  const page = Math.max(1, Number(one(p, "page")) || 1);
  const tri = one(p, "tri") ?? "recent";

  const where: Prisma.VehicleWhereInput = {
    ...(one(p, "vendus") === "1" ? {} : { status: { not: "VENDU" } }),
    ...(makes.length && { make: { in: makes } }),
    ...(fuels.length && { fuel: { in: fuels } }),
    ...(bodies.length && { body: { in: bodies } }),
    ...((boite === "MANUELLE" || boite === "AUTOMATIQUE") && { gearbox: boite }),
    ...(prixMax && { price: { lte: prixMax } }),
    ...(kmMax && { mileage: { lte: kmMax } }),
    ...(anneeMin && { firstRegistration: { gte: new Date(Date.UTC(anneeMin, 0, 1)) } }),
  };
  const orderBy: Prisma.VehicleOrderByWithRelationInput[] =
    tri === "prix-asc" ? [{ price: "asc" }] : tri === "prix-desc" ? [{ price: "desc" }] : tri === "km-asc" ? [{ mileage: "asc" }] : tri === "annee-desc" ? [{ firstRegistration: "desc" }] : [{ createdAt: "desc" }];

  const [vehicles, total, allMakes] = await Promise.all([
    prisma.vehicle.findMany({ where, orderBy: [{ status: "asc" }, ...orderBy], skip: (page - 1) * PER_PAGE, take: PER_PAGE }),
    prisma.vehicle.count({ where }),
    prisma.vehicle.findMany({ select: { make: true }, distinct: ["make"], orderBy: { make: "asc" } }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const pageHref = (n: number) => {
    const q = new URLSearchParams(Object.entries(p).flatMap(([k, v]) => (typeof v === "string" ? [[k, v]] : [])));
    q.set("page", String(n));
    return `/stock?${q}`;
  };

  return (
    <div className="pb-24">
      <div className="border-b bg-card">
        <div className="container-page py-10 md:py-14">
          <p className="eyebrow">Stock · mis à jour chaque semaine</p>
          <h1 className="mt-3 text-5xl md:text-7xl">Nos véhicules</h1>
          <p className="mt-3 max-w-xl text-muted-foreground">Prix TVAC. Tous nos véhicules sont livrés avec Car-Pass, contrôle technique « vente » et garantie.</p>
        </div>
      </div>
      <div className="container-page mt-10 grid gap-10 lg:grid-cols-[250px_1fr]">
        <StockFilters makes={allMakes.map((m) => m.make)} count={total} />
        <div>
          <div className="mb-6 flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-center">
            <p className="font-mono text-sm"><span className="font-medium">{total}</span> véhicule{total > 1 ? "s" : ""}</p>
            <SortSelect />
          </div>
          {vehicles.length === 0 ? (
            <div className="flex flex-col items-center border border-dashed py-20 text-center">
              <SearchX className="size-10 text-muted-foreground" strokeWidth={1.5} />
              <p className="mt-4 font-display text-2xl font-bold uppercase">Aucun véhicule ne correspond</p>
              <p className="mt-1 text-sm text-muted-foreground">Élargissez vos critères, ou <Link href="/contact?objet=recherche" className="underline">confiez-nous votre recherche</Link>.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {vehicles.map((v, i) => <VehicleCard key={v.id} v={v} priority={i < 3} />)}
            </div>
          )}
          {pages > 1 && (
            <nav className="mt-10 flex justify-center gap-1" aria-label="Pagination">
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <Link key={n} href={pageHref(n)} aria-current={n === page ? "page" : undefined} className={cn("flex size-10 items-center justify-center border font-mono text-sm", n === page ? "bg-foreground text-background" : "hover:bg-muted")}>{n}</Link>
              ))}
            </nav>
          )}
          <div className="mt-14 grid gap-4 border bg-card p-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="font-display text-2xl font-bold uppercase">Vous ne trouvez pas votre voiture ?</p>
              <p className="text-sm text-muted-foreground">Dites-nous ce que vous cherchez : nous la trouvons pour vous, contrôlée et garantie.</p>
            </div>
            <Link href="/contact?objet=recherche" className="inline-flex h-11 items-center justify-center rounded-md bg-signal px-5 text-sm font-semibold tracking-wide text-signal-foreground uppercase">Confier ma recherche</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
