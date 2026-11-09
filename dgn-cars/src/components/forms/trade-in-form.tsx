"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { tradeInSchema, type TradeInInput } from "@/lib/validations";
import { requestTradeIn } from "@/app/actions/leads";
import { Field, Honeypot, Success, selectCls } from "./fields";

const CONDITIONS = [
  ["excellent", "Excellent — aucun défaut"],
  ["bon", "Bon — petites traces d'usage"],
  ["moyen", "Moyen — carrosserie ou intérieur à rafraîchir"],
  ["a-reparer", "À réparer — panne ou dégâts"],
] as const;

export function TradeInForm() {
  const [done, setDone] = useState(false);
  const form = useForm<TradeInInput & { website?: string }>({
    resolver: zodResolver(tradeInSchema),
    defaultValues: { plate: "", make: "", model: "", year: "", mileage: "", fuel: "", condition: "bon", name: "", email: "", phone: "", message: "", consent: undefined as unknown as true },
  });
  const { errors, isSubmitting } = form.formState;

  if (done)
    return (
      <Success title="Demande reçue">
        Merci. Nous étudions votre véhicule et revenons vers vous avec une première estimation sous 24 h ouvrables. L&apos;offre définitive est confirmée après inspection sur place.
      </Success>
    );

  return (
    <form
      noValidate
      className="relative grid gap-8"
      onSubmit={form.handleSubmit(async (data) => {
        const res = await requestTradeIn(data);
        if (res.ok) setDone(true);
        else toast.error(res.error);
      })}
    >
      <Honeypot register={form.register("website")} />
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="mb-4 font-display text-2xl font-bold uppercase">1 · Votre véhicule</legend>
        <Field label="Plaque d'immatriculation" htmlFor="ti-plate" error={errors.plate?.message} className="sm:col-span-2">
          <Input id="ti-plate" placeholder="1-ABC-123" className="h-14 max-w-xs border-2 font-mono text-xl tracking-[0.2em] uppercase" aria-invalid={!!errors.plate} {...form.register("plate")} />
        </Field>
        <Field label="Marque" htmlFor="ti-make" error={errors.make?.message}><Input id="ti-make" aria-invalid={!!errors.make} {...form.register("make")} /></Field>
        <Field label="Modèle" htmlFor="ti-model" error={errors.model?.message}><Input id="ti-model" aria-invalid={!!errors.model} {...form.register("model")} /></Field>
        <Field label="Année" htmlFor="ti-year" error={errors.year?.message}><Input id="ti-year" inputMode="numeric" placeholder="2017" aria-invalid={!!errors.year} {...form.register("year")} /></Field>
        <Field label="Kilométrage" htmlFor="ti-km" error={errors.mileage?.message}><Input id="ti-km" inputMode="numeric" placeholder="120000" aria-invalid={!!errors.mileage} {...form.register("mileage")} /></Field>
        <Field label="Carburant" htmlFor="ti-fuel" error={errors.fuel?.message}>
          <select id="ti-fuel" className={selectCls} aria-invalid={!!errors.fuel} {...form.register("fuel")}>
            <option value="">Choisir…</option>
            {["Essence", "Diesel", "Hybride", "Électrique", "LPG"].map((f) => <option key={f}>{f}</option>)}
          </select>
        </Field>
        <Field label="État général" htmlFor="ti-cond">
          <select id="ti-cond" className={selectCls} {...form.register("condition")}>
            {CONDITIONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </Field>
        <Field label="Précisions (entretien, options, défauts)" htmlFor="ti-msg" className="sm:col-span-2"><Textarea id="ti-msg" rows={3} {...form.register("message")} /></Field>
      </fieldset>
      <fieldset className="grid gap-4 sm:grid-cols-3">
        <legend className="mb-4 font-display text-2xl font-bold uppercase">2 · Vos coordonnées</legend>
        <Field label="Nom" htmlFor="ti-name" error={errors.name?.message}><Input id="ti-name" autoComplete="name" aria-invalid={!!errors.name} {...form.register("name")} /></Field>
        <Field label="Téléphone" htmlFor="ti-phone" error={errors.phone?.message}><Input id="ti-phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} {...form.register("phone")} /></Field>
        <Field label="E-mail" htmlFor="ti-email" error={errors.email?.message}><Input id="ti-email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...form.register("email")} /></Field>
      </fieldset>
      <div>
        <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
          <Checkbox className="mt-0.5 rounded-sm" checked={form.watch("consent") === true} onCheckedChange={(c) => form.setValue("consent", (c === true) as true, { shouldValidate: form.formState.isSubmitted })} aria-invalid={!!errors.consent} />
          J&apos;accepte que DGN Cars me recontacte pour l&apos;estimation de mon véhicule.
        </label>
        {errors.consent && <p className="mt-1 text-xs font-medium text-destructive">{errors.consent.message}</p>}
      </div>
      <Button type="submit" size="lg" disabled={isSubmitting} className="justify-self-start bg-signal text-signal-foreground">{isSubmitting ? "Envoi…" : "Recevoir mon estimation"}</Button>
    </form>
  );
}
