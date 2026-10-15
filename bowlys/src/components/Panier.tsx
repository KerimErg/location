"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Minus, Plus, X, ShoppingBag, ArrowLeft, Store, Bike, Info, Trash2 } from "lucide-react";
import { OPTIONS, PRODUITS } from "@/data/menu";
import { prix } from "@/lib/format";
import { usePanier, produitParId, prixLigne } from "@/lib/panier";
import { useFenetre } from "@/lib/useVerrouDefilement";
import { site, adresseLigne, lienItineraire } from "@/config/site";
import { Photo } from "./Photo";
import { LienBouton } from "./Bouton";

type Etape = "panier" | "mode" | "infos" | "envoi";
type Infos = { prenom: string; telephone: string; note: string };

/**
 * Panier + tunnel de commande.
 * Tant que `site.commande.envoi` vaut null, la dernière étape explique honnêtement
 * que rien n'est transmis ni payé, et propose les moyens de commander qui existent.
 */
export function Panier() {
  const { lignes, total, nbArticles, changerQte, retirer, vider, panierOuvert, ouvrirPanier, ajouter } = usePanier();
  const [etape, setEtape] = useState<Etape>("panier");
  const [mode, setMode] = useState<"retrait" | "livraison">("retrait");
  const [infos, setInfos] = useState<Infos>({ prenom: "", telephone: "", note: "" });
  const [erreurs, setErreurs] = useState<Partial<Record<keyof Infos, string>>>({});
  const ref = useRef<HTMLDivElement>(null);
  const fermer = useCallback(() => ouvrirPanier(false), [ouvrirPanier]);
  useFenetre(panierOuvert, ref, fermer);
  useEffect(() => { if (!panierOuvert) setEtape("panier"); }, [panierOuvert]);
  useEffect(() => { if (!nbArticles) setEtape("panier"); }, [nbArticles]);

  if (!panierOuvert) return null;

  const modes = [
    site.commande.retraitSurPlace && { id: "retrait" as const, nom: "Retrait au restaurant", detail: adresseLigne() ?? "", Icone: Store },
    site.commande.livraison && { id: "livraison" as const, nom: "Livraison", detail: "Selon la zone desservie", Icone: Bike },
  ].filter(Boolean) as { id: "retrait" | "livraison"; nom: string; detail: string; Icone: typeof Store }[];

  const valider = () => {
    const e: typeof erreurs = {};
    if (infos.prenom.trim().length < 2) e.prenom = "Indiquez votre prénom.";
    if (!/^(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/.test(infos.telephone.trim())) e.telephone = "Numéro invalide. Exemple : 06 12 34 56 78";
    setErreurs(e);
    if (!Object.keys(e).length) setEtape("envoi");
  };

  const titres: Record<Etape, string> = { panier: "Votre panier", mode: "Retrait ou livraison", infos: "Vos coordonnées", envoi: "Récapitulatif" };
  const precedent: Partial<Record<Etape, Etape>> = { mode: "panier", infos: "mode", envoi: "infos" };
  const champ = "mt-1.5 h-13 w-full rounded-2xl bg-doux px-4 py-3.5 font-semibold ring-2 ring-transparent outline-none transition focus:bg-white focus:ring-bleu";

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-labelledby="panier-titre">
      <button type="button" tabIndex={-1} aria-label="Fermer le panier" onClick={fermer} className="anim-fondu absolute inset-0 bg-encre/60 backdrop-blur-[2px]" />
      <div ref={ref} className="anim-tiroir absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col bg-white pt-[env(safe-area-inset-top)] shadow-2xl">
        <div className="flex items-center gap-3 border-b border-trait px-5 py-4">
          {precedent[etape] ? (
            <button type="button" onClick={() => setEtape(precedent[etape]!)} aria-label="Étape précédente" className="grid size-11 place-items-center rounded-full hover:bg-doux"><ArrowLeft className="size-5" strokeWidth={2.6} /></button>
          ) : <ShoppingBag className="ml-2 size-6 text-bleu" strokeWidth={2.4} />}
          <h2 id="panier-titre" className="flex-1 font-display text-xl font-black">{titres[etape]}</h2>
          <button type="button" onClick={fermer} aria-label="Fermer" className="grid size-11 place-items-center rounded-full hover:bg-doux"><X className="size-5" strokeWidth={2.6} /></button>
        </div>

        {etape !== "panier" && (
          <ol aria-label="Étapes" className="flex gap-1.5 px-5 pt-4">
            {(["mode", "infos", "envoi"] as Etape[]).map((s, i) => (
              <li key={s} className={`h-1.5 flex-1 rounded-full ${["mode", "infos", "envoi"].indexOf(etape) >= i ? "bg-bleu" : "bg-trait"}`}><span className="sr-only">Étape {i + 1}</span></li>
            ))}
          </ol>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {etape === "panier" && (lignes.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div className="grid justify-items-center gap-4">
                <span className="grid size-20 place-items-center rounded-full bg-bleu-ciel"><ShoppingBag className="size-9 text-bleu" /></span>
                <p className="font-display text-xl font-black">Votre panier est vide</p>
                <p className="max-w-[28ch] text-gris">Ajoutez un manti, un lahmacun ou un menu depuis la carte.</p>
                <a href="/carte/" onClick={fermer} className="mt-2 inline-flex h-12 items-center rounded-full bg-bleu px-6 font-display font-extrabold text-white hover:bg-bleu-fonce">Voir la carte</a>
              </div>
            </div>
          ) : (
            <ul className="grid gap-4">
              {lignes.map((l) => {
                const p = produitParId(l.produitId)!;
                return (
                  <li key={l.cle} className="flex gap-4">
                    <Photo src={p.photo} alt={p.nom} className="size-20 shrink-0 rounded-2xl" sizes="80px" zoom={false} vignette />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <p className="font-display font-black leading-tight">{p.nom}</p>
                        <button type="button" onClick={() => retirer(l.cle)} aria-label={`Retirer ${p.nom}`} className="-mr-1 -mt-1 grid size-8 shrink-0 place-items-center rounded-full text-gris hover:bg-doux hover:text-encre"><Trash2 className="size-4" /></button>
                      </div>
                      {l.options.length > 0 && <p className="text-sm text-gris">+ {l.options.map((o) => OPTIONS.find((x) => x.id === o)?.nom).join(", ")}</p>}
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-full ring-1 ring-trait">
                          <button type="button" onClick={() => changerQte(l.cle, -1)} aria-label={`Retirer un ${p.nom}`} className="grid size-9 place-items-center rounded-full hover:bg-doux"><Minus className="size-3.5" strokeWidth={3} /></button>
                          <span className="w-7 text-center font-bold tabular-nums">{l.qte}</span>
                          <button type="button" onClick={() => changerQte(l.cle, 1)} aria-label={`Ajouter un ${p.nom}`} className="grid size-9 place-items-center rounded-full hover:bg-doux"><Plus className="size-3.5" strokeWidth={3} /></button>
                        </div>
                        <span className="font-display font-black tabular-nums">{prix(prixLigne(l))}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
              <li><button type="button" onClick={vider} className="text-sm font-semibold text-gris underline underline-offset-4 hover:text-encre">Vider le panier</button></li>
              {!lignes.some((l) => produitParId(l.produitId)?.categorie === "boissons") && (
                <li className="mt-2 rounded-2xl bg-doux p-4">
                  <p className="font-display font-black">Une boisson avec ça ?</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {PRODUITS.filter((p) => p.categorie === "boissons").map((p) => (
                      <button key={p.id} type="button" onClick={() => ajouter(p.id)} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white px-4 text-sm font-extrabold ring-1 ring-trait transition-colors hover:bg-bleu hover:text-white hover:ring-bleu">
                        <Plus className="size-3.5" strokeWidth={3} />{p.nom} · {prix(p.prix)}
                      </button>
                    ))}
                  </div>
                </li>
              )}
            </ul>
          ))}

          {etape === "mode" && (
            <fieldset className="grid gap-3">
              <legend className="sr-only">Mode de commande</legend>
              {modes.map((m) => (
                <label key={m.id} className={`flex cursor-pointer items-center gap-4 rounded-2xl p-5 ring-2 transition-colors ${mode === m.id ? "bg-bleu-ciel ring-bleu" : "ring-trait hover:ring-bleu/50"}`}>
                  <input type="radio" name="mode" className="sr-only" checked={mode === m.id} onChange={() => setMode(m.id)} />
                  <m.Icone className="size-7 text-bleu" />
                  <span><span className="block font-display font-black">{m.nom}</span><span className="text-sm text-gris">{m.detail}</span></span>
                </label>
              ))}
              {!site.commande.livraison && <p className="text-sm text-gris">La livraison n&apos;est pas encore proposée.</p>}
            </fieldset>
          )}

          {etape === "infos" && (
            <form id="form-infos" noValidate onSubmit={(e) => { e.preventDefault(); valider(); }} className="grid gap-5">
              <div>
                <label htmlFor="prenom" className="text-sm font-bold">Prénom</label>
                <input id="prenom" autoComplete="given-name" value={infos.prenom} onChange={(e) => setInfos({ ...infos, prenom: e.target.value })} aria-invalid={!!erreurs.prenom} aria-describedby="e-prenom" className={champ} />
                {erreurs.prenom && <p id="e-prenom" className="mt-1.5 text-sm font-semibold text-[#b42318]">{erreurs.prenom}</p>}
              </div>
              <div>
                <label htmlFor="tel" className="text-sm font-bold">Téléphone</label>
                <input id="tel" type="tel" inputMode="tel" autoComplete="tel" placeholder="06 12 34 56 78" value={infos.telephone} onChange={(e) => setInfos({ ...infos, telephone: e.target.value })} aria-invalid={!!erreurs.telephone} aria-describedby="e-tel" className={champ} />
                {erreurs.telephone && <p id="e-tel" className="mt-1.5 text-sm font-semibold text-[#b42318]">{erreurs.telephone}</p>}
              </div>
              <div>
                <label htmlFor="note" className="text-sm font-bold">Remarque <span className="font-normal text-gris">(facultatif)</span></label>
                <textarea id="note" rows={3} value={infos.note} onChange={(e) => setInfos({ ...infos, note: e.target.value })} className={`${champ} h-auto resize-none`} />
              </div>
            </form>
          )}

          {etape === "envoi" && (
            <div className="grid gap-5">
              <div className="rounded-2xl bg-doux p-5 text-sm">
                <p className="font-display text-base font-black">{infos.prenom} · {infos.telephone}</p>
                <p className="text-gris">{mode === "retrait" ? `Retrait : ${adresseLigne()}` : "Livraison"}</p>
                <ul className="mt-3 grid gap-1 border-t border-trait pt-3">
                  {lignes.map((l) => <li key={l.cle} className="flex justify-between"><span>{l.qte} × {produitParId(l.produitId)?.nom}</span><span className="tabular-nums">{prix(prixLigne(l))}</span></li>)}
                </ul>
              </div>
              {site.commande.envoi === null && (
                <div role="status" className="rounded-2xl border-2 border-bleu bg-bleu-ciel p-5">
                  <p className="flex items-center gap-2 font-display font-black text-bleu"><Info className="size-5" />Commande en ligne bientôt disponible</p>
                  <p className="mt-2 text-sm">
                    Le paiement et l&apos;envoi au restaurant ne sont pas encore activés : <strong>cette commande n&apos;a pas été transmise et rien n&apos;a été payé.</strong> Gardez ce récapitulatif et passez commande directement au comptoir.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {lienItineraire() && <LienBouton href={lienItineraire()!} externe style="bleu">Itinéraire</LienBouton>}
                    {site.telephone && <LienBouton href={`tel:${site.telephone.replace(/\s/g, "")}`} style="contour">Appeler</LienBouton>}
                    {site.commande.uberEats && <LienBouton href={site.commande.uberEats} externe style="contour">Uber Eats</LienBouton>}
                    {site.commande.deliveroo && <LienBouton href={site.commande.deliveroo} externe style="contour">Deliveroo</LienBouton>}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {lignes.length > 0 && etape !== "envoi" && (
          <div className="border-t border-trait px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-4">
            <div className="mb-3 flex items-baseline justify-between">
              <span className="font-semibold text-gris">Total TTC</span>
              <span className="font-display text-2xl font-black tabular-nums">{prix(total)}</span>
            </div>
            {etape === "infos" ? (
              <button type="submit" form="form-infos" className="h-14 w-full rounded-full bg-bleu font-display text-lg font-black text-white hover:bg-bleu-fonce">Voir le récapitulatif</button>
            ) : (
              <button type="button" onClick={() => setEtape(etape === "panier" ? "mode" : "infos")} className="h-14 w-full rounded-full bg-bleu font-display text-lg font-black text-white hover:bg-bleu-fonce">
                {etape === "panier" ? "Commander" : "Continuer"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
