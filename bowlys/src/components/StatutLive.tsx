"use client";

import { useEffect, useState } from "react";
import { site } from "@/config/site";
import { statut, type Statut } from "@/lib/horaires";

/** Statut d'ouverture recalculé chaque minute (null tant que la page n'est pas chargée ou sans horaires). */
export function useStatut(): Statut | null {
  const [s, setS] = useState<Statut | null>(null);
  useEffect(() => {
    if (!site.horaires) return;
    const maj = () => setS(statut(site.horaires!));
    maj();
    const t = setInterval(maj, 30_000);
    return () => clearInterval(t);
  }, []);
  return s;
}

/** Pastille « ● Ouvert · jusqu'à 23:00 ». `ton` : clair (sur photo/bleu) ou foncé (sur blanc). */
export function PastilleStatut({ ton = "fonce", className = "" }: { ton?: "clair" | "fonce"; className?: string }) {
  const s = useStatut();
  if (!s) return null;
  const clair = ton === "clair";
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[0.8rem] font-extrabold ${clair ? "bg-white/15 text-white ring-1 ring-white/30 backdrop-blur-sm" : s.ouvert ? "bg-bleu-ciel text-bleu" : "bg-doux text-gris"} ${className}`}>
      <span className="relative flex size-2">
        {s.ouvert && <span className={`absolute inline-flex size-full animate-ping rounded-full opacity-70 ${clair ? "bg-white" : "bg-bleu"}`} />}
        <span className={`relative inline-flex size-2 rounded-full ${s.ouvert ? (clair ? "bg-white" : "bg-bleu") : clair ? "bg-white/50" : "bg-gris"}`} />
      </span>
      {s.ouvert ? "Ouvert" : "Fermé"}
      <span className={`font-semibold ${clair ? "text-white/85" : "opacity-80"}`}>· {s.court}</span>
    </span>
  );
}
