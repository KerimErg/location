"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { Vehicle } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, selectCls } from "@/components/forms/fields";
import { BODY, FUEL, GEARBOX, STATUS } from "@/lib/labels";
import { saveVehicle, type FormState } from "@/app/actions/admin";

const ym = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;

export function VehicleForm({ vehicle: v }: { vehicle?: Vehicle }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveVehicle.bind(null, v?.id ?? null), {});
  const e = state.fieldErrors ?? {};
  const input = (name: string, label: string, def?: string | number | null, props: React.ComponentProps<"input"> = {}) => (
    <Field label={label} htmlFor={name} error={e[name]}>
      <Input id={name} name={name} defaultValue={def ?? ""} aria-invalid={!!e[name]} {...props} />
    </Field>
  );
  const select = (name: string, label: string, options: Record<string, string>, def: string) => (
    <Field label={label} htmlFor={name}>
      <select id={name} name={name} defaultValue={def} className={selectCls}>
        {Object.entries(options).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
      </select>
    </Field>
  );
  const box = (name: string, label: string, def: boolean) => (
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" name={name} defaultChecked={def} className="size-4 accent-[#ffc300]" /> {label}</label>
  );

  return (
    <form action={action} className="grid gap-6">
      <section className="grid gap-4 border bg-card p-6 md:grid-cols-3">
        <h2 className="text-2xl md:col-span-3">Identification</h2>
        {input("make", "Marque", v?.make, { required: true })}
        {input("model", "Modèle", v?.model, { required: true })}
        {input("version", "Version / finition", v?.version, { required: true })}
        {input("firstRegistration", "1re immatriculation (AAAA-MM)", v ? ym(v.firstRegistration) : "", { placeholder: "2021-05" })}
        {input("mileage", "Kilométrage", v?.mileage, { type: "number", min: 0 })}
        {input("owners", "Propriétaires", v?.owners ?? 1, { type: "number", min: 1 })}
        {input("color", "Couleur", v?.color)}
        {select("body", "Carrosserie", BODY, v?.body ?? "COMPACTE")}
        {select("status", "Statut", STATUS, v?.status ?? "DISPONIBLE")}
      </section>
      <section className="grid gap-4 border bg-card p-6 md:grid-cols-3">
        <h2 className="text-2xl md:col-span-3">Technique</h2>
        {select("fuel", "Carburant", FUEL, v?.fuel ?? "ESSENCE")}
        {select("gearbox", "Boîte", GEARBOX, v?.gearbox ?? "MANUELLE")}
        {input("powerKw", "Puissance (kW)", v?.powerKw, { type: "number", min: 1 })}
        {input("engineCc", "Cylindrée (cm³)", v?.engineCc, { type: "number", min: 0 })}
        {input("euroNorm", "Norme Euro", v?.euroNorm ?? "Euro 6d")}
        {input("co2", "CO₂ (g/km)", v?.co2, { type: "number", min: 0 })}
        {input("doors", "Portes", v?.doors ?? 5, { type: "number", min: 2, max: 5 })}
        {input("seats", "Places", v?.seats ?? 5, { type: "number", min: 1, max: 9 })}
        {input("warrantyMonths", "Garantie (mois)", v?.warrantyMonths ?? 12, { type: "number", min: 0 })}
      </section>
      <section className="grid gap-4 border bg-card p-6 md:grid-cols-3">
        <h2 className="text-2xl md:col-span-3">Prix & annonce</h2>
        {input("price", "Prix TVAC (€)", v?.price, { type: "number", min: 1 })}
        {input("previousPrice", "Ancien prix barré (€)", v?.previousPrice, { type: "number", min: 0 })}
        <div className="flex flex-col justify-end gap-2 pb-2">
          {box("vatDeductible", "TVA déductible", v?.vatDeductible ?? false)}
          {box("carPass", "Car-Pass fourni", v?.carPass ?? true)}
          {box("featured", "Mettre en avant (accueil)", v?.featured ?? false)}
        </div>
        <Field label="Description" htmlFor="description" error={e.description} className="md:col-span-3"><Textarea id="description" name="description" rows={4} defaultValue={v?.description} /></Field>
        <Field label="Équipements (un par ligne)" htmlFor="options" className="md:col-span-3 lg:col-span-1"><Textarea id="options" name="options" rows={8} defaultValue={v?.options.join("\n")} /></Field>
        <Field label="Photos (une URL par ligne, la 1re est la principale)" htmlFor="images" className="md:col-span-3 lg:col-span-2" hint="URL https (Unsplash, hébergement photo…) ou chemin /public.">
          <Textarea id="images" name="images" rows={8} defaultValue={v?.images.join("\n")} className="font-mono text-xs" />
        </Field>
      </section>
      {state.error && <p className="border-l-4 border-destructive bg-card p-3 text-sm font-medium text-destructive">{state.error}</p>}
      <div className="flex justify-end gap-3">
        <Button asChild variant="ghost"><Link href="/admin/vehicules">Annuler</Link></Button>
        <Button type="submit" disabled={pending} className="bg-signal text-signal-foreground">{pending ? "Enregistrement…" : "Enregistrer"}</Button>
      </div>
    </form>
  );
}
