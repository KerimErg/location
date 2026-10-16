import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
import { CATEGORIES } from "@/data/menu";
import { BandeauCarte, Medaillon, RondCategorie } from "@/components/carte/Elements";

export const metadata: Metadata = {
  title: "La carte",
  description: "La carte BOWLY'S : box lahmacun, dürüm, desserts et boissons, avec les prix.",
};

export default function PageCarte() {
  return (
    <>
      <Header transparent />
      <main id="contenu" className="min-h-dvh bg-white pb-28">
        <BandeauCarte photo="/images/four-a-bois.webp" ariane={[]} />
        <Medaillon>
          <div className="text-center">
            <Logo variante="complet" className="mx-auto w-32 text-rouge sm:w-36" />
          </div>
        </Medaillon>
        <h1 className="sr-only">La carte</h1>
        <p className="entree mt-6 text-center sm:mt-10 text-[0.72rem] font-extrabold uppercase tracking-[0.28em] text-rouge [animation-delay:.1s]">
          Choisissez une catégorie
        </p>
        <ul className="mx-auto mt-7 flex max-w-4xl flex-wrap justify-center gap-x-6 gap-y-7 px-5 sm:mt-10 sm:gap-x-12 sm:gap-y-10">
          {CATEGORIES.map((c, i) => (
            <li key={c.id} className="entree" style={{ animationDelay: `${0.15 + i * 0.07}s` }}>
              <RondCategorie id={c.id} nom={c.nom} />
            </li>
          ))}
        </ul>
        <p className="mt-10 px-5 text-center text-sm font-semibold text-gris sm:mt-16">Prix TTC · Allergènes : demandez-les au comptoir.</p>
      </main>
      <Footer />
    </>
  );
}
