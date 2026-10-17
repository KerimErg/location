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
        <h1 className="entree titre-large mt-6 text-center text-[clamp(2rem,7vw,4.4rem)] [animation-delay:.05s] sm:mt-8">Notre menu</h1>
        <p className="entree mt-2 text-center text-[clamp(1.05rem,2vw,1.5rem)] text-gris [animation-delay:.1s]">
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
