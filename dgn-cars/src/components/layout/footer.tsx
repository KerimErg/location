"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { SITE, fullAddress } from "@/config/site";

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  const cols = [
    { title: "Acheter", links: [["Tout le stock", "/stock"], ["SUV", "/stock?carrosserie=SUV"], ["Automatiques", "/stock?boite=AUTOMATIQUE"], ["Hybrides & électriques", "/stock?carburant=HYBRIDE,ELECTRIQUE"], ["Mes favoris", "/favoris"]] },
    { title: "Services", links: [["Reprise de votre véhicule", "/reprise"], ["Financement", "/financement"], ["Garantie & Car-Pass", "/garage#garanties"], ["Prendre rendez-vous", "/contact?objet=rendez-vous"]] },
    { title: "DGN Cars", links: [["Le garage", "/garage"], ["Contact & accès", "/contact"], ["Conditions de vente", "/legal/conditions-de-vente"], ["Vie privée", "/legal/vie-privee"], ["Mentions légales", "/legal/mentions-legales"]] },
  ];
  return (
    <footer className="bg-ink text-[#d9d7d2]">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <Logo size="lg" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#a9aeb3]">
            Voitures d&apos;occasion sélectionnées, contrôlées et livrées avec Car-Pass et garantie. Visites et essais sur rendez-vous à Rocourt.
          </p>
          <dl className="mt-8 space-y-3 font-mono text-xs">
            <div><dt className="text-[#8a9097] uppercase">Adresse</dt><dd className="mt-0.5 text-white">{fullAddress}</dd></div>
            {SITE.phone.href && <div><dt className="text-[#8a9097] uppercase">Téléphone</dt><dd className="mt-0.5"><a className="text-white hover:text-signal" href={`tel:${SITE.phone.href}`}>{SITE.phone.display}</a></dd></div>}
            <div><dt className="text-[#8a9097] uppercase">Instagram</dt><dd className="mt-0.5"><a className="text-white hover:text-signal" href={SITE.instagram} target="_blank" rel="noopener">@dgn_cars</a></dd></div>
          </dl>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {cols.map((c) => (
            <div key={c.title}>
              <h2 className="mb-4 font-display text-lg text-white">{c.title}</h2>
              <ul className="space-y-2.5 text-sm">
                {c.links.map(([l, h]) => (
                  <li key={h}><Link href={h} className="text-[#a9aeb3] transition hover:text-signal">{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col justify-between gap-2 py-5 font-mono text-[0.68rem] tracking-wide text-[#8a9097] uppercase sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.legalName} · TVA {SITE.vat}</p>
          <p>Photos d&apos;illustration : <a className="underline hover:text-signal" href="https://www.pexels.com/fr-fr/license/" target="_blank" rel="noopener">Pexels</a> · Prix TVAC</p>
        </div>
      </div>
    </footer>
  );
}
