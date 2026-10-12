import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/admin/page-header";

export const metadata = { title: "Agences" };
const TYPE: Record<string, string> = { city: "Centre-ville", station: "Gare", airport: "Aéroport" };

export default async function AdminAgencies() {
  const agencies = await prisma.agency.findMany({ orderBy: { city: "asc" }, include: { _count: { select: { pickupReservations: true } } } });
  return (
    <>
      <PageHeader title="Agences" description={`${agencies.length} agences`} action={<Button asChild><Link href="/admin/agences/nouvelle"><Plus /> Ajouter une agence</Link></Button>} />
      <div className="rounded-2xl border bg-card shadow-soft">
        <Table>
          <TableHeader><TableRow><TableHead>Agence</TableHead><TableHead>Type</TableHead><TableHead>Adresse</TableHead><TableHead>Horaires</TableHead><TableHead className="text-right">Départs</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>
            {agencies.map((a) => (
              <TableRow key={a.id}>
                <TableCell><div className="font-medium">{a.name}</div><div className="text-xs text-muted-foreground">{a.phone}</div></TableCell>
                <TableCell>{TYPE[a.type] ?? a.type}</TableCell>
                <TableCell className="text-xs">{a.address}<br />{a.postalCode} {a.city}</TableCell>
                <TableCell className="text-xs">{a.hours}</TableCell>
                <TableCell className="text-right tabular-nums">{a._count.pickupReservations}</TableCell>
                <TableCell className="text-right"><Button asChild variant="ghost" size="icon" className="size-8"><Link href={`/admin/agences/${a.id}`} aria-label="Modifier"><Pencil /></Link></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
