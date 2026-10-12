import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, MapPin, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PROTECTIONS } from "@/lib/constants";
import { eur, fmtDateTime } from "@/lib/format";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Réservation confirmée", robots: { index: false } };

export default async function ConfirmationPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  const r = await prisma.reservation.findUnique({
    where: { reference },
    include: { vehicle: true, pickupAgency: true, returnAgency: true, extras: { include: { extra: true } } },
  });
  if (!r) notFound();

  return (
    <div className="bg-surface pt-28 pb-24">
      <div className="container-page max-w-3xl">
        <div className="text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_40px_-10px_rgb(255_95_0/0.7)]">
            <CheckCircle2 className="size-8" />
          </span>
          <h1 className="mt-6 text-3xl font-bold md:text-5xl">C&apos;est réservé, {r.firstName} !</h1>
          <p className="mt-3 text-muted-foreground">Un e-mail de confirmation a été envoyé à <strong className="text-foreground">{r.email}</strong>.</p>
          <p className="mt-6 inline-flex rounded-full bg-background px-5 py-2 font-mono text-lg font-semibold shadow-soft">{r.reference}</p>
        </div>

        <div className="mt-10 overflow-hidden rounded-3xl border bg-card shadow-soft">
          <div className="flex items-center justify-between gap-4 border-b p-6">
            <div>
              <p className="text-xs text-muted-foreground">Votre véhicule</p>
              <p className="font-display text-2xl font-bold">{r.vehicle.name}</p>
            </div>
            <p className="font-display text-2xl font-bold">{eur(r.total)}</p>
          </div>
          <div className="grid gap-6 p-6 sm:grid-cols-2">
            {[
              { t: "Départ", d: r.pickupAt, a: r.pickupAgency },
              { t: "Retour", d: r.returnAt, a: r.returnAgency },
            ].map(({ t, d, a }) => (
              <div key={t} className="space-y-2 text-sm">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{t}</p>
                <p className="flex items-center gap-2 font-medium"><Clock className="size-4 text-primary" /> {fmtDateTime(d)}</p>
                <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-primary" /> <span>{a.name}<br /><span className="text-muted-foreground">{a.address}, {a.postalCode} {a.city}</span></span></p>
                <p className="flex items-center gap-2 text-muted-foreground"><Phone className="size-4" /> {a.phone}</p>
              </div>
            ))}
          </div>
          <div className="border-t p-6 text-sm">
            <p><span className="text-muted-foreground">Protection :</span> {PROTECTIONS.find((p) => p.value === r.protection)?.label}</p>
            {r.extras.length > 0 && <p className="mt-1"><span className="text-muted-foreground">Options :</span> {r.extras.map((e) => e.extra.name + (e.quantity > 1 ? ` ×${e.quantity}` : "")).join(", ")}</p>}
          </div>
          <div className="bg-accent/50 p-6 text-sm">
            <p className="font-semibold">À présenter au comptoir</p>
            <p className="mt-1 text-muted-foreground">Permis de conduire, pièce d&apos;identité et carte bancaire au nom du conducteur ({eur(r.vehicle.deposit)} de dépôt de garantie).</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg"><Link href="/compte">Gérer ma réservation</Link></Button>
          <Button asChild size="lg" variant="outline"><Link href="/">Retour à l&apos;accueil</Link></Button>
        </div>
      </div>
    </div>
  );
}
