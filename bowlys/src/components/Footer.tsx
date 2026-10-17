import Link from "next/link";
import { site } from "@/config/site";
import { Logo } from "./Logo";

/** Pied de page sobre : logo, copyright, pages légales. */
export function Footer() {
  const legal = [
    { href: "/mentions-legales/", label: "Mentions légales" },
    { href: "/confidentialite/", label: "Confidentialité" },
    { href: "/cookies/", label: "Cookies" },
    ...(site.commande.panierActif ? [{ href: "/cgv/", label: "CGV" }] : []),
  ];
  return (
    <footer className="border-t border-trait bg-white text-gris">
      <div className="mx-auto flex max-w-[1240px] flex-col items-center gap-4 px-[max(20px,env(safe-area-inset-left))] pb-28 pt-8 text-center md:flex-row md:justify-between md:pb-8 md:text-left">
        <div className="flex items-center gap-4">
          <Logo variante="texte" titre="BOWLY'S" className="w-24 text-rouge" />
          <p>© {new Date().getFullYear()} {site.nom}</p>
        </div>
        <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1">
          {legal.map((l) => <li key={l.href}><Link href={l.href} className="hover:text-rouge hover:underline">{l.label}</Link></li>)}
        </ul>
      </div>
    </footer>
  );
}
