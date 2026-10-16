"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Copy, Navigation, Pause, Phone, Play } from "lucide-react";
import { CATEGORIES, produitsDe, type CategorieId } from "@/data/menu";
import { prix } from "@/lib/format";
import { maintenantParis, duree } from "@/lib/horaires";
import { PastilleStatut, useStatut } from "./StatutLive";
import { site, adresseLigne, lienItineraire, lienPlanIntegre, JOURS } from "@/config/site";
import { Photo } from "./Photo";
import { LienBouton, classesBouton } from "./Bouton";
import { Logo } from "./Logo";

const conteneur = "mx-auto max-w-[1180px] px-[max(20px,env(safe-area-inset-left))]";

/* ─────────── Éléments de signature ─────────── */

/** Surtitre encadré de deux traits : « —— NOTRE CARTE —— ». */
export function Surtitre({ children, clair = false, centre = true }: { children: React.ReactNode; clair?: boolean; centre?: boolean }) {
  return (
    <p className={`flex items-center gap-4 font-display text-[0.78rem] font-extrabold uppercase tracking-[0.26em] ${centre ? "justify-center" : ""} ${clair ? "text-white" : "text-rouge"}`}>
      <span aria-hidden="true" className={`h-px w-10 ${clair ? "bg-white/60" : "bg-rouge/50"}`} />
      {children}
      <span aria-hidden="true" className={`h-px w-10 ${clair ? "bg-white/60" : "bg-rouge/50"}`} />
    </p>
  );
}

/** Ornement : trait · emblème BOWLY'S · trait. */
export function Ornement({ clair = false, className = "" }: { clair?: boolean; className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-3 ${className}`}>
      <span className={`h-px w-14 ${clair ? "bg-white/50" : "bg-rouge/40"}`} />
      <Logo variante="icone" titre="" className={`w-7 ${clair ? "text-white" : "text-rouge"}`} />
      <span className={`h-px w-14 ${clair ? "bg-white/50" : "bg-rouge/40"}`} />
    </div>
  );
}

export function EnTete({ surtitre, titre, id, clair = false, sousTitre }: { surtitre: string; titre: React.ReactNode; id: string; clair?: boolean; sousTitre?: string }) {
  return (
    <div className="apparait mx-auto max-w-[760px] text-center">
      <Surtitre clair={clair}>{surtitre}</Surtitre>
      <h2 id={id} className="mt-5 font-display text-[clamp(2.4rem,5.4vw,4.2rem)] font-extrabold leading-[0.98] tracking-[-0.025em]">{titre}</h2>
      <Ornement clair={clair} className="mt-6" />
      {sousTitre && <p className={`mx-auto mt-6 max-w-[48ch] text-lg font-semibold ${clair ? "text-white/90" : "text-gris"}`}>{sousTitre}</p>}
    </div>
  );
}

/* ─────────── Bienvenue chez BOWLY'S ─────────── */
export function Bienvenue() {
  return (
    <section id="concept" aria-labelledby="bienvenue-titre" className="sous-feuille relative overflow-hidden bg-white pt-24 sm:pt-36">
      <div className={`${conteneur} grid items-center gap-16 lg:grid-cols-2 lg:gap-24`}>
        {/* Arche photo + vignette + mention verticale */}
        <div className="apparait relative mx-auto w-full max-w-[440px]">
          <span aria-hidden="true" className="absolute -left-10 top-1/2 hidden -translate-y-1/2 -rotate-90 whitespace-nowrap text-[0.62rem] font-extrabold uppercase tracking-[0.42em] text-rouge/70 lg:block">
            Bowly&apos;s · Schiltigheim
          </span>
          <div className="rounded-t-full border border-rouge/25 p-3 pb-3">
            <div className="parallaxe relative aspect-[3/4] overflow-hidden rounded-t-full bg-encre">
              <Photo src="/images/four-a-bois.webp" alt="Lahmacuns qui cuisent dans un four à bois" className="absolute inset-0" sizes="(max-width: 1024px) 90vw, 440px" zoom={false} />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-4 w-[38%] bg-white p-1.5 shadow-[0_24px_50px_-24px_rgba(11,15,26,.55)] sm:-right-10">
            <Photo src="/images/lahmacun-gros-plan.webp" alt="Gros plan sur un lahmacun" vignette className="aspect-[4/5]" sizes="180px" zoom={false} />
          </div>
          <p className="mt-16 text-left text-[0.62rem] font-extrabold uppercase tracking-[0.32em] text-gris">Photos d&apos;illustration</p>
        </div>

        <div className="apparait-2 text-center">
          <Surtitre>Lahmacun · Dürüm</Surtitre>
          <h2 id="bienvenue-titre" className="mt-8 font-display font-extrabold tracking-[-0.02em]">
            <span className="block text-[clamp(2.8rem,5.6vw,4.4rem)] leading-none">Bienvenue</span>
            <span className="mt-4 flex items-center justify-center gap-4 text-lg font-bold text-gris">
              <span aria-hidden="true" className="h-px w-12 bg-rouge/40" />chez<span aria-hidden="true" className="h-px w-12 bg-rouge/40" />
            </span>
            <Logo variante="nom" titre="BOWLY'S" className="mx-auto mt-5 w-[min(100%,340px)] text-rouge" />
          </h2>
          <Ornement className="mt-9" />
          <p className="mx-auto mt-8 max-w-[42ch] text-[1.08rem] leading-relaxed text-gris">
            Chez BOWLY&apos;S, tout tourne autour du lahmacun : en box de petits formats pour partager, ou en dürüm grand format que vous composez vous-même. Une pâte fine, une garniture généreuse, et une carte courte à déguster sur place ou à emporter.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <LienBouton href="/carte/" taille="lg">Découvrir la carte</LienBouton>
            <LienBouton href="/#contact" style="contour" taille="lg">Nous trouver</LienBouton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── Notre carte : vitrine interactive ─────────── */
const VITRINE: { cat: CategorieId; photo: string | null; phrase: string }[] = [
  { cat: "box", photo: "/images/carte/box-nature.webp", phrase: "Des lahmacuns petit format, en box : nature, végétarien, poulet ou émincé de bœuf." },
  { cat: "durum", photo: "/images/carte/durum.webp", phrase: "Le lahmacun grand format roulé : tu choisis ton lahmacun, tes crudités et ta sauce." },
  { cat: "desserts", photo: "/images/carte/tiramisu.webp", phrase: "Panna cotta ou tiramisu, pour finir en douceur." },
];

export function Specialites() {
  const [actif, setActif] = useState(0);
  const v = VITRINE[actif];
  const cat = CATEGORIES.find((c) => c.id === v.cat)!;
  const produits = produitsDe(v.cat);
  const desPrix = Math.min(...produits.map((p) => p.prix));
  return (
    <section id="specialites" aria-labelledby="spe-titre" className="sur-sombre feuille sous-feuille overflow-hidden bg-rouge pt-24 text-white sm:pt-32">
      <Logo variante="icone" titre="" className="pointer-events-none absolute -left-24 bottom-10 w-[420px] text-white/[0.06]" />
      <div className={`${conteneur} relative grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20`}>
        <div className="apparait min-w-0">
          <Surtitre clair centre={false}>Notre carte</Surtitre>
          <h2 id="spe-titre" className="sr-only">Notre carte</h2>

          {/* Sélecteur : grands titres sur ordinateur, pastilles sur mobile */}
          <div role="tablist" aria-label="Spécialités" className="mt-8 hidden gap-1 lg:grid">
            {VITRINE.map((x, i) => {
              const c = CATEGORIES.find((k) => k.id === x.cat)!;
              const on = i === actif;
              return (
                <button key={x.cat} role="tab" aria-selected={on} aria-controls="vitrine" onMouseEnter={() => setActif(i)} onFocus={() => setActif(i)} onClick={() => setActif(i)}
                  className={`group flex items-baseline gap-5 text-left font-display text-[clamp(2.2rem,3.4vw,3.4rem)] font-extrabold leading-[1.08] tracking-[-0.02em] transition-colors duration-300 ${on ? "text-white" : "text-white/35 hover:text-white/70"}`}>
                  <span className="w-8 text-sm font-extrabold tracking-[0.2em] opacity-80">{String(i + 1).padStart(2, "0")}</span>
                  {c.nom}
                  <ArrowRight className={`size-8 self-center transition-all duration-300 ${on ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"}`} strokeWidth={2.6} />
                </button>
              );
            })}
          </div>
          <div role="tablist" aria-label="Spécialités" className="sans-barre -mx-1 mt-7 flex gap-2 overflow-x-auto px-1 lg:hidden">
            {VITRINE.map((x, i) => {
              const c = CATEGORIES.find((k) => k.id === x.cat)!;
              return (
                <button key={x.cat} role="tab" aria-selected={i === actif} aria-controls="vitrine" onClick={() => setActif(i)}
                  className={`h-11 shrink-0 rounded-full px-5 font-display font-extrabold transition-colors ${i === actif ? "bg-white text-rouge" : "bg-white/15 text-white"}`}>
                  {c.nom}
                </button>
              );
            })}
          </div>

          <div key={v.cat} className="anim-monter mt-8 hidden lg:block">
            <p className="max-w-[40ch] text-lg font-semibold text-white/90">{v.phrase}</p>
            <ListeVitrine produits={produits} />
            <div className="mt-8 flex flex-wrap gap-3">
              <LienBouton href={`/carte/${cat.id}/`} style="blanc" taille="lg">Voir les {cat.nom.toLowerCase()} <ArrowRight className="size-5" /></LienBouton>
              <LienBouton href="/carte/" style="contour-blanc" taille="lg">Toute la carte</LienBouton>
            </div>
          </div>
        </div>

        <div id="vitrine" role="tabpanel" className="apparait-2 min-w-0">
          <Link href={`/carte/${cat.id}/`} className="group relative block aspect-[4/5] overflow-hidden rounded-[2rem] bg-encre shadow-[0_50px_90px_-40px_rgba(0,0,0,.6)] sm:aspect-square lg:aspect-[4/5]">
            {VITRINE.map((x, i) => (
              <span key={x.cat} aria-hidden={i !== actif} className={`absolute inset-0 transition-opacity duration-700 ${i === actif ? "opacity-100" : "opacity-0"}`}>
                {x.photo ? (
                  <Photo src={x.photo} alt="" className={`absolute inset-0 ${i === actif ? "[&_img]:scale-100" : "[&_img]:scale-110"} [&_img]:transition-transform [&_img]:duration-[1.4s]`} sizes="(max-width: 1024px) 100vw, 560px" zoom={false} />
                ) : (
                  <span className="absolute inset-0 grid place-items-center bg-white text-rouge">
                    <span className="grid justify-items-center gap-5">
                      <IconeAccomp />
                      <span className="flex flex-wrap justify-center gap-2 px-6">
                        {produitsDe("boissons").map((p) => <span key={p.id} className="rounded-full bg-creme px-3 py-1.5 text-sm font-extrabold">{p.nom}</span>)}
                      </span>
                    </span>
                  </span>
                )}
              </span>
            ))}
            {v.photo && <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-encre/80 to-transparent" />}
            <span className={`absolute right-5 top-5 grid size-24 -rotate-6 place-items-center rounded-full text-center shadow-xl transition-transform duration-500 group-hover:rotate-0 sm:size-28 ${v.photo ? "bg-white text-rouge" : "bg-rouge text-white"}`}>
              <span className="leading-none">
                <span className="block text-[0.65rem] font-extrabold uppercase tracking-[0.16em]">dès</span>
                <span className="mt-1 block font-display text-2xl font-extrabold sm:text-[1.7rem]">{prix(desPrix).replace(",00", "")}</span>
              </span>
            </span>
            <span className={`absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-8 ${v.photo ? "" : "text-encre"}`}>
              <span>
                <span className={`block text-[0.72rem] font-extrabold uppercase tracking-[0.22em] ${v.photo ? "text-white/80" : "text-rouge"}`}>{produits.length} {produits.length > 1 ? "choix" : "recette"}</span>
                <span className={`mt-1 block font-display font-extrabold leading-none ${cat.nom.length > 10 ? "text-[clamp(1.6rem,3.2vw,2.2rem)]" : "text-[clamp(2rem,4vw,2.8rem)]"}`}>{cat.nom}</span>
              </span>
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-rouge text-white transition-transform duration-500 group-hover:-rotate-45"><ArrowRight className="size-6" strokeWidth={2.6} /></span>
            </span>
          </Link>

          {/* Mobile : texte et liste sous la photo */}
          <div key={`m-${v.cat}`} className="anim-monter mt-7 lg:hidden">
            <p className="text-[1.05rem] font-semibold text-white/90">{v.phrase}</p>
            <ListeVitrine produits={produits} />
            <div className="mt-7 grid gap-3">
              <LienBouton href={`/carte/${cat.id}/`} style="blanc" taille="lg" className="w-full">Voir les {cat.nom.toLowerCase()}</LienBouton>
              <LienBouton href="/carte/" style="contour-blanc" taille="lg" className="w-full">Toute la carte</LienBouton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ListeVitrine({ produits }: { produits: ReturnType<typeof produitsDe> }) {
  return (
    <ul className="mt-6 grid gap-0.5">
      {produits.map((p) => (
        <li key={p.id}>
          <Link href={`/carte/${p.categorie}/${p.id}/`} className="group flex items-baseline gap-3 border-b border-white/15 py-3 font-display text-lg font-extrabold">
            <span className="transition-transform duration-300 group-hover:translate-x-1">{p.nom}{p.badge && <span className="ml-2 rounded-full bg-white px-2 py-0.5 align-middle text-[0.6rem] font-extrabold uppercase tracking-[0.12em] text-rouge">★ {p.badge}</span>}</span>
            <span aria-hidden="true" className="flex-1 border-b-2 border-dotted border-white/25" />
            <span className="tabular-nums">{prix(p.prix)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function IconeAccomp() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="w-24">
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6h8v6l3 4v26H17V16l3-4z" /><path d="M17 25h14M17 33h14" />
      </g>
    </svg>
  );
}

/* ─────────── Galerie façon story Instagram ─────────── */
const STORIES = [
  { src: "/images/four-a-bois.webp", alt: "Le four à bois" },
  { src: "/images/lahmacun-pelle.webp", alt: "Lahmacuns qui sortent du four" },
  { src: "/images/legumes.webp", alt: "Légumes frais découpés" },
  { src: "/images/lahmacun-gros-plan.webp", alt: "Gros plan sur un lahmacun" },
];

export function Galerie() {
  const [i, setI] = useState(0);
  const [lecture, setLecture] = useState(true);
  useEffect(() => { if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setLecture(false); }, []);
  useEffect(() => {
    if (!lecture) return;
    const t = setTimeout(() => setI((x) => (x + 1) % STORIES.length), 4500);
    return () => clearTimeout(t);
  }, [i, lecture]);
  if (!site.reseaux.instagram) return null;
  return (
    <section aria-labelledby="galerie-titre" className="sur-sombre feuille sous-feuille overflow-hidden bg-encre pt-24 text-white sm:pt-32">
      <div className={`${conteneur} grid items-center gap-16 md:grid-cols-2 md:gap-24`}>
        <div className="apparait relative mx-auto w-[min(78vw,340px)] md:order-2">
          <div aria-hidden="true" className="absolute -inset-12 -z-10 rounded-full bg-rouge/45 blur-3xl" />
          <div className="relative aspect-[9/16] overflow-hidden rounded-[34px] bg-encre shadow-[0_50px_90px_-40px_rgba(11,15,26,.7)] ring-8 ring-white/10">
            {STORIES.map((s, k) => (
              <div key={s.src} className={`absolute inset-0 transition-opacity duration-700 ${k === i ? "opacity-100" : "opacity-0"}`} aria-hidden={k !== i}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.alt} className={`size-full object-cover ${k === i && lecture ? "story-zoom" : ""}`} />
              </div>
            ))}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 to-transparent" />
            <div className="absolute inset-x-3 top-3 flex gap-1">
              {STORIES.map((s, k) => (
                <span key={s.src} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/35">
                  <span key={`${i}-${k}`} className={`block h-full bg-white ${k < i ? "" : k === i && lecture ? "story-barre" : "scale-x-0"} ${k === i && !lecture ? "scale-x-100" : ""}`} style={{ transformOrigin: "left" }} />
                </span>
              ))}
            </div>
            <div className="absolute left-4 top-7 flex items-center gap-2.5 text-white">
              <span className="grid size-9 place-items-center rounded-full bg-white"><Logo variante="icone" titre="" className="w-5 text-rouge" /></span>
              <span className="text-sm font-bold">bowlys</span>
            </div>
            <button type="button" onClick={() => setI((x) => (x + 1) % STORIES.length)} aria-label="Photo suivante" className="absolute inset-y-0 right-0 w-1/2" />
            <button type="button" onClick={() => setI((x) => (x - 1 + STORIES.length) % STORIES.length)} aria-label="Photo précédente" className="absolute inset-y-0 left-0 w-1/2" />
            <button type="button" onClick={() => setLecture((l) => !l)} aria-label={lecture ? "Mettre en pause" : "Lancer le défilement"} className="absolute bottom-4 right-4 grid size-10 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm">
              {lecture ? <Pause className="size-4" fill="currentColor" /> : <Play className="size-4" fill="currentColor" />}
            </button>
            <span className="absolute bottom-5 left-4 rounded-full bg-black/40 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">Photos d&apos;illustration</span>
          </div>
        </div>
        <div className="apparait text-center md:text-left">
          <div className="md:[&_p]:justify-start"><Surtitre centre={false} clair>Galerie</Surtitre></div>
          <h2 id="galerie-titre" className="mt-5 font-display text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.025em]">
            Ça se passe aussi sur Instagram.
          </h2>
          <p className="mx-auto mt-6 max-w-[40ch] text-lg text-white/85 md:mx-0">Les nouveautés, les coulisses et les plats du moment : suivez-nous.</p>
          <LienBouton href={site.reseaux.instagram} externe style="blanc" taille="lg" className="mt-9">
            @bowlys <ArrowUpRight className="size-5" />
          </LienBouton>
        </div>
      </div>
    </section>
  );
}

/* ─────────── Nous trouver ─────────── */
function Plan() {
  const [charge, setCharge] = useState(false);
  const [encadre, setEncadre] = useState(false);
  useEffect(() => { setEncadre(window.self !== window.top); }, []);
  const src = lienPlanIntegre();
  if (!src) return null;
  return (
    <div className="sur-sombre relative h-full min-h-[340px] overflow-hidden rounded-[2rem] bg-encre text-white">
      {charge ? (
        <iframe src={src} title={`Plan d'accès BOWLY'S, ${adresseLigne()}`} className="absolute inset-0 size-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <div className="absolute inset-0 grid place-items-center p-8 text-center">
          {/* rues stylisées */}
          <svg aria-hidden="true" className="absolute inset-0 size-full opacity-[0.14]" preserveAspectRatio="none" viewBox="0 0 400 300">
            <g fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round"><path d="M-20 210 C 80 190 140 120 420 140" /><path d="M120 -20 L 170 320" /><path d="M300 -20 C 280 80 300 200 260 320" /></g>
            <g fill="none" stroke="#fff" strokeWidth="3"><path d="M-20 60 L 420 90" /><path d="M-20 270 L 420 250" /><path d="M40 -20 L 70 320" /><path d="M360 -20 L 380 320" /></g>
          </svg>
          <div aria-hidden="true" className="absolute left-1/2 top-[44%] size-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rouge/30 blur-3xl" />
          <div className="relative grid justify-items-center gap-5">
            <span className="relative grid size-20 place-items-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-rouge/50" />
              <span className="relative grid size-20 place-items-center rounded-full bg-rouge shadow-[0_0_0_10px_rgba(140,2,10,.25)]">
                <Logo variante="icone" titre="" className="w-10 text-white" />
              </span>
            </span>
            <p className="font-display text-2xl font-extrabold leading-tight">{site.restaurant!.rue}<br />{site.restaurant!.codePostal} {site.restaurant!.ville}</p>
            {encadre ? (
              <LienBouton href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adresseLigne()!)}`} externe style="blanc" taille="lg">Ouvrir le plan <ArrowUpRight className="size-5" /></LienBouton>
            ) : (
              <button type="button" onClick={() => setCharge(true)} className={classesBouton("blanc", "lg")}>Afficher le plan</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function BoutonCopier() {
  const [ok, setOk] = useState(false);
  const copier = async () => {
    const a = adresseLigne()!;
    try { await navigator.clipboard.writeText(a); setOk(true); }
    catch {
      const t = document.getElementById("adresse-texte");
      if (t) { const r = document.createRange(); r.selectNodeContents(t); const sel = getSelection(); sel?.removeAllRanges(); sel?.addRange(r); }
    }
    setTimeout(() => setOk(false), 1800);
  };
  return (
    <button type="button" onClick={copier} className="inline-flex h-10 items-center gap-2 rounded-full bg-white/15 px-4 text-sm font-extrabold text-white transition-colors hover:bg-white/25">
      {ok ? <Check className="size-4" strokeWidth={3} /> : <Copy className="size-4" />}{ok ? "Adresse copiée" : "Copier l'adresse"}
    </button>
  );
}

export function NousTrouver() {
  const h = site.horaires;
  const s = useStatut();
  const [aujourdhui, setAujourdhui] = useState<string | null>(null);
  useEffect(() => { setAujourdhui(maintenantParis().jour); }, []);
  if (!site.restaurant) return null;
  const a = encodeURIComponent(adresseLigne()!);
  const itineraires = [
    { nom: "Google Maps", href: lienItineraire()! },
    { nom: "Waze", href: `https://waze.com/ul?q=${a}&navigate=yes` },
    { nom: "Plans", href: `https://maps.apple.com/?daddr=${a}` },
  ];
  const tel = site.telephone;

  return (
    <section id="contact" aria-labelledby="contact-titre" className="feuille sous-feuille bg-doux pt-24 sm:pt-32">
      <div className={conteneur}>
        <EnTete id="contact-titre" surtitre="Contact" titre="On vous attend." />

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          {/* Carte vivante : statut, compte à rebours, actions */}
          <div className="sur-sombre apparait relative overflow-hidden rounded-[2rem] bg-rouge p-7 text-white sm:p-10">
            <Logo variante="icone" titre="" className="pointer-events-none absolute -bottom-10 -right-10 w-72 text-white/10" />
            <div className="relative">
              <PastilleStatut ton="clair" />
              <p className="mt-6 font-display text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.02em]">
                {s ? (s.ouvert ? <>On est ouverts,<br />venez vite !</> : <>Bientôt l&apos;heure<br />du lahmacun.</>) : <>Le lahmacun<br />vous attend.</>}
              </p>
              {s?.dans != null && (
                <p className="mt-3 text-lg font-semibold text-white/90">
                  {s.ouvert ? <>Encore <strong className="text-white">{duree(s.dans)}</strong> avant la fermeture.</> : <>Ouverture dans <strong className="text-white">{duree(s.dans)}</strong>.</>}
                </p>
              )}

              <address className="mt-8 not-italic">
                <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.22em] text-white/70">Adresse</span>
                <span id="adresse-texte" className="mt-1 block font-display text-2xl font-extrabold">{site.restaurant.rue}, {site.restaurant.codePostal} {site.restaurant.ville}</span>
              </address>
              <div className="mt-4"><BoutonCopier /></div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {tel && (
                  <a href={`tel:${tel.replace(/\s/g, "")}`} className="group flex h-16 items-center gap-4 rounded-2xl bg-white px-5 text-rouge transition-transform hover:-translate-y-0.5">
                    <span className="grid size-10 place-items-center rounded-full bg-rouge text-white"><Phone className="size-5" /></span>
                    <span className="leading-tight"><span className="block text-xs font-extrabold uppercase tracking-[0.16em] text-rouge/70">Appeler</span><span className="font-display text-lg font-extrabold tabular-nums">{tel}</span></span>
                  </a>
                )}
                <a href={itineraires[0].href} target="_blank" rel="noopener noreferrer" className="group flex h-16 items-center gap-4 rounded-2xl bg-encre px-5 text-white transition-transform hover:-translate-y-0.5">
                  <span className="grid size-10 place-items-center rounded-full bg-white/15"><Navigation className="size-5" /></span>
                  <span className="leading-tight"><span className="block text-xs font-extrabold uppercase tracking-[0.16em] text-white/70">Y aller</span><span className="font-display text-lg font-extrabold">Itinéraire</span></span>
                </a>
              </div>
              <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold text-white/80">
                Ouvrir avec :
                {itineraires.map((x) => <a key={x.nom} href={x.href} target="_blank" rel="noopener noreferrer" className="underline decoration-white/40 underline-offset-4 hover:decoration-white">{x.nom}</a>)}
              </p>
            </div>
          </div>

          <div className="apparait-2 min-h-[360px]"><Plan /></div>
        </div>

        {/* La semaine en un coup d'œil */}
        {h && (
          <div className="apparait mt-5 rounded-[2rem] bg-white p-6 ring-1 ring-trait sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-display text-xl font-extrabold">Horaires de la semaine</p>
              <PastilleStatut />
            </div>
            <ol className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
              {JOURS.map((j) => {
                const on = j === aujourdhui;
                return (
                  <li key={j} className={`rounded-2xl p-4 transition-colors ${on ? "bg-rouge text-white shadow-[0_14px_30px_-14px_rgba(140,2,10,.8)]" : "bg-doux"}`}>
                    <span className={`block text-[0.7rem] font-extrabold uppercase tracking-[0.18em] ${on ? "text-white/80" : "text-gris"}`}>{on ? "Aujourd'hui" : j}</span>
                    <span className="mt-1 block font-display font-extrabold capitalize">{on ? j : ""}</span>
                    <span className={`block font-display font-extrabold tabular-nums ${on ? "" : "text-encre"}`}>{h[j].length ? h[j].map((p) => `${p.ouverture} – ${p.fermeture}`).join(" · ") : "Fermé"}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
