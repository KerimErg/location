import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, Car, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { STATUS_LABEL, STATUS_VARIANT } from "@/lib/constants";
import { eur, fmtDateTime, parseImages } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VehicleVisual } from "@/components/vehicles/vehicle-visual";
import { CancelButton } from "@/components/cancel-button";

export const metadata: Metadata = { title: "Mon compte", robots: { index: false } };

export default async function AccountPage() {
  const sessionUser = await requireUser("/compte");
  const user = await prisma.user.findUniqueOrThrow({ where: { id: sessionUser.id } });
  const reservations = await prisma.reservation.findMany({
    where: { OR: [{ userId: user.id }, { email: user.email }] },
    include: { vehicle: true, pickupAgency: true, returnAgency: true },
    orderBy: { pickupAt: "desc" },
  });
  const now = Date.now();
  const upcoming = reservations.filter((r) => ["PENDING", "CONFIRMED", "ONGOING"].includes(r.status) && r.returnAt.getTime() >= now);
  const past = reservations.filter((r) => !upcoming.includes(r));
  const spent = reservations.filter((r) => r.status !== "CANCELLED").reduce((s, r) => s + r.total, 0);

  const List = ({ items }: { items: typeof reservations }) =>
    items.length === 0 ? (
      <div className="rounded-3xl border border-dashed p-12 text-center">
        <Car className="mx-auto size-10 text-muted-foreground" />
        <p className="mt-4 font-display text-lg font-semibold">Aucune réservation</p>
        <Button asChild className="mt-6"><Link href="/vehicules">Réserver un véhicule</Link></Button>
      </div>
    ) : (
      <div className="grid gap-4">
        {items.map((r) => {
          const cancellable = ["PENDING", "CONFIRMED"].includes(r.status) && r.pickupAt.getTime() - now > 48 * 3600_000;
          return (
            <article key={r.id} className="grid overflow-hidden rounded-3xl border bg-card shadow-soft md:grid-cols-[220px_1fr]">
              <VehicleVisual src={parseImages(r.vehicle.images)[0]} alt={r.vehicle.name} color={r.vehicle.color} category={r.vehicle.category} sizes="220px" className="aspect-[16/10] md:aspect-auto" />
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{r.reference}</p>
                    <h3 className="font-display text-xl font-bold">{r.vehicle.name}</h3>
                  </div>
                  <Badge variant={STATUS_VARIANT[r.status]}>{STATUS_LABEL[r.status]}</Badge>
                </div>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <p className="flex items-start gap-2"><CalendarClock className="mt-0.5 size-4 shrink-0 text-primary" /><span>{fmtDateTime(r.pickupAt)}<br />{fmtDateTime(r.returnAt)}</span></p>
                  <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" /><span>{r.pickupAgency.name}{r.returnAgencyId !== r.pickupAgencyId && <><br />→ {r.returnAgency.name}</>}</span></p>
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                  <p className="font-display text-lg font-bold">{eur(r.total)}</p>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="ghost"><Link href={`/reservation/confirmation/${r.reference}`}>Détails</Link></Button>
                    {cancellable && <CancelButton id={r.id} reference={r.reference} />}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );

  return (
    <div className="bg-surface pt-28 pb-24">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm text-muted-foreground">Espace client</p>
            <h1 className="text-3xl font-bold md:text-5xl">Bonjour {user.name.split(" ")[0]}</h1>
          </div>
          <Button asChild><Link href="/vehicules">Nouvelle réservation</Link></Button>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            ["Réservations", String(reservations.length)],
            ["À venir", String(upcoming.length)],
            ["Total dépensé", eur(spent)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-3xl border bg-card p-6 shadow-soft">
              <p className="text-sm text-muted-foreground">{k}</p>
              <p className="mt-1 font-display text-3xl font-bold">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">À venir ({upcoming.length})</TabsTrigger>
              <TabsTrigger value="past">Historique ({past.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming"><List items={upcoming} /></TabsContent>
            <TabsContent value="past"><List items={past} /></TabsContent>
          </Tabs>
          <aside className="h-fit rounded-3xl border bg-card p-6 shadow-soft lg:mt-17">
            <h2 className="text-lg font-bold">Mes informations</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div><dt className="text-muted-foreground">Nom</dt><dd className="font-medium">{user.name}</dd></div>
              <div><dt className="text-muted-foreground">E-mail</dt><dd className="font-medium">{user.email}</dd></div>
              <div><dt className="text-muted-foreground">Téléphone</dt><dd className="font-medium">{user.phone ?? "—"}</dd></div>
              <div><dt className="text-muted-foreground">Membre depuis</dt><dd className="font-medium">{user.createdAt.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</dd></div>
            </dl>
          </aside>
        </div>
      </div>
    </div>
  );
}
