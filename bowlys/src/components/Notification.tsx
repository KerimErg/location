"use client";

import { CheckCircle2 } from "lucide-react";
import { usePanier } from "@/lib/panier";

/** Petit message « ajouté au panier », annoncé aux lecteurs d'écran. */
export function Notification() {
  const { message, ouvrirPanier, panierOuvert } = usePanier();
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-[max(20px,env(safe-area-inset-bottom))] left-1/2 z-[80] w-[min(92vw,420px)] -translate-x-1/2">
      {message && !panierOuvert && (
        <div className="anim-toast pointer-events-auto flex items-center gap-3 rounded-full bg-encre py-2 pl-4 pr-2 text-white shadow-2xl">
          <CheckCircle2 className="size-5 shrink-0 text-creme" />
          <span className="flex-1 truncate text-sm font-semibold">{message}</span>
          <button type="button" onClick={() => ouvrirPanier()} className="h-10 shrink-0 rounded-full bg-rouge px-4 font-display text-sm font-extrabold hover:bg-rouge-fonce">
            Voir le panier
          </button>
        </div>
      )}
    </div>
  );
}
