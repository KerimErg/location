import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { CATEGORIES, PRODUITS, type CategorieId, type Produit } from "@/data/menu";
import { prix } from "@/lib/format";
import { Logo } from "../Logo";
import { IconeCategorie } from "./IconeCategorie";
import { AjoutRapide } from "./AjoutRapide";

/** Liens de la carte (une seule source pour les adresses). */
export const lienCategorie = (c: CategorieId) => `/carte/${c}/`;
export const lienProduit = (p: Produit) => `/carte/${p.categorie}/${p.id}/`;
export const num = (i: number) => String(i + 1).padStart(2, "0");

/** Bandeau photo coupé en biais, avec fil d'Ariane. */
export function BandeauCarte({ photo, ariane }: { photo: string | null; ariane: { href?: string; label: string }[] }) {
  return (
    <div className="sur-sombre relative h-[46vh] min-h-[320px] overflow-hidden bg-encre text-white [clip-path:polygon(0_0,100%_0,100%_78%,0_100%)]">
      {photo ? (
        <Image src={photo} alt="" fill priority sizes="100vw" className="lent-zoom object-cover opacity-80" />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 bg-rouge">
          <Logo variante="icone" titre="" className="absolute -right-16 top-6 w-[520px] max-w-none text-white/10" />
        </div>
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(11,15,26,.72),rgba(11,15,26,.2)_45%,rgba(11,15,26,.55))]" />
      {ariane.length > 0 && (
        <nav aria-label="Fil d'Ariane" className="relative mx-auto max-w-[1180px] px-[max(20px,env(safe-area-inset-left))] pt-28">
          <ol className="flex flex-wrap items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-white/80">
            {ariane.map((a, i) => (
              <li key={a.label} className="flex items-center gap-2">
                {i > 0 && <ChevronRight className="size-3" aria-hidden="true" />}
                {a.href ? <Link href={a.href} className="hover:text-white">{a.label}</Link> : <span aria-current="page" className="text-white">{a.label}</span>}
              </li>
            ))}
          </ol>
        </nav>
      )}
    </div>
  );
}

/** Carte blanche flottante à cheval sur le bandeau. */
export function Medaillon({ children }: { children: React.ReactNode }) {
  return (
    <div className="entree relative z-10 -mt-24 flex justify-center px-5 sm:-mt-28">
      <div className="grid size-44 place-items-center rounded-[2.2rem] bg-white shadow-[0_30px_60px_-28px_rgba(11,15,26,.45)] sm:size-52">{children}</div>
    </div>
  );
}

/** Rond de catégorie (accueil de la carte). */
export function RondCategorie({ id, nom }: { id: CategorieId; nom: string }) {
  return (
    <Link href={lienCategorie(id)} className="group flex w-28 flex-col items-center text-center sm:w-36">
      <span className="grid size-24 place-items-center rounded-full bg-rouge text-white shadow-[0_18px_34px_-16px_rgba(140,2,10,.75)] ring-4 ring-white ring-offset-2 ring-offset-rouge/20 transition-transform duration-500 ease-[var(--ease-pro)] group-hover:-translate-y-1.5 sm:size-32">
        <IconeCategorie id={id} className="w-11 sm:w-14" />
      </span>
      <span className="mt-4 font-display text-[0.8rem] font-extrabold uppercase tracking-[0.22em] text-encre sm:text-sm">{nom}</span>
      <span className="mt-1 text-xs font-semibold text-gris">{PRODUITS.filter((p) => p.categorie === id).length} produits</span>
    </Link>
  );
}

/** Petits ronds de navigation entre catégories. */
export function NavCategories({ actif }: { actif: CategorieId }) {
  return (
    <nav aria-label="Catégories" className="sans-barre flex justify-start gap-5 overflow-x-auto px-5 pb-2 sm:justify-center sm:gap-9">
      {CATEGORIES.map((c) => {
        const on = c.id === actif;
        return (
          <Link key={c.id} href={lienCategorie(c.id)} aria-current={on ? "page" : undefined} className="group flex shrink-0 flex-col items-center gap-2.5">
            <span className={`grid size-14 place-items-center rounded-full transition-all duration-500 ease-[var(--ease-pro)] sm:size-16 ${on ? "bg-rouge text-white ring-2 ring-rouge ring-offset-4 ring-offset-white" : "border border-encre/15 bg-white text-encre/70 group-hover:-translate-y-1 group-hover:border-rouge group-hover:text-rouge"}`}>
              <IconeCategorie id={c.id} className="w-7 sm:w-8" />
            </span>
            <span className={`text-[0.66rem] font-extrabold uppercase tracking-[0.2em] ${on ? "text-encre" : "text-gris group-hover:text-encre"}`}>{c.nom}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/** Titre de page de la carte : grand nom + accroche entre deux traits. */
export function TitreCarte({ titre, accroche }: { titre: string; accroche: string }) {
  return (
    <header className="entree mt-8 px-5 text-center [animation-delay:.1s]">
      <h1 className="font-display text-[clamp(2.8rem,8vw,4.6rem)] font-extrabold leading-none tracking-[-0.02em]">{titre}</h1>
      <p className="mt-5 flex items-center justify-center gap-4 text-[0.7rem] font-extrabold uppercase tracking-[0.26em] text-rouge">
        <span aria-hidden="true" className="h-px w-10 bg-rouge/40 sm:w-16" />{accroche}<span aria-hidden="true" className="h-px w-10 bg-rouge/40 sm:w-16" />
      </p>
    </header>
  );
}

/** Carte produit de la grille : photo (ou aplat de marque), numéro, nom, prix. */
export function TuileProduit({ p, i, petit = false }: { p: Produit; i: number; petit?: boolean }) {
  return (
    <Link href={lienProduit(p)} className="group relative block overflow-hidden rounded-[1.4rem] bg-encre text-white shadow-[0_20px_40px_-28px_rgba(11,15,26,.6)] transition-[transform,box-shadow] duration-500 ease-[var(--ease-pro)] hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(11,15,26,.7)]">
      <span className={`relative block ${petit ? "aspect-square" : "aspect-[4/3]"}`}>
        {p.photo ? (
          <Image src={p.photo} alt={p.nom} fill sizes="(max-width: 768px) 50vw, 33vw" className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-pro)] group-hover:scale-[1.06]" />
        ) : (
          <span aria-hidden="true" className={`absolute inset-0 ${i % 2 ? "bg-encre" : "bg-rouge"}`}>
            <IconeCategorie id={p.categorie} className="absolute left-1/2 top-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2 text-white/25" />
          </span>
        )}
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-encre/85 via-encre/5 to-transparent" />
        <span className="absolute right-4 top-4 font-display text-xs font-extrabold tracking-[0.2em] text-white/85">{num(i)}</span>
        {p.badge && <span className="absolute left-3 top-3 rounded-full bg-rouge px-2.5 py-1 text-[0.6rem] font-extrabold uppercase tracking-[0.12em] text-white shadow">★ {p.badge}</span>}
        <span className="absolute inset-x-0 bottom-0 p-4 pr-16 sm:p-5 sm:pr-16">
          <span className="block font-display text-[1.15rem] font-extrabold leading-tight sm:text-xl">{p.nom}</span>
          <span className="mt-1.5 inline-block rounded-full bg-white px-2.5 py-0.5 font-display text-sm font-extrabold text-rouge">{prix(p.prix)}</span>
        </span>
        {!(p.groupes?.length) && <AjoutRapide p={p} />}
      </span>
    </Link>
  );
}
