"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, MapPin, Pause, Play } from "lucide-react";
import { produitsDe, type CategorieId } from "@/data/menu";
import { prix } from "@/lib/format";
import { usePanier } from "@/lib/panier";
import { statut, maintenantParis } from "@/lib/horaires";
import { site, adresseLigne, lienItineraire, lienPlanIntegre, JOURS } from "@/config/site";
import { Photo } from "./Photo";
import { LienBouton, classesBouton } from "./Bouton";
import { Logo } from "./Logo";

/** Demande à la carte d'afficher une catégorie, puis y fait défiler. */
export function allerALaCarte(cat: CategorieId) {
  window.dispatchEvent(new CustomEvent("bowlys-filtre", { detail: cat }));
  document.getElementById("carte")?.scrollIntoView({ behavior: "smooth" });
}

const conteneur = "mx-auto max-w-[1180px] px-[max(20px,env(safe-area-inset-left))]";

/* ─────────── Éléments de signature ─────────── */

/** Surtitre encadré de deux traits : « —— NOTRE CARTE —— ». */
export function Surtitre({ children, clair = false, centre = true }: { children: React.ReactNode; clair?: boolean; centre?: boolean }) {
  return (
    <p className={`flex items-center gap-4 font-display text-[0.78rem] font-extrabold uppercase tracking-[0.26em] ${centre ? "justify-center" : ""} ${clair ? "text-white" : "text-bleu"}`}>
      <span aria-hidden="true" className={`h-px w-10 ${clair ? "bg-white/60" : "bg-bleu/50"}`} />
      {children}
      <span aria-hidden="true" className={`h-px w-10 ${clair ? "bg-white/60" : "bg-bleu/50"}`} />
    </p>
  );
}

/** Ornement : trait · emblème BOWLY'S · trait. */
export function Ornement({ clair = false, className = "" }: { clair?: boolean; className?: string }) {
  return (
    <div aria-hidden="true" className={`flex items-center justify-center gap-3 ${className}`}>
      <span className={`h-px w-14 ${clair ? "bg-white/50" : "bg-bleu/40"}`} />
      <Logo variante="icone" titre="" className={`w-7 ${clair ? "text-white" : "text-bleu"}`} />
      <span className={`h-px w-14 ${clair ? "bg-white/50" : "bg-bleu/40"}`} />
    </div>
  );
}

export function EnTete({ surtitre, titre, id, clair = false, sousTitre }: { surtitre: string; titre: React.ReactNode; id: string; clair?: boolean; sousTitre?: string }) {
  return (
    <div className="apparait mx-auto max-w-[760px] text-center">
      <Surtitre clair={clair}>{surtitre}</Surtitre>
      <h2 id={id} className="mt-5 font-display text-[clamp(2.4rem,5.4vw,4.2rem)] font-black leading-[0.98] tracking-[-0.025em]">{titre}</h2>
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
        {/* Composition photo : grand cadre + vignette + mention verticale */}
        <div className="apparait relative mx-auto w-full max-w-[480px] pb-10 pr-8 sm:pr-14">
          <span aria-hidden="true" className="absolute -left-2 top-1/2 hidden origin-center -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap font-display text-[0.7rem] font-extrabold uppercase tracking-[0.4em] text-bleu/70 sm:block">
            Manti · Lahmacun · Schiltigheim
          </span>
          <div className="rounded-[36px] border-2 border-bleu/25 p-3">
            <Photo src="/images/illustration-manti-yaourt.webp" alt="Sauce yaourt versée sur des mantis" illustration className="aspect-[4/5] rounded-[26px]" sizes="(max-width: 1024px) 90vw, 480px" zoom={false} />
          </div>
          <div className="absolute bottom-0 right-0 w-[46%] rounded-[24px] bg-white p-2 shadow-[0_30px_60px_-30px_rgba(11,15,26,.55)]">
            <Photo src="/images/illustration-manti-beurre.webp" alt="Beurre pimenté versé sur des mantis" vignette className="aspect-square rounded-[18px]" sizes="220px" zoom={false} />
          </div>
          <div className="absolute -top-5 right-2 grid size-24 place-items-center rounded-full bg-bleu text-center text-white shadow-[0_18px_40px_-16px_rgba(0,87,231,.8)] sm:right-6">
            <span className="font-display text-[0.7rem] font-black uppercase leading-tight tracking-[0.08em]">Street<br />food<br />turque</span>
          </div>
        </div>

        <div className="apparait text-center">
          <Surtitre>Notre concept</Surtitre>
          <h2 id="bienvenue-titre" className="mt-7 font-display font-black tracking-[-0.02em]">
            <span className="block text-[clamp(2.6rem,5vw,4rem)] leading-none">Bienvenue</span>
            <span className="mt-3 flex items-center justify-center gap-4 text-xl font-bold text-gris">
              <span aria-hidden="true" className="h-px w-12 bg-bleu/40" />chez<span aria-hidden="true" className="h-px w-12 bg-bleu/40" />
            </span>
            <Logo variante="nom" titre="BOWLY'S" className="mx-auto mt-5 w-[min(100%,380px)] text-bleu" />
          </h2>
          <Ornement className="mt-8" />
          <p className="mx-auto mt-8 max-w-[44ch] text-lg leading-relaxed text-gris">
            Ici, on met à l&apos;honneur deux grands classiques turcs : le <strong className="text-encre">manti</strong>, petits raviolis nappés de yaourt et de beurre pimenté, et le <strong className="text-encre">lahmacun</strong>, galette fine cuite au four. Une carte courte, des portions généreuses, et un seul objectif : se faire plaisir.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <LienBouton href="/#carte" taille="lg">Voir la carte</LienBouton>
            <LienBouton href="/#contact" style="contour" taille="lg">Nous trouver</LienBouton>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── Nos spécialités ─────────── */
export function Specialites() {
  const blocs = [
    { cat: "mantis" as CategorieId, num: "01", titre: "Les Mantis", texte: "Petits raviolis turcs, sauce yaourt et beurre pimenté.", photo: "/images/illustration-manti-beurre.webp", n: produitsDe("mantis").length },
    { cat: "lahmacuns" as CategorieId, num: "02", titre: "Les Lahmacuns", texte: "Pâte fine, garnie et cuite au four.", photo: "/images/illustration-lahmacun-garniture.webp", n: produitsDe("lahmacuns").length },
  ];
  return (
    <section id="specialites" aria-labelledby="spe-titre" className="feuille sous-feuille overflow-hidden bg-doux pt-24 sm:pt-32">
      <span aria-hidden="true" className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-display text-[clamp(7rem,22vw,20rem)] font-black leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(0,87,231,.12)]">
        BOWLY&apos;S
      </span>
      <div className={`${conteneur} relative`}>
        <EnTete id="spe-titre" surtitre="Nos spécialités" titre="Manti ou lahmacun ?" />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {blocs.map((b) => (
            <button key={b.cat} type="button" onClick={() => allerALaCarte(b.cat)} className={`${b.num === "01" ? "apparait" : "apparait-2"} group text-left`}>
              <span className="parallaxe relative block aspect-[4/5] overflow-hidden rounded-[30px] bg-encre sm:aspect-[5/6]">
                <Photo src={b.photo} alt={b.titre} illustration className="absolute inset-0" sizes="(max-width: 768px) 100vw, 50vw" />
                <span className="absolute inset-0 bg-gradient-to-t from-encre/80 via-transparent to-transparent" />
                <span className="absolute right-6 top-6 font-display text-sm font-black tracking-[0.2em] text-white/90">{b.num}</span>
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-7 text-white sm:p-9">
                  <span>
                    <span className="block text-[0.75rem] font-extrabold uppercase tracking-[0.22em] text-white/80">{b.n} recettes</span>
                    <span className="mt-2 block font-display text-[clamp(2.2rem,4vw,3.2rem)] font-black leading-none">{b.titre}</span>
                  </span>
                  <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white text-bleu transition-transform duration-500 group-hover:-rotate-45">
                    <ArrowRight className="size-6" strokeWidth={2.6} />
                  </span>
                </span>
              </span>
              <span className="mt-5 flex items-center justify-between gap-4 px-2">
                <span className="text-lg font-semibold text-encre">{b.texte}</span>
                <span className="shrink-0 font-display font-extrabold text-bleu underline-offset-4 group-hover:underline">Découvrir</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── Les menus ─────────── */
export function Menus() {
  const { ajouter, ouvrirProduit } = usePanier();
  const menus = produitsDe("menus");
  return (
    <section id="menus" aria-labelledby="menus-titre" className="sur-sombre feuille sous-feuille overflow-hidden bg-bleu pt-24 text-white sm:pt-32">
      <Logo variante="icone" titre="" className="pointer-events-none absolute -right-24 -top-16 w-[460px] text-white/[0.07]" />
      <div className={`${conteneur} relative`}>
        <EnTete id="menus-titre" surtitre="Les menus" titre="Le repas complet." clair sousTitre="Le plus simple pour bien manger : choisissez votre menu." />
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {menus.map((m, k) => {
            const mix = m.id === "menu-mix";
            return (
              <article key={m.id} className={`${["apparait", "apparait-2", "apparait-3"][k]} relative flex flex-col overflow-hidden rounded-[26px] p-8 ${mix ? "bg-encre text-white" : "bg-white text-encre"}`}>
                {mix && <span className="absolute right-6 top-6 rounded-full bg-bleu px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-white">Le plus complet</span>}
                <p className={`text-[0.75rem] font-extrabold uppercase tracking-[0.22em] ${mix ? "text-white/70" : "text-bleu"}`}>Menu</p>
                <h3 className="mt-2 font-display text-3xl font-black">
                  <button type="button" onClick={() => ouvrirProduit(m)} className="text-left hover:underline">{m.nom.replace("Menu ", "")}</button>
                </h3>
                <p className={`mt-3 font-semibold ${mix ? "text-white/85" : "text-gris"}`}>{m.description}</p>
                <div className={`my-8 h-px ${mix ? "bg-white/15" : "bg-trait"}`} />
                <p className={`font-display text-5xl font-black tracking-tight ${mix ? "text-white" : "text-bleu"}`}>{prix(m.prix)}</p>
                {site.commande.panierActif && (
                  <button type="button" onClick={() => ajouter(m.id)} className={classesBouton(mix ? "bleu" : "encre", "lg", "mt-8 w-full")}>
                    Ajouter ce menu
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────── Galerie façon story Instagram ─────────── */
const STORIES = [
  { src: "/images/illustration-manti-beurre.webp", alt: "Beurre pimenté sur des mantis" },
  { src: "/images/illustration-lahmacun-garniture.webp", alt: "Garniture d'un lahmacun" },
  { src: "/images/illustration-manti-yaourt.webp", alt: "Sauce yaourt sur des mantis" },
  { src: "/images/illustration-manti-assiette.webp", alt: "Assiette de mantis" },
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
          <div aria-hidden="true" className="absolute -inset-12 -z-10 rounded-full bg-bleu/45 blur-3xl" />
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
              <span className="grid size-9 place-items-center rounded-full bg-white"><Logo variante="icone" titre="" className="w-5 text-bleu" /></span>
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
          <h2 id="galerie-titre" className="mt-5 font-display text-[clamp(2.4rem,5vw,4rem)] font-black leading-[0.98] tracking-[-0.025em]">
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
function Statut() {
  const [s, setS] = useState<{ ouvert: boolean; texte: string } | null>(null);
  useEffect(() => {
    if (!site.horaires) return;
    const maj = () => setS(statut(site.horaires!));
    maj();
    const t = setInterval(maj, 60_000);
    return () => clearInterval(t);
  }, []);
  if (!s) return null;
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-extrabold ${s.ouvert ? "bg-bleu text-white" : "bg-encre text-white"}`}>
      <span className={`size-2 rounded-full ${s.ouvert ? "animate-pulse bg-white" : "bg-white/50"}`} />
      {s.texte}
    </span>
  );
}

function Plan() {
  const [charge, setCharge] = useState(false);
  const [encadre, setEncadre] = useState(false);
  useEffect(() => { setEncadre(window.self !== window.top); }, []);
  const src = lienPlanIntegre();
  if (!src) return null;
  return (
    <div className="sur-sombre relative h-full min-h-[420px] overflow-hidden rounded-[30px] bg-encre text-white">
      {charge ? (
        <iframe src={src} title={`Plan d'accès BOWLY'S, ${adresseLigne()}`} className="absolute inset-0 size-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <div className="absolute inset-0 grid place-items-center p-8 text-center">
          <div aria-hidden="true" className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:48px_48px]" />
          <div aria-hidden="true" className="absolute left-1/2 top-1/2 size-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bleu/25 blur-3xl" />
          <div className="relative grid justify-items-center gap-5">
            <span className="relative grid size-20 place-items-center rounded-full bg-bleu shadow-[0_0_0_10px_rgba(0,87,231,.25),0_0_0_22px_rgba(0,87,231,.12)]">
              <MapPin className="size-8" strokeWidth={2.4} />
            </span>
            <p className="font-display text-2xl font-black leading-tight">{site.restaurant!.rue}<br />{site.restaurant!.codePostal} {site.restaurant!.ville}</p>
            {encadre ? (
              <LienBouton href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adresseLigne()!)}`} externe style="blanc" taille="lg">Ouvrir le plan <ArrowUpRight className="size-5" /></LienBouton>
            ) : (
              <button type="button" onClick={() => setCharge(true)} className={classesBouton("blanc", "lg")}>Afficher le plan</button>
            )}
            {!encadre && <p className="max-w-[32ch] text-sm text-white/75">Plan fourni par Google Maps, chargé uniquement si vous le demandez.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export function NousTrouver() {
  const h = site.horaires;
  const itin = lienItineraire();
  const [aujourdhui, setAujourdhui] = useState<string | null>(null);
  useEffect(() => { setAujourdhui(maintenantParis().jour); }, []);
  if (!site.restaurant) return null;
  return (
    <section id="contact" aria-labelledby="contact-titre" className="feuille sous-feuille bg-doux pt-24 sm:pt-32">
      <div className={conteneur}>
        <EnTete id="contact-titre" surtitre="Contact" titre="Nous trouver" />
        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="apparait grid content-start gap-6 rounded-[30px] bg-white p-8 ring-1 ring-trait sm:p-10">
            <div>
              <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.22em] text-bleu">Adresse</p>
              <address className="mt-3 font-display text-[clamp(1.8rem,3vw,2.3rem)] font-black not-italic leading-[1.1]">
                {site.restaurant.rue}<br />{site.restaurant.codePostal} {site.restaurant.ville}
              </address>
              <div className="mt-6 flex flex-wrap gap-3">
                {itin && <LienBouton href={itin} externe>Itinéraire <ArrowUpRight className="size-4" /></LienBouton>}
                {site.telephone && <LienBouton href={`tel:${site.telephone.replace(/\s/g, "")}`} style="contour">{site.telephone}</LienBouton>}
                {site.reseaux.instagram && <LienBouton href={site.reseaux.instagram} externe style="contour">Instagram</LienBouton>}
              </div>
            </div>
            <div className="h-px bg-trait" />
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.22em] text-bleu">Horaires</p>
                <Statut />
              </div>
              {h ? (
                <dl className="mt-4">
                  {JOURS.map((j) => {
                    const actif = j === aujourdhui;
                    return (
                      <div key={j} className={`flex justify-between gap-6 rounded-xl px-3 py-2.5 ${actif ? "bg-bleu-ciel font-extrabold text-bleu" : "font-semibold text-encre"}`}>
                        <dt className="capitalize">{j}{actif && <span className="sr-only"> (aujourd&apos;hui)</span>}</dt>
                        <dd className="tabular-nums">{h[j].length ? h[j].map((p) => `${p.ouverture} – ${p.fermeture}`).join(" · ") : "Fermé"}</dd>
                      </div>
                    );
                  })}
                </dl>
              ) : (
                <p className="mt-4 font-semibold text-gris">Horaires bientôt disponibles.</p>
              )}
            </div>
          </div>
          <div className="apparait-2"><Plan /></div>
        </div>
      </div>
    </section>
  );
}
