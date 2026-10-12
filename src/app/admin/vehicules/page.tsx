import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CATEGORY_LABEL, FUEL_LABEL, TRANSMISSION_LABEL } from "@/lib/constants";
import { eur } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/admin/page-header";
import { VehicleRowActions } from "@/components/admin/vehicle-row-actions";

export const metadata = { title: "Véhicules" };

export default async function AdminVehicles() {
  const vehicles = await prisma.vehicle.findMany({ orderBy: [{ category: "asc" }, { pricePerDay: "asc" }], include: { _count: { select: { reservations: true } } } });
  return (
    <>
      <PageHeader
        title="Véhicules"
        description={`${vehicles.length} véhicules · ${vehicles.filter((v) => v.active).length} actifs`}
        action={<Button asChild><Link href="/admin/vehicules/nouveau"><Plus /> Ajouter un véhicule</Link></Button>}
      />
      <div className="rounded-2xl border bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow><TableHead>Véhicule</TableHead><TableHead>Catégorie</TableHead><TableHead>Caractéristiques</TableHead><TableHead className="text-right">Prix/jour</TableHead><TableHead className="text-right">Réservations</TableHead><TableHead className="text-right">Actif / actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((v) => (
              <TableRow key={v.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="size-4 rounded-full border" style={{ background: v.color }} />
                    <div>
                      <Link href={`/vehicules/${v.slug}`} className="font-medium hover:text-primary">{v.name}</Link>
                      {v.featured && <Badge variant="accent" className="ml-2">Mis en avant</Badge>}
                      <div className="text-xs text-muted-foreground">{v.slug}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{CATEGORY_LABEL[v.category]}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{TRANSMISSION_LABEL[v.transmission]} · {FUEL_LABEL[v.fuel]} · {v.seats} pl.</TableCell>
                <TableCell className="text-right font-medium tabular-nums">{eur(v.pricePerDay)}</TableCell>
                <TableCell className="text-right tabular-nums">{v._count.reservations}</TableCell>
                <TableCell><VehicleRowActions id={v.id} active={v.active} name={v.name} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
