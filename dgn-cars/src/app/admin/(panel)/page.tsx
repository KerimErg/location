import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { LEAD_TYPE } from "@/lib/labels";
import { eur } from "@/lib/format";
import { AdminTitle } from "@/components/admin/admin-title";

export default async function Dashboard() {
  const [byStatus, value, leads, newByType] = await Promise.all([
    prisma.vehicle.groupBy({ by: ["status"], _count: true }),
    prisma.vehicle.aggregate({ _sum: { price: true }, where: { status: "DISPONIBLE" } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { vehicle: { select: { make: true, model: true, reference: true } } } }),
    prisma.lead.groupBy({ by: ["type"], _count: true, where: { status: "NOUVEAU" } }),
  ]);
  const c = (s: string) => byStatus.find((b) => b.status === s)?._count ?? 0;
  const kpis = [
    ["Disponibles", String(c("DISPONIBLE"))],
    ["Réservés", String(c("RESERVE"))],
    ["Vendus", String(c("VENDU"))],
    ["Valeur du stock", eur(value._sum.price ?? 0)],
  ];
  return (
    <>
      <AdminTitle title="Tableau de bord" sub={new Date().toLocaleDateString("fr-BE", { weekday: "long", day: "numeric", month: "long" })} />
      <div className="grid border-t border-l sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(([k, v]) => (
          <div key={k} className="border-r border-b bg-card p-5">
            <p className="eyebrow">{k}</p>
            <p className="mt-2 font-display text-4xl font-bold">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="border bg-card">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-2xl">Dernières demandes</h2>
            <Link href="/admin/demandes" className="text-sm underline">Tout voir</Link>
          </div>
          <ul>
            {leads.map((l) => (
              <li key={l.id} className="grid grid-cols-[110px_1fr_auto] items-center gap-3 border-b px-4 py-3 text-sm last:border-0">
                <span className="font-mono text-xs text-muted-foreground uppercase">{LEAD_TYPE[l.type]}</span>
                <span className="truncate"><strong>{l.name}</strong>{l.vehicle && <span className="text-muted-foreground"> · {l.vehicle.make} {l.vehicle.model} ({l.vehicle.reference})</span>}</span>
                <span className="font-mono text-xs text-muted-foreground">{l.createdAt.toLocaleDateString("fr-BE")}</span>
              </li>
            ))}
            {leads.length === 0 && <li className="p-6 text-sm text-muted-foreground">Aucune demande.</li>}
          </ul>
        </section>
        <section className="border bg-card p-4">
          <h2 className="text-2xl">À traiter</h2>
          <ul className="mt-4 grid gap-2">
            {(["ESSAI", "REPRISE", "FINANCEMENT", "CONTACT"] as const).map((t) => (
              <li key={t}>
                <Link href={`/admin/demandes?type=${t}&statut=NOUVEAU`} className="flex items-center justify-between border px-4 py-3 text-sm hover:bg-muted">
                  {LEAD_TYPE[t]} <span className="font-mono">{newByType.find((n) => n.type === t)?._count ?? 0}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
