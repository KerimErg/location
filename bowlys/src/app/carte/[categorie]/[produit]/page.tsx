import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AjoutProduit } from "@/components/AjoutProduit";
import { CATEGORIES, PRODUITS } from "@/data/menu";
import { prix } from "@/lib/format";
import { lienCategorie, lienProduit, num, TuileProduit } from "@/components/carte/Elements";
import { IconeCategorie } from "@/components/carte/IconeCategorie";

export function generateStaticParams() {
  return PRODUITS.map((p) => ({ categorie: p.categorie, produit: p.id }));
}

type Params = { params: Promise<{ categorie: string; produit: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { produit } = await params;
  const p = PRODUITS.find((x) => x.id === produit);
  return p ? { title: `${p.nom} · La carte`, description: `${p.nom} — ${p.description} ${prix(p.prix)}.` } : {};
}

export default async function PageProduit({ params }: Params) {
  const { categorie, produit } = await params;
  const p = PRODUITS.find((x) => x.id === produit && x.categorie === categorie);
  if (!p) notFound();
  const c = CATEGORIES.find((x) => x.id === p.categorie)!;
  const liste = PRODUITS.filter((x) => x.categorie === c.id);
  const i = liste.findIndex((x) => x.id === p.id);
  const prec = liste[(i - 1 + liste.length) % liste.length];
  const suiv = liste[(i + 1) % liste.length];
  const autres = liste.filter((x) => x.id !== p.id);

  return (
    <>
      <Header />
      <main id="contenu" className="min-h-dvh bg-white pb-24 md:pt-28">
        <div className="mx-auto grid max-w-[1180px] md:grid-cols-[1.05fr_1fr] md:gap-14 md:px-[max(20px,env(safe-area-inset-left))]">
          {/* Photo */}
          <div className="entree relative md:sticky md:top-28 md:self-start">
            <div className="relative aspect-[4/5] max-h-[78vh] w-full overflow-hidden bg-encre md:rounded-[2rem]">
              {p.photo ? (
                <Image src={p.photo} alt={p.nom} fill priority sizes="(max-width: 768px) 100vw, 600px" className="lent-zoom object-cover" />
              ) : (
                <div className="absolute inset-0 grid place-items-center bg-bleu">
                  <IconeCategorie id={p.categorie} className="w-[38%] text-white/25" />
                  <span className="absolute bottom-6 text-[0.65rem] font-extrabold uppercase tracking-[0.22em] text-white/70">Photo à venir</span>
                </div>
              )}
              {p.illustration && <span className="absolute bottom-4 left-4 rounded-full bg-black/45 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">Photo d&apos;illustration</span>}
              <Link href={lienCategorie(c.id)} aria-label={`Retour : ${c.nom}`} className="absolute left-4 top-[calc(env(safe-area-inset-top)+80px)] grid size-11 place-items-center rounded-full bg-white text-encre shadow-lg md:hidden">
                <ArrowLeft className="size-5" strokeWidth={2.4} />
              </Link>
            </div>
          </div>

          {/* Fiche */}
          <div className="relative z-10 -mt-8 rounded-t-[2rem] bg-white px-5 pt-8 sm:px-8 md:mt-0 md:rounded-none md:px-0 md:pt-2">
            <nav aria-label="Fil d'Ariane" className="hidden md:block">
              <ol className="flex items-center gap-2 text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-gris">
                <li><Link href="/carte/" className="hover:text-bleu">La carte</Link></li>
                <li aria-hidden="true"><ChevronRight className="size-3" /></li>
                <li><Link href={lienCategorie(c.id)} className="hover:text-bleu">{c.nom}</Link></li>
              </ol>
            </nav>
            <p className="entree flex items-center gap-3 text-[0.7rem] font-extrabold uppercase tracking-[0.26em] text-bleu md:mt-8">
              <span aria-hidden="true" className="h-px w-10 bg-bleu/40" />{c.nom} · {num(i)} / {num(liste.length - 1)}
            </p>
            <h1 className="entree mt-4 font-display text-[clamp(2.4rem,5.6vw,4rem)] font-black leading-[1] tracking-[-0.02em] [animation-delay:.06s]">{p.nom}</h1>
            <div className="entree mt-5 flex flex-wrap items-center gap-2 [animation-delay:.12s]">
              <span className="rounded-full bg-bleu px-4 py-1.5 font-display text-xl font-black text-white">{prix(p.prix)}</span>
              <span className="rounded-full border border-bleu/30 px-3 py-1 text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-bleu">{c.nom}</span>
            </div>
            <p className="entree mt-6 max-w-[46ch] text-lg leading-relaxed text-gris [animation-delay:.18s]">{p.description}</p>
            <div className="entree mt-8 max-w-[520px] [animation-delay:.24s]"><AjoutProduit p={p} /></div>

            {liste.length > 1 && (
              <div className="mt-10 grid max-w-[520px] grid-cols-2 border-t border-trait">
                <Link href={lienProduit(prec)} className="group border-r border-trait py-5 pr-4">
                  <span className="flex items-center gap-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-gris"><ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />Précédent</span>
                  <span className="mt-1.5 block font-display text-lg font-black group-hover:text-bleu">{prec.nom}</span>
                </Link>
                <Link href={lienProduit(suiv)} className="group py-5 pl-4 text-right">
                  <span className="flex items-center justify-end gap-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-gris">Suivant<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" /></span>
                  <span className="mt-1.5 block font-display text-lg font-black group-hover:text-bleu">{suiv.nom}</span>
                </Link>
              </div>
            )}
            <Link href={lienCategorie(c.id)} className="mt-4 inline-flex items-center gap-2 font-display font-extrabold text-bleu hover:underline">
              <ArrowLeft className="size-4" /> Toute la catégorie {c.nom}
            </Link>
          </div>
        </div>

        {autres.length > 0 && (
          <section aria-labelledby="aussi" className="mx-auto mt-20 max-w-[1180px] px-5 sm:px-[max(20px,env(safe-area-inset-left))]">
            <h2 id="aussi" className="flex items-center gap-4 text-[0.72rem] font-extrabold uppercase tracking-[0.26em] text-bleu">
              À découvrir aussi<span aria-hidden="true" className="h-px flex-1 bg-trait" />
            </h2>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
              {autres.slice(0, 4).map((x) => (
                <li key={x.id}><TuileProduit p={x} i={liste.indexOf(x)} petit /></li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
