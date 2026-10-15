"use client";

import { useEffect, useState } from "react";
import { CATEGORIES, PRODUITS, type CategorieId } from "@/data/menu";
import { CarteProduit } from "./CarteProduit";

type Filtre = CategorieId | "tout";

/** La carte digitale : filtres par catégorie + grille de fiches produits. */
export function Carte() {
  const [filtre, setFiltre] = useState<Filtre>("tout");
  // Les boutons « Découvrir » des autres sections choisissent la catégorie.
  useEffect(() => {
    const f = (e: Event) => setFiltre((e as CustomEvent<CategorieId>).detail);
    window.addEventListener("bowlys-filtre", f);
    return () => window.removeEventListener("bowlys-filtre", f);
  }, []);
  const cats = filtre === "tout" ? CATEGORIES : CATEGORIES.filter((c) => c.id === filtre);
  const onglets: { id: Filtre; nom: string; n: number }[] = [
    { id: "tout", nom: "Tout", n: PRODUITS.length },
    ...CATEGORIES.map((c) => ({ id: c.id, nom: c.nom, n: PRODUITS.filter((p) => p.categorie === c.id).length })),
  ];

  return (
    <section id="carte" aria-labelledby="carte-titre" className="bg-doux py-20 sm:py-28">
      <div className="mx-auto max-w-[1240px] px-[max(20px,env(safe-area-inset-left))]">
        <div className="apparait flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-bleu">Notre carte</p>
            <h2 id="carte-titre" className="mt-3 font-display text-[clamp(2.4rem,5.6vw,4.4rem)] font-black leading-[0.95] tracking-[-0.02em]">
              Faites votre choix.
            </h2>
          </div>
          <p className="max-w-[38ch] text-gris">Touchez un plat pour voir le détail, ou le bouton <strong className="text-bleu">+</strong> pour l&apos;ajouter directement.</p>
        </div>

        {/* Filtres : restent visibles pendant le défilement */}
        <div className="sticky top-[72px] z-20 -mx-[max(20px,env(safe-area-inset-left))] mt-10 bg-doux/95 px-[max(20px,env(safe-area-inset-left))] py-3 backdrop-blur-md lg:top-20">
          <div role="toolbar" aria-label="Filtrer la carte" className="sans-barre flex gap-2 overflow-x-auto">
            {onglets.map((o) => (
              <button
                key={o.id}
                type="button"
                aria-pressed={filtre === o.id}
                onClick={() => setFiltre(o.id)}
                className={`flex h-11 shrink-0 items-center gap-2 rounded-full px-5 font-display font-extrabold transition-colors ${
                  filtre === o.id ? "bg-bleu text-white" : "bg-white text-encre ring-1 ring-trait hover:ring-bleu hover:text-bleu"
                }`}
              >
                {o.nom}
                <span className={`text-xs ${filtre === o.id ? "text-white/80" : "text-gris"}`}>{o.n}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-14">
          {cats.map((c) => {
            const liste = PRODUITS.filter((p) => p.categorie === c.id);
            const compact = c.id === "boissons" || c.id === "extras";
            return (
              <div key={`${filtre}-${c.id}`} className="anim-monter">
                <div className="mb-5 flex items-baseline gap-3">
                  <h3 className="font-display text-2xl font-black sm:text-3xl">{c.nom}</h3>
                  <span className="text-sm font-semibold text-gris">{c.accroche}</span>
                </div>
                <div className={`grid gap-3 sm:gap-5 ${compact ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 lg:grid-cols-3"}`}>
                  {liste.map((p) => <CarteProduit key={p.id} produit={p} />)}
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-12 text-center text-sm text-gris">
          Prix TTC. Liste des allergènes en cours de validation : demandez-la au comptoir.
        </p>
      </div>
    </section>
  );
}
