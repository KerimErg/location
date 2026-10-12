import Link from "next/link";
import type { Prisma, ReservationStatus } from "@prisma/client";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PROTECTIONS, STATUS_LABEL } from "@/lib/constants";
import { eur, fmtDateTime } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/admin/page-header";
import { StatusSelect } from "@/components/admin/status-select";
import { cn } from "@/lib/utils";

export const metadata = { title: "Réservations" };

export default async function AdminReservations({ searchParams }: { searchParams: Promise<{ statut?: string; q?: string }> }) {
  const { statut, q } = await searchParams;
  const status = statut && statut in STATUS_LABEL ? (statut as ReservationStatus) : undefined;
  const where: Prisma.ReservationWhereInput = {
    ...(status && { status }),
    ...(q && { OR: [{ reference: { contains: q, mode: "insensitive" } }, { lastName: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }, { vehicle: { name: { contains: q, mode: "insensitive" } } }] }),
  };
  const [rows, counts] = await Promise.all([
    prisma.reservation.findMany({ where, include: { vehicle: true, pickupAgency: true, returnAgency: true }, orderBy: { pickupAt: "desc" }, take: 200 }),
    prisma.reservation.groupBy({ by: ["status"], _count: true }),
  ]);
  const count = (s?: ReservationStatus) => (s ? counts.find((c) => c.status === s)?._count ?? 0 : counts.reduce((a, c) => a + c._count, 0));
  const href = (s?: string) => `/admin/reservations?${new URLSearchParams({ ...(s && { statut: s }), ...(q && { q }) })}`;

  return (
    <>
      <PageHeader title="Réservations" description="Suivez et mettez à jour le statut des locations." />
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-1 overflow-x-auto">
          {[undefined, ...Object.keys(STATUS_LABEL)].map((s) => (
            <Link key={s ?? "all"} href={href(s)} className={cn("shrink-0 rounded-full px-3 py-1.5 text-xs font-medium", status === s ? "bg-foreground text-background" : "bg-card text-muted-foreground hover:text-foreground")}>
              {s ? STATUS_LABEL[s as ReservationStatus] : "Toutes"} ({count(s as ReservationStatus | undefined)})
            </Link>
          ))}
        </div>
        <form className="relative md:w-72">
          {status && <input type="hidden" name="statut" value={status} />}
          <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={q} placeholder="Référence, nom, e-mail…" className="h-10 pl-10" />
        </form>
      </div>
      <div className="rounded-2xl border bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Référence</TableHead><TableHead>Client</TableHead><TableHead>Véhicule</TableHead><TableHead>Période</TableHead><TableHead>Agences</TableHead><TableHead>Protection</TableHead><TableHead className="text-right">Total</TableHead><TableHead>Statut</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{r.reference}</TableCell>
                <TableCell><div className="font-medium">{r.firstName} {r.lastName}</div><div className="text-xs text-muted-foreground">{r.email}</div></TableCell>
                <TableCell>{r.vehicle.name}</TableCell>
                <TableCell className="text-xs">{fmtDateTime(r.pickupAt)}<br />{fmtDateTime(r.returnAt)} · {r.days} j</TableCell>
                <TableCell className="text-xs">{r.pickupAgency.name}{r.returnAgencyId !== r.pickupAgencyId && <><br />→ {r.returnAgency.name}</>}</TableCell>
                <TableCell className="text-xs">{PROTECTIONS.find((p) => p.value === r.protection)?.label}</TableCell>
                <TableCell className="text-right font-medium tabular-nums">{eur(r.total)}</TableCell>
                <TableCell><StatusSelect id={r.id} status={r.status} /></TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && <TableRow><TableCell colSpan={8} className="py-10 text-center text-muted-foreground">Aucune réservation.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
