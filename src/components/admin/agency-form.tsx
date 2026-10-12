"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { Agency } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveAgency, type FormState } from "@/app/actions/admin";
import { FormField, nativeSelect } from "./form-field";

export function AgencyForm({ agency }: { agency?: Agency }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveAgency.bind(null, agency?.id ?? null), {});
  const e = state.fieldErrors ?? {};
  const field = (name: keyof Agency, label: string, props: React.ComponentProps<"input"> = {}) => (
    <FormField label={label} error={e[name]} htmlFor={name}>
      <Input id={name} name={name} defaultValue={agency ? String(agency[name]) : undefined} aria-invalid={!!e[name]} {...props} />
    </FormField>
  );
  return (
    <form action={action} className="grid gap-6">
      <section className="grid gap-5 rounded-2xl border bg-card p-6 shadow-soft md:grid-cols-2">
        {field("name", "Nom de l'agence", { required: true })}
        {field("slug", "Slug (URL)", { required: true })}
        {field("address", "Adresse", { required: true })}
        <div className="grid grid-cols-[1fr_2fr] gap-3">
          {field("postalCode", "Code postal")}
          {field("city", "Ville")}
        </div>
        {field("latitude", "Latitude", { type: "number", step: "any" })}
        {field("longitude", "Longitude", { type: "number", step: "any" })}
        {field("phone", "Téléphone")}
        {field("hours", "Horaires", { placeholder: "Lun–Sam · 8h00–19h00" })}
        <FormField label="Type" htmlFor="type">
          <select id="type" name="type" defaultValue={agency?.type ?? "city"} className={nativeSelect}>
            <option value="city">Centre-ville</option>
            <option value="station">Gare</option>
            <option value="airport">Aéroport</option>
          </select>
        </FormField>
      </section>
      {state.error && <p className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive">{state.error}</p>}
      <div className="flex justify-end gap-3">
        <Button asChild variant="ghost"><Link href="/admin/agences">Annuler</Link></Button>
        <Button type="submit" disabled={pending}>{pending ? "Enregistrement…" : "Enregistrer"}</Button>
      </div>
    </form>
  );
}
