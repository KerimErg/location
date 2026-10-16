"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Copy, Navigation, Pause, Phone, Play } from "lucide-react";
import { CATEGORIES, produitsDe, type CategorieId } from "@/data/menu";
import { prix } from "@/lib/format";
import { maintenantParis } from "@/lib/horaires";
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
      <h2 id={id} className="mt-5 font-display text-[clamp(2.4rem,5.4vw,4.2rem)] font-extrabold leading-[0.98] tracking-[-0.025em]">
        {typeof titre === "string"
          ? titre.split(" ").map((m, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span className="masque-vue"><span style={{ animationRange: `entry ${20 + i * 6}% cover ${34 + i * 6}%` }}>{m}</span></span>
              </Fragment>
            ))
          : titre}
      </h2>
      <Ornement clair={clair} className="mt-6" />
      {sousTitre && <p className={`mx-auto mt-6 max-w-[48ch] text-lg font-semibold ${clair ? "text-white/90" : "text-gris"}`}>{sousTitre}</p>}
    </div>
  );
}

/* ─────────── Bienvenue chez BOWLY'S ─────────── */
/** Petits lahmacuns qui flottent autour du panneau. */
const INGREDIENTS = [
  { src: "/images/choix/lahmacun-nature.webp", classe: "left-[46%] -top-8 w-[4.5rem] sm:w-24 [--r:-10deg]", delai: "0s" },
  { src: "/images/choix/lahmacun-poulet.webp", classe: "-right-3 top-[14%] w-16 sm:-right-7 sm:w-20 lg:top-[38%] [--r:14deg]", delai: "-2s" },
  { src: "/images/choix/lahmacun-boeuf.webp", classe: "-bottom-9 right-[22%] w-[4.5rem] sm:w-[5.5rem] [--r:6deg]", delai: "-4s" },
];

export function Bienvenue() {
  const durum = produitsDe("durum")[0];
  return (
    <section id="concept" aria-labelledby="bienvenue-titre" className="sous-feuille relative bg-white pt-20 [overflow-x:clip] sm:pt-28">
      <div className={conteneur}>
        <div className="apparait relative">
          <div className="sur-sombre relative grid overflow-hidden rounded-[2.2rem] bg-vin text-white shadow-[0_60px_120px_-60px_rgba(45,4,6,.9)] lg:grid-cols-[1.1fr_1fr] lg:rounded-[3rem]">
            {/* Halo chaud derrière le plat */}
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(55%_70%_at_78%_50%,rgba(140,2,10,.35),transparent_70%)]" />

            {/* Photo : le fond bordeaux du menu se fond dans le panneau (bords estompés) */}
            <div className="relative order-1 lg:order-2">
              <div className="lg:absolute lg:inset-y-0 lg:-left-[8%] lg:right-0 lg:flex lg:items-center">
                <div className="fondu-bords relative aspect-[1020/582] w-full">
                  <Photo src={durum.photo} alt="Dürüm lahmacun garni de crudités" priorite className="anim-plat absolute inset-0 !bg-transparent" sizes="(max-width: 1024px) 100vw, 680px" zoom={false} />
                </div>
              </div>
            </div>

            <div className="relative order-2 px-7 pb-10 pt-2 text-center sm:px-12 sm:pb-14 lg:order-1 lg:py-24 lg:pl-16 lg:pr-0 lg:text-left">
              <div className="lg:[&_p]:justify-start"><Surtitre clair centre={false}>Bienvenue chez</Surtitre></div>
              <h2 id="bienvenue-titre" className="mt-5">
                <Logo variante="nom" titre="BOWLY'S" className="mx-auto w-[min(88%,400px)] text-white lg:mx-0" />
              </h2>
              <div className="mx-auto mt-7 grid max-w-[44ch] gap-4 text-[1.05rem] leading-relaxed text-white/80 lg:mx-0">
                <p>
                  Chez BOWLY&apos;S, tout tourne autour du lahmacun. Une pâte fine, une garniture parfumée, des crudités fraîches et la sauce que vous aimez.
                </p>
                <p>
                  BOWLY&apos;S est né d&apos;une idée simple : donner au lahmacun la place qu&apos;il mérite, avec une carte courte pensée entièrement autour de lui. En box de petits formats pour partager, ou en dürüm grand format composé à votre goût. Sur place ou à emporter.
                </p>
              </div>
              <div className="mt-8 flex flex-col flex-wrap justify-center gap-3 sm:flex-row lg:justify-start">
                <LienBouton href="/carte/" style="blanc" taille="lg">Découvrir la carte <ArrowRight className="size-5" /></LienBouton>
                <LienBouton href={`/carte/durum/${durum.id}/`} style="contour-blanc" taille="lg">Composer mon dürüm</LienBouton>
              </div>
            </div>
          </div>
          {INGREDIENTS.map((x) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={x.src} src={x.src} alt="" aria-hidden="true" loading="lazy" style={{ animationDelay: x.delai }}
              className={`flotte pointer-events-none absolute z-10 aspect-square rounded-full drop-shadow-[0_16px_20px_rgba(30,11,14,.4)] ${x.classe}`} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── Notre carte : un aperçu qui donne envie ─────────── */
const APERCU: { cat: CategorieId; photos: string[]; accroche: string }[] = [
  { cat: "box", photos: ["/images/carte/box-nature.webp"], accroche: "Nos lahmacuns petit format, à partager." },
  { cat: "durum", photos: ["/images/carte/durum.webp"], accroche: "Le grand format, composé à votre goût." },
  { cat: "desserts", photos: ["/images/carte/panna-cotta.webp", "/images/carte/tiramisu.webp"], accroche: "Panna cotta ou tiramisu, la douceur de la fin." },
];

/** Légère inclinaison 3D de la carte qui suit la souris (ordinateur uniquement). */
function incliner(e: React.PointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget, r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
  el.style.setProperty("--ry", `${x * 8}deg`);
  el.style.setProperty("--rx", `${-y * 8}deg`);
  el.style.setProperty("--ty", "-6px");
}
function redresser(e: React.PointerEvent<HTMLElement>) {
  ["--rx", "--ry", "--ty"].forEach((v) => e.currentTarget.style.removeProperty(v));
}

export function Specialites() {
  return (
    <section id="specialites" aria-labelledby="spe-titre" className="feuille sous-feuille overflow-hidden bg-doux pt-24 text-encre sm:pt-32">
      <Logo variante="icone" titre="" className="pointer-events-none absolute -left-24 top-24 w-[420px] text-rouge/[0.05]" />
      <div className={`${conteneur} relative`}>
        <EnTete id="spe-titre" surtitre="Notre carte" titre="Fait pour donner faim." sousTitre="Un avant-goût de ce qui vous attend." />

        <ul className="sans-barre -mx-[max(20px,env(safe-area-inset-left))] mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[max(20px,env(safe-area-inset-left))] pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
          {APERCU.map((a, i) => {
            const c = CATEGORIES.find((k) => k.id === a.cat)!;
            const desPrix = Math.min(...produitsDe(a.cat).map((p) => p.prix));
            return (
              <li key={a.cat} className={`w-[80%] shrink-0 snap-center md:w-auto ${i === 0 ? "apparait" : i === 1 ? "apparait-2" : "apparait-3"}`}>
                <Link href={`/carte/${a.cat}/`} onPointerMove={incliner} onPointerLeave={redresser} className="sur-sombre group flex h-full flex-col overflow-hidden rounded-[2rem] bg-vin text-white shadow-[0_40px_80px_-40px_rgba(45,4,6,.8)] transition-transform duration-300 ease-out [transform:perspective(900px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))_translateY(var(--ty,0px))]">
                  <span className={`revele relative grid aspect-[4/3] overflow-hidden ${a.photos.length > 1 ? "grid-cols-2" : ""}`}>
                    {a.photos.map((src) => (
                      <Photo key={src} src={src} alt="" className="h-full !bg-vin" sizes="(max-width: 768px) 80vw, 380px" />
                    ))}
                    {a.cat === "box" && <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-rouge shadow-lg">★ Best seller</span>}
                  </span>
                  <span className="flex flex-1 flex-col p-6 sm:p-7">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <span className="font-display text-[clamp(1.35rem,2.2vw,1.6rem)] font-extrabold leading-none whitespace-nowrap">{c.nom}</span>
                      <span className="shrink-0 text-sm font-semibold text-white/75">dès <strong className="font-display text-lg font-extrabold text-white">{prix(desPrix)}</strong></span>
                    </span>
                    <span className="mt-3 text-white/80">{a.accroche}</span>
                    <span className="mt-auto flex items-center gap-2 pt-6 font-display font-extrabold">
                      Découvrir
                      <span className="grid size-9 place-items-center rounded-full bg-white text-rouge transition-transform duration-500 group-hover:translate-x-1"><ArrowRight className="size-4" strokeWidth={2.8} /></span>
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="apparait mt-12 flex flex-col items-center gap-4 text-center">
          <LienBouton href="/carte/" taille="lg">Voir toute la carte <ArrowRight className="size-5" /></LienBouton>
          <p className="text-sm font-semibold text-gris">Boissons, options et dürüm à composer : tout est sur la carte.</p>
        </div>
      </div>
    </section>
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
          <div aria-hidden="true" className="absolute -inset-16 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(140,2,10,.55),transparent)]" />
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
              <span className="text-sm font-bold">bowlys.fr</span>
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
            Suivez-nous sur les réseaux.
          </h2>
          <p className="mx-auto mt-6 max-w-[40ch] text-lg text-white/85 md:mx-0">Les nouveautés, les coulisses et les plats du moment : suivez-nous.</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3 md:justify-start">
            <LienBouton href={site.reseaux.instagram} externe style="blanc" taille="lg">
              Instagram · @bowlys.fr <ArrowUpRight className="size-5" />
            </LienBouton>
            {site.reseaux.tiktok && (
              <LienBouton href={site.reseaux.tiktok} externe style="contour-blanc" taille="lg">
                TikTok · @bowlys.fr <ArrowUpRight className="size-5" />
              </LienBouton>
            )}
          </div>
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
          <div aria-hidden="true" className="absolute left-1/2 top-[44%] size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(140,2,10,.4),transparent)]" />
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
