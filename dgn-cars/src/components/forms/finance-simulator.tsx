"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { DEFAULT_RATE, DURATIONS, monthlyPayment } from "@/lib/finance";
import { eur } from "@/lib/format";
import { financeSchema, type FinanceInput } from "@/lib/validations";
import { requestFinance } from "@/app/actions/leads";
import { cn } from "@/lib/utils";
import { Field, Honeypot, Success } from "./fields";

export function FinanceSimulator({ initialPrice, vehicleId, vehicleName }: { initialPrice: number; vehicleId?: string; vehicleName?: string }) {
  const [price, setPrice] = useState(initialPrice);
  const [deposit, setDeposit] = useState(Math.round((initialPrice * 0.2) / 500) * 500);
  const [months, setMonths] = useState(60);
  const [done, setDone] = useState(false);
  const principal = Math.max(0, price - deposit);
  const monthly = useMemo(() => monthlyPayment(principal, DEFAULT_RATE, months), [principal, months]);
  const totalCost = monthly * months;

  const form = useForm<FinanceInput & { website?: string }>({
    resolver: zodResolver(financeSchema),
    defaultValues: { name: "", email: "", phone: "", message: "", vehicleId, amount: principal, deposit, months, consent: undefined as unknown as true },
  });
  const { errors, isSubmitting } = form.formState;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div className="border bg-card p-6 md:p-8">
        {vehicleName && <p className="eyebrow mb-4">Véhicule : {vehicleName}</p>}
        <div className="grid gap-8">
          <div>
            <div className="flex items-baseline justify-between"><span className="eyebrow">Prix du véhicule</span><span className="font-mono text-lg">{eur(price)}</span></div>
            <Slider className="mt-4" min={3000} max={60000} step={500} value={[price]} onValueChange={([v]) => { setPrice(v); if (deposit > v) setDeposit(v); }} />
          </div>
          <div>
            <div className="flex items-baseline justify-between"><span className="eyebrow">Acompte</span><span className="font-mono text-lg">{eur(deposit)}</span></div>
            <Slider className="mt-4" min={0} max={price} step={250} value={[deposit]} onValueChange={([v]) => setDeposit(v)} />
          </div>
          <div>
            <span className="eyebrow">Durée</span>
            <div className="mt-3 grid grid-cols-5 border">
              {DURATIONS.map((d) => (
                <button key={d} type="button" onClick={() => setMonths(d)} className={cn("py-3 font-mono text-sm", months === d ? "bg-foreground text-background" : "hover:bg-muted")}>{d} m</button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6">
          <p className="eyebrow">Mensualité estimée</p>
          <p className="mt-1 font-display text-6xl font-bold">{eur(Math.round(monthly))}<span className="text-2xl text-muted-foreground"> /mois</span></p>
          <dl className="mt-4 grid grid-cols-2 gap-y-1 font-mono text-xs">
            <dt className="text-muted-foreground">Montant financé</dt><dd className="text-right">{eur(principal)}</dd>
            <dt className="text-muted-foreground">TAEG (exemple)</dt><dd className="text-right">{DEFAULT_RATE.toLocaleString("fr-BE")} %</dd>
            <dt className="text-muted-foreground">Montant total dû</dt><dd className="text-right">{eur(Math.round(totalCost))}</dd>
          </dl>
          <p className="mt-5 border-l-4 border-signal pl-3 text-sm font-semibold">Attention, emprunter de l&apos;argent coûte aussi de l&apos;argent.</p>
          <p className="mt-2 text-xs text-muted-foreground">Simulation indicative à titre d&apos;exemple, sans valeur d&apos;offre. Prêt à tempérament sous réserve d&apos;acceptation du dossier par le prêteur partenaire. Taux et conditions à confirmer.</p>
        </div>
      </div>

      <div>
        {done ? (
          <Success title="Demande envoyée">Nous préparons votre dossier de financement et vous recontactons rapidement.</Success>
        ) : (
          <form
            noValidate
            className="relative grid gap-4"
            onSubmit={(e) => {
              form.setValue("amount", principal);
              form.setValue("deposit", deposit);
              form.setValue("months", months);
              form.handleSubmit(async (data) => {
                const res = await requestFinance(data);
                if (res.ok) setDone(true);
                else toast.error(res.error);
              })(e);
            }}
          >
            <p className="font-display text-3xl font-bold uppercase">Être rappelé pour ce financement</p>
            <Honeypot register={form.register("website")} />
            <Field label="Nom" htmlFor="fi-name" error={errors.name?.message}><Input id="fi-name" autoComplete="name" aria-invalid={!!errors.name} {...form.register("name")} /></Field>
            <Field label="Téléphone" htmlFor="fi-phone" error={errors.phone?.message}><Input id="fi-phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} {...form.register("phone")} /></Field>
            <Field label="E-mail" htmlFor="fi-email" error={errors.email?.message}><Input id="fi-email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...form.register("email")} /></Field>
            <label className="flex items-start gap-2.5 text-xs text-muted-foreground">
              <Checkbox className="mt-0.5 rounded-sm" checked={form.watch("consent") === true} onCheckedChange={(c) => form.setValue("consent", (c === true) as true, { shouldValidate: form.formState.isSubmitted })} />
              J&apos;accepte d&apos;être recontacté au sujet de cette demande de financement.
            </label>
            {errors.consent && <p className="-mt-2 text-xs font-medium text-destructive">{errors.consent.message}</p>}
            <Button type="submit" size="lg" disabled={isSubmitting} className="bg-signal text-signal-foreground">{isSubmitting ? "Envoi…" : "Envoyer ma demande"}</Button>
          </form>
        )}
      </div>
    </div>
  );
}
