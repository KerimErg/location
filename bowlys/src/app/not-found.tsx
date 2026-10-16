import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LienBouton } from "@/components/Bouton";

export default function Introuvable() {
  return (
    <>
      <Header />
      <main id="contenu" className="grid min-h-[70vh] place-items-center px-6 pt-24 text-center">
        <div className="grid justify-items-center gap-5">
          <p className="font-display text-7xl font-extrabold text-rouge">404</p>
          <h1 className="font-display text-3xl font-extrabold">Cette page n&apos;existe pas.</h1>
          <LienBouton href="/" taille="lg">Retour à l&apos;accueil</LienBouton>
        </div>
      </main>
      <Footer />
    </>
  );
}
