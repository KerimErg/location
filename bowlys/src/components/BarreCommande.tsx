"use client";

import { ShoppingBag } from "lucide-react";
import { usePanier } from "@/lib/panier";
import { prix } from "@/lib/format";

/** Mobile : barre fixe en bas dès qu'il y a quelque chose dans le panier. */
export function BarreCommande() {
  const { nbArticles, total, ouvrirPanier, panierOuvert, message } = usePanier();
  if (!nbArticles || panierOuvert || message) return null;
  return (
    <div className="anim-toast fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(16px,env(safe-area-inset-bottom))] md:hidden">
      <button
        type="button"
        onClick={() => ouvrirPanier()}
        className="flex h-16 w-full items-center justify-between rounded-full bg-bleu pl-3 pr-6 font-display font-black text-white shadow-[0_18px_40px_-14px_rgba(0,87,231,.8)]"
      >
        <span className="flex items-center gap-3">
          <span className="relative grid size-11 place-items-center rounded-full bg-white/15">
            <ShoppingBag className="size-5" />
            <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-white text-[0.7rem] text-bleu">{nbArticles}</span>
          </span>
          Voir mon panier
        </span>
        <span className="tabular-nums">{prix(total)}</span>
      </button>
    </div>
  );
}
