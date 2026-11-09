"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { testDriveSchema, type TestDriveInput } from "@/lib/validations";
import { requestTestDrive } from "@/app/actions/leads";
import { Field, Honeypot, Success, selectCls } from "./fields";

function minDate() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export function TestDriveForm({ vehicleId, vehicleName }: { vehicleId: string; vehicleName: string }) {
  const [done, setDone] = useState(false);
  const form = useForm<TestDriveInput & { website?: string }>({
    resolver: zodResolver(testDriveSchema),
    defaultValues: { vehicleId, name: "", email: "", phone: "", preferredDate: "", preferredSlot: "matin", message: "", consent: undefined as unknown as true },
  });
  const { errors, isSubmitting } = form.formState;

  if (done)
    return (
      <Success title="Demande envoyée">
        Merci ! Nous vous rappelons rapidement pour confirmer votre créneau d&apos;essai de la {vehicleName}.
      </Success>
    );

  return (
    <form
      noValidate
      className="relative grid gap-4"
      onSubmit={form.handleSubmit(async (data) => {
        const res = await requestTestDrive(data);
        if (res.ok) setDone(true);
        else toast.error(res.error);
      })}
    >
      <Honeypot register={form.register("website")} />
      <Field label="Nom" htmlFor="td-name" error={errors.name?.message}>
        <Input id="td-name" autoComplete="name" aria-invalid={!!errors.name} {...form.register("name")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Téléphone" htmlFor="td-phone" error={errors.phone?.message}>
          <Input id="td-phone" type="tel" autoComplete="tel" placeholder="+32 4.." aria-invalid={!!errors.phone} {...form.register("phone")} />
        </Field>
        <Field label="E-mail" htmlFor="td-email" error={errors.email?.message}>
          <Input id="td-email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...form.register("email")} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Date souhaitée" htmlFor="td-date" error={errors.preferredDate?.message}>
          <Input id="td-date" type="date" min={minDate()} aria-invalid={!!errors.preferredDate} {...form.register("preferredDate")} />
        </Field>
        <Field label="Moment" htmlFor="td-slot">
          <select id="td-slot" className={selectCls} {...form.register("preferredSlot")}>
            <option value="matin">Matin</option>
            <option value="apres-midi">Après-midi</option>
            <option value="soir">Fin de journée</option>
          </select>
        </Field>
      </div>
      <Field label="Message (optionnel)" htmlFor="td-msg">
        <Textarea id="td-msg" rows={3} placeholder="Reprise éventuelle, questions…" {...form.register("message")} />
      </Field>
      <label className="flex items-start gap-2.5 text-xs text-muted-foreground">
        <Checkbox className="mt-0.5 rounded-sm" checked={form.watch("consent") === true} onCheckedChange={(c) => form.setValue("consent", (c === true) as true, { shouldValidate: form.formState.isSubmitted })} aria-invalid={!!errors.consent} />
        J&apos;accepte que DGN Cars me recontacte au sujet de cette demande.
      </label>
      {errors.consent && <p className="-mt-2 text-xs font-medium text-destructive">{errors.consent.message}</p>}
      <Button type="submit" size="lg" disabled={isSubmitting} className="bg-signal text-signal-foreground">{isSubmitting ? "Envoi…" : "Demander un essai"}</Button>
    </form>
  );
}
