"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Navigation, Phone, Plus, Check } from "lucide-react";
import { CATEGORIES, produitsDe, type Produit } from "@/data/menu";
import { prix } from "@/lib/format";
import { usePanier } from "@/lib/panier";
import { site, adresseLigne, lienItineraire, lienPlanIntegre, JOURS, type Jour } from "@/config/site";
import { Photo } from "./Photo";
import { PastilleStatut } from "./StatutLive";

/**
 * Page d'accueil « style affiche » :
 * rouge à vagues + grands titres blancs élargis + accents jaunes, menu en grille sur fond blanc.
 */

const conteneur = "mx-auto max-w-[1240px] px-[max(20px,env(safe-area-inset-left))]";

/* ─────────── Éléments communs ─────────── */

/** Gros bouton jaune avec pastille rouge (« COMMANDER »). */
function BoutonJaune({ children, href, onClick, className = "" }: { children: React.ReactNode; href?: string; onClick?: () => void; className?: string }) {
  const cls = `titre-large group inline-flex h-14 items-center gap-3 rounded-full bg-jaune pl-4 pr-7 text-[clamp(.95rem,1.6vw,1.45rem)] text-encre shadow-[0_14px_30px_-12px_rgba(0,0,0,.45)] transition-transform duration-300 ease-[var(--ease-pro)] hover:-translate-y-0.5 active:scale-[.97] sm:h-[4.25rem] sm:pl-5 sm:pr-9 ${className}`;
  const contenu = (
    <>
      <span aria-hidden="true" className="grid size-7 place-items-center rounded-full border-[3px] border-rouge sm:size-8">
        <span className="size-3.5 rounded-full bg-rouge transition-transform duration-300 group-hover:scale-125 sm:size-4" />
      </span>
      {children}
    </>
  );
  return href ? <Link href={href} className={cls}>{contenu}</Link> : <button type="button" onClick={onClick} className={cls}>{contenu}</button>;
}

/** Commander : ouvre le panier s'il contient quelque chose, sinon mène au menu. */
function useCommander() {
  const { nbArticles, ouvrirPanier } = usePanier();
  return () => (nbArticles > 0 ? ouvrirPanier() : document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" }));
}

/** Vidéo muette qui ne tourne que lorsqu'elle est visible (fluidité, batterie). */
function VideoVisible({ src, affiche, className = "" }: { src: string; affiche: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.15 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} src={src} poster={affiche} muted loop playsInline preload="metadata" aria-hidden="true" className={className} />;
}

/* ─────────── Bannière ─────────── */
export function Banniere() {
  const commander = useCommander();
  return (
    <section aria-labelledby="hero-titre" className="vagues sur-sombre relative overflow-hidden bg-rouge text-white">
      <div className={`${conteneur} grid items-center gap-7 pb-10 pt-24 lg:min-h-[100svh] lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:pb-16 lg:pt-28`}>
        <div className="anim-monter text-center lg:text-left">
          <p className="text-[clamp(1.15rem,2.1vw,1.9rem)] font-medium text-jaune">Box à partager, dürüm à composer.</p>
          <h1 id="hero-titre" className="titre-large mt-2 text-[clamp(2.6rem,7.2vw,6.4rem)]">
            Le lahmacun<br />autrement
          </h1>
          <div className="mt-7 flex flex-col items-center gap-4 sm:mt-9 lg:items-start">
            <BoutonJaune onClick={commander}>Commander</BoutonJaune>
            <PastilleStatut ton="clair" />
          </div>
        </div>

        {/* Le lahmacun, en rond : la vidéo du four, découpée en cercle */}
        <div className="anim-monter relative mx-auto w-[min(62vw,600px)] lg:w-[min(76vw,600px)] [animation-delay:150ms] lg:mr-[-6%]">
          <div aria-hidden="true" className="tourne-lent absolute -inset-[4%] rounded-full border-2 border-dashed border-jaune/40" />
          <div className="relative aspect-square overflow-hidden rounded-full shadow-[0_40px_90px_-30px_rgba(0,0,0,.7)] ring-[10px] ring-white/10">
            <VideoVisible src="/videos/hero-rond.mp4" affiche="/videos/hero-rond.webp" className="size-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── Notre menu ─────────── */
function CarteProduit({ p }: { p: Produit }) {
  return (
    <Link href={`/carte/${p.categorie}/${p.id}/`} className="group block text-center">
      <span className="relative block aspect-[4/3] overflow-hidden rounded-[1.4rem] bg-vin shadow-[0_24px_40px_-26px_rgba(30,11,14,.7)] sm:rounded-[1.8rem]">
        <Photo src={p.photo} alt={p.nom} className="absolute inset-0 !bg-vin" sizes="(max-width: 1024px) 50vw, 300px" />
        {p.badge && <span className="titre-large absolute left-2.5 top-2.5 rounded-full bg-jaune px-2.5 py-1 text-[0.55rem] text-encre sm:left-3 sm:top-3 sm:text-[0.65rem]">★ {p.badge}</span>}
      </span>
      <span className="mt-3 block text-[clamp(1.1rem,1.9vw,1.75rem)] font-bold leading-tight text-encre sm:mt-4">{p.nom.replace("Box ", "")}</span>
      <span className="mx-auto mt-1 block max-w-[30ch] text-[0.85rem] font-light leading-snug text-gris sm:text-base">{p.description}</span>
      <span className="mt-1.5 block text-[clamp(1.3rem,2vw,2rem)] font-bold text-rouge">{prix(p.prix)}</span>
    </Link>
  );
}

function AjoutLigne({ p }: { p: Produit }) {
  const { ajouter } = usePanier();
  const [ok, setOk] = useState(false);
  if (!site.commande.panierActif) return null;
  return (
    <button type="button" aria-label={`Ajouter ${p.nom} au panier`} onClick={() => { ajouter(p.id); setOk(true); setTimeout(() => setOk(false), 1200); }}
      className={`grid size-9 shrink-0 place-items-center rounded-full transition-colors ${ok ? "bg-white text-rouge" : "bg-jaune text-encre hover:bg-white"}`}>
      {ok ? <Check className="size-4" strokeWidth={3} /> : <Plus className="size-4" strokeWidth={3} />}
    </button>
  );
}

export function Menu() {
  const box = produitsDe("box");
  const durum = produitsDe("durum")[0];
  const desserts = produitsDe("desserts");
  const boissons = produitsDe("boissons");
  const option = box[0].groupes?.[0]?.choix[0];
  const commander = useCommander();
  const catBox = CATEGORIES.find((c) => c.id === "box")!;

  return (
    <section id="menu" aria-labelledby="menu-titre" className="bg-white py-14 sm:py-24">
      <div className={conteneur}>
        <header className="apparait text-center">
          <h2 id="menu-titre" className="titre-large text-[clamp(2.2rem,6vw,4.6rem)] text-encre">Notre menu</h2>
          <p className="mt-2 text-[clamp(1.05rem,2vw,1.7rem)] text-gris">Box à partager, dürüm à composer — sur place ou à emporter.</p>
        </header>

        {/* Box Lahmacun */}
        <h3 className="apparait mt-10 flex flex-col items-center justify-center gap-1 text-center sm:mt-16 sm:flex-row sm:items-baseline sm:gap-3">
          <span className="titre-large text-[clamp(1.2rem,2.4vw,1.9rem)] text-rouge">{catBox.nom}</span>
          <span className="text-[0.95rem] font-medium text-gris sm:text-lg"><span className="hidden sm:inline">· </span>{catBox.accroche}</span>
        </h3>
        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-8 sm:gap-x-8 lg:grid-cols-4">
          {box.map((p, i) => (
            <li key={p.id} className={i % 2 ? "apparait-2" : "apparait"}><CarteProduit p={p} /></li>
          ))}
        </ul>
        {option?.prix != null && (
          <p className="apparait mt-8 text-center text-[1.05rem] sm:text-xl">
            <span className="rounded-full bg-creme px-4 py-2 font-bold text-rouge">{option.nom} : +{prix(option.prix)}</span>
          </p>
        )}

        {/* Dürüm à composer */}
        <div className="apparait mt-14 grid items-center gap-6 rounded-[2rem] bg-doux p-4 sm:mt-20 sm:gap-10 sm:p-8 lg:grid-cols-2 lg:p-10">
          <Link href={`/carte/durum/${durum.id}/`} className="group relative block aspect-[1020/582] overflow-hidden rounded-[1.6rem] bg-vin">
            <Photo src={durum.photo} alt={durum.nom} className="absolute inset-0 !bg-vin" sizes="(max-width: 1024px) 100vw, 560px" />
          </Link>
          <div className="px-1 pb-2 text-center lg:text-left">
            <p className="titre-large text-[0.8rem] text-rouge sm:text-sm">Lahmacun grand format</p>
            <h3 className="titre-large mt-2 text-[clamp(2rem,4.4vw,3.6rem)] text-encre">Le dürüm</h3>
            <p className="mt-1 text-[clamp(1.6rem,2.6vw,2.4rem)] font-bold text-rouge">{prix(durum.prix)}</p>
            <ol className="mx-auto mt-5 grid max-w-[460px] gap-3 text-left lg:mx-0">
              {(durum.groupes ?? []).map((g, i) => (
                <li key={g.id} className="flex items-center gap-3">
                  <span className="titre-large grid size-8 shrink-0 place-items-center rounded-full bg-rouge text-sm text-white">{i + 1}</span>
                  <span className="w-[7.5rem] shrink-0 text-[0.95rem] font-bold leading-tight text-encre sm:w-36 sm:text-lg">{g.titre.replace(/^\d+\.\s*/, "")}</span>
                  <span className="flex min-w-0 -space-x-2">
                    {g.choix.filter((c) => c.photo).map((c) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={c.id} src={c.photo} alt={c.nom} title={c.nom} loading="lazy" className="size-8 rounded-full ring-2 ring-doux sm:size-10" />
                    ))}
                  </span>
                </li>
              ))}
            </ol>
            <BoutonJaune href={`/carte/durum/${durum.id}/`} className="mt-7">Composer</BoutonJaune>
          </div>
        </div>

        {/* Desserts & boissons : tableau sur fond rouge + photos */}
        <div className="apparait sur-sombre vagues mt-14 grid overflow-hidden rounded-[2rem] bg-rouge text-white sm:mt-20 lg:grid-cols-[1.1fr_1fr]">
          <div className="p-6 sm:p-12">
            {[{ titre: "Dessert", liste: desserts }, { titre: "Boisson", liste: boissons }].map(({ titre, liste }, k) => (
              <table key={titre} className={`w-full ${k ? "mt-8" : ""}`}>
                <thead>
                  <tr className="titre-large text-left text-[clamp(1rem,1.8vw,1.5rem)] text-jaune">
                    <th className="pb-2 font-[inherit]">{titre}</th>
                    <th className="w-24 pb-2 text-right font-[inherit] sm:w-32">Prix</th>
                    <th className="w-12 pb-2" aria-label="Ajouter" />
                  </tr>
                </thead>
                <tbody className="text-[clamp(1.1rem,1.8vw,1.6rem)]">
                  {liste.map((p) => (
                    <tr key={p.id} className="border-t border-white/15">
                      <td className="py-2"><Link href={`/carte/${p.categorie}/${p.id}/`} className="hover:underline">{p.nom}</Link></td>
                      <td className="py-2 text-right tabular-nums">{prix(p.prix)}</td>
                      <td className="py-2 pl-3 text-right"><AjoutLigne p={p} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </div>
          <div className="hidden grid-cols-6 gap-1 bg-vin p-1 lg:grid">
            {desserts.map((p) => (
              <Photo key={p.id} src={p.photo} alt={p.nom} className="col-span-3 aspect-square !bg-vin" sizes="(max-width: 1024px) 50vw, 280px" zoom={false} />
            ))}
            {boissons.slice(0, 3).map((p) => (
              <Photo key={p.id} src={p.photo} alt={p.nom} className="col-span-2 aspect-square !bg-vin" sizes="(max-width: 1024px) 33vw, 190px" zoom={false} />
            ))}
          </div>
        </div>

        <div className="apparait mt-12 flex flex-col items-center gap-4 sm:mt-16">
          <BoutonJaune onClick={commander}>Commander</BoutonJaune>
          <Link href="/carte/" className="inline-flex items-center gap-2 text-lg font-bold text-rouge hover:underline">
            Voir la carte détaillée <ArrowRight className="size-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─────────── À propos ─────────── */
const GALERIE = [
  { src: "/images/four-a-bois.webp", alt: "Le four à bois" },
  { src: "/images/lahmacun-pelle.webp", alt: "Lahmacuns qui sortent du four" },
  { src: "/images/legumes.webp", alt: "Légumes frais découpés" },
  { src: "/images/lahmacun-gros-plan.webp", alt: "Gros plan sur un lahmacun" },
];

export function APropos() {
  return (
    <section id="apropos" aria-labelledby="apropos-titre" className="bg-white pb-12 sm:pb-24">
      <div className={conteneur}>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="apparait relative aspect-[16/10] overflow-hidden rounded-[1.6rem] bg-encre sm:rounded-[2rem]">
            <VideoVisible src="/videos/hero-2.mp4" affiche="/videos/hero-2.webp" className="absolute inset-0 size-full object-cover" />
          </div>
          <div className="apparait-2 text-center lg:text-left">
            <h2 id="apropos-titre" className="titre-large text-[clamp(2rem,4.8vw,4rem)] text-encre">À propos de nous</h2>
            <p className="mx-auto mt-4 max-w-[52ch] text-[1.05rem] leading-relaxed text-gris sm:text-[1.2rem] lg:mx-0">
              BOWLY&apos;S est né d&apos;une idée simple : donner au lahmacun la place qu&apos;il mérite. Une carte courte, pensée entièrement autour de lui, en box de petits formats pour partager ou en dürüm grand format composé à votre goût.
            </p>
            <ul className="mx-auto mt-6 grid max-w-[52ch] gap-2.5 text-left text-[1.05rem] font-bold text-encre sm:text-[1.25rem] lg:mx-0">
              <li>🫓 Des lahmacuns petit format, en box à partager</li>
              <li>🌯 Un dürüm grand format, composé à votre goût</li>
              <li>📍 Sur place ou à emporter, {site.restaurant?.rue}</li>
            </ul>
          </div>
        </div>

        <ul className="sans-barre -mx-[max(20px,env(safe-area-inset-left))] mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-[max(20px,env(safe-area-inset-left))] sm:mx-0 sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {GALERIE.map((g, i) => (
            <li key={g.src} className={`${i % 2 ? "apparait-2" : "apparait"} relative aspect-[4/5] w-[42%] shrink-0 snap-start overflow-hidden rounded-[1.2rem] bg-encre sm:w-auto sm:rounded-[1.6rem]`}>
              <Photo src={g.src} alt={g.alt} className="absolute inset-0" sizes="(max-width: 1024px) 50vw, 300px" zoom={false} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ─────────── Contact ─────────── */
/** Regroupe les jours consécutifs aux mêmes horaires : « Lundi au jeudi : 11:30 – 23:00 ». */
function horairesGroupes() {
  const h = site.horaires;
  if (!h) return [];
  const texte = (j: Jour) => (h[j].length ? h[j].map((p) => `${p.ouverture} – ${p.fermeture}`).join(" · ") : "Fermé");
  const groupes: { de: Jour; a: Jour; t: string }[] = [];
  for (const j of JOURS) {
    const t = texte(j), g = groupes[groupes.length - 1];
    if (g && g.t === t) g.a = j; else groupes.push({ de: j, a: j, t });
  }
  const maj = (j: string) => j[0].toUpperCase() + j.slice(1);
  return groupes.map((g) => ({
    jours: g.de === g.a ? maj(g.de) : JOURS.indexOf(g.a) - JOURS.indexOf(g.de) === 1 ? `${maj(g.de)} et ${g.a}` : `${maj(g.de)} au ${g.a}`,
    t: g.t,
  }));
}

function IconeInstagram() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" /></svg>;
}
function IconeTikTok() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6" fill="currentColor"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.8 5.8 0 1 0 4.9 5.7V9.1a7.4 7.4 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6Z" /></svg>;
}

function PlanContact() {
  const [charge, setCharge] = useState(false);
  const [encadre, setEncadre] = useState(false);
  useEffect(() => { setEncadre(window.self !== window.top); }, []);
  const src = lienPlanIntegre();
  if (!src) return null;
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[1.6rem] bg-[#f1ece9] text-encre shadow-[0_30px_60px_-30px_rgba(0,0,0,.6)] sm:rounded-[2rem]">
      {charge ? (
        <iframe src={src} title={`Plan d'accès BOWLY'S, ${adresseLigne()}`} className="absolute inset-0 size-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <>
          {/* Plan stylisé (le vrai plan Google ne se charge qu'à la demande) */}
          <svg aria-hidden="true" className="absolute inset-0 size-full" preserveAspectRatio="none" viewBox="0 0 400 300">
            <g fill="none" stroke="#fff" strokeLinecap="round"><path d="M-20 200 C 80 185 150 120 420 135" strokeWidth="16" /><path d="M120 -20 L 175 320" strokeWidth="12" /><path d="M300 -20 C 280 80 300 200 255 320" strokeWidth="12" /><path d="M-20 60 L 420 90" strokeWidth="6" /><path d="M-20 270 L 420 250" strokeWidth="6" /><path d="M45 -20 L 70 320" strokeWidth="6" /></g>
          </svg>
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <div className="grid justify-items-center gap-3">
              <span className="relative grid size-14 place-items-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-rouge/40" />
                <span className="relative grid size-14 place-items-center rounded-full bg-rouge text-white shadow-lg"><Navigation className="size-6" /></span>
              </span>
              <p className="text-lg font-bold leading-tight">{site.restaurant!.rue}<br />{site.restaurant!.codePostal} {site.restaurant!.ville}</p>
              {encadre ? (
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adresseLigne()!)}`} target="_blank" rel="noopener noreferrer" className="titre-large rounded-full bg-encre px-5 py-3 text-xs text-white">Ouvrir le plan</a>
              ) : (
                <button type="button" onClick={() => setCharge(true)} className="titre-large rounded-full bg-encre px-5 py-3 text-xs text-white">Afficher le plan</button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function Contact() {
  if (!site.restaurant) return null;
  const tel = site.telephone;
  const reseaux = [
    site.reseaux.instagram && { href: site.reseaux.instagram, label: "Instagram", icone: <IconeInstagram /> },
    site.reseaux.tiktok && { href: site.reseaux.tiktok, label: "TikTok", icone: <IconeTikTok /> },
    tel && { href: `tel:${tel.replace(/\s/g, "")}`, label: "Appeler", icone: <Phone className="size-6" /> },
    { href: lienItineraire()!, label: "Itinéraire", icone: <Navigation className="size-6" /> },
  ].filter(Boolean) as { href: string; label: string; icone: React.ReactNode }[];

  return (
    <section id="contact" aria-labelledby="contact-titre" className="vagues sur-sombre bg-rouge py-14 text-white sm:py-24">
      <div className={`${conteneur} grid items-center gap-10 lg:grid-cols-2 lg:gap-16`}>
        <div className="apparait text-center">
          <p className="text-[clamp(1.2rem,2.2vw,1.9rem)] font-medium text-jaune">BOWLY&apos;S Lahmacun</p>
          <h2 id="contact-titre" className="titre-large mt-1 text-[clamp(2rem,5.2vw,4.4rem)]">Contactez-nous</h2>

          {site.horaires && (
            <>
              <h3 className="mt-6 text-[clamp(1.3rem,2.2vw,1.9rem)] font-bold">Heures d&apos;ouverture</h3>
              <ul className="mt-1 text-[clamp(1.05rem,1.8vw,1.45rem)]">
                {horairesGroupes().map((g) => <li key={g.jours}>{g.jours} : <span className="tabular-nums">{g.t}</span></li>)}
              </ul>
              <div className="mt-3"><PastilleStatut ton="clair" /></div>
            </>
          )}

          <h3 className="mt-6 text-[clamp(1.3rem,2.2vw,1.9rem)] font-bold">Adresse</h3>
          <address className="text-[clamp(1.05rem,1.8vw,1.45rem)] not-italic">{adresseLigne()}</address>
          {tel && (
            <a href={`tel:${tel.replace(/\s/g, "")}`} className="mt-4 inline-flex items-center gap-3 text-[clamp(1.2rem,2vw,1.7rem)] font-bold hover:underline">
              <Phone className="size-6" /> <span className="tabular-nums">{tel}</span>
            </a>
          )}

          <ul className="mt-6 flex justify-center gap-3 sm:gap-4">
            {reseaux.map((r) => (
              <li key={r.label}>
                <a href={r.href} aria-label={r.label} {...(r.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="grid size-14 place-items-center rounded-full bg-white text-rouge transition-transform duration-300 hover:-translate-y-1 hover:bg-jaune hover:text-encre sm:size-16">
                  {r.icone}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="apparait-2"><PlanContact /></div>
      </div>
    </section>
  );
}
