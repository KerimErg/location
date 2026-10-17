"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, ShoppingBag, X, ArrowRight } from "lucide-react";
import { Logo } from "./Logo";
import { usePanier } from "@/lib/panier";
import { site } from "@/config/site";
import { useFenetre } from "@/lib/useVerrouDefilement";
import { NAV } from "@/config/navigation";

/** `transparent` : posé sur la vidéo d'accueil, devient blanc au défilement. */
export function Header({ transparent = false }: { transparent?: boolean }) {
  const { nbArticles, ouvrirPanier, bump } = usePanier();
  const [scrolle, setScrolle] = useState(!transparent);
  const [cache, setCache] = useState(false);
  const garde = useRef(0);
  const [menu, setMenu] = useState(false);
  const panneau = useRef<HTMLDivElement>(null);
  useFenetre(menu, panneau, () => setMenu(false));

  // Fond blanc dès qu'on quitte la vidéo ; l'en-tête s'efface quand on descend et revient dès qu'on remonte.
  useEffect(() => {
    let avant = window.scrollY;
    const f = () => {
      const y = window.scrollY;
      if (transparent) setScrolle(y > 40);
      if (Math.abs(y - avant) > 6) { setCache(y > avant && y > 480 && Date.now() > garde.current); avant = y; }
    };
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, [transparent]);

  // Un article vient d'être ajouté : l'en-tête revient pour montrer le panier.
  useEffect(() => { if (bump) { garde.current = Date.now() + 2500; setCache(false); } }, [bump]);

  const clair = !scrolle; // en-tête transparent sur la bannière
  const commander = () => (nbArticles > 0 ? ouvrirPanier() : (window.location.href = "/#menu"));

  return (
    <>
      <header
        className={`entete-vt sur-sombre fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)] text-white transition-[background,box-shadow,transform] duration-500 ease-[var(--ease-pro)] ${cache && !menu ? "-translate-y-full" : ""} ${
          clair ? "" : "bg-rouge shadow-[0_10px_30px_-18px_rgba(0,0,0,.6)]"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between gap-4 px-[max(20px,env(safe-area-inset-left))] lg:h-20">
          <Link href="/" aria-label="BOWLY'S, accueil" className="flex shrink-0 items-center gap-2.5">
            <Logo variante="texte" titre="" className="w-[118px] text-white sm:w-[140px]" />
          </Link>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-2">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className="lien-nav rounded-full px-4 py-2 text-[1.3rem] font-medium transition-colors hover:text-jaune"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            
            {site.commande.panierActif && (
              <button
                type="button"
                onClick={() => ouvrirPanier()}
                aria-label={`Ouvrir le panier, ${nbArticles} article${nbArticles > 1 ? "s" : ""}`}
                className="relative grid size-12 place-items-center rounded-full transition-colors hover:bg-white/15"
              >
                <ShoppingBag className="size-[22px]" strokeWidth={2.2} />
                {nbArticles > 0 && (
                  <span key={bump} className="anim-pop absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-jaune px-1 text-[0.7rem] font-extrabold text-encre ring-2 ring-rouge">
                    {nbArticles}
                  </span>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={commander}
              className="titre-large hidden h-12 items-center gap-2 rounded-full bg-jaune px-6 text-sm text-encre transition-transform hover:-translate-y-0.5 sm:inline-flex"
            >
              Commander
            </button>
            <button
              type="button"
              onClick={() => setMenu(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={menu}
              className="grid size-12 place-items-center rounded-full hover:bg-white/15 lg:hidden"
            >
              <Menu className="size-6" strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </header>

      {menu && (
        <div ref={panneau} role="dialog" aria-modal="true" aria-label="Menu" className="vagues sur-sombre anim-fondu fixed inset-0 z-50 flex flex-col bg-rouge text-white lg:hidden">
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
                  <Link href={n.href} onClick={() => setMenu(false)} className="titre-large flex items-center justify-between border-b border-white/20 py-5 text-[1.7rem]">
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
              className="titre-large flex h-16 w-full items-center justify-center rounded-full bg-jaune text-lg text-encre"
            >
              Commander
            </button>
          </div>
        </div>
      )}
    </>
  );
}
