import { prisma } from "@/lib/prisma";
import { eur } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/admin/page-header";

export const metadata = { title: "Clients" };

export default async function AdminClients() {
  const [users, subscribers] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, include: { reservations: { select: { total: true, status: true } } } }),
    prisma.newsletterSubscriber.count(),
  ]);
  return (
    <>
      <PageHeader title="Clients" description={`${users.length} comptes · ${subscribers} abonnés newsletter`} />
      <div className="rounded-2xl border bg-card shadow-soft">
        <Table>
          <TableHeader><TableRow><TableHead>Nom</TableHead><TableHead>E-mail</TableHead><TableHead>Téléphone</TableHead><TableHead>Rôle</TableHead><TableHead className="text-right">Réservations</TableHead><TableHead className="text-right">CA généré</TableHead><TableHead>Inscription</TableHead></TableRow></TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.phone ?? "—"}</TableCell>
                <TableCell><Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>{u.role === "ADMIN" ? "Admin" : "Client"}</Badge></TableCell>
                <TableCell className="text-right tabular-nums">{u.reservations.length}</TableCell>
                <TableCell className="text-right tabular-nums">{eur(u.reservations.filter((r) => r.status !== "CANCELLED").reduce((s, r) => s + r.total, 0))}</TableCell>
                <TableCell>{u.createdAt.toLocaleDateString("fr-FR")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
