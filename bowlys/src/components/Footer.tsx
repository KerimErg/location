import Link from "next/link";
import { site, adresseLigne } from "@/config/site";
import { Logo } from "./Logo";
import { NAV } from "@/config/navigation";

export function Footer() {
  const adresse = adresseLigne();
  const legal = [
    { href: "/mentions-legales/", label: "Mentions légales" },
    { href: "/confidentialite/", label: "Confidentialité" },
    { href: "/cookies/", label: "Cookies" },
    ...(site.commande.panierActif ? [{ href: "/cgv/", label: "Conditions générales de vente" }] : []),
  ];
  return (
    <footer className="sur-sombre feuille overflow-hidden bg-encre text-white">
      <div className="relative z-10 mx-auto max-w-[1240px] px-[max(20px,env(safe-area-inset-left))] pb-10 pt-20">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Logo variante="complet" className="w-44 text-white" />
            <p className="mt-6 max-w-[30ch] text-white/70">La street food turque, autrement.</p>
          </div>
          <nav aria-label="Pied de page">
            <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.18em] text-white/50">Navigation</h2>
            <ul className="mt-4 grid gap-2.5">
              {NAV.map((n) => <li key={n.href}><Link href={n.href} className="font-semibold hover:text-bleu-ciel hover:underline">{n.label}</Link></li>)}
            </ul>
          </nav>
          <div>
            <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.18em] text-white/50">Coordonnées</h2>
            <ul className="mt-4 grid gap-2.5 text-white/85">
              {adresse && <li>{site.restaurant!.rue}<br />{site.restaurant!.codePostal} {site.restaurant!.ville}</li>}
              {site.telephone && <li><a href={`tel:${site.telephone.replace(/\s/g, "")}`} className="hover:underline">{site.telephone}</a></li>}
              {site.email && <li><a href={`mailto:${site.email}`} className="hover:underline">{site.email}</a></li>}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.18em] text-white/50">Réseaux</h2>
            <ul className="mt-4 grid gap-2.5">
              {site.reseaux.instagram && <li><a href={site.reseaux.instagram} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">Instagram</a></li>}
              {site.reseaux.tiktok && <li><a href={site.reseaux.tiktok} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">TikTok</a></li>}
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-white/15 pt-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {site.nom}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legal.map((l) => <li key={l.href}><Link href={l.href} className="hover:text-white hover:underline">{l.label}</Link></li>)}
          </ul>
        </div>
      </div>
      {/* Grand logo en filigrane */}
      <Logo variante="nom" titre="" className="pointer-events-none absolute -bottom-[2%] left-1/2 w-[110%] max-w-none -translate-x-1/2 text-white/[0.05]" />
    </footer>
  );
}
