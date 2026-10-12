"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Building2, Clock, Phone, Plane, Search, TrainFront } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { MapAgency } from "./agency-map";

const AgencyMap = dynamic(() => import("./agency-map"), { ssr: false, loading: () => <Skeleton className="h-full w-full rounded-none" /> });

type Agency = MapAgency & { type: string };

const TYPE = {
  airport: { icon: Plane, label: "Aéroport" },
  station: { icon: TrainFront, label: "Gare" },
  city: { icon: Building2, label: "Centre-ville" },
} as const;

export function AgenciesExplorer({ agencies, className }: { agencies: Agency[]; className?: string }) {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string>();
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? agencies.filter((a) => `${a.name} ${a.city} ${a.postalCode}`.toLowerCase().includes(s)) : agencies;
  }, [q, agencies]);

  return (
    <div className={cn("grid overflow-hidden rounded-3xl border bg-card shadow-soft lg:h-[620px] lg:grid-cols-[380px_1fr]", className)}>
      <div className="flex min-h-0 flex-col border-b lg:border-r lg:border-b-0">
        <div className="border-b p-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ville, gare, aéroport…" className="pl-11" aria-label="Rechercher une agence" />
          </div>
        </div>
        <ul className="max-h-80 min-h-0 flex-1 overflow-y-auto lg:max-h-none">
          {list.map((a) => {
            const T = TYPE[a.type as keyof typeof TYPE] ?? TYPE.city;
            return (
              <li key={a.slug}>
                <button
                  type="button"
                  onClick={() => setSelected(a.slug)}
                  className={cn("w-full border-b px-5 py-4 text-left transition hover:bg-muted/60", selected === a.slug && "bg-accent/60")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{a.name}</p>
                      <p className="text-sm text-muted-foreground">{a.address}, {a.postalCode} {a.city}</p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-muted px-2 py-1 text-[0.7rem] font-medium"><T.icon className="size-3" /> {T.label}</span>
                  </div>
                  {selected === a.slug && (
                    <div className="mt-3 space-y-1.5 text-sm">
                      <p className="flex items-center gap-2 text-muted-foreground"><Clock className="size-4" /> {a.hours}</p>
                      <p className="flex items-center gap-2 text-muted-foreground"><Phone className="size-4" /> {a.phone}</p>
                      <Button asChild size="sm" className="mt-2">
                        <Link href={`/vehicules?pickupAgency=${a.slug}`}>Réserver dans cette agence</Link>
                      </Button>
                    </div>
                  )}
                </button>
              </li>
            );
          })}
          {list.length === 0 && <li className="p-6 text-sm text-muted-foreground">Aucune agence ne correspond à « {q} ».</li>}
        </ul>
      </div>
      <div className="relative z-0 h-[420px] lg:h-full">
        <AgencyMap agencies={list} selected={selected} onSelect={setSelected} />
      </div>
    </div>
  );
}
