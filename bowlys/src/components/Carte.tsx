"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { CATEGORIES, PRODUITS, type CategorieId, type Produit } from "@/data/menu";
import { prix } from "@/lib/format";
import { usePanier } from "@/lib/panier";
import { site } from "@/config/site";
import { Photo } from "./Photo";
import { EnTete } from "./Sections";

/** Une ligne de la carte : vignette, nom, description, prix, « + ». Toute la ligne ouvre la fiche. */
function LigneProduit({ p }: { p: Produit }) {
  const { ajouter, ouvrirProduit } = usePanier();
  const aOptions = (p.options?.length ?? 0) > 0;
  return (
    <li className="group relative flex items-center gap-4 rounded-[20px] bg-white p-3 pr-4 ring-1 ring-trait transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-26px_rgba(11,15,26,.5)] hover:ring-bleu/40 sm:gap-5">
      <Photo src={p.photo} alt={p.nom} vignette className="size-20 shrink-0 rounded-2xl sm:size-24" sizes="96px" />
      <div className="min-w-0 flex-1">
        <h3 className="font-display text-[1.05rem] font-black leading-tight sm:text-lg">
          <button type="button" onClick={() => ouvrirProduit(p)} className="text-left after:absolute after:inset-0 after:rounded-[20px] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-3 focus-visible:after:outline-bleu">
            {p.nom}
          </button>
        </h3>
        <p className="mt-0.5 line-clamp-2 text-sm text-gris">{p.description}</p>
        <p className="mt-1.5 font-display font-black text-bleu">{prix(p.prix)}</p>
      </div>
      {site.commande.panierActif && (
        <button
          type="button"
          onClick={() => (aOptions ? ouvrirProduit(p) : ajouter(p.id))}
          aria-label={aOptions ? `Choisir les suppléments et ajouter ${p.nom}` : `Ajouter ${p.nom} au panier`}
          className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full bg-bleu text-white transition-[transform,background] duration-300 hover:rotate-90 hover:bg-bleu-fonce active:scale-90"
        >
          <Plus className="size-5" strokeWidth={3} />
        </button>
      )}
    </li>
  );
}

/** La carte : une catégorie à la fois, pour rester lisible. */
export function Carte() {
  const [cat, setCat] = useState<CategorieId>("mantis");
  useEffect(() => {
    const f = (e: Event) => setCat((e as CustomEvent<CategorieId>).detail);
    window.addEventListener("bowlys-filtre", f);
    return () => window.removeEventListener("bowlys-filtre", f);
  }, []);
  const c = CATEGORIES.find((x) => x.id === cat)!;
  const liste = PRODUITS.filter((p) => p.categorie === cat);

  return (
    <section id="carte" aria-labelledby="carte-titre" className="bg-doux py-24 sm:py-32">
      <div className="mx-auto max-w-[1000px] px-[max(20px,env(safe-area-inset-left))]">
        <EnTete id="carte-titre" surtitre="Notre carte" titre="La carte" centre />

        <div className="sticky top-[72px] z-20 -mx-[max(20px,env(safe-area-inset-left))] mt-10 bg-doux/95 px-[max(20px,env(safe-area-inset-left))] py-3 backdrop-blur-md lg:top-20">
          <div role="tablist" aria-label="Catégories" className="sans-barre mx-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-white p-1.5 ring-1 ring-trait">
            {CATEGORIES.map((x) => (
              <button
                key={x.id}
                type="button"
                role="tab"
                id={`onglet-${x.id}`}
                aria-selected={cat === x.id}
                aria-controls="carte-liste"
                onClick={() => setCat(x.id)}
                className={`h-11 shrink-0 rounded-full px-5 font-display font-extrabold transition-colors ${cat === x.id ? "bg-bleu text-white" : "text-gris hover:text-encre"}`}
              >
                {x.nom}
              </button>
            ))}
          </div>
        </div>

        <div id="carte-liste" role="tabpanel" aria-labelledby={`onglet-${cat}`} key={cat} className="anim-monter mt-8">
          <p className="text-center font-semibold text-gris">{c.accroche}</p>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {liste.map((p) => <LigneProduit key={p.id} p={p} />)}
          </ul>
        </div>

        <p className="mt-10 text-center text-sm text-gris">Prix TTC · Allergènes : demandez-les au comptoir.</p>
      </div>
    </section>
  );
}
