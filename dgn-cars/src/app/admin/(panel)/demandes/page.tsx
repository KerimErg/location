import Link from "next/link";
import type { LeadStatus, LeadType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { LEAD_STATUS, LEAD_TYPE } from "@/lib/labels";
import { AdminTitle } from "@/components/admin/admin-title";
import { LeadStatusSelect } from "@/components/admin/inline-selects";
import { cn } from "@/lib/utils";

export const metadata = { title: "Demandes" };

const DETAIL_LABELS: Record<string, string> = {
  creneau: "Créneau", plate: "Plaque", make: "Marque", model: "Modèle", year: "Année", mileage: "Km", fuel: "Carburant", condition: "État",
  amount: "Montant financé", deposit: "Acompte", months: "Durée (mois)", objet: "Objet", plaque: "Plaque", marque: "Marque", modele: "Modèle", annee: "Année", km: "Km",
};

export default async function Leads({ searchParams }: { searchParams: Promise<{ type?: string; statut?: string }> }) {
  const { type, statut } = await searchParams;
  const where: Prisma.LeadWhereInput = {
    ...(type && type in LEAD_TYPE && { type: type as LeadType }),
    ...(statut && statut in LEAD_STATUS ? { status: statut as LeadStatus } : { status: { not: "ARCHIVE" } }),
  };
  const leads = await prisma.lead.findMany({ where, orderBy: { createdAt: "desc" }, take: 200, include: { vehicle: { select: { make: true, model: true, reference: true, slug: true } } } });
  const href = (t?: string) => `/admin/demandes${t ? `?type=${t}` : ""}`;

  return (
    <>
      <AdminTitle title="Demandes" sub="Essais, reprises, financements et messages reçus via le site." />
      <div className="mb-5 flex flex-wrap gap-1">
        {[undefined, ...Object.keys(LEAD_TYPE)].map((t) => (
          <Link key={t ?? "all"} href={href(t)} className={cn("rounded-md border px-3 py-1.5 text-xs font-medium uppercase", type === t ? "bg-foreground text-background" : "bg-card hover:bg-muted")}>
            {t ? LEAD_TYPE[t as LeadType] : "Toutes"}
          </Link>
        ))}
      </div>
      <div className="grid gap-3">
        {leads.map((l) => {
          const details = (l.details ?? {}) as Record<string, unknown>;
          return (
            <article key={l.id} className={cn("grid gap-4 border bg-card p-5 md:grid-cols-[1fr_auto]", l.status === "NOUVEAU" && "border-l-4 border-l-signal")}>
              <div>
                <p className="font-mono text-xs text-muted-foreground uppercase">{LEAD_TYPE[l.type]} · {l.createdAt.toLocaleString("fr-BE", { dateStyle: "short", timeStyle: "short" })}</p>
                <p className="mt-1 text-lg font-semibold">{l.name}</p>
                <p className="text-sm"><a className="underline" href={`tel:${l.phone}`}>{l.phone}</a> · <a className="underline" href={`mailto:${l.email}`}>{l.email}</a></p>
                {l.vehicle && <p className="mt-2 text-sm">Véhicule : <Link className="underline" href={`/stock/${l.vehicle.slug}`}>{l.vehicle.make} {l.vehicle.model} ({l.vehicle.reference})</Link></p>}
                {l.preferredDate && <p className="text-sm">Date souhaitée : {l.preferredDate.toLocaleDateString("fr-BE")}</p>}
                {Object.keys(details).length > 0 && (
                  <dl className="mt-2 flex flex-wrap gap-x-5 gap-y-1 font-mono text-xs">
                    {Object.entries(details).map(([k, v]) => <div key={k}><dt className="inline text-muted-foreground">{DETAIL_LABELS[k] ?? k} : </dt><dd className="inline">{String(v)}</dd></div>)}
                  </dl>
                )}
                {l.message && <p className="mt-3 border-l-2 pl-3 text-sm text-muted-foreground">{l.message}</p>}
              </div>
              <LeadStatusSelect id={l.id} status={l.status} />
            </article>
          );
        })}
        {leads.length === 0 && <p className="border border-dashed p-10 text-center text-sm text-muted-foreground">Aucune demande.</p>}
      </div>
    </>
  );
}
