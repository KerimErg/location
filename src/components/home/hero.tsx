"use client";

import { motion } from "framer-motion";
import { Gauge, Headset, ShieldCheck, Star } from "lucide-react";
import { BookingPanel, type AgencyOption } from "@/components/booking/booking-panel";
import type { SearchInput } from "@/lib/validations";

const ease = [0.22, 1, 0.36, 1] as const;

/** Traînées lumineuses façon feux sur autoroute de nuit (pur CSS/SVG, aucun asset). */
function LightTrails() {
  const trails = [
    { top: "58%", delay: 0, dur: 5.5, w: "38%", o: 0.9 },
    { top: "64%", delay: 1.6, dur: 4.2, w: "26%", o: 0.6 },
    { top: "70%", delay: 0.8, dur: 6.4, w: "44%", o: 0.75 },
    { top: "76%", delay: 2.4, dur: 4.8, w: "30%", o: 0.5 },
    { top: "82%", delay: 3.1, dur: 5.8, w: "36%", o: 0.4 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_35%,black_60%,black_85%,transparent)]">
      {trails.map((t, i) => (
        <motion.span
          key={i}
          className="absolute left-0 h-px rounded-full bg-gradient-to-r from-transparent via-[#ff7a2e] to-[#ffd2b0]"
          style={{ top: t.top, width: t.w, opacity: t.o, boxShadow: "0 0 18px 2px rgba(255,95,0,.55)" }}
          initial={{ x: "-110%" }}
          animate={{ x: "320%" }}
          transition={{ duration: t.dur, delay: t.delay, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 }}
        />
      ))}
    </div>
  );
}

export function Hero({ agencies, defaults }: { agencies: AgencyOption[]; defaults: SearchInput }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-1/4 right-[-10%] h-[80vh] w-[70vw] rounded-full bg-[#ff5f00]/20 blur-[160px]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[50vh] w-[50vw] rounded-full bg-[#ff5f00]/10 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
        <LightTrails />
      </div>

      <div className="container-page flex min-h-[100svh] flex-col justify-center pt-28 pb-10 md:pt-32 md:pb-14">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease }} className="max-w-4xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 backdrop-blur">
            <span className="flex items-center gap-0.5 text-primary">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-3 fill-current" />)}
            </span>
            4,8/5 sur plus de 12 000 avis vérifiés
          </div>
          <h1 className="text-[2.8rem] leading-[0.98] font-bold sm:text-7xl lg:text-[6.2rem]">
            Prenez la route
            <br />
            <span className="bg-gradient-to-r from-[#ff5f00] via-[#ff8a3d] to-[#ffc49a] bg-clip-text text-transparent">en première classe.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base text-white/65 md:text-lg">
            Des véhicules récents, impeccables et prêts à partir dans plus de 40 agences. Kilométrage illimité et annulation gratuite jusqu&apos;à 48 h avant.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease }} className="mt-12 md:mt-16">
          <BookingPanel agencies={agencies} defaults={defaults} />
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-8 grid grid-cols-1 gap-3 text-sm text-white/60 sm:grid-cols-3"
        >
          {[
            { icon: Gauge, t: "Kilométrage illimité" },
            { icon: ShieldCheck, t: "Paiement 100 % sécurisé" },
            { icon: Headset, t: "Assistance 24/7 partout en Europe" },
          ].map(({ icon: Icon, t }) => (
            <li key={t} className="flex items-center gap-2.5">
              <Icon className="size-4 text-primary" /> {t}
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
