"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronRight, ShoppingBag, X } from "lucide-react";
import { CATEGORIES, PRODUITS, type CategorieId, type Produit } from "@/data/menu";
import { prix } from "@/lib/format";
import { usePanier } from "@/lib/panier";
import { useFenetre } from "@/lib/useVerrouDefilement";
import { site } from "@/config/site";
import { Photo } from "./Photo";
import { Logo } from "./Logo";
import { EnTete } from "./Sections";
import { AjoutProduit } from "./AjoutProduit";

/**
 * CARTE DIGITALE
 * Sur la page : les tuiles de catégories.
 * Au clic : la carte s'ouvre en plein écran, comme un menu QR :
 *   catégories → liste numérotée → fiche du plat (précédent / suivant, à découvrir aussi).
 */

type Vue = { niveau: "categories" } | { niveau: "liste"; cat: CategorieId } | { niveau: "plat"; cat: CategorieId; id: string };

/** Ouvre la carte digitale depuis n'importe où (bannière, spécialités...). */
export function ouvrirCarte(cat?: CategorieId) {
  window.dispatchEvent(new CustomEvent("bowlys-carte", { detail: cat ?? null }));
}

const nombre = (cat: CategorieId) => PRODUITS.filter((p) => p.categorie === cat).length;
const num = (i: number) => String(i + 1).padStart(2, "0");

/** Tuile de catégorie : photo ou aplat aux couleurs de la marque. */
function Tuile({ c, index, grande = false, onClick }: { c: (typeof CATEGORIES)[number]; index: number; grande?: boolean; onClick: () => void }) {
  const sombre = index % 2 === 1;
  return (
    <button type="button" onClick={onClick} className={`group relative block w-full overflow-hidden rounded-[26px] text-left text-white ${grande ? "aspect-[4/5] sm:aspect-square" : "aspect-square"} ${c.photo ? "bg-encre" : sombre ? "bg-encre" : "bg-bleu"}`}>
      {c.photo ? (
        <>
          <Photo src={c.photo} alt="" className="absolute inset-0" sizes="(max-width: 768px) 50vw, 33vw" />
          <span className="absolute inset-0 bg-gradient-to-t from-encre/85 via-encre/10 to-transparent" />
        </>
      ) : (
        <Logo variante="icone" titre="" className="absolute -right-6 -top-4 w-[70%] text-white/15 transition-transform duration-700 group-hover:-rotate-6 group-hover:scale-105" />
      )}
      <span className="absolute left-5 top-5 font-display text-xs font-black tracking-[0.2em] text-white/85">{num(index)}</span>
      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-6">
        <span className="min-w-0">
          <span className={`block font-display font-black leading-none ${grande ? "text-[clamp(1.8rem,3.4vw,2.6rem)]" : "text-[1.35rem] sm:text-3xl"}`}>{c.nom}</span>
          <span className="mt-2 block text-sm font-semibold text-white/85">{nombre(c.id)} produits</span>
        </span>
        <span className={`shrink-0 place-items-center rounded-full bg-white text-bleu transition-transform duration-500 group-hover:-rotate-45 ${grande ? "grid size-11" : "hidden size-11 sm:grid"}`}>
          <ArrowRight className="size-5" strokeWidth={2.6} />
        </span>
      </span>
    </button>
  );
}

/* ─────────── Section de la page d'accueil ─────────── */
export function Carte() {
  return (
    <section id="carte" aria-labelledby="carte-titre" className="feuille sous-feuille bg-white pt-24 sm:pt-32">
      <div className="mx-auto max-w-[1180px] px-[max(20px,env(safe-area-inset-left))]">
        <EnTete id="carte-titre" surtitre="Notre carte" titre="La carte" sousTitre="Choisissez une catégorie pour découvrir nos plats et leurs prix." />
        <div className="mt-14 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-6">
          {CATEGORIES.map((c, i) => (
            <div key={c.id} className={`${i < 2 ? "col-span-2 sm:col-span-1 lg:col-span-3" : "lg:col-span-2"} ${i === 4 ? "col-span-2 sm:col-span-1" : ""} ${["apparait", "apparait-2", "apparait", "apparait-2", "apparait-3"][i]}`}>
              <Tuile c={c} index={i} grande={i < 2} onClick={() => ouvrirCarte(c.id)} />
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-sm font-semibold text-gris">Prix TTC · Allergènes : demandez-les au comptoir.</p>
      </div>
    </section>
  );
}

/* ─────────── Carte digitale plein écran ─────────── */
export function CarteDigitale() {
  const { nbArticles, ouvrirPanier, panierOuvert, bump } = usePanier();
  const [vue, setVue] = useState<Vue | null>(null);
  const [sens, setSens] = useState<"avant" | "arriere">("avant");
  const ref = useRef<HTMLDivElement>(null);
  const corps = useRef<HTMLDivElement>(null);
  const fermer = useCallback(() => setVue(null), []);
  useFenetre(!!vue && !panierOuvert, ref, fermer);

  useEffect(() => {
    const f = (e: Event) => {
      const cat = (e as CustomEvent<CategorieId | null>).detail;
      setSens("avant");
      setVue(cat ? { niveau: "liste", cat } : { niveau: "categories" });
    };
    window.addEventListener("bowlys-carte", f);
    return () => window.removeEventListener("bowlys-carte", f);
  }, []);
  useEffect(() => { corps.current?.scrollTo({ top: 0 }); }, [vue]);

  if (!vue) return null;

  const aller = (v: Vue, s: "avant" | "arriere" = "avant") => { setSens(s); setVue(v); };
  const retour = () => {
    if (vue.niveau === "plat") aller({ niveau: "liste", cat: vue.cat }, "arriere");
    else if (vue.niveau === "liste") aller({ niveau: "categories" }, "arriere");
    else fermer();
  };
  const cat = vue.niveau !== "categories" ? CATEGORIES.find((c) => c.id === vue.cat)! : null;
  const liste = cat ? PRODUITS.filter((p) => p.categorie === cat.id) : [];
  const anim = sens === "avant" ? "anim-vue-avant" : "anim-vue-arriere";

  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label="La carte BOWLY'S" className="anim-carte fixed inset-0 z-[55] flex flex-col bg-white">
      {/* Barre du haut */}
      <div className="border-b border-trait bg-white pt-[env(safe-area-inset-top)]">
        <div className="mx-auto grid h-16 max-w-[1100px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-[max(16px,env(safe-area-inset-left))]">
          <button type="button" onClick={retour} className="flex w-fit items-center gap-2 rounded-full py-2 pl-2 pr-4 font-display font-extrabold hover:bg-doux">
            <ArrowLeft className="size-5" strokeWidth={2.6} />
            <span className="hidden sm:inline">{vue.niveau === "categories" ? "Fermer" : vue.niveau === "liste" ? "Catégories" : cat!.nom}</span>
            <span className="sr-only sm:hidden">Retour</span>
          </button>
          <Logo variante="nom" titre="BOWLY'S" className="w-[104px] text-bleu" />
          <div className="flex items-center justify-end gap-1">
            {site.commande.panierActif && (
              <button type="button" onClick={() => ouvrirPanier()} aria-label={`Panier, ${nbArticles} article${nbArticles > 1 ? "s" : ""}`} className="relative grid size-11 place-items-center rounded-full hover:bg-doux">
                <ShoppingBag className="size-[22px]" strokeWidth={2.2} />
                {nbArticles > 0 && <span key={bump} className="anim-pop absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-bleu px-1 text-[0.7rem] font-extrabold text-white ring-2 ring-white">{nbArticles}</span>}
              </button>
            )}
            <button type="button" onClick={fermer} aria-label="Fermer la carte" className="grid size-11 place-items-center rounded-full hover:bg-doux"><X className="size-5" strokeWidth={2.6} /></button>
          </div>
        </div>
        {/* Onglets de catégories (liste et fiche) */}
        {vue.niveau !== "categories" && (
          <nav aria-label="Catégories" className="sans-barre mx-auto flex max-w-[1100px] gap-1.5 overflow-x-auto px-[max(16px,env(safe-area-inset-left))] pb-3">
            {CATEGORIES.map((c) => (
              <button key={c.id} type="button" aria-current={cat!.id === c.id ? "true" : undefined} onClick={() => aller({ niveau: "liste", cat: c.id })} className={`h-10 shrink-0 rounded-full px-4 font-display text-[0.95rem] font-extrabold transition-colors ${cat!.id === c.id ? "bg-bleu text-white" : "bg-doux text-encre hover:text-bleu"}`}>
                {c.nom}
              </button>
            ))}
          </nav>
        )}
      </div>

      <div ref={corps} className="flex-1 overflow-y-auto overscroll-contain pb-[max(32px,env(safe-area-inset-bottom))]">
        <div key={JSON.stringify(vue)} className={`${anim} mx-auto max-w-[1100px] px-[max(16px,env(safe-area-inset-left))]`}>
          {/* 1. Catégories */}
          {vue.niveau === "categories" && (
            <div className="py-8 sm:py-12">
              <div className="text-center">
                <p className="font-display text-[0.78rem] font-extrabold uppercase tracking-[0.26em] text-bleu">La carte</p>
                <h2 className="mt-3 font-display text-[clamp(2.2rem,5vw,3.4rem)] font-black leading-none">Que voulez-vous manger ?</h2>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
                {CATEGORIES.map((c, i) => (
                  <div key={c.id} className={i === 0 ? "col-span-2 md:col-span-1" : ""}>
                    <Tuile c={c} index={i} onClick={() => aller({ niveau: "liste", cat: c.id })} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Liste numérotée */}
          {vue.niveau === "liste" && cat && (
            <div className="py-6 sm:py-10">
              <div className={`relative overflow-hidden rounded-[26px] text-white ${cat.photo ? "bg-encre" : "bg-bleu"}`}>
                {cat.photo && (
                  <>
                    <Photo src={cat.photo} alt="" className="absolute inset-0" zoom={false} sizes="1100px" />
                    <span className="absolute inset-0 bg-gradient-to-r from-encre/85 via-encre/50 to-encre/10" />
                  </>
                )}
                {!cat.photo && <Logo variante="icone" titre="" className="absolute -right-8 -top-6 w-64 text-white/15" />}
                <div className="relative px-6 py-10 sm:px-10 sm:py-14">
                  <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.24em] text-white/80">{liste.length} produits</p>
                  <h2 className="mt-2 font-display text-[clamp(2.4rem,6vw,4rem)] font-black leading-none">{cat.nom}</h2>
                  <p className="mt-3 font-semibold text-white/90">{cat.accroche}</p>
                </div>
              </div>
              <ol className="mt-6 grid gap-2 md:grid-cols-2 md:gap-3">
                {liste.map((p, i) => (
                  <li key={p.id}>
                    <button type="button" onClick={() => aller({ niveau: "plat", cat: cat.id, id: p.id })} className="group flex w-full items-center gap-3 rounded-[20px] p-3 text-left ring-1 ring-trait transition-[box-shadow,background] hover:bg-doux hover:ring-bleu/40 sm:gap-4">
                      <span className="w-6 shrink-0 text-center font-display text-sm font-black text-bleu">{num(i)}</span>
                      <Photo src={p.photo} alt="" vignette className="size-16 shrink-0 rounded-2xl sm:size-[72px]" sizes="72px" />
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-lg font-black leading-tight">{p.nom}</span>
                        <span className="mt-0.5 line-clamp-1 text-sm text-gris">{p.description}</span>
                        <span className="mt-1 block font-display font-black text-bleu">{prix(p.prix)}</span>
                      </span>
                      <ChevronRight className="size-5 shrink-0 text-gris transition-transform group-hover:translate-x-1" />
                    </button>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-center text-sm font-semibold text-gris">Prix TTC · Allergènes : demandez-les au comptoir.</p>
            </div>
          )}

          {/* 3. Fiche du plat */}
          {vue.niveau === "plat" && cat && (() => {
            const i = liste.findIndex((p) => p.id === vue.id);
            const p = liste[i] as Produit;
            const prec = liste[(i - 1 + liste.length) % liste.length];
            const suiv = liste[(i + 1) % liste.length];
            return (
              <div className="py-6 sm:py-10">
                <div className="grid gap-8 md:grid-cols-2 md:gap-12">
                  <Photo src={p.photo} alt={p.nom} illustration={p.illustration} priorite zoom={false} className="anim-zoom aspect-square rounded-[28px]" sizes="(max-width: 768px) 100vw, 540px" />
                  <div className="flex flex-col">
                    <p className="font-display text-[0.78rem] font-extrabold uppercase tracking-[0.24em] text-bleu">{cat.nom} · {num(i)} / {num(liste.length - 1)}</p>
                    <h2 className="mt-3 font-display text-[clamp(2.2rem,5vw,3.4rem)] font-black leading-[1.02]">{p.nom}</h2>
                    <p className="mt-3 font-display text-3xl font-black text-bleu">{prix(p.prix)}</p>
                    <p className="mt-5 text-lg text-gris">{p.description}</p>
                    <div className="mt-7"><AjoutProduit p={p} /></div>
                    {liste.length > 1 && (
                      <div className="mt-8 grid grid-cols-2 gap-3 border-t border-trait pt-6">
                        <button type="button" onClick={() => aller({ niveau: "plat", cat: cat.id, id: prec.id }, "arriere")} className="rounded-2xl p-3 text-left hover:bg-doux">
                          <span className="flex items-center gap-1 text-xs font-extrabold uppercase tracking-[0.18em] text-gris"><ArrowLeft className="size-3.5" />Précédent</span>
                          <span className="mt-1 block font-display font-black">{prec.nom}</span>
                        </button>
                        <button type="button" onClick={() => aller({ niveau: "plat", cat: cat.id, id: suiv.id })} className="rounded-2xl p-3 text-right hover:bg-doux">
                          <span className="flex items-center justify-end gap-1 text-xs font-extrabold uppercase tracking-[0.18em] text-gris">Suivant<ArrowRight className="size-3.5" /></span>
                          <span className="mt-1 block font-display font-black">{suiv.nom}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {liste.length > 1 && (
                  <div className="mt-12">
                    <p className="font-display text-xl font-black">À découvrir aussi</p>
                    <div className="sans-barre -mx-[max(16px,env(safe-area-inset-left))] mt-4 flex gap-3 overflow-x-auto px-[max(16px,env(safe-area-inset-left))] pb-2">
                      {liste.filter((x) => x.id !== p.id).map((x) => (
                        <button key={x.id} type="button" onClick={() => aller({ niveau: "plat", cat: cat.id, id: x.id })} className="group w-40 shrink-0 text-left sm:w-48">
                          <Photo src={x.photo} alt="" vignette className="aspect-square rounded-[20px]" sizes="192px" />
                          <span className="mt-2 block font-display font-black leading-tight">{x.nom}</span>
                          <span className="font-display text-sm font-black text-bleu">{prix(x.prix)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
