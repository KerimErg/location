"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, Navigation, Pause, Phone, Play } from "lucide-react";
import { CATEGORIES, produitsDe, type Produit } from "@/data/menu";
import { prix } from "@/lib/format";
import { usePanier } from "@/lib/panier";
import { site, adresseLigne, lienItineraire, JOURS, type Jour } from "@/config/site";
import { Photo } from "./Photo";
import { Logo } from "./Logo";
import { PastilleStatut } from "./StatutLive";

/**
 * Page d'accueil « style affiche » : rouge à vagues, grands titres blancs élargis, accents jaunes.
 * Bannière vidéo plein écran → aperçu du menu → livraison → à propos → contact.
 */

const conteneur = "mx-auto max-w-[1240px] px-[max(20px,env(safe-area-inset-left))]";

/* ─────────── Éléments communs ─────────── */

/** Gros bouton jaune avec pastille rouge (« COMMANDER »). */
function BoutonJaune({ children, href, onClick, className = "" }: { children: React.ReactNode; href?: string; onClick?: () => void; className?: string }) {
  const cls = `titre-large group inline-flex h-14 items-center gap-3 rounded-full bg-jaune pl-4 pr-7 text-[clamp(.95rem,1.5vw,1.3rem)] text-encre shadow-[0_14px_30px_-12px_rgba(0,0,0,.45)] transition-transform duration-300 ease-[var(--ease-pro)] hover:-translate-y-0.5 active:scale-[.97] sm:h-16 sm:pl-5 sm:pr-8 ${className}`;
  const contenu = (
    <>
      <span aria-hidden="true" className="relative grid size-7 place-items-center rounded-full border-[3px] border-rouge sm:size-8">
        <span className="absolute inset-0 animate-ping rounded-full bg-rouge/30" />
        <span className="size-3 rounded-full bg-rouge sm:size-3.5" />
      </span>
      {children}
    </>
  );
  return href ? <Link href={href} className={cls}>{contenu}</Link> : <button type="button" onClick={onClick} className={cls}>{contenu}</button>;
}

/** Commander : ouvre le panier s'il contient quelque chose, sinon mène à la carte. */
function useCommander() {
  const { nbArticles, ouvrirPanier } = usePanier();
  return () => (nbArticles > 0 ? ouvrirPanier() : (window.location.href = "/carte/"));
}

/** Titre de section : les mots montent derrière un cache en arrivant à l'écran. */
function TitreSection({ id, children, className = "" }: { id: string; children: string; className?: string }) {
  return (
    <h2 id={id} className={`titre-large ${className}`}>
      {children.split(" ").map((m, i) => (
        <Fragment key={i}>
          {i > 0 && " "}
          <span className="masque-vue"><span style={{ animationRange: `entry ${15 + i * 7}% cover ${32 + i * 7}%` }}>{m}</span></span>
        </Fragment>
      ))}
    </h2>
  );
}

/** Vidéo muette qui ne tourne que lorsqu'elle est visible (fluidité, batterie). */
function VideoVisible({ src, affiche, className = "" }: { src: string; affiche: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.15 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} src={src} poster={affiche} muted loop playsInline preload="metadata" aria-hidden="true" className={className} />;
}

/** Badge rond au texte qui tourne, logo au centre. */
function BadgeTournant({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`${/\babsolute\b/.test(className) ? "" : "relative"} grid aspect-square place-items-center rounded-full bg-jaune text-encre shadow-[0_20px_40px_-16px_rgba(0,0,0,.6)] ${className}`}>
      <svg viewBox="0 0 200 200" className="tourne-lent absolute inset-0 size-full [animation-duration:18s]">
        <defs><path id="cercle-badge" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" /></defs>
        <text className="titre-large" fontSize="19" letterSpacing="3.2" fill="currentColor">
          <textPath href="#cercle-badge">BOWLY&apos;S • LAHMACUN • BOX • DÜRÜM •</textPath>
        </text>
      </svg>
      <Logo variante="icone" titre="" className="w-[42%] text-rouge" />
    </div>
  );
}

/* ─────────── Bannière : vidéo plein écran ─────────── */
const PANNEAUX = [
  { video: "/videos/hero-1.mp4", affiche: "/videos/hero-1.webp", mobile: false },
  { video: "/videos/hero-2.mp4", affiche: "/videos/hero-2.webp", mobile: false },
  { video: "/videos/hero-3.mp4", affiche: "/videos/hero-3.webp", mobile: false },
  { video: "/videos/hero-mobile.mp4", affiche: "/videos/hero-1.webp", mobile: true },
];

export function Banniere() {
  const commander = useCommander();
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const zone = useRef<HTMLElement>(null);
  const [lecture, setLecture] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => { if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setLecture(false); }, []);
  useEffect(() => {
    const el = zone.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const sync = () => refs.current.forEach((v) => {
      if (!v) return;
      if (lecture && visible && v.offsetParent !== null) v.play().catch(() => {}); else v.pause();
    });
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [lecture, visible]);

  const mots = ["Le", "lahmacun", "autrement"];
  return (
    <section ref={zone} aria-labelledby="hero-titre" className="sur-sombre relative h-[86svh] min-h-[560px] overflow-hidden bg-encre text-white sm:h-[100svh] sm:min-h-[640px]">
      <div aria-hidden="true" className="absolute inset-0 grid grid-cols-1 md:grid-cols-3">
        {PANNEAUX.map((p, i) => (
          <div key={p.video} className={`relative overflow-hidden ${p.mobile ? "md:hidden" : "hidden md:block"}`}>
            <video ref={(el) => { refs.current[i] = el; }} className="absolute inset-0 size-full object-cover" src={p.video} poster={p.affiche} muted loop playsInline preload="metadata" />
          </div>
        ))}
      </div>
      {/* Voile rouge BOWLY'S : lisibilité du titre, couleur de la marque */}
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(100deg,rgba(140,2,10,.92)_0%,rgba(140,2,10,.72)_38%,rgba(140,2,10,.15)_75%,rgba(30,11,14,.25)_100%)] max-md:bg-[linear-gradient(180deg,rgba(30,11,14,.35)_0%,rgba(140,2,10,.55)_45%,rgba(140,2,10,.92)_100%)]" />
      <div aria-hidden="true" className="vagues absolute inset-0 opacity-70" />

      <div className={`${conteneur} relative z-10 flex h-full items-end pb-16 sm:items-center sm:pb-0`}>
        <div className="max-w-[760px]">
          <p className="anim-monter text-[clamp(1.15rem,2vw,1.8rem)] font-medium text-jaune [animation-delay:100ms]">Box à partager, dürüm à composer.</p>
          <h1 id="hero-titre" className="titre-large mt-2 text-[clamp(2.3rem,10.2vw,7.4rem)] leading-[.9] sm:text-[clamp(3rem,8.4vw,7.4rem)]">
            {mots.map((m, i) => (
              <Fragment key={m}>
                <span className="masque"><span style={{ animationDelay: `${200 + i * 130}ms` }}>{m}</span></span>
                {i === 0 ? " " : <br />}
              </Fragment>
            ))}
          </h1>
          <div className="anim-monter mt-7 flex flex-wrap items-center gap-3 [animation-delay:650ms] sm:mt-9 sm:gap-4">
            <BoutonJaune onClick={commander}>Commander</BoutonJaune>
            <Link href="/carte/" className="titre-large inline-flex h-14 items-center gap-2 rounded-full border-2 border-white/80 px-6 text-[clamp(.85rem,1.3vw,1.1rem)] transition-colors hover:bg-white hover:text-rouge sm:h-16 sm:px-8">
              Voir le menu
            </Link>
          </div>
          <div className="anim-monter mt-5 [animation-delay:800ms]"><PastilleStatut ton="clair" /></div>
        </div>
      </div>

      <BadgeTournant className="anim-pop-entree absolute right-[max(20px,4vw)] top-24 z-10 w-24 sm:bottom-14 sm:top-auto sm:w-40" />

      <a href="#menu" aria-label="Descendre vers le menu" className="absolute bottom-5 left-1/2 z-10 hidden size-12 -translate-x-1/2 place-items-center rounded-full border-2 border-white/60 transition-colors hover:bg-white hover:text-rouge sm:grid">
        <ArrowDown className="size-5 animate-bounce" />
      </a>
      <button type="button" onClick={() => setLecture((l) => !l)} aria-label={lecture ? "Mettre la vidéo en pause" : "Lancer la vidéo"}
        className="absolute bottom-5 right-[max(20px,env(safe-area-inset-right))] z-10 hidden size-11 place-items-center rounded-full border border-white/50 bg-black/20 hover:bg-white hover:text-rouge sm:grid">
        {lecture ? <Pause className="size-4" fill="currentColor" /> : <Play className="size-4" fill="currentColor" />}
      </button>
    </section>
  );
}

/* ─────────── Notre menu : un aperçu, la carte complète est classée sur /carte/ ─────────── */
function CarteProduit({ p }: { p: Produit }) {
  return (
    <Link href={`/carte/${p.categorie}/${p.id}/`} className="group block text-center">
      <span className="relative block aspect-[4/3] overflow-hidden rounded-[1.4rem] bg-vin shadow-[0_24px_40px_-26px_rgba(30,11,14,.7)] transition-[transform,box-shadow] duration-500 ease-[var(--ease-pro)] group-hover:-translate-y-1.5 group-hover:shadow-[0_34px_50px_-26px_rgba(30,11,14,.8)] sm:rounded-[1.8rem]">
        <Photo src={p.photo} alt={p.nom} className="absolute inset-0 !bg-vin" sizes="(max-width: 1024px) 50vw, 300px" />
        {p.badge && <span className="titre-large absolute left-2.5 top-2.5 rounded-full bg-jaune px-2.5 py-1 text-[0.55rem] text-encre sm:left-3 sm:top-3 sm:text-[0.65rem]">★ {p.badge}</span>}
      </span>
      <span className="mt-3 block text-[clamp(1.1rem,1.9vw,1.7rem)] font-bold leading-tight text-encre sm:mt-4">{p.nom.replace("Box ", "")}</span>
      <span className="mx-auto mt-1 block max-w-[30ch] text-[0.85rem] font-light leading-snug text-gris sm:text-base">{p.description}</span>
      <span className="mt-1.5 block text-[clamp(1.3rem,2vw,1.9rem)] font-bold text-rouge">{prix(p.prix)}</span>
    </Link>
  );
}

export function Menu() {
  const box = produitsDe("box");
  const durum = produitsDe("durum")[0];
  const option = box[0].groupes?.[0]?.choix[0];
  const catBox = CATEGORIES.find((c) => c.id === "box")!;

  return (
    <section id="menu" aria-labelledby="menu-titre" className="bg-white py-14 sm:py-24">
      <div className={conteneur}>
        <header className="text-center">
          <TitreSection id="menu-titre" className="text-[clamp(2.2rem,6vw,4.6rem)] text-encre">Notre menu</TitreSection>
          <p className="apparait mt-2 text-[clamp(1.05rem,2vw,1.6rem)] text-gris">Box à partager, dürüm à composer — sur place ou à emporter.</p>
        </header>

        <h3 className="apparait mt-10 flex flex-col items-center justify-center gap-1 text-center sm:mt-14 sm:flex-row sm:items-baseline sm:gap-3">
          <span className="titre-large text-[clamp(1.2rem,2.4vw,1.9rem)] text-rouge">{catBox.nom}</span>
          <span className="text-[0.95rem] font-medium text-gris sm:text-lg"><span className="hidden sm:inline">· </span>{catBox.accroche}</span>
        </h3>
        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:mt-8 sm:gap-x-8 lg:grid-cols-4">
          {box.map((p, i) => (
            <li key={p.id} className={["apparait", "apparait-2", "apparait-3", "apparait-2"][i % 4]}><CarteProduit p={p} /></li>
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
                      <img key={c.id} src={c.photo} alt={c.nom} title={c.nom} loading="lazy" className="relative size-8 rounded-full ring-2 ring-doux transition-transform duration-300 hover:z-10 hover:scale-125 sm:size-10" />
                    ))}
                  </span>
                </li>
              ))}
            </ol>
            <BoutonJaune href={`/carte/durum/${durum.id}/`} className="mt-7">Composer</BoutonJaune>
          </div>
        </div>

        {/* La carte complète, classée par catégories */}
        <div className="apparait mt-12 flex flex-col items-center gap-5 sm:mt-16">
          <ul className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link href={`/carte/${c.id}/`} className="inline-flex h-11 items-center rounded-full border-2 border-encre/10 px-5 text-lg font-bold text-encre transition-colors hover:border-rouge hover:bg-rouge hover:text-white">{c.nom}</Link>
              </li>
            ))}
          </ul>
          <BoutonJaune href="/carte/">Voir tout le menu</BoutonJaune>
        </div>
      </div>
    </section>
  );
}

/* ─────────── Livraison / à emporter ─────────── */
/** N'affiche que des informations réelles : la livraison est annoncée « bientôt » tant qu'elle n'est pas configurée. */
export function Livraison() {
  const commander = useCommander();
  const { uberEats, deliveroo, livraison, retraitSurPlace } = site.commande;
  const plateformes = [uberEats && { nom: "Uber Eats", href: uberEats }, deliveroo && { nom: "Deliveroo", href: deliveroo }].filter(Boolean) as { nom: string; href: string }[];
  const boxNature = produitsDe("box")[0];

  return (
    <section id="livraison" aria-labelledby="livraison-titre" className="overflow-hidden bg-white pb-14 sm:pb-24">
      <div className={`${conteneur} grid items-center gap-10 lg:grid-cols-2 lg:gap-16`}>
        <div className="text-center">
          <TitreSection id="livraison-titre" className="text-[clamp(2.2rem,5.6vw,4.4rem)] text-encre">Livraison</TitreSection>
          <p className="apparait mx-auto mt-4 max-w-[46ch] text-[1.05rem] leading-relaxed text-gris sm:text-[1.25rem]">
            Envie d&apos;un lahmacun ? Choisissez vos box et votre dürüm en ligne, puis
            {livraison ? " faites-vous livrer ou passez les récupérer." : " passez les récupérer au restaurant."}
          </p>
          <ul className="apparait mx-auto mt-6 grid max-w-[46ch] gap-2.5 text-[1.05rem] font-bold text-encre sm:text-[1.3rem]">
            {retraitSurPlace && <li>🥡 À emporter : {adresseLigne()}</li>}
            <li>🛵 Livraison : {livraison || plateformes.length ? "disponible" : "bientôt disponible"}</li>
          </ul>
          <div className="apparait mt-8 flex flex-wrap justify-center gap-3">
            <BoutonJaune onClick={commander}>Commander</BoutonJaune>
            {plateformes.map((p) => (
              <a key={p.nom} href={p.href} target="_blank" rel="noopener noreferrer" className="titre-large inline-flex h-14 items-center rounded-full border-2 border-encre px-6 text-sm text-encre hover:bg-encre hover:text-white sm:h-16">{p.nom}</a>
            ))}
          </div>
        </div>

        {/* Visuel : la box BOWLY'S sur fond rouge, badge qui tourne */}
        <div className="apparait-2 relative">
          <div className="vagues relative overflow-hidden rounded-[2rem] bg-rouge p-6 sm:p-10">
            <div className="fondu-bords relative mx-auto aspect-[1095/531] w-full">
              <Photo src={boxNature.photo} alt="Box de lahmacuns BOWLY'S" className="anim-plat absolute inset-0 !bg-transparent" sizes="(max-width: 1024px) 90vw, 560px" zoom={false} />
            </div>
            <p className="titre-large mt-4 text-center text-[clamp(1.2rem,2.6vw,2rem)] text-white">Sur place ou à emporter</p>
          </div>
          <BadgeTournant className="absolute -right-1 -top-6 w-24 sm:-right-6 sm:-top-8 sm:w-32" />
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
    <section id="apropos" aria-labelledby="apropos-titre" className="vagues sur-sombre bg-rouge py-14 text-white sm:py-24">
      <div className={conteneur}>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="apparait relative aspect-[16/10] overflow-hidden rounded-[1.6rem] bg-encre shadow-[0_40px_80px_-40px_rgba(0,0,0,.7)] sm:rounded-[2rem]">
            <VideoVisible src="/videos/hero-2.mp4" affiche="/videos/hero-2.webp" className="absolute inset-0 size-full object-cover" />
          </div>
          <div className="text-center lg:text-left">
            <p className="apparait text-[clamp(1.15rem,2vw,1.7rem)] font-medium text-jaune">Notre histoire</p>
            <TitreSection id="apropos-titre" className="mt-1 text-[clamp(2rem,4.8vw,4rem)]">À propos de nous</TitreSection>
            <p className="apparait mx-auto mt-4 max-w-[52ch] text-[1.05rem] leading-relaxed text-white/85 sm:text-[1.2rem] lg:mx-0">
              BOWLY&apos;S est né d&apos;une idée simple : donner au lahmacun la place qu&apos;il mérite. Une carte courte, pensée entièrement autour de lui, en box de petits formats pour partager ou en dürüm grand format composé à votre goût.
            </p>
            <ul className="apparait mx-auto mt-6 grid max-w-[52ch] gap-2.5 text-left text-[1.05rem] font-bold sm:text-[1.25rem] lg:mx-0">
              <li>🫓 Des lahmacuns petit format, en box à partager</li>
              <li>🌯 Un dürüm grand format, composé à votre goût</li>
              <li>🔥 Cuits au four, servis sur place ou à emporter</li>
            </ul>
          </div>
        </div>

        <ul className="sans-barre -mx-[max(20px,env(safe-area-inset-left))] mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-[max(20px,env(safe-area-inset-left))] sm:mx-0 sm:mt-14 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {GALERIE.map((g, i) => (
            <li key={g.src} className={`${["apparait", "apparait-2", "apparait-3", "apparait-2"][i]} group relative aspect-[4/5] w-[42%] shrink-0 snap-start overflow-hidden rounded-[1.2rem] bg-encre sm:w-auto sm:rounded-[1.6rem]`}>
              <Photo src={g.src} alt={g.alt} className="absolute inset-0" sizes="(max-width: 1024px) 50vw, 300px" />
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

export function Contact() {
  if (!site.restaurant) return null;
  const tel = site.telephone;
  const reseaux = [
    site.reseaux.instagram && { href: site.reseaux.instagram, label: "Instagram", icone: <IconeInstagram /> },
    site.reseaux.tiktok && { href: site.reseaux.tiktok, label: "TikTok", icone: <IconeTikTok /> },
  ].filter(Boolean) as { href: string; label: string; icone: React.ReactNode }[];

  return (
    <section id="contact" aria-labelledby="contact-titre" className="bg-white py-14 sm:py-24">
      <div className={`${conteneur} text-center`}>
        <p className="apparait text-[clamp(1.15rem,2vw,1.7rem)] font-medium text-rouge">BOWLY&apos;S Lahmacun</p>
        <TitreSection id="contact-titre" className="mt-1 text-[clamp(2rem,5.2vw,4.4rem)] text-encre">Contactez-nous</TitreSection>

        <div className="mx-auto mt-10 grid max-w-[980px] gap-4 text-left sm:grid-cols-3 sm:gap-5">
          {site.horaires && (
            <div className="apparait rounded-[1.6rem] bg-doux p-6 sm:p-7">
              <p className="titre-large text-sm text-rouge">Horaires</p>
              <ul className="mt-3 grid gap-1.5 text-[1.05rem]">
                {horairesGroupes().map((g) => <li key={g.jours}><span className="block font-bold text-encre">{g.jours}</span><span className="tabular-nums text-gris">{g.t}</span></li>)}
              </ul>
              <div className="mt-4"><PastilleStatut /></div>
            </div>
          )}
          <div className="apparait-2 flex flex-col rounded-[1.6rem] bg-doux p-6 sm:p-7">
            <p className="titre-large text-sm text-rouge">Adresse</p>
            <address className="mt-3 text-[1.15rem] font-bold not-italic leading-snug text-encre">{site.restaurant.rue}<br />{site.restaurant.codePostal} {site.restaurant.ville}</address>
            <a href={lienItineraire()!} target="_blank" rel="noopener noreferrer" className="titre-large mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-encre px-5 text-xs text-white transition-colors hover:bg-rouge sm:mt-auto">
              <Navigation className="size-4" /> Itinéraire
            </a>
          </div>
          <div className="apparait-3 flex flex-col rounded-[1.6rem] bg-rouge p-6 text-white sm:p-7">
            <p className="titre-large text-sm text-jaune">Nous joindre</p>
            {tel && (
              <a href={`tel:${tel.replace(/\s/g, "")}`} className="mt-3 inline-flex items-center gap-2.5 text-[1.3rem] font-bold tabular-nums hover:underline">
                <Phone className="size-5" /> {tel}
              </a>
            )}
            {reseaux.length > 0 && (
              <ul className="mt-5 flex gap-3 sm:mt-auto sm:pt-5">
                {reseaux.map((r) => (
                  <li key={r.label}>
                    <a href={r.href} aria-label={r.label} target="_blank" rel="noopener noreferrer"
                      className="grid size-12 place-items-center rounded-full bg-white text-rouge transition-transform duration-300 hover:-translate-y-1 hover:bg-jaune hover:text-encre">
                      {r.icone}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
