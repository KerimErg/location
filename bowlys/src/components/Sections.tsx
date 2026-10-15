"use client";

import { ArrowRight, Check, MapPin, Clock, Phone, Mail } from "lucide-react";
import { PRODUITS, produitsDe, type CategorieId } from "@/data/menu";
import { prix } from "@/lib/format";
import { usePanier } from "@/lib/panier";
import { site, adresseLigne, lienItineraire, JOURS } from "@/config/site";
import { Photo } from "./Photo";
import { LienBouton, classesBouton } from "./Bouton";
import { Logo } from "./Logo";

/** Demande à la carte d'afficher une catégorie, puis y fait défiler. */
export function allerALaCarte(cat: CategorieId) {
  window.dispatchEvent(new CustomEvent("bowlys-filtre", { detail: cat }));
  document.getElementById("carte")?.scrollIntoView({ behavior: "smooth" });
}

const Surtitre = ({ children, clair = false }: { children: React.ReactNode; clair?: boolean }) => (
  <p className={`font-display text-sm font-extrabold uppercase tracking-[0.2em] ${clair ? "text-white/80" : "text-bleu"}`}>{children}</p>
);

/* ─────────── Bandeau défilant ─────────── */
export function Bandeau() {
  const mots = ["Manti", "Lahmacun", "Sur place", "À emporter", "Street food turque"];
  const suite = [...mots, ...mots, ...mots, ...mots];
  return (
    <div aria-hidden="true" className="overflow-hidden bg-bleu py-4 text-white">
      <div className="defilement flex w-max gap-8 whitespace-nowrap font-display text-xl font-black uppercase tracking-wide sm:text-2xl">
        {[...suite, ...suite].map((m, i) => (
          <span key={i} className="flex items-center gap-8">{m}<Logo variante="icone" titre="" className="w-7 text-white/70" /></span>
        ))}
      </div>
    </div>
  );
}

/* ─────────── Nos spécialités ─────────── */
export function Specialites() {
  const blocs = [
    {
      cat: "mantis" as CategorieId, titre: "Les Mantis", sombre: false,
      texte: "De petits raviolis turcs servis généreusement, avec leur sauce yaourt et une touche de beurre pimenté.",
      photo: "/images/illustration-manti-beurre.webp", illustration: true, n: produitsDe("mantis").length,
    },
    {
      cat: "lahmacuns" as CategorieId, titre: "Les Lahmacuns", sombre: true,
      texte: "Une pâte fine et dorée, garnie puis cuite au four pour rester croustillante.",
      photo: "/images/illustration-lahmacun-garniture.webp", illustration: true, n: produitsDe("lahmacuns").length,
    },
  ];
  return (
    <section id="specialites" aria-labelledby="spe-titre" className="py-20 sm:py-28">
      <div className="mx-auto max-w-[1240px] px-[max(20px,env(safe-area-inset-left))]">
        <div className="apparait mx-auto max-w-[760px] text-center">
          <Surtitre>Nos spécialités</Surtitre>
          <h2 id="spe-titre" className="mt-3 font-display text-[clamp(2.4rem,5.6vw,4.4rem)] font-black leading-[0.95] tracking-[-0.02em]">
            Deux recettes. Zéro compromis sur le goût.
          </h2>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {blocs.map((b) => (
            <article key={b.cat} className={`apparait group relative flex min-h-[560px] flex-col overflow-hidden rounded-[28px] sm:min-h-[640px] ${b.sombre ? "sur-sombre bg-encre text-white" : "bg-bleu-ciel"}`}>
              <Photo src={b.photo} alt={b.titre} illustration={b.illustration} sombre={b.sombre} className="absolute inset-0" sizes="(max-width: 768px) 100vw, 50vw" />
              {b.photo && <div className="absolute inset-0 bg-gradient-to-t from-encre/90 via-encre/25 to-transparent" />}
              <div className={`relative mt-auto grid gap-4 p-7 sm:p-10 ${b.photo ? "text-white" : ""}`}>
                <span className="w-fit rounded-full bg-bleu px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-white">{b.n} recettes</span>
                <h3 className="font-display text-[clamp(2.4rem,4.6vw,3.6rem)] font-black leading-none">{b.titre}</h3>
                <p className="max-w-[40ch] text-[1.05rem] font-semibold opacity-90">{b.texte}</p>
                <button type="button" onClick={() => allerALaCarte(b.cat)} className={classesBouton(b.photo || b.sombre ? "blanc" : "bleu", "lg", "mt-2 w-fit")}>
                  Découvrir <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── Les menus ─────────── */
export function Menus() {
  const { ajouter } = usePanier();
  const menus = produitsDe("menus");
  return (
    <section id="menus" aria-labelledby="menus-titre" className="sur-sombre bg-bleu py-20 text-white sm:py-28">
      <div className="mx-auto max-w-[1240px] px-[max(20px,env(safe-area-inset-left))]">
        <div className="apparait flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Surtitre clair>Les menus</Surtitre>
            <h2 id="menus-titre" className="mt-3 font-display text-[clamp(2.4rem,5.6vw,4.4rem)] font-black leading-[0.95] tracking-[-0.02em]">
              Le repas complet,<br />en un clic.
            </h2>
          </div>
          <p className="max-w-[36ch] font-semibold text-white/85">Choisissez votre menu, on s&apos;occupe du reste.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {menus.map((m, i) => {
            const vedette = m.id === "menu-mix";
            return (
              <article key={m.id} className={`apparait group relative flex flex-col overflow-hidden rounded-[26px] bg-white text-encre ${vedette ? "ring-4 ring-white md:-translate-y-4" : ""}`} style={{ animationDelay: `${i * 80}ms` }}>
                {vedette && <span className="absolute right-4 top-4 z-10 rounded-full bg-encre px-3 py-1 text-xs font-extrabold uppercase tracking-[0.12em] text-white">Manti + Lahmacun</span>}
                <Photo src={m.photo} alt={m.nom} illustration={m.illustration} className="aspect-[4/3]" sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="flex flex-1 flex-col gap-3 p-6 sm:p-7">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-2xl font-black sm:text-3xl">{m.nom}</h3>
                    <span className="font-display text-2xl font-black text-bleu sm:text-3xl">{prix(m.prix)}</span>
                  </div>
                  <p className="text-gris">{m.description}</p>
                  {m.composition && m.composition.length > 0 ? (
                    <ul className="grid gap-1.5 text-sm font-semibold">
                      {m.composition.map((c) => <li key={c} className="flex items-center gap-2"><Check className="size-4 text-bleu" strokeWidth={3} />{c}</li>)}
                    </ul>
                  ) : (
                    <p className="text-sm font-semibold text-gris/80">Composition détaillée bientôt en ligne.</p>
                  )}
                  {site.commande.panierActif && (
                    <button type="button" onClick={() => ajouter(m.id)} className={classesBouton(vedette ? "bleu" : "encre", "md", "mt-auto w-full")}>
                      Ajouter ce menu
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────── Notre concept ─────────── */
export function Concept() {
  const piliers = [
    { t: "Deux spécialités", d: "Le manti et le lahmacun, travaillés en plusieurs recettes." },
    { t: "Une carte claire", d: "Des plats, des menus, des prix lisibles. On choisit vite." },
    { t: "Sur place ou à emporter", d: "Pour une pause rapide ou un repas à partager." },
  ];
  return (
    <section id="concept" aria-labelledby="concept-titre" className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-[max(20px,env(safe-area-inset-left))] md:grid-cols-2 lg:gap-20">
        <div className="apparait relative">
          <Photo src="/images/illustration-manti-yaourt.webp" alt="Sauce yaourt versée sur des mantis" illustration className="aspect-[4/5] rounded-[28px]" sizes="(max-width: 768px) 100vw, 50vw" zoom={false} />
          <div className="absolute -bottom-6 -right-3 hidden rounded-[22px] bg-bleu p-6 text-white shadow-xl sm:block md:-right-8">
            <Logo variante="complet" titre="BOWLY'S" className="w-40 text-white" />
          </div>
        </div>
        <div className="apparait">
          <Surtitre>Notre concept</Surtitre>
          <h2 id="concept-titre" className="mt-3 font-display text-[clamp(2.2rem,4.8vw,3.8rem)] font-black leading-[0.98] tracking-[-0.02em]">
            Les spécialités turques, version street food.
          </h2>
          <p className="mt-6 max-w-[48ch] text-lg text-gris">
            BOWLY&apos;S met à l&apos;honneur deux grands classiques turcs dans un univers moderne et accessible. Des portions généreuses, une carte courte et claire, et un seul objectif : se faire plaisir.
          </p>
          <ul className="mt-10 grid gap-4">
            {piliers.map((p, i) => (
              <li key={p.t} className="flex gap-5 rounded-2xl bg-doux p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-bleu font-display font-black text-white">{i + 1}</span>
                <div>
                  <h3 className="font-display text-lg font-black">{p.t}</h3>
                  <p className="text-gris">{p.d}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ─────────── Contact & infos pratiques ─────────── */
export function Contact() {
  const adresse = adresseLigne();
  const itin = lienItineraire();
  const h = site.horaires;
  return (
    <section id="contact" aria-labelledby="contact-titre" className="bg-doux py-20 sm:py-28">
      <div className="mx-auto max-w-[1240px] px-[max(20px,env(safe-area-inset-left))]">
        <div className="apparait mx-auto max-w-[760px] text-center">
          <Surtitre>Contact</Surtitre>
          <h2 id="contact-titre" className="mt-3 font-display text-[clamp(2.4rem,5.6vw,4.4rem)] font-black leading-[0.95] tracking-[-0.02em]">On vous attend.</h2>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
          {adresse && (
            <div className="sur-sombre apparait flex flex-col justify-between gap-10 rounded-[28px] bg-encre p-8 text-white sm:p-10">
              <div>
                <MapPin className="size-8 text-bleu" strokeWidth={2.4} />
                <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-white/60">Le restaurant</p>
                <p className="mt-2 font-display text-[clamp(1.9rem,3.6vw,2.8rem)] font-black leading-[1.05]">
                  {site.restaurant!.rue}<br />{site.restaurant!.codePostal} {site.restaurant!.ville}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                {itin && <LienBouton href={itin} externe style="bleu" taille="lg">Itinéraire <ArrowRight className="size-5" /></LienBouton>}
                {site.telephone && <LienBouton href={`tel:${site.telephone.replace(/\s/g, "")}`} style="contour-blanc" taille="lg"><Phone className="size-5" />{site.telephone}</LienBouton>}
              </div>
            </div>
          )}
          <div className="grid gap-5">
            <div className="apparait rounded-[28px] bg-white p-8 ring-1 ring-trait">
              <div className="flex items-center gap-3"><Clock className="size-6 text-bleu" strokeWidth={2.4} /><h3 className="font-display text-xl font-black">Horaires</h3></div>
              {h ? (
                <dl className="mt-5 grid gap-2">
                  {JOURS.map((j) => (
                    <div key={j} className="flex justify-between border-b border-trait pb-2 text-sm">
                      <dt className="font-bold capitalize">{j}</dt>
                      <dd className="tabular-nums text-gris">{h[j].length ? h[j].map((p) => `${p.ouverture} – ${p.fermeture}`).join(" · ") : "Fermé"}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="mt-4 text-gris">Les horaires d&apos;ouverture seront affichés ici très bientôt.</p>
              )}
            </div>
            <div className="apparait rounded-[28px] bg-white p-8 ring-1 ring-trait">
              <h3 className="font-display text-xl font-black">Suivez-nous</h3>
              <div className="mt-5 flex flex-wrap gap-3">
                {site.reseaux.instagram && <LienBouton href={site.reseaux.instagram} externe style="contour">Instagram</LienBouton>}
                {site.reseaux.tiktok && <LienBouton href={site.reseaux.tiktok} externe style="contour">TikTok</LienBouton>}
                {site.email && <LienBouton href={`mailto:${site.email}`} style="contour"><Mail className="size-4" />{site.email}</LienBouton>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const nbProduits = PRODUITS.length;
