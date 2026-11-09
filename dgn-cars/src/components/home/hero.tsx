"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PHOTOS } from "@/config/photos";
import { RATING } from "@/config/reviews";

const ease = [0.22, 1, 0.36, 1] as const;
const up = (delay: number) => ({ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay, ease } });

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[86svh] items-center overflow-hidden bg-ink text-white lg:min-h-[760px]">
      <motion.div className="absolute inset-0 -z-20" initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 2.6, ease }}>
        <Image src={PHOTOS.hero} alt="Voitures d'occasion alignées sur un parc de vente" fill priority sizes="100vw" className="object-cover object-[65%_60%]" />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-[#0b0c0d]/60" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-[#0b0c0d] to-transparent" />

      <div className="container-page py-24 text-center">
        <motion.p {...up(0.2)} className="font-mono text-xs tracking-[0.3em] text-white/75 uppercase">
          DGN Cars · Liège
        </motion.p>
        <motion.h1 {...up(0.35)} className="mx-auto mt-6 max-w-5xl text-[3.6rem] sm:text-8xl lg:text-[8.5rem]">
          Roulez l&apos;esprit <span className="text-signal">tranquille.</span>
        </motion.h1>
        <motion.p {...up(0.55)} className="mx-auto mt-6 max-w-xl text-lg text-white/80 md:text-xl">
          Voitures d&apos;occasion contrôlées, avec Car-Pass et garantie.
        </motion.p>
        <motion.div {...up(0.7)} className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="h-14 bg-signal px-8 text-signal-foreground">
            <Link href="/stock">Voir nos voitures <ArrowRight /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-14 border-white/50 bg-transparent px-8 text-white hover:bg-white hover:text-ink">
            <Link href="/reprise">Estimer ma voiture</Link>
          </Button>
        </motion.div>
        <motion.a
          {...up(0.9)}
          href="#avis"
          className="mt-10 inline-flex items-center gap-2 text-sm text-white/75 hover:text-white"
        >
          <span className="flex text-signal">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-4 fill-current" />)}</span>
          {RATING.average.toLocaleString("fr-BE")}/5 · {RATING.count} avis clients
        </motion.a>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      >
        <ChevronDown className="size-7" />
      </motion.div>
    </section>
  );
}
