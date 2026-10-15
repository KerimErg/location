import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CATEGORIES, PRODUITS, type CategorieId } from "@/data/menu";
import { BandeauCarte, Medaillon, NavCategories, TitreCarte, TuileProduit } from "@/components/carte/Elements";
import { IconeCategorie } from "@/components/carte/IconeCategorie";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ categorie: c.id }));
}

type Params = { params: Promise<{ categorie: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { categorie } = await params;
  const c = CATEGORIES.find((x) => x.id === categorie);
  return c ? { title: `${c.nom} · La carte`, description: `${c.nom} BOWLY'S : ${c.accroche.toLowerCase()}.` } : {};
}

export default async function PageCategorie({ params }: Params) {
  const { categorie } = await params;
  const c = CATEGORIES.find((x) => x.id === categorie);
  if (!c) notFound();
  const liste = PRODUITS.filter((p) => p.categorie === (c.id as CategorieId));
  const petit = c.id === "extras" || c.id === "boissons";

  return (
    <>
      <Header transparent />
      <main id="contenu" className="min-h-dvh bg-white pb-28">
        <BandeauCarte photo={c.photo} ariane={[{ href: "/carte/", label: "La carte" }, { label: c.nom }]} />
        <Medaillon>
          <div className="flex flex-col items-center">
            <span className="grid size-20 place-items-center rounded-full bg-bleu text-white ring-4 ring-white ring-offset-2 ring-offset-bleu/20">
              <IconeCategorie id={c.id} className="w-10" />
            </span>
            <p className="mt-3 font-display text-[0.6rem] font-black uppercase tracking-[0.4em] text-bleu">Bowly&apos;s</p>
          </div>
        </Medaillon>
        <TitreCarte titre={c.nom} accroche={c.accroche} />
        <div className="entree mt-10 [animation-delay:.2s]"><NavCategories actif={c.id} /></div>
        <ul className={`mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 px-4 sm:gap-6 sm:px-8 ${petit ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
          {liste.map((p, i) => (
            <li key={p.id} className="entree" style={{ animationDelay: `${0.28 + i * 0.07}s` }}>
              <TuileProduit p={p} i={i} petit={petit} />
            </li>
          ))}
        </ul>
        <p className="mt-14 px-5 text-center text-sm font-semibold text-gris">Prix TTC · Allergènes : demandez-les au comptoir.</p>
      </main>
      <Footer />
    </>
  );
}
