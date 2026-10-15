"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Minus, Plus, X, Check } from "lucide-react";
import { optionsDe } from "@/data/menu";
import { prix } from "@/lib/format";
import { usePanier } from "@/lib/panier";
import { useFenetre } from "@/lib/useVerrouDefilement";
import { site } from "@/config/site";
import { Photo } from "./Photo";

/** Fenêtre de détail d'un produit : grande photo, options, quantité, ajout au panier. */
export function FicheProduit() {
  const { produitOuvert: p, ouvrirProduit, ajouter } = usePanier();
  const [choix, setChoix] = useState<string[]>([]);
  const [qte, setQte] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  const fermer = useCallback(() => ouvrirProduit(null), [ouvrirProduit]);
  useFenetre(!!p, ref, fermer);

  useEffect(() => { setChoix([]); setQte(1); }, [p]);
  if (!p) return null;

  const options = optionsDe(p);
  const unitaire = p.prix + options.filter((o) => choix.includes(o.id)).reduce((s, o) => s + o.prix, 0);
  const basculer = (id: string) => setChoix((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

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

          {p.composition && (
            <div className="rounded-2xl bg-doux p-4 text-sm">
              <p className="font-bold">Composition du menu</p>
              {p.composition.length ? (
                <ul className="mt-2 grid gap-1">{p.composition.map((c) => <li key={c}>• {c}</li>)}</ul>
              ) : (
                <p className="mt-1 text-gris">Composition détaillée bientôt en ligne.</p>
              )}
            </div>
          )}

          {site.commande.panierActif && options.length > 0 && (
            <fieldset>
              <legend className="font-display font-black">Suppléments</legend>
              <div className="mt-3 grid gap-2">
                {options.map((o) => {
                  const actif = choix.includes(o.id);
                  return (
                    <label key={o.id} className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl px-4 py-3.5 ring-2 transition-colors ${actif ? "bg-bleu-ciel ring-bleu" : "ring-trait hover:ring-bleu/50"}`}>
                      <span className="flex items-center gap-3">
                        <span className={`grid size-6 place-items-center rounded-md ${actif ? "bg-bleu text-white" : "ring-2 ring-trait"}`}>{actif && <Check className="size-4" strokeWidth={3.5} />}</span>
                        <input type="checkbox" className="sr-only" checked={actif} onChange={() => basculer(o.id)} />
                        <span className="font-semibold">{o.nom}</span>
                      </span>
                      <span className="text-sm font-bold text-gris">+ {prix(o.prix)}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          <p className="rounded-2xl border border-dashed border-trait p-4 text-sm text-gris">
            <strong className="text-encre">Allergènes :</strong>{" "}
            {p.allergenes ? (p.allergenes.length ? p.allergenes.join(", ") : "aucun allergène déclaré") : "informations en cours de validation, demandez-les au comptoir."}
          </p>

          {site.commande.panierActif && (
            <div className="mt-auto flex items-center gap-3 border-t border-trait pt-5">
              <div className="flex items-center rounded-full ring-2 ring-trait">
                <button type="button" onClick={() => setQte((q) => Math.max(1, q - 1))} aria-label="Retirer un" className="grid size-12 place-items-center rounded-full hover:bg-doux disabled:opacity-40" disabled={qte <= 1}><Minus className="size-4" strokeWidth={3} /></button>
                <span aria-live="polite" className="w-8 text-center font-display text-lg font-black tabular-nums">{qte}</span>
                <button type="button" onClick={() => setQte((q) => Math.min(30, q + 1))} aria-label="Ajouter un" className="grid size-12 place-items-center rounded-full hover:bg-doux"><Plus className="size-4" strokeWidth={3} /></button>
              </div>
              <button
                type="button"
                onClick={() => { ajouter(p.id, choix, qte); fermer(); }}
                className="flex h-14 flex-1 items-center justify-between gap-3 rounded-full bg-bleu px-6 font-display text-base font-black text-white shadow-[0_12px_28px_-12px_rgba(0,87,231,.7)] transition-colors hover:bg-bleu-fonce"
              >
                <span>Ajouter</span>
                <span className="tabular-nums">{prix(unitaire * qte)}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
