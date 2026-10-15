"use client";

import { useEffect, useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { optionsDe, type Produit } from "@/data/menu";
import { prix } from "@/lib/format";
import { usePanier } from "@/lib/panier";
import { site } from "@/config/site";

/** Bloc commun aux fiches produit : composition, suppléments, allergènes, quantité, bouton Ajouter. */
export function AjoutProduit({ p, apresAjout }: { p: Produit; apresAjout?: () => void }) {
  const { ajouter } = usePanier();
  const [choix, setChoix] = useState<string[]>([]);
  const [qte, setQte] = useState(1);
  const [ajoute, setAjoute] = useState(false);
  useEffect(() => { setChoix([]); setQte(1); }, [p]);

  const options = optionsDe(p);
  const unitaire = p.prix + options.filter((o) => choix.includes(o.id)).reduce((s, o) => s + o.prix, 0);
  const basculer = (id: string) => setChoix((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  return (
    <div className="grid gap-5">
      {p.composition && p.composition.length > 0 && (
        <div className="rounded-2xl bg-doux p-4">
          <p className="font-display font-black">Composition du menu</p>
          <ul className="mt-2 grid gap-1 font-semibold text-gris">{p.composition.map((c) => <li key={c}>• {c}</li>)}</ul>
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
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full ring-2 ring-trait">
            <button type="button" onClick={() => setQte((q) => Math.max(1, q - 1))} aria-label="Retirer un" disabled={qte <= 1} className="grid size-12 place-items-center rounded-full hover:bg-doux disabled:opacity-40"><Minus className="size-4" strokeWidth={3} /></button>
            <span aria-live="polite" className="w-8 text-center font-display text-lg font-black tabular-nums">{qte}</span>
            <button type="button" onClick={() => setQte((q) => Math.min(30, q + 1))} aria-label="Ajouter un" className="grid size-12 place-items-center rounded-full hover:bg-doux"><Plus className="size-4" strokeWidth={3} /></button>
          </div>
          <button
            type="button"
            onClick={() => { ajouter(p.id, choix, qte); setChoix([]); setQte(1); setAjoute(true); setTimeout(() => setAjoute(false), 1400); apresAjout?.(); }}
            className="flex h-14 flex-1 items-center justify-between gap-3 rounded-full bg-bleu px-6 font-display text-base font-black text-white shadow-[0_12px_28px_-12px_rgba(0,87,231,.7)] transition-colors hover:bg-bleu-fonce"
          >
            {ajoute ? (
              <span className="flex w-full items-center justify-center gap-2"><Check className="size-5" strokeWidth={3} />Ajouté au panier</span>
            ) : (
              <><span>Ajouter</span><span className="tabular-nums">{prix(unitaire * qte)}</span></>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
