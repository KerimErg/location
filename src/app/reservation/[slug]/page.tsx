import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { readSearch, searchToQuery, type SearchParamsRecord } from "@/lib/dates";
import { isVehicleAvailable } from "@/lib/availability";
import { ReservationWizard } from "@/components/booking/reservation-wizard";

export const metadata: Metadata = { title: "Réservation", robots: { index: false } };

export default async function ReservationPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<SearchParamsRecord> }) {
  const [{ slug }, sParams] = await Promise.all([params, searchParams]);
  const search = readSearch(sParams);
  const vehicle = await prisma.vehicle.findUnique({ where: { slug } });
  if (!vehicle || !vehicle.active) notFound();

  const [pickup, ret, extras, session, available] = await Promise.all([
    search.pickupAgency ? prisma.agency.findUnique({ where: { slug: search.pickupAgency } }) : null,
    search.returnAgency ? prisma.agency.findUnique({ where: { slug: search.returnAgency } }) : null,
    prisma.extra.findMany({ orderBy: { order: "asc" } }),
    getSession(),
    isVehicleAvailable(vehicle.id, search.pickupAt, search.returnAt),
  ]);
  if (!pickup || !ret || !available) redirect(`/vehicules/${slug}?${searchToQuery(search)}`);

  const user = session?.user ? await prisma.user.findUnique({ where: { id: session.user.id } }) : null;
  const [firstName, ...rest] = (user?.name ?? "").split(" ");

  return (
    <ReservationWizard
      vehicle={{ id: vehicle.id, slug: vehicle.slug, name: vehicle.name, category: vehicle.category, pricePerDay: vehicle.pricePerDay, images: vehicle.images, color: vehicle.color, deposit: vehicle.deposit }}
      pickup={{ id: pickup.id, name: pickup.name, address: `${pickup.address}, ${pickup.postalCode} ${pickup.city}`, type: pickup.type }}
      ret={{ id: ret.id, name: ret.name, address: `${ret.address}, ${ret.postalCode} ${ret.city}`, type: ret.type }}
      pickupAt={search.pickupAt.toISOString()}
      returnAt={search.returnAt.toISOString()}
      backHref={`/vehicules/${slug}?${searchToQuery(search)}`}
      extras={extras.map((e) => ({ id: e.id, code: e.code, name: e.name, description: e.description, price: e.price, pricing: e.pricing, maxPrice: e.maxPrice, icon: e.icon }))}
      prefill={user ? { firstName, lastName: rest.join(" "), email: user.email, phone: user.phone ?? "" } : undefined}
      loggedIn={!!user}
    />
  );
}
