"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
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

export function EnTete({ surtitre, titre, id, clair = false, centre = false }: { surtitre: string; titre: React.ReactNode; id: string; clair?: boolean; centre?: boolean }) {
  return (
    <div className={`apparait ${centre ? "mx-auto max-w-[720px] text-center" : ""}`}>
      <p className={`font-display text-[0.8rem] font-extrabold uppercase tracking-[0.22em] ${clair ? "text-white/75" : "text-bleu"}`}>{surtitre}</p>
      <h2 id={id} className="mt-3 font-display text-[clamp(2.2rem,5vw,3.8rem)] font-black leading-[0.98] tracking-[-0.02em]">{titre}</h2>
    </div>
  );
}

/* ─────────── Notre concept : une phrase, pas plus ─────────── */
export function Concept() {
  return (
    <section id="concept" aria-labelledby="concept-titre" className="py-24 sm:py-32">
      <div className={`${conteneur} apparait grid justify-items-center text-center`}>
        <Logo variante="icone" titre="" className="w-14 text-bleu" />
        <p className="mt-6 font-display text-[0.8rem] font-extrabold uppercase tracking-[0.22em] text-bleu">Notre concept</p>
        <h2 id="concept-titre" className="mt-4 max-w-[18ch] font-display text-[clamp(2.2rem,5vw,3.8rem)] font-black leading-[1.02] tracking-[-0.02em]">
          Les spécialités turques, version street food.
        </h2>
        <p className="mt-6 max-w-[52ch] text-lg text-gris">
          Deux grands classiques, le manti et le lahmacun, servis généreusement dans un univers moderne. Une carte courte, des prix clairs, et un seul objectif : se faire plaisir.
        </p>
      </div>
    </section>
  );
}

/* ─────────── Nos spécialités ─────────── */
export function Specialites() {
  const blocs = [
    { cat: "mantis" as CategorieId, titre: "Les Mantis", texte: "Petits raviolis turcs, sauce yaourt et beurre pimenté.", photo: "/images/illustration-manti-beurre.webp" },
    { cat: "lahmacuns" as CategorieId, titre: "Les Lahmacuns", texte: "Pâte fine, garnie et cuite au four.", photo: "/images/illustration-lahmacun-garniture.webp" },
  ];
  return (
    <section id="specialites" aria-labelledby="spe-titre" className="pb-24 sm:pb-32">
      <div className={conteneur}>
        <EnTete id="spe-titre" surtitre="Nos spécialités" titre="Manti ou lahmacun ?" centre />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {blocs.map((b) => (
            <button
              key={b.cat}
              type="button"
              onClick={() => allerALaCarte(b.cat)}
              className="apparait group relative aspect-[4/5] overflow-hidden rounded-[28px] bg-encre text-left text-white sm:aspect-[5/6]"
            >
              <Photo src={b.photo} alt={b.titre} illustration className="absolute inset-0" sizes="(max-width: 768px) 100vw, 50vw" />
              <span className="absolute inset-0 bg-gradient-to-t from-encre/85 via-encre/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-7 sm:p-9">
                <span>
                  <span className="block font-display text-[clamp(2.2rem,4vw,3.2rem)] font-black leading-none">{b.titre}</span>
                  <span className="mt-3 block max-w-[30ch] font-semibold text-white/85">{b.texte}</span>
                </span>
                <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white text-bleu transition-transform duration-500 group-hover:-rotate-45">
                  <ArrowRight className="size-6" strokeWidth={2.6} />
                </span>
              </span>
              <span className="sr-only">Voir les {b.titre.toLowerCase()} sur la carte</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── Les menus : sans photo, lisibles d'un coup d'œil ─────────── */
export function Menus() {
  const { ajouter, ouvrirProduit } = usePanier();
  const menus = produitsDe("menus");
  return (
    <section id="menus" aria-labelledby="menus-titre" className="sur-sombre bg-bleu py-24 text-white sm:py-28">
      <div className={conteneur}>
        <EnTete id="menus-titre" surtitre="Les menus" titre="Le repas complet." clair centre />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {menus.map((m) => {
            const mix = m.id === "menu-mix";
            return (
              <article key={m.id} className={`apparait flex flex-col rounded-[24px] p-7 sm:p-8 ${mix ? "bg-encre" : "bg-white text-encre"}`}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-2xl font-black">
                    <button type="button" onClick={() => ouvrirProduit(m)} className="text-left hover:underline">{m.nom}</button>
                  </h3>
                  {mix && <span className="rounded-full bg-white/15 px-3 py-1 text-[0.7rem] font-extrabold uppercase tracking-[0.12em]">Manti + Lahmacun</span>}
                </div>
                <p className={`mt-2 ${mix ? "text-white/75" : "text-gris"}`}>{m.description}</p>
                <p className={`mt-8 font-display text-5xl font-black tracking-tight ${mix ? "" : "text-bleu"}`}>{prix(m.prix)}</p>
                {site.commande.panierActif && (
                  <button type="button" onClick={() => ajouter(m.id)} className={classesBouton(mix ? "blanc" : "bleu", "md", "mt-6 w-full")}>
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

/* ─────────── Nous trouver : adresse, horaires, plan ─────────── */
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
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ${s.ouvert ? "bg-bleu-ciel text-bleu" : "bg-doux text-gris"}`}>
      <span className={`size-2 rounded-full ${s.ouvert ? "bg-bleu" : "bg-gris"}`} />
      {s.texte}
    </span>
  );
}

function Plan() {
  const [charge, setCharge] = useState(false);
  const [encadre, setEncadre] = useState(false);
  useEffect(() => { setEncadre(window.self !== window.top); }, []);
  const src = lienPlanIntegre();
  const itin = lienItineraire();
  if (!src) return null;
  return (
    <div className="relative h-full min-h-[360px] overflow-hidden rounded-[28px] bg-bleu-ciel">
      {charge ? (
        <iframe src={src} title={`Plan d'accès BOWLY'S, ${adresseLigne()}`} className="absolute inset-0 size-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <div className="absolute inset-0 grid place-items-center p-8 text-center">
          {/* quadrillage discret façon plan */}
          <div aria-hidden="true" className="absolute inset-0 opacity-60 [background-image:linear-gradient(var(--color-trait)_1px,transparent_1px),linear-gradient(90deg,var(--color-trait)_1px,transparent_1px)] [background-size:44px_44px]" />
          <div className="relative grid justify-items-center gap-4">
            <span className="grid size-16 place-items-center rounded-full bg-bleu text-white shadow-[0_14px_30px_-12px_rgba(0,87,231,.8)]"><MapPin className="size-7" strokeWidth={2.4} /></span>
            <p className="font-display text-xl font-black">{site.restaurant!.rue}<br />{site.restaurant!.codePostal} {site.restaurant!.ville}</p>
            {encadre ? (
              itin && <LienBouton href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(adresseLigne()!)}`} externe style="bleu">Ouvrir le plan <ArrowUpRight className="size-4" /></LienBouton>
            ) : (
              <button type="button" onClick={() => setCharge(true)} className={classesBouton("bleu", "md")}>Afficher le plan</button>
            )}
            {!encadre && <p className="max-w-[30ch] text-xs text-gris">Le plan est fourni par Google Maps et ne se charge que si vous le demandez.</p>}
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
    <section id="contact" aria-labelledby="contact-titre" className="py-24 sm:py-32">
      <div className={conteneur}>
        <EnTete id="contact-titre" surtitre="Contact" titre="Nous trouver" centre />
        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          <div className="apparait grid content-start gap-10 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.2em] text-gris">Adresse</p>
              <address className="mt-3 font-display text-[1.9rem] font-black not-italic leading-[1.1]">
                {site.restaurant.rue}<br />{site.restaurant.codePostal} {site.restaurant.ville}
              </address>
              {itin && (
                <a href={itin} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 font-display font-extrabold text-bleu underline-offset-4 hover:underline">
                  Itinéraire <ArrowUpRight className="size-4" />
                </a>
              )}
              {(site.telephone || site.reseaux.instagram || site.email) && (
                <div className="mt-8">
                  <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.2em] text-gris">Contact</p>
                  <ul className="mt-3 grid gap-2 font-semibold">
                    {site.telephone && <li><a href={`tel:${site.telephone.replace(/\s/g, "")}`} className="hover:text-bleu">{site.telephone}</a></li>}
                    {site.email && <li><a href={`mailto:${site.email}`} className="hover:text-bleu">{site.email}</a></li>}
                    {site.reseaux.instagram && <li><a href={site.reseaux.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-bleu">Instagram · @bowlys</a></li>}
                    {site.reseaux.tiktok && <li><a href={site.reseaux.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-bleu">TikTok</a></li>}
                  </ul>
                </div>
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.2em] text-gris">Horaires</p>
                <Statut />
              </div>
              {h ? (
                <dl className="mt-4">
                  {JOURS.map((j) => {
                    const actif = j === aujourdhui;
                    return (
                      <div key={j} className={`flex justify-between gap-6 border-b border-trait py-2.5 ${actif ? "font-extrabold text-encre" : "text-gris"}`}>
                        <dt className="capitalize">{j}</dt>
                        <dd className="tabular-nums">{h[j].length ? h[j].map((p) => `${p.ouverture} – ${p.fermeture}`).join(" · ") : "Fermé"}</dd>
                      </div>
                    );
                  })}
                </dl>
              ) : (
                <p className="mt-4 text-gris">Horaires bientôt disponibles.</p>
              )}
            </div>
          </div>
          <div className="apparait"><Plan /></div>
        </div>
      </div>
    </section>
  );
}
