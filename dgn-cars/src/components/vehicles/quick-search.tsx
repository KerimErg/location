"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sel = "h-12 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function QuickSearch({ makes, count, className }: { makes: string[]; count: number; className?: string }) {
  const router = useRouter();
  const [make, setMake] = useState("");
  const [budget, setBudget] = useState("");
  const [fuel, setFuel] = useState("");
  const [gearbox, setGearbox] = useState("");
  return (
    <form
      className={cn("grid gap-3 border bg-card p-4 text-foreground sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:p-5", className)}
      onSubmit={(e) => {
        e.preventDefault();
        const q = new URLSearchParams();
        if (make) q.set("marque", make);
        if (budget) q.set("prixMax", budget);
        if (fuel) q.set("carburant", fuel);
        if (gearbox) q.set("boite", gearbox);
        router.push(`/stock?${q}`);
      }}
    >
      <label className="grid gap-1.5">
        <span className="eyebrow">Marque</span>
        <select className={sel} value={make} onChange={(e) => setMake(e.target.value)}>
          <option value="">Toutes les marques</option>
          {makes.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </label>
      <label className="grid gap-1.5">
        <span className="eyebrow">Budget max.</span>
        <select className={sel} value={budget} onChange={(e) => setBudget(e.target.value)}>
          <option value="">Sans limite</option>
          {[5000, 6000, 7500, 10000, 15000, 20000].map((b) => <option key={b} value={b}>{new Intl.NumberFormat("fr-BE").format(b)} €</option>)}
        </select>
      </label>
      <label className="grid gap-1.5">
        <span className="eyebrow">Carburant</span>
        <select className={sel} value={fuel} onChange={(e) => setFuel(e.target.value)}>
          <option value="">Tous</option>
          <option value="ESSENCE">Essence</option>
          <option value="DIESEL">Diesel</option>
          <option value="HYBRIDE">Hybride</option>
          <option value="ELECTRIQUE">Électrique</option>
        </select>
      </label>
      <label className="grid gap-1.5">
        <span className="eyebrow">Boîte</span>
        <select className={sel} value={gearbox} onChange={(e) => setGearbox(e.target.value)}>
          <option value="">Indifférent</option>
          <option value="MANUELLE">Manuelle</option>
          <option value="AUTOMATIQUE">Automatique</option>
        </select>
      </label>
      <Button type="submit" size="lg" className="h-12 self-end bg-signal text-signal-foreground sm:col-span-2 lg:col-span-1">
        <Search /> Voir les {count} véhicules
      </Button>
    </form>
  );
}
