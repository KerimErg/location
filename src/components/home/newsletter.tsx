"use client";

import { useActionState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { subscribeNewsletter, type NewsletterState } from "@/app/actions/newsletter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [state, action, pending] = useActionState<NewsletterState, FormData>(subscribeNewsletter, {});
  return (
    <section className="container-page py-20 md:py-28">
      <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-14 text-white md:px-16 md:py-20">
        <div className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-10 size-80 rounded-full bg-black/20 blur-3xl" />
        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold md:text-5xl">-10 % sur votre première location</h2>
            <p className="mt-4 max-w-md text-white/85">Inscrivez-vous à la newsletter et recevez nos offres privées, nouveautés de la flotte et idées d&apos;escapades.</p>
          </div>
          {state.ok ? (
            <p className="flex items-center gap-3 rounded-2xl bg-white/15 p-5 font-medium backdrop-blur"><CheckCircle2 className="size-6 shrink-0" /> {state.message}</p>
          ) : (
            <form action={action} className="space-y-2">
              <div className="flex flex-col gap-2 rounded-2xl bg-white p-2 sm:flex-row">
                <Input name="email" type="email" required placeholder="votre@email.fr" aria-label="Adresse e-mail" className="h-12 border-0 text-foreground shadow-none focus-visible:ring-0" />
                <Button type="submit" variant="dark" size="lg" disabled={pending} className="h-12 rounded-xl">
                  {pending ? "Inscription…" : "Je m'inscris"} <ArrowRight />
                </Button>
              </div>
              {state.message && <p className="text-sm font-medium text-white">{state.message}</p>}
              <p className="text-xs text-white/70">Désinscription en un clic. Vos données ne sont jamais revendues.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
