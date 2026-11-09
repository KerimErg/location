"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BODY, FUEL } from "@/lib/labels";
import { cn } from "@/lib/utils";

const sel = "h-10 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";
const FILTER_KEYS = ["marque", "carburant", "boite", "carrosserie", "prixMax", "kmMax", "anneeMin", "vendus"];

function useParamsState() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();
  const list = (k: string) => params.get(k)?.split(",").filter(Boolean) ?? [];
  const set = (k: string, v: string | string[] | null) => {
    const next = new URLSearchParams(params.toString());
    const val = Array.isArray(v) ? v.join(",") : v;
    if (val) next.set(k, val);
    else next.delete(k);
    next.delete("page");
    start(() => router.replace(`${pathname}?${next}`, { scroll: false }));
  };
  const toggle = (k: string, value: string) => {
    const cur = list(k);
    set(k, cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value]);
  };
  const reset = () => start(() => router.replace(pathname, { scroll: false }));
  const active = FILTER_KEYS.some((k) => params.has(k));
  return { params, list, set, toggle, reset, pending, active };
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b py-5 first:pt-0">
      <legend className="eyebrow mb-3">{title}</legend>
      {children}
    </fieldset>
  );
}

function Body({ makes }: { makes: string[] }) {
  const { params, list, set, toggle, reset, active } = useParamsState();
  const box = (k: string, value: string, label: string) => (
    <label key={value} className="flex cursor-pointer items-center gap-2.5 py-1 text-sm">
      <Checkbox checked={list(k).includes(value)} onCheckedChange={() => toggle(k, value)} className="rounded-sm" />
      {label}
    </label>
  );
  return (
    <div>
      <Group title="Marque">{makes.map((m) => box("marque", m, m))}</Group>
      <Group title="Budget">
        <div className="grid gap-3">
          <select aria-label="Prix maximum" className={sel} value={params.get("prixMax") ?? ""} onChange={(e) => set("prixMax", e.target.value || null)}>
            <option value="">Prix max. : indifférent</option>
            {[5000, 6000, 7500, 10000, 15000, 20000].map((p) => <option key={p} value={p}>Jusqu&apos;à {new Intl.NumberFormat("fr-BE").format(p)} €</option>)}
          </select>
          <select aria-label="Kilométrage maximum" className={sel} value={params.get("kmMax") ?? ""} onChange={(e) => set("kmMax", e.target.value || null)}>
            <option value="">Km max. : indifférent</option>
            {[50000, 100000, 125000, 150000, 200000].map((p) => <option key={p} value={p}>Moins de {new Intl.NumberFormat("fr-BE").format(p)} km</option>)}
          </select>
          <select aria-label="Année minimum" className={sel} value={params.get("anneeMin") ?? ""} onChange={(e) => set("anneeMin", e.target.value || null)}>
            <option value="">Année min. : indifférent</option>
            {[2018, 2016, 2014, 2012, 2010].map((y) => <option key={y} value={y}>{y} et plus récent</option>)}
          </select>
        </div>
      </Group>
      <Group title="Carburant">{Object.entries(FUEL).map(([k, l]) => box("carburant", k, l))}</Group>
      <Group title="Boîte de vitesses">
        <div className="grid grid-cols-3 border">
          {[["", "Toutes"], ["MANUELLE", "Manuelle"], ["AUTOMATIQUE", "Auto"]].map(([v, l]) => (
            <button key={v} type="button" onClick={() => set("boite", v || null)} className={cn("py-2 text-xs font-medium uppercase", (params.get("boite") ?? "") === v ? "bg-foreground text-background" : "hover:bg-muted")}>{l}</button>
          ))}
        </div>
      </Group>
      <Group title="Carrosserie">{Object.entries(BODY).map(([k, l]) => box("carrosserie", k, l))}</Group>
      <Group title="Affichage">
        <label className="flex cursor-pointer items-center gap-2.5 text-sm">
          <Checkbox checked={params.get("vendus") === "1"} onCheckedChange={(c) => set("vendus", c ? "1" : null)} className="rounded-sm" />
          Afficher aussi les véhicules vendus
        </label>
      </Group>
      {active && <Button variant="outline" className="mt-5 w-full" onClick={reset}><X /> Effacer les filtres</Button>}
    </div>
  );
}

export function StockFilters({ makes, count }: { makes: string[]; count: number }) {
  return (
    <>
      <aside className="hidden lg:block" aria-label="Filtres">
        <div className="sticky top-32"><Body makes={makes} /></div>
      </aside>
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full"><SlidersHorizontal /> Filtrer</Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="p-6">
            <SheetTitle className="font-display text-2xl uppercase">Filtrer le stock</SheetTitle>
            <Body makes={makes} />
            <p className="text-center font-mono text-xs text-muted-foreground">{count} véhicule{count > 1 ? "s" : ""}</p>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export function SortSelect() {
  const { params, set, pending } = useParamsState();
  return (
    <select aria-label="Trier" className={cn(sel, "w-full sm:w-60", pending && "opacity-60")} value={params.get("tri") ?? "recent"} onChange={(e) => set("tri", e.target.value === "recent" ? null : e.target.value)}>
      <option value="recent">Arrivages récents</option>
      <option value="prix-asc">Prix croissant</option>
      <option value="prix-desc">Prix décroissant</option>
      <option value="km-asc">Kilométrage croissant</option>
      <option value="annee-desc">Année la plus récente</option>
    </select>
  );
}
