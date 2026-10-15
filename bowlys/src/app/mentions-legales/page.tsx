import type { Metadata } from "next";
import { PageLegale, AC } from "@/components/PageLegale";
import { site, adresseLigne } from "@/config/site";

export const metadata: Metadata = { title: "Mentions légales", robots: { index: false } };

export default function MentionsLegales() {
  return (
    <PageLegale titre="Mentions légales">
      <section>
        <h2>Éditeur du site</h2>
        <p>Raison sociale : <AC>dénomination et forme juridique</AC><br />
          Siège social : <AC>adresse du siège</AC><br />
          Capital social : <AC>montant</AC><br />
          RCS / SIREN : <AC>numéro</AC> — N° TVA intracommunautaire : <AC>numéro</AC><br />
          Directeur de la publication : <AC>nom et fonction</AC><br />
          Contact : {site.email ?? <AC>e-mail</AC>}{site.telephone ? ` · ${site.telephone}` : ""}</p>
      </section>
      <section>
        <h2>Établissement</h2>
        <p>{adresseLigne() ?? <AC>adresse du restaurant</AC>}</p>
      </section>
      <section>
        <h2>Hébergement</h2>
        <p>Hébergeur : <AC>nom, adresse et téléphone de l&apos;hébergeur (ex. Netlify, Cloudflare, Vercel)</AC></p>
      </section>
      <section>
        <h2>Propriété intellectuelle</h2>
        <p>Le nom, le logo BOWLY&apos;S et les contenus de ce site sont protégés. Toute reproduction sans autorisation est interdite. Crédits photos et vidéos : <AC>auteurs et droits d&apos;utilisation</AC>.</p>
      </section>
    </PageLegale>
  );
}
