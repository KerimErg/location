import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { eur, km, regDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminTitle } from "@/components/admin/admin-title";
import { DeleteVehicleButton, VehicleStatusSelect } from "@/components/admin/inline-selects";

export const metadata = { title: "Véhicules" };

export default async function AdminVehicles() {
  const vehicles = await prisma.vehicle.findMany({ orderBy: [{ status: "asc" }, { position: "asc" }], include: { _count: { select: { leads: true } } } });
  return (
    <>
      <AdminTitle title="Véhicules" sub={`${vehicles.length} véhicules au total`} action={<Button asChild className="bg-signal text-signal-foreground"><Link href="/admin/vehicules/nouveau"><Plus /> Ajouter</Link></Button>} />
      <div className="border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>Réf.</TableHead><TableHead>Véhicule</TableHead><TableHead>Immat.</TableHead><TableHead className="text-right">Km</TableHead><TableHead className="text-right">Prix</TableHead><TableHead className="text-right">Demandes</TableHead><TableHead>Statut</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>
            {vehicles.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-mono text-xs">{v.reference}</TableCell>
                <TableCell><Link href={`/stock/${v.slug}`} className="font-medium hover:underline">{v.make} {v.model}</Link><div className="max-w-[260px] truncate text-xs text-muted-foreground">{v.version}</div></TableCell>
                <TableCell className="font-mono text-xs">{regDate(v.firstRegistration)}</TableCell>
                <TableCell className="text-right font-mono text-xs">{km(v.mileage)}</TableCell>
                <TableCell className="text-right font-mono">{eur(v.price)}</TableCell>
                <TableCell className="text-right font-mono">{v._count.leads}</TableCell>
                <TableCell><VehicleStatusSelect id={v.id} status={v.status} /></TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/vehicules/${v.id}`} aria-label="Modifier" className="inline-flex size-9 items-center justify-center rounded-md hover:bg-muted"><Pencil className="size-4" /></Link>
                  <DeleteVehicleButton id={v.id} name={`${v.make} ${v.model}`} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
