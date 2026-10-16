"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, ShoppingBag, X, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import { usePanier } from "@/lib/panier";
import { site } from "@/config/site";
import { useFenetre } from "@/lib/useVerrouDefilement";
import { NAV } from "@/config/navigation";
import { PastilleStatut } from "./StatutLive";

/** `transparent` : posé sur la vidéo d'accueil, devient blanc au défilement. */
export function Header({ transparent = false }: { transparent?: boolean }) {
  const { nbArticles, ouvrirPanier, bump } = usePanier();
  const [scrolle, setScrolle] = useState(!transparent);
  const [cache, setCache] = useState(false);
  const [menu, setMenu] = useState(false);
  const panneau = useRef<HTMLDivElement>(null);
  useFenetre(menu, panneau, () => setMenu(false));

  // Fond blanc dès qu'on quitte la vidéo ; l'en-tête s'efface quand on descend et revient dès qu'on remonte.
  useEffect(() => {
    let avant = window.scrollY;
    const f = () => {
      const y = window.scrollY;
      if (transparent) setScrolle(y > 40);
      if (Math.abs(y - avant) > 6) { setCache(y > avant && y > 480); avant = y; }
    };
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, [transparent]);

  const clair = !scrolle; // texte blanc sur la vidéo
  const commander = () => (nbArticles > 0 ? ouvrirPanier() : (window.location.href = "/carte/"));

  return (
    <>
      <header
        className={`entete-vt fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)] transition-[background,box-shadow,color,transform] duration-500 ease-[var(--ease-pro)] ${cache && !menu ? "-translate-y-full" : ""} ${
          clair ? "text-white" : "bg-white/95 text-encre shadow-[0_1px_0_var(--color-trait)] backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between gap-4 px-[max(20px,env(safe-area-inset-left))] lg:h-20">
          <Link href="/" aria-label="BOWLY'S, accueil" className="flex shrink-0 items-center gap-2.5">
            <Logo variante="texte" titre="" className={`w-[118px] sm:w-[132px] ${clair ? "text-white" : "text-rouge"}`} />
          </Link>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className={`lien-nav rounded-full px-4 py-2 font-display text-[0.95rem] font-bold transition-colors ${
                      clair ? "" : "hover:text-rouge"
                    }`}
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden 2xl:block"><PastilleStatut ton={clair ? "clair" : "fonce"} /></span>
            {site.commande.panierActif && (
              <button
                type="button"
                onClick={() => ouvrirPanier()}
                aria-label={`Ouvrir le panier, ${nbArticles} article${nbArticles > 1 ? "s" : ""}`}
                className={`relative grid size-12 place-items-center rounded-full transition-colors ${clair ? "hover:bg-white/15" : "hover:bg-creme"}`}
              >
                <ShoppingBag className="size-[22px]" strokeWidth={2.2} />
                {nbArticles > 0 && (
                  <span key={bump} className="anim-pop absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rouge px-1 text-[0.7rem] font-extrabold text-white ring-2 ring-white">
                    {nbArticles}
                  </span>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={commander}
              className={`hidden h-12 items-center gap-2 rounded-full px-6 font-display font-extrabold transition-colors sm:inline-flex ${
                clair ? "bg-white text-rouge hover:bg-creme" : "bg-rouge text-white hover:bg-rouge-fonce"
              }`}
            >
              Commander
            </button>
            <button
              type="button"
              onClick={() => setMenu(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={menu}
              className={`grid size-12 place-items-center rounded-full lg:hidden ${clair ? "hover:bg-white/15" : "hover:bg-creme"}`}
            >
              <Menu className="size-6" strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </header>

      {menu && (
        <div ref={panneau} role="dialog" aria-modal="true" aria-label="Menu" className="sur-sombre anim-fondu fixed inset-0 z-50 flex flex-col bg-rouge text-white lg:hidden">
          <div className="flex h-[72px] items-center justify-between px-[max(20px,env(safe-area-inset-left))] pt-[env(safe-area-inset-top)]">
            <Logo variante="texte" titre="BOWLY'S Lahmacun" className="w-[120px] text-white" />
            <button type="button" onClick={() => setMenu(false)} aria-label="Fermer le menu" className="grid size-12 place-items-center rounded-full hover:bg-white/15">
              <X className="size-7" strokeWidth={2.4} />
            </button>
          </div>
          <nav aria-label="Navigation mobile" className="flex-1 overflow-y-auto px-6 pt-6">
            <ul className="grid gap-1">
              {NAV.map((n, i) => (
                <li key={n.href} className="anim-monter" style={{ animationDelay: `${60 + i * 50}ms` }}>
                  <Link href={n.href} onClick={() => setMenu(false)} className="flex items-center justify-between border-b border-white/20 py-5 font-display text-3xl font-extrabold">
                    {n.label}
                    <ArrowRight className="size-6 opacity-70" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-6 pb-[max(24px,env(safe-area-inset-bottom))]">
            <button
              type="button"
              onClick={() => { setMenu(false); commander(); }}
              className="flex h-16 w-full items-center justify-center rounded-full bg-white font-display text-lg font-extrabold text-rouge"
            >
              Commander
            </button>
          </div>
        </div>
      )}
    </>
  );
}
