"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, ArrowDown } from "lucide-react";
import { LienBouton, classesBouton } from "./Bouton";
import { usePanier } from "@/lib/panier";

/**
 * Ordinateur : trois vidéos verticales côte à côte (manti · lahmacun · manti), nettes car non étirées.
 * Mobile : une seule vidéo plein écran qui enchaîne manti puis lahmacun.
 */
const PANNEAUX = [
  { video: "/videos/hero-1.mp4", affiche: "/videos/hero-1.webp", mobile: false },
  { video: "/videos/hero-2.mp4", affiche: "/videos/hero-2.webp", mobile: false },
  { video: "/videos/hero-3.mp4", affiche: "/videos/hero-3.webp", mobile: false },
  { video: "/videos/hero-mobile.mp4", affiche: "/videos/hero-1.webp", mobile: true },
];

export function Hero() {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [lecture, setLecture] = useState(true);
  const { nbArticles, ouvrirPanier } = usePanier();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setLecture(false);
  }, []);

  useEffect(() => {
    const sync = () =>
      refs.current.forEach((v) => {
        if (!v) return;
        const visible = v.offsetParent !== null;
        if (lecture && visible) v.play().catch(() => {});
        else v.pause();
      });
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [lecture]);

  return (
    <section aria-labelledby="hero-titre" className="sur-sombre hero-sortie relative h-[100svh] min-h-[620px] max-h-[1000px] overflow-hidden bg-encre text-white">
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-3" aria-hidden="true">
        {PANNEAUX.map((p, i) => (
          <div key={p.video} className={`relative overflow-hidden ${p.mobile ? "md:hidden" : "hidden md:block"} ${i === 1 ? "md:border-x md:border-white/10" : ""}`}>
            <video
              ref={(el) => { refs.current[i] = el; }}
              className="absolute inset-0 size-full object-cover"
              src={p.video}
              poster={p.affiche}
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>
        ))}
      </div>
      {/* Voile pour la lisibilité du texte */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_55%,rgba(11,15,26,.55),rgba(11,15,26,.25))]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-encre/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-encre/85 to-transparent" />

      <div className="relative z-10 flex h-full items-center justify-center px-5 pt-16 text-center">
        <div className="grid max-w-[980px] justify-items-center gap-6">
          <span className="anim-monter rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.22em] backdrop-blur-sm">
            Manti &amp; Lahmacun
          </span>
          <h1 id="hero-titre" className="anim-monter font-display text-[clamp(2.7rem,8.4vw,6.6rem)] font-black leading-[0.95] tracking-[-0.02em] [animation-delay:80ms]">
            La street food turque,{" "}
            <span className="inline-block -rotate-2 rounded-2xl bg-bleu px-[0.22em] pb-[0.06em]">autrement.</span>
          </h1>
          <div className="anim-monter flex w-full flex-col items-center justify-center gap-3 pt-2 [animation-delay:160ms] sm:w-auto sm:flex-row">
            <LienBouton href="/carte/" style="bleu" taille="lg" className="w-full sm:w-auto">
              Découvrir la carte
            </LienBouton>
            <button
              type="button"
              onClick={() => (nbArticles > 0 ? ouvrirPanier() : (window.location.href = "/carte/"))}
              className={classesBouton("blanc", "lg", "w-full sm:w-auto")}
            >
              Commander maintenant
            </button>
          </div>
        </div>
      </div>

      <a href="#specialites" aria-label="Descendre vers nos spécialités" className="absolute bottom-6 left-1/2 z-10 grid size-12 -translate-x-1/2 place-items-center rounded-full border-2 border-white/50 transition-colors hover:bg-white hover:text-encre">
        <ArrowDown className="size-5" />
      </a>
      <button
        type="button"
        onClick={() => setLecture((l) => !l)}
        aria-label={lecture ? "Mettre la vidéo en pause" : "Lancer la vidéo"}
        className="absolute bottom-6 right-[max(20px,env(safe-area-inset-right))] z-10 grid size-11 place-items-center rounded-full border border-white/50 bg-encre/30 backdrop-blur-sm hover:bg-white hover:text-encre"
      >
        {lecture ? <Pause className="size-4" fill="currentColor" /> : <Play className="size-4" fill="currentColor" />}
      </button>
    </section>
  );
}
