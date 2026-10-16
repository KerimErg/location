import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

/** Gabarit des pages légales. Les passages [À COMPLÉTER] doivent être remplis et validés avant publication. */
export function PageLegale({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <>
      <Header />
      <main id="contenu" className="mx-auto max-w-[820px] px-[max(20px,env(safe-area-inset-left))] pb-24 pt-32 sm:pt-40">
        <p className="font-display text-sm font-extrabold uppercase tracking-[0.2em] text-rouge">Informations légales</p>
        <h1 className="mt-3 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold leading-none">{titre}</h1>
        <p className="mt-6 rounded-2xl border-2 border-dashed border-rouge/40 bg-creme p-4 text-sm">
          Modèle à compléter et à faire valider. Les mentions entre crochets <strong>[À COMPLÉTER]</strong> doivent être renseignées avant la mise en ligne.
        </p>
        <div className="mt-10 grid gap-8 text-[1.02rem] leading-relaxed text-encre/90 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-encre [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}

export const AC = ({ children }: { children: ReactNode }) => (
  <mark className="rounded bg-creme px-1 font-semibold text-rouge">[À COMPLÉTER : {children}]</mark>
);
