"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Building2, Clock, MapPin, Plane, TrainFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DateRangeField } from "./date-range-field";
import { searchSchema, type SearchInput } from "@/lib/validations";
import { TIME_SLOTS, searchToQuery } from "@/lib/dates";
import { cn } from "@/lib/utils";
import { useState } from "react";

export type AgencyOption = { slug: string; name: string; city: string; type: string };

const AgencyIcon = ({ type }: { type: string }) =>
  type === "airport" ? <Plane className="size-4" /> : type === "station" ? <TrainFront className="size-4" /> : <Building2 className="size-4" />;

function AgencySelect({ value, onChange, agencies, placeholder, invalid }: { value: string; onChange: (v: string) => void; agencies: AgencyOption[]; placeholder: string; invalid?: boolean }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger aria-invalid={invalid} className="h-14 [&>span]:flex [&>span]:items-center [&>span]:gap-2">
        <MapPin className="size-5 shrink-0 text-primary" />
        <span className="flex-1 text-left">
          <SelectValue placeholder={placeholder} />
        </span>
      </SelectTrigger>
      <SelectContent>
        {agencies.map((a) => (
          <SelectItem key={a.slug} value={a.slug}>
            <span className="flex items-center gap-2">
              <span className="text-muted-foreground"><AgencyIcon type={a.type} /></span>
              {a.name}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function TimeSelect({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-14" aria-label={label}>
        <Clock className="size-5 shrink-0 text-primary" />
        <span className="flex-1 text-left">
          <span className="block text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">{label}</span>
          <SelectValue />
        </span>
      </SelectTrigger>
      <SelectContent className="max-h-72">
        {TIME_SLOTS.map((t) => (
          <SelectItem key={t} value={t}>{t}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function BookingPanel({
  agencies,
  defaults,
  className,
  submitLabel = "Voir les véhicules",
  action = "/vehicules",
  stacked = false,
  title = "Réservez votre véhicule",
}: {
  agencies: AgencyOption[];
  defaults: SearchInput;
  className?: string;
  submitLabel?: string;
  action?: string;
  /** Mise en page verticale (barre latérale). */
  stacked?: boolean;
  title?: string;
}) {
  const router = useRouter();
  const [differentReturn, setDifferentReturn] = useState(!!defaults.returnAgency && defaults.returnAgency !== defaults.pickupAgency);
  const form = useForm<SearchInput>({ resolver: zodResolver(searchSchema), defaultValues: defaults });
  const v = form.watch();
  const errors = form.formState.errors;

  const onSubmit = form.handleSubmit((data) => {
    router.push(`${action}?${searchToQuery(data)}`);
  });

  const setPickupAgency = (slug: string) => {
    form.setValue("pickupAgency", slug, { shouldValidate: form.formState.isSubmitted });
    if (!differentReturn) form.setValue("returnAgency", slug, { shouldValidate: form.formState.isSubmitted });
  };

  const firstError = errors.pickupAgency?.message || errors.returnAgency?.message || errors.pickupDate?.message || errors.returnDate?.message;

  return (
    <form onSubmit={onSubmit} className={cn("rounded-3xl border bg-background/95 p-4 text-foreground shadow-lift backdrop-blur-xl sm:p-5", className)} noValidate>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
        <p className="font-display text-sm font-semibold">{title}</p>
        <Label className="cursor-pointer text-xs font-medium text-muted-foreground">
          <Switch
            checked={differentReturn}
            onCheckedChange={(c) => {
              setDifferentReturn(c);
              if (!c) form.setValue("returnAgency", v.pickupAgency);
            }}
          />
          Retour dans une autre agence
        </Label>
      </div>
      <div className={cn("grid gap-3", stacked ? "" : differentReturn ? "lg:grid-cols-[1fr_1fr_1.3fr_0.7fr_0.7fr_auto]" : "lg:grid-cols-[1.3fr_1.3fr_0.7fr_0.7fr_auto]")}>
        <AgencySelect value={v.pickupAgency} onChange={setPickupAgency} agencies={agencies} placeholder="Agence de départ" invalid={!!errors.pickupAgency} />
        {differentReturn && (
          <AgencySelect
            value={v.returnAgency}
            onChange={(s) => form.setValue("returnAgency", s, { shouldValidate: form.formState.isSubmitted })}
            agencies={agencies}
            placeholder="Agence de retour"
            invalid={!!errors.returnAgency}
          />
        )}
        <DateRangeField
          from={v.pickupDate}
          to={v.returnDate}
          invalid={!!errors.pickupDate || !!errors.returnDate}
          onChange={(f, t) => {
            form.setValue("pickupDate", f, { shouldValidate: form.formState.isSubmitted });
            form.setValue("returnDate", t, { shouldValidate: form.formState.isSubmitted });
          }}
        />
        <div className={cn("grid grid-cols-2 gap-3", !stacked && "lg:contents")}>
          <TimeSelect label="Prise" value={v.pickupTime} onChange={(t) => form.setValue("pickupTime", t, { shouldValidate: form.formState.isSubmitted })} />
          <TimeSelect label="Retour" value={v.returnTime} onChange={(t) => form.setValue("returnTime", t, { shouldValidate: form.formState.isSubmitted })} />
        </div>
        <Button type="submit" size="lg" className="h-14 rounded-xl px-6">
          {submitLabel} <ArrowRight />
        </Button>
      </div>
      {firstError && <p className="mt-3 px-1 text-sm font-medium text-destructive">{firstError}</p>}
    </form>
  );
}
