"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { CATEGORIES } from "@/lib/constants";

const COLS = [
  {
    title: "Location",
    links: CATEGORIES.map((c) => ({ href: `/vehicules?categorie=${c.slug}`, label: `Location ${c.label.toLowerCase()}` })),
  },
  {
    title: "TestLocation",
    links: [
      { href: "/agences", label: "Nos agences" },
      { href: "/#pourquoi", label: "Pourquoi nous choisir" },
      { href: "/#avis", label: "Avis clients" },
      { href: "/compte", label: "Espace client" },
    ],
  },
  {
    title: "Aide",
    links: [
      { href: "/#faq", label: "Questions fréquentes" },
      { href: "/legal/cgv", label: "Conditions générales" },
      { href: "/legal/confidentialite", label: "Confidentialité" },
      { href: "/legal/mentions-legales", label: "Mentions légales" },
    ],
  },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return (
    <footer className="bg-ink text-white">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.3fr_2fr]">
        <div className="space-y-6">
          <Logo inverted />
          <p className="max-w-sm text-sm leading-relaxed text-white/60">
            Location de voitures et d&apos;utilitaires premium partout en France. Kilométrage illimité, annulation gratuite et assistance 24/7.
          </p>
          <a href="tel:+33184601200" className="inline-flex items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 transition hover:border-primary">
            <Phone className="size-5 text-primary" />
            <span>
              <span className="block text-xs text-white/50">Service client 24/7</span>
              <span className="font-display font-semibold">01 84 60 12 00</span>
            </span>
          </a>
          <div className="flex gap-2">
            {[["IG", "Instagram"], ["FB", "Facebook"], ["IN", "LinkedIn"], ["YT", "YouTube"]].map(([short, name]) => (
              <a key={short} href="#" aria-label={name} className="flex size-10 items-center justify-center rounded-full bg-white/5 text-[0.65rem] font-bold tracking-wider transition hover:bg-primary">
                {short}
              </a>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {COLS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-semibold text-white">{col.title}</h3>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-white/55 transition hover:text-primary">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} TestLocation SAS. Tous droits réservés.</p>
          <p>Paiement sécurisé · Photos : <a href="https://unsplash.com/license" className="underline hover:text-primary">Unsplash</a> (libres de droits)</p>
        </div>
      </div>
    </footer>
  );
}
