export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getAgencies } from "@/lib/queries";
import { AgenciesExplorer } from "@/components/agencies/agencies-explorer";

export const metadata: Metadata = { title: "Nos agences", description: "Trouvez une agence TestLocation en gare, en aéroport ou en centre-ville." };

export default async function AgenciesPage() {
  const agencies = await getAgencies();
  const cities = new Set(agencies.map((a) => a.city)).size;
  return (
    <div className="pb-24">
      <div className="bg-ink pt-28 pb-16 text-white">
        <div className="container-page">
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Réseau TestLocation</p>
          <h1 className="mt-3 text-4xl font-bold md:text-6xl">Nos agences</h1>
          <p className="mt-4 max-w-xl text-white/60">{agencies.length} agences dans {cities} villes, ouvertes 7j/7 dans les gares et aéroports. Retour possible dans n&apos;importe quelle agence.</p>
        </div>
      </div>
      <div className="container-page -mt-8">
        <AgenciesExplorer agencies={agencies} />
      </div>
    </div>
  );
}
