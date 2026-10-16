"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Copy, Layers, MapPin, Navigation, Pause, Phone, Play, Sparkles } from "lucide-react";
import { produitsDe } from "@/data/menu";
import { AjoutRapide } from "./carte/AjoutRapide";
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
      <h2 id={id} className="mt-5 font-display text-[clamp(2.4rem,5.4vw,4.2rem)] font-extrabold leading-[0.98] tracking-[-0.025em]">{titre}</h2>
      <Ornement clair={clair} className="mt-6" />
      {sousTitre && <p className={`mx-auto mt-6 max-w-[48ch] text-lg font-semibold ${clair ? "text-white/90" : "text-gris"}`}>{sousTitre}</p>}
    </div>
  );
}

/* ─────────── Bienvenue chez BOWLY'S ─────────── */
const ATOUTS = () => {
  const box = produitsDe("box");
  const durum = produitsDe("durum")[0];
  return [
    { titre: "Box Lahmacun", texte: `${box.length} recettes petit format, dès ${prix(Math.min(...box.map((p) => p.prix)))}`, href: "/carte/box/", Icone: Layers },
    { titre: "Dürüm grand format", texte: `À composer en 3 étapes, ${prix(durum.prix)}`, href: `/carte/durum/${durum.id}/`, Icone: Sparkles },
    { titre: "Sur place ou à emporter", texte: site.restaurant ? `${site.restaurant.rue}, ${site.restaurant.ville}` : "Schiltigheim", href: "/#contact", Icone: MapPin },
  ];
};

/** Ingrédients détourés qui flottent autour des photos. */
const INGREDIENTS = [
  { src: "/images/choix/tomate.webp", classe: "-left-4 top-[6%] w-[19%] [--r:-8deg] sm:-left-8", delai: "0s" },
  { src: "/images/choix/salade.webp", classe: "-right-3 top-[38%] w-[17%] [--r:10deg] sm:-right-7", delai: "-2s" },
  { src: "/images/choix/sauce-piquante.webp", classe: "-left-2 bottom-[2%] w-[21%] [--r:6deg] sm:-left-6", delai: "-4s" },
  { src: "/images/choix/oignon.webp", classe: "right-[18%] -top-6 w-[13%] [--r:-12deg]", delai: "-1s" },
];

export function Bienvenue() {
  return (
    <section id="concept" aria-labelledby="bienvenue-titre" className="sous-feuille relative overflow-hidden bg-white pt-24 sm:pt-36">
      <div className={`${conteneur} grid items-center gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-20`}>
        {/* Composition photo : dürüm + box du menu, ingrédients autour */}
        <div className="apparait relative mx-auto w-full max-w-[560px] lg:order-2">
          <div aria-hidden="true" className="absolute inset-[6%_4%_8%_10%] -rotate-3 rounded-[2.5rem] bg-rouge" />
          <Logo variante="icone" titre="" className="pointer-events-none absolute right-[2%] top-[4%] w-[34%] text-white/10" />
          <div className="relative grid gap-4 p-[7%] pb-[10%]">
            <Link href="/carte/durum/durum/" className="group relative ml-[12%] block aspect-[1020/582] overflow-hidden rounded-[1.6rem] bg-vin shadow-[0_30px_60px_-28px_rgba(30,11,14,.8)] ring-4 ring-white">
              <Photo src="/images/carte/durum.webp" alt="Dürüm lahmacun garni" className="absolute inset-0 !bg-vin" sizes="(max-width: 640px) 80vw, 460px" />
              <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 font-display text-sm font-extrabold text-rouge shadow-md">Dürüm · {prix(produitsDe("durum")[0].prix)}</span>
            </Link>
            <Link href="/carte/box/box-nature/" className="group relative -mt-[9%] mr-[14%] block aspect-[1095/531] overflow-hidden rounded-[1.6rem] bg-vin shadow-[0_30px_60px_-28px_rgba(30,11,14,.8)] ring-4 ring-white">
              <Photo src="/images/carte/box-nature.webp" alt="Box de lahmacuns nature" className="absolute inset-0 !bg-vin" sizes="(max-width: 640px) 80vw, 460px" />
              <span className="absolute right-3 top-3 rounded-full bg-rouge px-3 py-1 font-display text-xs font-extrabold text-white shadow-md sm:text-sm">★ Best seller<span className="hidden sm:inline"> · Box Nature · {prix(produitsDe("box")[0].prix)}</span></span>
            </Link>
          </div>
          {INGREDIENTS.map((x) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={x.src} src={x.src} alt="" aria-hidden="true" loading="lazy" style={{ animationDelay: x.delai }}
              className={`flotte pointer-events-none absolute aspect-square rounded-full drop-shadow-[0_14px_18px_rgba(30,11,14,.35)] ${x.classe}`} />
          ))}
        </div>

        <div className="apparait-2 text-center lg:text-left">
          <div className="lg:[&_p]:justify-start"><Surtitre centre={false}>Bienvenue</Surtitre></div>
          <h2 id="bienvenue-titre" className="mt-6 font-display font-extrabold tracking-[-0.02em]">
            <span className="block text-[clamp(1.6rem,3vw,2.2rem)] leading-tight text-encre">Bienvenue chez</span>
            <Logo variante="nom" titre="BOWLY'S" className="mx-auto mt-3 w-[min(100%,380px)] text-rouge lg:mx-0" />
            <span className="mt-4 block text-[clamp(1.25rem,2.2vw,1.6rem)] leading-snug text-gris">la maison du lahmacun à Schiltigheim.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[46ch] text-[1.08rem] leading-relaxed text-gris lg:mx-0">
            Une pâte fine, une garniture généreuse et une carte courte : le lahmacun en box petit format pour partager, ou en dürüm grand format que vous composez vous-même.
          </p>

          <ul className="mt-9 grid gap-3 text-left">
            {ATOUTS().map(({ titre, texte, href, Icone }) => (
              <li key={titre}>
                <Link href={href} className="group flex items-center gap-4 rounded-2xl bg-doux p-4 ring-1 ring-trait transition-[background,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_18px_40px_-24px_rgba(30,11,14,.45)]">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full bg-rouge text-white"><Icone className="size-5" /></span>
                  <span className="min-w-0 flex-1 leading-snug">
                    <span className="block font-display text-[1.05rem] font-extrabold text-encre">{titre}</span>
                    <span className="block text-[0.95rem] text-gris">{texte}</span>
                  </span>
                  <ArrowRight className="size-5 shrink-0 text-rouge transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <LienBouton href="/carte/" taille="lg">Découvrir la carte</LienBouton>
            <LienBouton href="/#contact" style="contour" taille="lg">Nous trouver</LienBouton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── Notre carte : vitrine en mosaïque ─────────── */
const carteBase = "apparait relative flex min-w-0 flex-col overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-40px_rgba(0,0,0,.65)]";

function PrixPastille({ children, clair = false }: { children: React.ReactNode; clair?: boolean }) {
  return <span className={`inline-flex h-9 items-center rounded-full px-4 font-display text-lg font-extrabold tabular-nums ${clair ? "bg-white text-rouge" : "bg-rouge text-white"}`}>{children}</span>;
}

export function Specialites() {
  const box = produitsDe("box");
  const durum = produitsDe("durum")[0];
  const desserts = produitsDe("desserts");
  const boissons = produitsDe("boissons");
  const option = box[0].groupes?.[0]?.choix[0];
  return (
    <section id="specialites" aria-labelledby="spe-titre" className="sur-sombre feuille sous-feuille overflow-hidden bg-rouge pt-24 text-white sm:pt-32">
      <Logo variante="icone" titre="" className="pointer-events-none absolute -left-24 top-24 w-[420px] text-white/[0.06]" />
      <div className={`${conteneur} relative`}>
        <EnTete id="spe-titre" clair surtitre="Notre carte" titre="Fait pour donner faim." sousTitre="Box, dürüm, desserts et boissons : toute la carte en un coup d'œil." />

        <div className="mt-14 grid gap-5 lg:grid-cols-12">
          {/* Box Lahmacun */}
          <article className={`${carteBase} bg-white text-encre lg:col-span-7`}>
            <Link href="/carte/box/" className="group relative block aspect-[1095/531] overflow-hidden bg-vin">
              <Photo src={box[0].photo} alt="Box de lahmacuns" className="absolute inset-0 !bg-vin" sizes="(max-width: 1024px) 100vw, 680px" />
              <span className="absolute left-4 top-4 rounded-full bg-rouge px-3 py-1.5 text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-white shadow-lg">★ Best seller · Nature</span>
            </Link>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.22em] text-rouge">Lahmacun petit format</p>
                  <h3 className="mt-1 font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-none"><Link href="/carte/box/" className="hover:text-rouge">Box Lahmacun</Link></h3>
                </div>
                {option?.prix != null && <span className="rounded-full bg-creme px-3 py-1.5 text-sm font-extrabold text-rouge">{option.nom} : +{prix(option.prix)}</span>}
              </div>
              <ul className="mt-5 grid gap-x-8 sm:grid-cols-2">
                {box.map((p) => (
                  <li key={p.id}>
                    <Link href={`/carte/box/${p.id}/`} className="group flex items-baseline gap-3 border-b border-trait py-3">
                      <span className="min-w-0 font-display font-extrabold transition-colors group-hover:text-rouge">{p.nom.replace("Box ", "")}</span>
                      <span aria-hidden="true" className="flex-1 border-b-2 border-dotted border-trait" />
                      <span className="font-display font-extrabold tabular-nums text-rouge">{prix(p.prix)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <LienBouton href="/carte/box/" taille="md" className="mt-6 self-start">Choisir ma box <ArrowRight className="size-5" /></LienBouton>
            </div>
          </article>

          {/* Dürüm à composer */}
          <article className={`${carteBase} bg-vin lg:col-span-5`}>
            <Link href={`/carte/durum/${durum.id}/`} className="group relative block aspect-[1020/582] overflow-hidden bg-vin">
              <Photo src={durum.photo} alt="Dürüm lahmacun" className="absolute inset-0 !bg-vin" sizes="(max-width: 1024px) 100vw, 480px" />
            </Link>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.22em] text-white/70">Lahmacun grand format</p>
                  <h3 className="mt-1 font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-none">Dürüm</h3>
                </div>
                <PrixPastille clair>{prix(durum.prix)}</PrixPastille>
              </div>
              <ol className="mt-6 grid gap-4">
                {(durum.groupes ?? []).map((g, i) => (
                  <li key={g.id} className="flex items-center gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white font-display text-sm font-extrabold text-rouge">{i + 1}</span>
                    <span className="w-[5.5rem] shrink-0 text-[0.8rem] sm:w-[6.5rem] sm:text-sm font-bold leading-tight text-white/90">{g.titre}</span>
                    <span className="flex min-w-0 -space-x-2">
                      {g.choix.filter((c) => c.photo).map((c) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={c.id} src={c.photo} alt={c.nom} title={c.nom} loading="lazy" className="size-9 rounded-full bg-vin ring-2 ring-vin sm:size-11" />
                      ))}
                    </span>
                  </li>
                ))}
              </ol>
              <LienBouton href={`/carte/durum/${durum.id}/`} style="blanc" taille="md" className="mt-7 self-start">Composer mon dürüm <ArrowRight className="size-5" /></LienBouton>
            </div>
          </article>

          {/* Desserts */}
          <article className={`${carteBase} bg-vin lg:col-span-5`}>
            <div className="flex items-end justify-between gap-3 p-6 pb-0 sm:p-8 sm:pb-0">
              <div>
                <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.22em] text-white/70">Pour finir en douceur</p>
                <h3 className="mt-1 font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-none"><Link href="/carte/desserts/" className="hover:underline">Desserts</Link></h3>
              </div>
            </div>
            <ul className="grid flex-1 grid-cols-2 gap-3 p-4 sm:p-6">
              {desserts.map((p) => (
                <li key={p.id}>
                  <Link href={`/carte/desserts/${p.id}/`} className="group relative block aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-vin">
                    <Photo src={p.photo} alt={p.nom} className="absolute inset-0 !bg-vin" sizes="(max-width: 1024px) 50vw, 240px" />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-vin to-transparent p-4 pr-16 pt-10">
                      <span className="block font-display text-lg font-extrabold leading-tight">{p.nom}</span>
                      <span className="font-display font-extrabold tabular-nums text-white/85">{prix(p.prix)}</span>
                    </span>
                    <AjoutRapide p={p} />
                  </Link>
                </li>
              ))}
            </ul>
          </article>

          {/* Boissons */}
          <article className={`${carteBase} bg-white text-encre lg:col-span-7`}>
            <div className="flex flex-wrap items-end justify-between gap-3 p-6 pb-0 sm:p-8 sm:pb-0">
              <div>
                <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.22em] text-rouge">Bien fraîches</p>
                <h3 className="mt-1 font-display text-[clamp(1.9rem,3.4vw,2.6rem)] font-extrabold leading-none"><Link href="/carte/boissons/" className="hover:text-rouge">Boissons</Link></h3>
              </div>
              <PrixPastille>{prix(Math.min(...boissons.map((p) => p.prix)))}</PrixPastille>
            </div>
            <ul className="grid flex-1 grid-cols-3 gap-2 p-4 sm:grid-cols-5 sm:gap-3 sm:p-6">
              {boissons.map((p) => (
                <li key={p.id}>
                  <Link href={`/carte/boissons/${p.id}/`} className="group relative block overflow-hidden rounded-[1.2rem] bg-vin">
                    <Photo src={p.photo} alt={p.nom} className="aspect-square !bg-vin" sizes="140px" />
                    <span className="block bg-vin px-2 pb-3 text-center font-display text-sm font-extrabold text-white">{p.nom}</span>
                  </Link>
                </li>
              ))}
              <li className="sm:hidden">
                <Link href="/carte/boissons/" className="grid h-full place-items-center rounded-[1.2rem] bg-creme p-2 text-center font-display text-sm font-extrabold text-rouge">Voir tout <ArrowRight className="size-5" /></Link>
              </li>
            </ul>
          </article>
        </div>

        <div className="apparait mt-10 flex justify-center">
          <LienBouton href="/carte/" style="blanc" taille="lg">Voir toute la carte <ArrowRight className="size-5" /></LienBouton>
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
