import type { Metadata } from "next";
import type { Fuel, Prisma } from "@prisma/client";
import { SearchX } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getAgencyOptions } from "@/lib/queries";
import { readSearch, searchToQuery, sp, type SearchParamsRecord } from "@/lib/dates";
import { unavailableVehicleIds } from "@/lib/availability";
import { CATEGORIES, categoryFromSlug } from "@/lib/constants";
import { quote } from "@/lib/pricing";
import { fmtDateTime } from "@/lib/format";
import { BookingPanel } from "@/components/booking/booking-panel";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { Filters, SortSelect } from "@/components/vehicles/filters";

export const metadata: Metadata = {
  title: "Nos véhicules",
  description: "Citadines, berlines, SUV, utilitaires, premium et électriques : comparez et réservez en quelques clics.",
};

const csv = (p: SearchParamsRecord, k: string) => sp(p, k)?.split(",").filter(Boolean) ?? [];

export default async function VehiclesPage({ searchParams }: { searchParams: Promise<SearchParamsRecord> }) {
  const params = await searchParams;
  const search = readSearch(params);
  const categories = csv(params, "categorie").map(categoryFromSlug).filter((c) => !!c);
  const fuels = csv(params, "carburant").map((f) => f.toUpperCase()).filter((f): f is Fuel => ["PETROL", "DIESEL", "HYBRID", "ELECTRIC"].includes(f));
  const maxPrice = Number(sp(params, "prix")) || undefined;
  const boite = sp(params, "boite");
  const seats = Number(sp(params, "places")) || undefined;
  const sort = sp(params, "tri") ?? "prix-asc";

  const where: Prisma.VehicleWhereInput = {
    active: true,
    ...(categories.length && { category: { in: categories } }),
    ...(fuels.length && { fuel: { in: fuels } }),
    ...(maxPrice && { pricePerDay: { lte: maxPrice } }),
    ...(boite === "auto" && { transmission: "AUTOMATIC" }),
    ...(boite === "manuelle" && { transmission: "MANUAL" }),
    ...(seats && { seats: { gte: seats } }),
  };
  const orderBy: Prisma.VehicleOrderByWithRelationInput[] =
    sort === "prix-desc" ? [{ pricePerDay: "desc" }] : sort === "populaires" ? [{ featured: "desc" }, { pricePerDay: "asc" }] : sort === "puissance" ? [{ power: "desc" }] : [{ pricePerDay: "asc" }];

  const [agencies, vehicles, busy] = await Promise.all([
    getAgencyOptions(),
    prisma.vehicle.findMany({ where, orderBy }),
    unavailableVehicleIds(search.pickupAt, search.returnAt),
  ]);

  const oneWay = !!search.pickupAgency && search.pickupAgency !== search.returnAgency;
  let rows = vehicles.map((v) => ({ v, unavailable: busy.has(v.id), q: quote({ pricePerDay: v.pricePerDay, pickupAt: search.pickupAt, returnAt: search.returnAt, oneWay }) }));
  if (sp(params, "dispo") === "1") rows = rows.filter((r) => !r.unavailable);
  rows.sort((a, b) => Number(a.unavailable) - Number(b.unavailable));

  const query = searchToQuery(search);
  const title = categories.length === 1 ? `Location ${CATEGORIES.find((c) => c.value === categories[0])!.label.toLowerCase()}` : "Tous nos véhicules";
  const pickupName = agencies.find((a) => a.slug === search.pickupAgency)?.name;

  return (
    <div className="pb-24">
      <div className="bg-ink pt-24 pb-10 text-white md:pt-28">
        <div className="container-page">
          <h1 className="text-3xl font-bold md:text-5xl">{title}</h1>
          <p className="mt-2 text-sm text-white/60">
            {pickupName ? `${pickupName} · ` : ""}
            <span>{fmtDateTime(search.pickupAt)}</span> → <span>{fmtDateTime(search.returnAt)}</span>
          </p>
          <BookingPanel
            className="mt-6"
            title="Modifier ma recherche"
            submitLabel="Actualiser"
            agencies={agencies}
            defaults={{ pickupAgency: search.pickupAgency, returnAgency: search.returnAgency, pickupDate: search.pickupDate, pickupTime: search.pickupTime, returnDate: search.returnDate, returnTime: search.returnTime }}
          />
        </div>
      </div>

      <div className="container-page mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
        <Filters count={rows.length} />
        <div>
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{rows.length}</span> véhicule{rows.length > 1 ? "s" : ""} · {rows[0]?.q.days ?? 0} jour{(rows[0]?.q.days ?? 0) > 1 ? "s" : ""} de location
            </p>
            <SortSelect />
          </div>
          {rows.length === 0 ? (
            <div className="flex flex-col items-center rounded-3xl border border-dashed py-20 text-center">
              <SearchX className="size-10 text-muted-foreground" />
              <p className="mt-4 font-display text-lg font-semibold">Aucun véhicule ne correspond</p>
              <p className="mt-1 text-sm text-muted-foreground">Élargissez vos filtres ou modifiez vos dates.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {rows.map(({ v, unavailable, q }, i) => (
                <VehicleCard key={v.id} v={v} query={query} days={q.days} total={q.total} unavailable={unavailable} priority={i < 3} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
