"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { sendContact } from "@/app/actions/leads";
import { Field, Honeypot, Success, selectCls } from "./fields";

export const SUBJECTS: Record<string, string> = {
  "rendez-vous": "Prendre rendez-vous pour une visite",
  recherche: "Recherche d'un véhicule précis",
  vehicule: "Question sur un véhicule",
  autre: "Autre demande",
};

export function ContactForm({ defaultSubject }: { defaultSubject?: string }) {
  const [done, setDone] = useState(false);
  const form = useForm<ContactInput & { website?: string }>({
    resolver: zodResolver(contactSchema),
    defaultValues: { subject: SUBJECTS[defaultSubject ?? ""] ?? SUBJECTS["rendez-vous"], name: "", email: "", phone: "", message: "", consent: undefined as unknown as true },
  });
  const { errors, isSubmitting } = form.formState;

  if (done) return <Success title="Message envoyé">Merci, nous revenons vers vous dans la journée (jours ouvrables).</Success>;

  return (
    <form
      noValidate
      className="relative grid gap-4 sm:grid-cols-2"
      onSubmit={form.handleSubmit(async (data) => {
        const res = await sendContact(data);
        if (res.ok) setDone(true);
        else toast.error(res.error);
      })}
    >
      <Honeypot register={form.register("website")} />
      <Field label="Objet" htmlFor="ct-subject" className="sm:col-span-2">
        <select id="ct-subject" className={selectCls} {...form.register("subject")}>
          {Object.values(SUBJECTS).map((s) => <option key={s}>{s}</option>)}
        </select>
      </Field>
      <Field label="Nom" htmlFor="ct-name" error={errors.name?.message} className="sm:col-span-2"><Input id="ct-name" autoComplete="name" aria-invalid={!!errors.name} {...form.register("name")} /></Field>
      <Field label="Téléphone" htmlFor="ct-phone" error={errors.phone?.message}><Input id="ct-phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} {...form.register("phone")} /></Field>
      <Field label="E-mail" htmlFor="ct-email" error={errors.email?.message}><Input id="ct-email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...form.register("email")} /></Field>
      <Field label="Message" htmlFor="ct-msg" className="sm:col-span-2" hint="Pour un rendez-vous, indiquez le véhicule et vos disponibilités.">
        <Textarea id="ct-msg" rows={5} {...form.register("message")} />
      </Field>
      <div className="sm:col-span-2">
        <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
          <Checkbox className="mt-0.5 rounded-sm" checked={form.watch("consent") === true} onCheckedChange={(c) => form.setValue("consent", (c === true) as true, { shouldValidate: form.formState.isSubmitted })} />
          J&apos;accepte que DGN Cars utilise ces informations pour me répondre.
        </label>
        {errors.consent && <p className="mt-1 text-xs font-medium text-destructive">{errors.consent.message}</p>}
      </div>
      <Button type="submit" size="lg" disabled={isSubmitting} className="justify-self-start bg-signal text-signal-foreground sm:col-span-2">{isSubmitting ? "Envoi…" : "Envoyer"}</Button>
    </form>
  );
}
