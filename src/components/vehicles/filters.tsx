"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, FUEL_LABEL } from "@/lib/constants";
import { eur } from "@/lib/format";
import { cn } from "@/lib/utils";

export const PRICE_MAX = 300;
const FUELS = Object.entries(FUEL_LABEL).map(([value, label]) => ({ value: value.toLowerCase(), label }));
const SEATS = ["2", "4", "5", "7"];

function useFilterParams() {
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
    start(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
  };
  const reset = () => {
    const next = new URLSearchParams(params.toString());
    ["categorie", "prix", "boite", "carburant", "places", "dispo"].forEach((k) => next.delete(k));
    start(() => router.replace(`${pathname}?${next.toString()}`, { scroll: false }));
  };
  const toggle = (k: string, value: string) => {
    const cur = list(k);
    set(k, cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value]);
  };
  return { params, list, set, toggle, reset, pending };
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b py-6 first:pt-0 last:border-0">
      <h3 className="mb-4 font-sans text-sm font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function FilterBody() {
  const { params, list, set, toggle, reset } = useFilterParams();
  const priceParam = Number(params.get("prix")) || PRICE_MAX;
  const [price, setPrice] = useState(priceParam);
  useEffect(() => setPrice(priceParam), [priceParam]);
  const boite = params.get("boite") ?? "";

  return (
    <div>
      <Group title="Catégorie">
        <div className="grid gap-3">
          {CATEGORIES.map((c) => (
            <Label key={c.slug} className="cursor-pointer font-normal">
              <Checkbox checked={list("categorie").includes(c.slug)} onCheckedChange={() => toggle("categorie", c.slug)} />
              {c.label}
            </Label>
          ))}
        </div>
      </Group>
      <Group title="Prix maximum par jour">
        <Slider min={30} max={PRICE_MAX} step={10} value={[price]} onValueChange={([v]) => setPrice(v)} onValueCommit={([v]) => set("prix", v >= PRICE_MAX ? null : String(v))} />
        <p className="mt-3 text-sm text-muted-foreground">Jusqu&apos;à <span className="font-semibold text-foreground">{price >= PRICE_MAX ? "sans limite" : eur(price)}</span></p>
      </Group>
      <Group title="Boîte de vitesses">
        <div className="grid grid-cols-3 gap-1 rounded-full bg-muted p-1">
          {[["", "Toutes"], ["auto", "Auto"], ["manuelle", "Manuelle"]].map(([v, l]) => (
            <button key={v} type="button" onClick={() => set("boite", v || null)} className={cn("rounded-full py-2 text-xs font-medium transition", boite === v ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              {l}
            </button>
          ))}
        </div>
      </Group>
      <Group title="Carburant / énergie">
        <div className="grid gap-3">
          {FUELS.map((f) => (
            <Label key={f.value} className="cursor-pointer font-normal">
              <Checkbox checked={list("carburant").includes(f.value)} onCheckedChange={() => toggle("carburant", f.value)} />
              {f.label}
            </Label>
          ))}
        </div>
      </Group>
      <Group title="Nombre de places minimum">
        <div className="flex flex-wrap gap-2">
          {SEATS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => set("places", params.get("places") === s ? null : s)}
              className={cn("h-10 min-w-12 rounded-full border px-4 text-sm font-medium transition", params.get("places") === s ? "border-primary bg-primary text-primary-foreground" : "hover:border-foreground/30")}
            >
              {s}+
            </button>
          ))}
        </div>
      </Group>
      <Group title="Disponibilité">
        <Label className="cursor-pointer font-normal">
          <Checkbox checked={params.get("dispo") === "1"} onCheckedChange={(c) => set("dispo", c ? "1" : null)} />
          Uniquement les véhicules disponibles
        </Label>
      </Group>
      <Button variant="outline" className="w-full" onClick={reset}>Réinitialiser les filtres</Button>
    </div>
  );
}

export function Filters({ count }: { count: number }) {
  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-3xl border bg-card p-6 shadow-soft">
          <FilterBody />
        </div>
      </aside>
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full"><SlidersHorizontal /> Filtres</Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="p-6">
            <SheetTitle>Filtrer les véhicules</SheetTitle>
            <FilterBody />
            <p className="text-center text-sm text-muted-foreground">{count} véhicule{count > 1 ? "s" : ""}</p>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

export function SortSelect() {
  const { params, set, pending } = useFilterParams();
  return (
    <Select value={params.get("tri") ?? "prix-asc"} onValueChange={(v) => set("tri", v === "prix-asc" ? null : v)}>
      <SelectTrigger className={cn("h-10 w-full rounded-full sm:w-56", pending && "opacity-60")} aria-label="Trier">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="prix-asc">Prix croissant</SelectItem>
        <SelectItem value="prix-desc">Prix décroissant</SelectItem>
        <SelectItem value="populaires">Les plus populaires</SelectItem>
        <SelectItem value="puissance">Puissance</SelectItem>
      </SelectContent>
    </Select>
  );
}
