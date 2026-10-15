import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { CATEGORIES } from "@/data/menu";
import { BandeauCarte, Medaillon, RondCategorie } from "@/components/carte/Elements";

export const metadata: Metadata = {
  title: "La carte",
  description: "La carte BOWLY'S : mantis, lahmacuns, menus, extras et boissons, avec les prix.",
};

export default function PageCarte() {
  return (
    <>
      <Header transparent />
      <main id="contenu" className="min-h-dvh bg-white pb-28">
        <BandeauCarte photo="/images/illustration-manti-beurre.webp" ariane={[]} />
        <Medaillon>
          <div className="text-center">
            <Logo variante="complet" className="mx-auto w-32 text-bleu sm:w-36" />
          </div>
        </Medaillon>
        <h1 className="sr-only">La carte</h1>
        <p className="entree mt-10 text-center text-[0.72rem] font-extrabold uppercase tracking-[0.28em] text-bleu [animation-delay:.1s]">
          Choisissez une catégorie
        </p>
        <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-x-6 gap-y-10 px-5 sm:gap-x-12">
          {CATEGORIES.map((c, i) => (
            <li key={c.id} className="entree" style={{ animationDelay: `${0.15 + i * 0.07}s` }}>
              <RondCategorie id={c.id} nom={c.nom} />
            </li>
          ))}
        </ul>
        <p className="mt-16 px-5 text-center text-sm font-semibold text-gris">Prix TTC · Allergènes : demandez-les au comptoir.</p>
      </main>
      <Footer />
    </>
  );
}
