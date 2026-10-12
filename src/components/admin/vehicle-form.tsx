"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { Vehicle } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CATEGORIES, FUEL_LABEL, TRANSMISSION_LABEL } from "@/lib/constants";
import { parseImages } from "@/lib/format";
import { saveVehicle, type FormState } from "@/app/actions/admin";
import { FormField, nativeSelect } from "./form-field";

export function VehicleForm({ vehicle }: { vehicle?: Vehicle }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveVehicle.bind(null, vehicle?.id ?? null), {});
  const e = state.fieldErrors ?? {};
  const v = vehicle;
  const text = (name: keyof Vehicle, label: string, props: React.ComponentProps<"input"> = {}) => (
    <FormField label={label} error={e[name]} htmlFor={name}>
      <Input id={name} name={name} defaultValue={v ? String(v[name] ?? "") : undefined} aria-invalid={!!e[name]} {...props} />
    </FormField>
  );

  return (
    <form action={action} className="grid gap-6">
      <section className="grid gap-5 rounded-2xl border bg-card p-6 shadow-soft md:grid-cols-2">
        <h2 className="text-lg font-bold md:col-span-2">Informations</h2>
        {text("name", "Nom commercial", { required: true })}
        {text("slug", "Slug (URL)", { required: true, pattern: "[a-z0-9\\-]+" })}
        <FormField label="Catégorie" htmlFor="category">
          <select id="category" name="category" defaultValue={v?.category ?? "CITADINE"} className={nativeSelect}>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </FormField>
        {text("year", "Année", { type: "number", defaultValue: v?.year ?? new Date().getFullYear() })}
        <FormField label="Description" error={e.description} className="md:col-span-2" htmlFor="description">
          <Textarea id="description" name="description" defaultValue={v?.description} rows={4} />
        </FormField>
      </section>

      <section className="grid gap-5 rounded-2xl border bg-card p-6 shadow-soft md:grid-cols-3">
        <h2 className="text-lg font-bold md:col-span-3">Caractéristiques</h2>
        <FormField label="Boîte" htmlFor="transmission">
          <select id="transmission" name="transmission" defaultValue={v?.transmission ?? "MANUAL"} className={nativeSelect}>
            {Object.entries(TRANSMISSION_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </FormField>
        <FormField label="Énergie" htmlFor="fuel">
          <select id="fuel" name="fuel" defaultValue={v?.fuel ?? "PETROL"} className={nativeSelect}>
            {Object.entries(FUEL_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </FormField>
        {text("power", "Puissance (ch)", { type: "number", min: 1 })}
        {text("seats", "Places", { type: "number", min: 1, max: 9 })}
        {text("doors", "Portes", { type: "number", min: 2, max: 5 })}
        {text("luggage", "Bagages", { type: "number", min: 0, max: 12 })}
        {text("consumption", "Consommation")}
        {text("colorName", "Nom de la couleur")}
        {text("color", "Couleur (hex)", { placeholder: "#FF5F00" })}
      </section>

      <section className="grid gap-5 rounded-2xl border bg-card p-6 shadow-soft md:grid-cols-2">
        <h2 className="text-lg font-bold md:col-span-2">Tarifs & visuels</h2>
        {text("pricePerDay", "Prix par jour (€ TTC)", { type: "number", min: 1 })}
        {text("deposit", "Dépôt de garantie (€)", { type: "number", min: 0, defaultValue: v?.deposit ?? 800 })}
        <FormField label="Photos (une URL par ligne)" error={e.images} hint="Chemins /public (ex. /vehicles/ma-voiture.jpg) ou URL https. Laissez vide pour le visuel par défaut." className="md:col-span-2" htmlFor="images">
          <Textarea id="images" name="images" rows={3} defaultValue={v ? parseImages(v.images).join("\n") : ""} placeholder="https://…/photo.jpg" />
        </FormField>
        <div className="flex flex-wrap gap-6 md:col-span-2">
          <Label className="cursor-pointer font-normal"><Checkbox name="active" defaultChecked={v?.active ?? true} /> Visible sur le site</Label>
          <Label className="cursor-pointer font-normal"><Checkbox name="featured" defaultChecked={v?.featured ?? false} /> Mettre en avant (accueil)</Label>
        </div>
      </section>

      {state.error && <p className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive">{state.error}</p>}
      <div className="flex justify-end gap-3">
        <Button asChild variant="ghost"><Link href="/admin/vehicules">Annuler</Link></Button>
        <Button type="submit" disabled={pending}>{pending ? "Enregistrement…" : "Enregistrer"}</Button>
      </div>
    </form>
  );
}
