"use client";

import { useCallback, useRef } from "react";
import { X } from "lucide-react";
import { prix } from "@/lib/format";
import { usePanier } from "@/lib/panier";
import { useFenetre } from "@/lib/useVerrouDefilement";
import { Photo } from "./Photo";
import { AjoutProduit } from "./AjoutProduit";

/** Fenêtre rapide de détail d'un produit (ouverte hors de la carte digitale). */
export function FicheProduit() {
  const { produitOuvert: p, ouvrirProduit } = usePanier();
  const ref = useRef<HTMLDivElement>(null);
  const fermer = useCallback(() => ouvrirProduit(null), [ouvrirProduit]);
  useFenetre(!!p, ref, fermer);
  if (!p) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center md:items-center md:p-6" role="dialog" aria-modal="true" aria-labelledby="fiche-titre">
      <button type="button" aria-label="Fermer" tabIndex={-1} onClick={fermer} className="anim-fondu absolute inset-0 bg-encre/70 backdrop-blur-[2px]" />
      <div ref={ref} className="anim-feuille relative grid max-h-[94dvh] w-full max-w-[960px] overflow-y-auto rounded-t-[28px] bg-white md:grid-cols-2 md:overflow-hidden md:rounded-[28px]">
        <button type="button" onClick={fermer} aria-label="Fermer la fiche" className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-white text-encre shadow-lg hover:bg-bleu hover:text-white">
          <X className="size-5" strokeWidth={2.6} />
        </button>
        <Photo src={p.photo} alt={p.nom} illustration={p.illustration} className="aspect-square md:aspect-auto md:min-h-full" sizes="(max-width: 768px) 100vw, 480px" zoom={false} priorite />
        <div className="flex flex-col gap-5 p-6 pb-[max(24px,env(safe-area-inset-bottom))] sm:p-8 md:max-h-[90dvh] md:overflow-y-auto">
          <div>
            <h2 id="fiche-titre" className="font-display text-3xl font-black leading-tight sm:text-4xl">{p.nom}</h2>
            <p className="mt-2 font-display text-2xl font-black text-bleu">{prix(p.prix)}</p>
          </div>
          <p className="text-gris">{p.description}</p>
          <AjoutProduit p={p} apresAjout={fermer} />
        </div>
      </div>
    </div>
  );
}
