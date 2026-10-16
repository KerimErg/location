"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, Minus, Plus } from "lucide-react";
import { choixDe, selectionInitiale, type Produit } from "@/data/menu";
import { prix } from "@/lib/format";
import { usePanier } from "@/lib/panier";
import { site } from "@/config/site";

/** Bloc commun aux fiches produit : choix (format, lahmacun, crudités, sauce), allergènes, quantité, Ajouter. */
export function AjoutProduit({ p, apresAjout }: { p: Produit; apresAjout?: () => void }) {
  const { ajouter } = usePanier();
  const [sel, setSel] = useState<string[]>(() => selectionInitiale(p));
  const [qte, setQte] = useState(1);
  const [ajoute, setAjoute] = useState(false);
  useEffect(() => { setSel(selectionInitiale(p)); setQte(1); }, [p]);

  const unitaire = p.prix + sel.reduce((s, cle) => s + (choixDe(p, cle)?.choix.prix ?? 0), 0);
  const choisir = (groupe: string, choix: string, unique: boolean) => {
    const cle = `${groupe}:${choix}`;
    setSel((s) => (unique ? [...s.filter((x) => !x.startsWith(`${groupe}:`)), cle] : s.includes(cle) ? s.filter((x) => x !== cle) : [...s, cle]));
  };

  return (
    <div className="grid gap-6">
      {site.commande.panierActif && p.groupes?.map((g) => {
        const avecPhotos = g.choix.some((c) => c.photo);
        return (
          <fieldset key={g.id}>
            <legend className="flex w-full items-baseline justify-between gap-3 font-display font-extrabold">
              {g.titre}
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-gris">{g.type === "unique" ? "1 choix" : "Au choix"}</span>
            </legend>
            {avecPhotos ? (
              <div className={`mt-3 grid gap-2 ${g.choix.length > 4 ? "grid-cols-5" : g.choix.length > 2 ? "grid-cols-4" : "grid-cols-2 sm:grid-cols-4"}`}>
                {g.choix.map((c) => {
                  const on = sel.includes(`${g.id}:${c.id}`);
                  return (
                    <label key={c.id} className="group flex cursor-pointer flex-col items-center gap-1.5 text-center">
                      <input type={g.type === "unique" ? "radio" : "checkbox"} name={`${p.id}-${g.id}`} className="peer sr-only" checked={on} onChange={() => choisir(g.id, c.id, g.type === "unique")} />
                      <span className={`relative grid aspect-square w-full max-w-[84px] place-items-center rounded-full p-0.5 ring-2 transition-all duration-300 peer-focus-visible:ring-encre ${on ? "scale-100 ring-rouge" : "scale-95 opacity-60 ring-transparent group-hover:opacity-100"}`}>
                        {c.photo && <Image src={c.photo} alt="" width={160} height={160} className="size-full rounded-full object-cover" />}
                        {on && <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-rouge text-white ring-2 ring-white"><Check className="size-3" strokeWidth={3.5} /></span>}
                      </span>
                      <span className={`text-[0.78rem] font-bold leading-tight ${on ? "text-encre" : "text-gris"}`}>{c.nom}</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="mt-3 grid gap-2">
                {g.choix.map((c) => {
                  const on = sel.includes(`${g.id}:${c.id}`);
                  return (
                    <label key={c.id} className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl px-4 py-3.5 ring-2 transition-colors ${on ? "bg-creme ring-rouge" : "ring-trait hover:ring-rouge/40"}`}>
                      <span className="flex items-center gap-3">
                        <span className={`grid size-6 place-items-center rounded-md ${on ? "bg-rouge text-white" : "ring-2 ring-trait"}`}>{on && <Check className="size-4" strokeWidth={3.5} />}</span>
                        <input type={g.type === "unique" ? "radio" : "checkbox"} name={`${p.id}-${g.id}`} className="sr-only" checked={on} onChange={() => choisir(g.id, c.id, g.type === "unique")} />
                        <span className="font-semibold">{c.nom}</span>
                      </span>
                      {c.prix ? <span className="text-sm font-bold text-gris">+ {prix(c.prix)}</span> : null}
                    </label>
                  );
                })}
              </div>
            )}
          </fieldset>
        );
      })}

      <p className="rounded-2xl border border-dashed border-trait p-4 text-sm text-gris">
        <strong className="text-encre">Allergènes :</strong>{" "}
        {p.allergenes ? (p.allergenes.length ? p.allergenes.join(", ") : "aucun allergène déclaré") : "informations en cours de validation, demandez-les au comptoir."}
      </p>

      {site.commande.panierActif && (
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full ring-2 ring-trait">
            <button type="button" onClick={() => setQte((q) => Math.max(1, q - 1))} aria-label="Retirer un" disabled={qte <= 1} className="grid size-12 place-items-center rounded-full hover:bg-doux disabled:opacity-40"><Minus className="size-4" strokeWidth={3} /></button>
            <span aria-live="polite" className="w-8 text-center font-display text-lg font-extrabold tabular-nums">{qte}</span>
            <button type="button" onClick={() => setQte((q) => Math.min(30, q + 1))} aria-label="Ajouter un" className="grid size-12 place-items-center rounded-full hover:bg-doux"><Plus className="size-4" strokeWidth={3} /></button>
          </div>
          <button
            type="button"
            onClick={() => { ajouter(p.id, sel, qte); setSel(selectionInitiale(p)); setQte(1); setAjoute(true); setTimeout(() => setAjoute(false), 1400); apresAjout?.(); }}
            className="flex h-14 flex-1 items-center justify-between gap-3 rounded-full bg-rouge px-6 font-display text-base font-extrabold text-white shadow-[0_12px_28px_-12px_rgba(140,2,10,.7)] transition-colors hover:bg-rouge-fonce"
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
