"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import type { Produit } from "@/data/menu";
import { usePanier } from "@/lib/panier";
import { site } from "@/config/site";

/** « + » posé sur une carte produit : ajoute en un geste (sans quitter la liste). */
export function AjoutRapide({ p }: { p: Produit }) {
  const { ajouter } = usePanier();
  const [ok, setOk] = useState(false);
  if (!site.commande.panierActif) return null;
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); ajouter(p.id); setOk(true); setTimeout(() => setOk(false), 1200); }}
      aria-label={`Ajouter ${p.nom} au panier`}
      className={`absolute bottom-4 right-4 z-10 grid size-11 place-items-center rounded-full shadow-lg transition-[transform,background,color] duration-300 active:scale-90 ${ok ? "bg-white text-bleu" : "bg-bleu text-white hover:scale-110"}`}
    >
      {ok ? <Check className="size-5" strokeWidth={3} /> : <Plus className="size-5" strokeWidth={3} />}
    </button>
  );
}
