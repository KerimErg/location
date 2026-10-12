import Link from "next/link";
import { ArrowUpRight, CalendarCheck, Car, Euro, Gauge } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ACTIVE_STATUSES, CATEGORY_LABEL, STATUS_LABEL, STATUS_VARIANT } from "@/lib/constants";
import { eur, fmtDateTime } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/admin/page-header";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const in7 = new Date(now.getTime() + 7 * 24 * 3600_000);

  const [revenue, monthRevenue, activeCount, vehicles, ongoing, departures, byCategory, users] = await Promise.all([
    prisma.reservation.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
    prisma.reservation.aggregate({ _sum: { total: true }, _count: true, where: { status: { not: "CANCELLED" }, createdAt: { gte: monthStart } } }),
    prisma.reservation.count({ where: { status: { in: ACTIVE_STATUSES } } }),
    prisma.vehicle.count({ where: { active: true } }),
    prisma.reservation.count({ where: { status: { in: ACTIVE_STATUSES }, pickupAt: { lte: now }, returnAt: { gte: now } } }),
    prisma.reservation.findMany({
      where: { status: { in: ["PENDING", "CONFIRMED"] }, pickupAt: { gte: now, lte: in7 } },
      include: { vehicle: true, pickupAgency: true },
      orderBy: { pickupAt: "asc" },
      take: 8,
    }),
    prisma.reservation.findMany({ where: { status: { not: "CANCELLED" } }, select: { total: true, vehicle: { select: { category: true } } } }),
    prisma.user.count({ where: { role: "CLIENT" } }),
  ]);

  const occupancy = vehicles ? Math.round((ongoing / vehicles) * 100) : 0;
  const cat = Object.entries(
    byCategory.reduce<Record<string, number>>((acc, r) => ((acc[r.vehicle.category] = (acc[r.vehicle.category] ?? 0) + r.total), acc), {}),
  ).sort((a, b) => b[1] - a[1]);
  const maxCat = Math.max(1, ...cat.map(([, v]) => v));

  const kpis = [
    { label: "Chiffre d'affaires total", value: eur(revenue._sum.total ?? 0), icon: Euro, sub: `${eur(monthRevenue._sum.total ?? 0)} ce mois-ci` },
    { label: "Réservations actives", value: String(activeCount), icon: CalendarCheck, sub: `${monthRevenue._count} créées ce mois-ci` },
    { label: "Taux d'occupation", value: `${occupancy} %`, icon: Gauge, sub: `${ongoing} véhicule(s) en location` },
    { label: "Flotte active", value: String(vehicles), icon: Car, sub: `${users} clients inscrits` },
  ];

  return (
    <>
      <PageHeader title="Tableau de bord" description={`Mis à jour le ${now.toLocaleString("fr-FR")}`} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{k.label}</p>
              <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-accent-foreground"><k.icon className="size-4" /></span>
            </div>
            <p className="mt-3 font-display text-3xl font-bold">{k.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{k.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="rounded-2xl border bg-card p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Départs des 7 prochains jours</h2>
            <Link href="/admin/reservations" className="flex items-center gap-1 text-sm text-primary hover:underline">Tout voir <ArrowUpRight className="size-4" /></Link>
          </div>
          {departures.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Aucun départ prévu.</p>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Client</TableHead><TableHead>Véhicule</TableHead><TableHead>Agence</TableHead><TableHead>Statut</TableHead></TableRow></TableHeader>
              <TableBody>
                {departures.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell >{fmtDateTime(r.pickupAt)}</TableCell>
                    <TableCell>{r.firstName} {r.lastName}</TableCell>
                    <TableCell>{r.vehicle.name}</TableCell>
                    <TableCell>{r.pickupAgency.name}</TableCell>
                    <TableCell><Badge variant={STATUS_VARIANT[r.status]}>{STATUS_LABEL[r.status]}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </section>
        <section className="rounded-2xl border bg-card p-5 shadow-soft">
          <h2 className="mb-5 text-lg font-bold">Chiffre d&apos;affaires par catégorie</h2>
          <ul className="space-y-4">
            {cat.map(([c, v]) => (
              <li key={c}>
                <div className="mb-1.5 flex justify-between text-sm"><span>{CATEGORY_LABEL[c as keyof typeof CATEGORY_LABEL]}</span><span className="font-medium tabular-nums">{eur(v)}</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(v / maxCat) * 100}%` }} /></div>
              </li>
            ))}
            {cat.length === 0 && <li className="text-sm text-muted-foreground">Pas encore de données.</li>}
          </ul>
        </section>
      </div>
    </>
  );
}
