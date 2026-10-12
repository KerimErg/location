"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Star } from "lucide-react";
import { BookingPanel, type AgencyOption } from "@/components/booking/booking-panel";
import { HeroVisual } from "./hero-visual";
import type { SearchInput } from "@/lib/validations";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero({ agencies, defaults }: { agencies: AgencyOption[]; defaults: SearchInput }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      {/* Halo lumineux */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 h-[60vh] w-[80vw] -translate-x-1/2 rounded-full bg-[#ff5f00]/18 blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.07),transparent_60%)]" />
      </div>

      <div className="relative flex min-h-[100svh] flex-col">
        <div className="relative z-10 container-page pt-28 md:pt-36">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 backdrop-blur">
              <span className="flex items-center gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-3 fill-current" />)}
              </span>
              4,8/5 sur plus de 12 000 avis vérifiés
            </div>
            <h1 className="text-[2.6rem] leading-[1.02] font-bold sm:text-6xl lg:text-7xl">
              Prenez la route
              <br />
              <span className="bg-gradient-to-r from-[#ff5f00] via-[#ff8a3d] to-[#ffb37a] bg-clip-text text-transparent">en première classe.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-white/65 md:text-lg">
              Des véhicules récents, impeccables et prêts à partir. Kilométrage illimité et annulation gratuite jusqu&apos;à 48 h avant.
            </p>
          </motion.div>
        </div>

        <div className="relative min-h-[42vh] flex-1 md:min-h-[46vh]">
          <HeroVisual />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease }}
          className="relative z-10 container-page pb-8 md:pb-12"
        >
          <BookingPanel agencies={agencies} defaults={defaults} />
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/55">
            <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-primary" /> Paiement 100 % sécurisé</span>
            <span>Sans frais cachés</span>
            <span>Plus de 40 agences en France</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
