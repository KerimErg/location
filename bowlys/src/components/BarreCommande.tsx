"use client";

import Link from "next/link";
import { Navigation, Phone, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { usePanier } from "@/lib/panier";
import { prix } from "@/lib/format";
import { site, lienItineraire } from "@/config/site";

/**
 * Mobile : barre fixe en bas, utilisable d'un pouce.
 * - panier vide → Carte · Appeler · Itinéraire
 * - panier rempli → « Voir mon panier » avec le total
 */
export function BarreCommande() {
  const { nbArticles, total, ouvrirPanier, panierOuvert, message } = usePanier();
  if (panierOuvert || message) return null;
  const itin = lienItineraire();

  if (nbArticles > 0) {
    return (
      <div className="anim-toast fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(14px,env(safe-area-inset-bottom))] md:hidden">
        <button type="button" onClick={() => ouvrirPanier()} className="flex h-16 w-full items-center justify-between rounded-full bg-rouge pl-3 pr-6 font-display font-extrabold text-white shadow-[0_18px_40px_-14px_rgba(140,2,10,.8)]">
          <span className="flex items-center gap-3">
            <span className="relative grid size-11 place-items-center rounded-full bg-white/15">
              <ShoppingBag className="size-5" />
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-white text-[0.7rem] text-rouge">{nbArticles}</span>
            </span>
            Voir mon panier
          </span>
          <span className="tabular-nums">{prix(total)}</span>
        </button>
      </div>
    );
  }

  const actions = [
    { href: "/carte/", label: "La carte", Icone: UtensilsCrossed, principal: true, externe: false },
    ...(site.telephone ? [{ href: `tel:${site.telephone.replace(/\s/g, "")}`, label: "Appeler", Icone: Phone, principal: false, externe: false }] : []),
    ...(itin ? [{ href: itin, label: "Itinéraire", Icone: Navigation, principal: false, externe: true }] : []),
  ];
  return (
    <nav aria-label="Actions rapides" className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(12px,env(safe-area-inset-bottom))] md:hidden">
      <div className="flex gap-2 rounded-full bg-encre/90 p-1.5 shadow-[0_18px_40px_-16px_rgba(11,15,26,.6)] backdrop-blur-md">
        {actions.map(({ href, label, Icone, principal, externe }) => {
          const cls = `flex h-12 flex-1 items-center justify-center gap-2 rounded-full font-display text-[0.92rem] font-extrabold ${principal ? "bg-rouge text-white" : "text-white"}`;
          const contenu = <><Icone className="size-[18px]" strokeWidth={2.4} />{label}</>;
          return externe || href.startsWith("tel:") ? (
            <a key={label} href={href} {...(externe ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={cls}>{contenu}</a>
          ) : (
            <Link key={label} href={href} className={cls}>{contenu}</Link>
          );
        })}
      </div>
    </nav>
  );
}
