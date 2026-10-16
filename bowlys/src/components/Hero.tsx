"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, ArrowDown } from "lucide-react";
import { LienBouton, classesBouton } from "./Bouton";
import { Logo } from "./Logo";
import { usePanier } from "@/lib/panier";
import { PastilleStatut } from "./StatutLive";

/**
 * Ordinateur : trois vidéos verticales côte à côte (façonnage · four · lahmacuns cuits), nettes car non étirées.
 * Mobile : une seule vidéo plein écran qui enchaîne les trois.
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
  const [visible, setVisible] = useState(true);
  const zone = useRef<HTMLElement>(null);
  const { nbArticles, ouvrirPanier } = usePanier();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setLecture(false);
  }, []);

  // Les vidéos se mettent en pause dès que la bannière sort de l'écran (moins de batterie, défilement plus fluide).
  useEffect(() => {
    const el = zone.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const sync = () =>
      refs.current.forEach((v) => {
        if (!v) return;
        const affiche = v.offsetParent !== null;
        if (lecture && visible && affiche) v.play().catch(() => {});
        else v.pause();
      });
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [lecture, visible]);

  return (
    <section ref={zone} aria-labelledby="hero-titre" className="sur-sombre hero-sortie relative h-[88svh] min-h-[560px] max-h-[1000px] sm:h-[100svh] sm:min-h-[620px] overflow-hidden bg-encre text-white">
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
          <Logo variante="complet" titre="BOWLY'S Lahmacun" className="anim-monter w-[clamp(150px,22vw,230px)] text-white drop-shadow-[0_8px_30px_rgba(0,0,0,.35)]" />
          <h1 id="hero-titre" className="font-display text-[clamp(2.3rem,6.4vw,5.2rem)] font-extrabold leading-[1.02] tracking-[-0.02em]">
            <span className="masque"><span style={{ animationDelay: "120ms" }}>Le</span></span>{" "}
            <span className="masque"><span style={{ animationDelay: "220ms" }}>lahmacun</span></span>{" "}
            <span className="masque"><span style={{ animationDelay: "340ms" }} className="relative isolate whitespace-nowrap text-white after:absolute after:inset-x-0 after:bottom-[0.06em] after:-z-10 after:h-[0.34em] after:origin-left after:animate-[souligner_.8s_var(--ease-pro)_1s_both] after:bg-rouge">autrement.</span></span>
          </h1>
          <div className="anim-monter flex w-full flex-col items-center justify-center gap-3 pt-2 [animation-delay:160ms] sm:w-auto sm:flex-row">
            <LienBouton href="/carte/" style="rouge" taille="lg" className="w-full sm:w-auto">
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
          <PastilleStatut ton="clair" className="anim-monter [animation-delay:240ms]" />
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
