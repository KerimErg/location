"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  Armchair, ArrowLeft, ArrowRight, Baby, Check, CreditCard, Lock, Minus, Navigation, Plus, ShieldCheck, Snowflake, UserPlus, Wifi, type LucideIcon,
} from "lucide-react";
import type { Category, Protection } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { VehicleVisual } from "@/components/vehicles/vehicle-visual";
import { CATEGORY_LABEL, PROTECTIONS } from "@/lib/constants";
import { quote, durationDiscountRate, type ExtraLine } from "@/lib/pricing";
import { eur, fmtDateTime, parseImages } from "@/lib/format";
import { driverSchema, type DriverInput } from "@/lib/validations";
import { createReservation } from "@/app/actions/reservation";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = { Navigation, UserPlus, Baby, Armchair, Snowflake, Wifi };
const STEPS = ["Protection", "Options", "Conducteur", "Paiement"];

type Agency = { id: string; name: string; address: string; type: string };
type Extra = Omit<ExtraLine, "quantity"> & { description: string; icon: string };

function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="mt-1.5 text-xs font-medium text-destructive">{msg}</p> : null;
}

export function ReservationWizard(props: {
  vehicle: { id: string; slug: string; name: string; category: Category; pricePerDay: number; images: string; color: string; deposit: number };
  pickup: Agency;
  ret: Agency;
  pickupAt: string;
  returnAt: string;
  backHref: string;
  extras: Extra[];
  prefill?: Partial<DriverInput>;
  loggedIn: boolean;
}) {
  const { vehicle, pickup, ret, extras } = props;
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [protection, setProtection] = useState<Protection>("PLUS");
  const [qty, setQty] = useState<Record<string, number>>({});
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });
  const [cardError, setCardError] = useState<string>();
  const [pending, start] = useTransition();

  const form = useForm<DriverInput>({
    resolver: zodResolver(driverSchema),
    defaultValues: { firstName: "", lastName: "", email: "", phone: "", birthDate: "", licenseNumber: "", flightNumber: "", notes: "", ...props.prefill, acceptTerms: undefined as unknown as true },
  });
  const errors = form.formState.errors;

  const pickupAt = useMemo(() => new Date(props.pickupAt), [props.pickupAt]);
  const returnAt = useMemo(() => new Date(props.returnAt), [props.returnAt]);
  const q = quote({
    pricePerDay: vehicle.pricePerDay,
    pickupAt,
    returnAt,
    protection,
    extras: extras.map((e) => ({ ...e, quantity: qty[e.id] ?? 0 })),
    oneWay: pickup.id !== ret.id,
  });

  const next = async () => {
    if (step === 2 && !(await form.trigger())) return;
    setStep((s) => Math.min(s + 1, 3));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pay = () => {
    const digits = card.number.replace(/\s/g, "");
    if (!/^\d{16}$/.test(digits)) return setCardError("Numéro de carte invalide (16 chiffres).");
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.expiry)) return setCardError("Date d'expiration invalide (MM/AA).");
    if (!/^\d{3,4}$/.test(card.cvc)) return setCardError("Cryptogramme invalide.");
    if (card.name.trim().length < 3) return setCardError("Indiquez le nom du titulaire.");
    setCardError(undefined);
    start(async () => {
      const d = form.getValues();
      const res = await createReservation({
        ...d,
        vehicleId: vehicle.id,
        pickupAgencyId: pickup.id,
        returnAgencyId: ret.id,
        pickupAt: props.pickupAt,
        returnAt: props.returnAt,
        protection,
        extras: Object.entries(qty).filter(([, n]) => n > 0).map(([id, quantity]) => ({ id, quantity })),
      });
      if (res.ok) {
        toast.success("Réservation confirmée !");
        router.push(`/reservation/confirmation/${res.reference}`);
      } else toast.error(res.error);
    });
  };

  return (
    <div className="bg-surface pt-20 pb-24 md:pt-24">
      <div className="container-page">
        <Link href={props.backHref} className="inline-flex items-center gap-2 py-4 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Retour au véhicule
        </Link>

        {/* Stepper */}
        <ol className="mb-8 flex items-center gap-2 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <li key={s} className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                disabled={i > step}
                onClick={() => setStep(i)}
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition",
                  i === step ? "bg-foreground text-background" : i < step ? "text-foreground hover:bg-muted" : "text-muted-foreground",
                )}
              >
                <span className={cn("flex size-6 items-center justify-center rounded-full text-xs", i < step ? "bg-primary text-white" : i === step ? "bg-background text-foreground" : "bg-muted")}>
                  {i < step ? <Check className="size-3.5" /> : i + 1}
                </span>
                {s}
              </button>
              {i < STEPS.length - 1 && <span className="h-px w-6 bg-border" />}
            </li>
          ))}
        </ol>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                {step === 0 && (
                  <section>
                    <h1 className="text-3xl font-bold">Choisissez votre protection</h1>
                    <p className="mt-2 text-muted-foreground">Roulez l&apos;esprit tranquille. Vous pourrez toujours la modifier au comptoir.</p>
                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                      {PROTECTIONS.map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => setProtection(p.value)}
                          className={cn(
                            "relative flex flex-col rounded-3xl border-2 bg-card p-6 text-left transition hover:shadow-lift",
                            protection === p.value ? "border-primary shadow-lift" : "border-transparent shadow-soft",
                          )}
                        >
                          {p.recommended && <Badge className="absolute -top-3 left-6">Recommandée</Badge>}
                          <ShieldCheck className={cn("size-8", protection === p.value ? "text-primary" : "text-muted-foreground")} />
                          <p className="mt-4 font-display text-xl font-bold">{p.label}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{p.pricePerDay ? `+ ${eur(p.pricePerDay)} /jour` : "Incluse"}</p>
                          <ul className="mt-5 space-y-2 text-sm">
                            {p.perks.map((perk) => (
                              <li key={perk} className="flex items-start gap-2"><Check className="mt-0.5 size-4 shrink-0 text-primary" /> {perk}</li>
                            ))}
                          </ul>
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                {step === 1 && (
                  <section>
                    <h1 className="text-3xl font-bold">Ajoutez des options</h1>
                    <p className="mt-2 text-muted-foreground">Tout ce qu&apos;il faut pour un voyage confortable, prêt au départ.</p>
                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      {extras.map((e) => {
                        const Icon = ICONS[e.icon] ?? Plus;
                        const n = qty[e.id] ?? 0;
                        const max = e.code === "BABY" || e.code === "BOOSTER" ? 3 : 1;
                        return (
                          <div key={e.id} className={cn("flex items-center gap-4 rounded-2xl border-2 bg-card p-5 transition", n > 0 ? "border-primary" : "border-transparent shadow-soft")}>
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><Icon className="size-5" /></span>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold">{e.name}</p>
                              <p className="text-xs text-muted-foreground">{e.description}</p>
                              <p className="mt-1 text-sm font-medium">{eur(e.price)}{e.pricing === "PER_DAY" ? " /jour" : " /location"}</p>
                            </div>
                            {max === 1 ? (
                              <Checkbox checked={n > 0} onCheckedChange={(c) => setQty((s) => ({ ...s, [e.id]: c ? 1 : 0 }))} aria-label={e.name} className="size-6" />
                            ) : (
                              <div className="flex items-center gap-2">
                                <Button type="button" size="icon" variant="outline" className="size-8" disabled={n === 0} onClick={() => setQty((s) => ({ ...s, [e.id]: n - 1 }))} aria-label="Retirer"><Minus /></Button>
                                <span className="w-4 text-center text-sm font-semibold">{n}</span>
                                <Button type="button" size="icon" variant="outline" className="size-8" disabled={n >= max} onClick={() => setQty((s) => ({ ...s, [e.id]: n + 1 }))} aria-label="Ajouter"><Plus /></Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {step === 2 && (
                  <section>
                    <h1 className="text-3xl font-bold">Conducteur principal</h1>
                    <p className="mt-2 text-muted-foreground">
                      {props.loggedIn ? "Vos informations ont été pré-remplies." : (<>Déjà client ? <Link className="text-primary underline" href={`/connexion?callbackUrl=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname + window.location.search : "/")}`}>Connectez-vous</Link> pour aller plus vite.</>)}
                    </p>
                    <form className="mt-8 grid gap-5 rounded-3xl bg-card p-6 shadow-soft sm:grid-cols-2 md:p-8" onSubmit={(e) => { e.preventDefault(); next(); }} noValidate>
                      {([
                        ["firstName", "Prénom", "text", "given-name"],
                        ["lastName", "Nom", "text", "family-name"],
                        ["email", "E-mail", "email", "email"],
                        ["phone", "Téléphone", "tel", "tel"],
                        ["birthDate", "Date de naissance", "date", "bday"],
                        ["licenseNumber", "N° de permis de conduire", "text", "off"],
                      ] as const).map(([name, label, type, ac]) => (
                        <div key={name}>
                          <Label htmlFor={name} className="mb-2">{label}</Label>
                          <Input id={name} type={type} autoComplete={ac} aria-invalid={!!errors[name]} {...form.register(name)} />
                          <FieldError msg={errors[name]?.message} />
                        </div>
                      ))}
                      {pickup.type === "airport" && (
                        <div>
                          <Label htmlFor="flightNumber" className="mb-2">N° de vol (optionnel)</Label>
                          <Input id="flightNumber" placeholder="AF1234" {...form.register("flightNumber")} />
                          <p className="mt-1.5 text-xs text-muted-foreground">Nous vous attendons même en cas de retard.</p>
                        </div>
                      )}
                      <div className="sm:col-span-2">
                        <Label htmlFor="notes" className="mb-2">Remarques (optionnel)</Label>
                        <Textarea id="notes" placeholder="Une demande particulière ?" {...form.register("notes")} />
                      </div>
                      <div className="sm:col-span-2">
                        <Label className="cursor-pointer items-start font-normal leading-relaxed">
                          <Checkbox
                            className="mt-0.5"
                            checked={form.watch("acceptTerms") === true}
                            onCheckedChange={(c) => form.setValue("acceptTerms", (c === true) as true, { shouldValidate: form.formState.isSubmitted })}
                            aria-invalid={!!errors.acceptTerms}
                          />
                          <span>J&apos;accepte les <Link href="/legal/cgv" target="_blank" className="text-primary underline">conditions générales de location</Link> et la <Link href="/legal/confidentialite" target="_blank" className="text-primary underline">politique de confidentialité</Link>.</span>
                        </Label>
                        <FieldError msg={errors.acceptTerms?.message} />
                      </div>
                      <button type="submit" className="hidden" />
                    </form>
                  </section>
                )}

                {step === 3 && (
                  <section>
                    <h1 className="text-3xl font-bold">Paiement sécurisé</h1>
                    <p className="mt-2 text-muted-foreground">Vous serez débité de {eur(q.total)}. Une empreinte de {eur(vehicle.deposit)} sera réalisée au comptoir.</p>
                    <div className="mt-8 rounded-3xl bg-card p-6 shadow-soft md:p-8">
                      <div className="mb-6 flex items-center justify-between rounded-2xl bg-ink p-5 text-white">
                        <CreditCard className="size-7 text-primary" />
                        <p className="font-mono tracking-widest">{card.number || "•••• •••• •••• ••••"}</p>
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <Label htmlFor="cc" className="mb-2">Numéro de carte</Label>
                          <Input id="cc" inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" value={card.number}
                            onChange={(e) => setCard({ ...card, number: e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim() })} />
                        </div>
                        <div>
                          <Label htmlFor="exp" className="mb-2">Expiration</Label>
                          <Input id="exp" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" value={card.expiry}
                            onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 4); setCard({ ...card, expiry: v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v }); }} />
                        </div>
                        <div>
                          <Label htmlFor="cvc" className="mb-2">Cryptogramme</Label>
                          <Input id="cvc" inputMode="numeric" autoComplete="cc-csc" placeholder="123" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })} />
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor="ccname" className="mb-2">Titulaire de la carte</Label>
                          <Input id="ccname" autoComplete="cc-name" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
                        </div>
                      </div>
                      {cardError && <p className="mt-4 text-sm font-medium text-destructive">{cardError}</p>}
                      <p className="mt-6 flex items-center gap-2 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
                        <Lock className="size-4 shrink-0" /> Démo : paiement simulé, aucune donnée bancaire n&apos;est transmise ni enregistrée. Branchez Stripe en production.
                      </p>
                    </div>
                  </section>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between gap-3">
              <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                <ArrowLeft /> Précédent
              </Button>
              {step < 3 ? (
                <Button size="lg" onClick={next}>Continuer <ArrowRight /></Button>
              ) : (
                <Button size="lg" onClick={pay} disabled={pending}>{pending ? "Paiement en cours…" : `Payer ${eur(q.total)}`} <Lock /></Button>
              )}
            </div>
          </div>

          {/* Récapitulatif */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-3xl border bg-card shadow-soft">
              <VehicleVisual src={parseImages(vehicle.images)[0]} alt={vehicle.name} color={vehicle.color} category={vehicle.category} sizes="380px" className="aspect-[16/9]" />
              <div className="p-6">
                <p className="text-xs text-muted-foreground">{CATEGORY_LABEL[vehicle.category]}</p>
                <p className="font-display text-xl font-bold">{vehicle.name}</p>
                <div className="mt-5 space-y-4 border-t pt-5 text-sm">
                  <div>
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Départ</p>
                    <p className="font-medium">{fmtDateTime(pickupAt)}</p>
                    <p className="text-muted-foreground">{pickup.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Retour</p>
                    <p className="font-medium">{fmtDateTime(returnAt)}</p>
                    <p className="text-muted-foreground">{ret.name}</p>
                  </div>
                </div>
                <dl className="mt-5 space-y-2 border-t pt-5 text-sm">
                  <div className="flex justify-between"><dt className="text-muted-foreground">Location · {q.days} j</dt><dd>{eur(q.basePrice)}</dd></div>
                  {q.discount > 0 && <div className="flex justify-between text-emerald-600 dark:text-emerald-400"><dt>Remise durée (-{Math.round(durationDiscountRate(q.days) * 100)} %)</dt><dd>-{eur(q.discount)}</dd></div>}
                  <div className="flex justify-between"><dt className="text-muted-foreground">Protection {PROTECTIONS.find((p) => p.value === protection)?.label}</dt><dd>{q.protectionPrice ? eur(q.protectionPrice) : "Incluse"}</dd></div>
                  {q.extrasLines.map((e) => (
                    <div key={e.id} className="flex justify-between"><dt className="text-muted-foreground">{e.name}{e.quantity > 1 ? ` ×${e.quantity}` : ""}</dt><dd>{eur(e.total)}</dd></div>
                  ))}
                  {q.oneWayFee > 0 && <div className="flex justify-between"><dt className="text-muted-foreground">Forfait aller simple</dt><dd>{eur(q.oneWayFee)}</dd></div>}
                </dl>
                <div className="mt-5 flex items-baseline justify-between border-t pt-5">
                  <p className="font-semibold">Total TTC</p>
                  <p className="font-display text-3xl font-bold">{eur(q.total)}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
