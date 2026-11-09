"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Phone } from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useFavorites } from "@/components/favorites";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/stock", label: "Stock" },
  { href: "/reprise", label: "Reprise" },
  { href: "/financement", label: "Financement" },
  { href: "/garage", label: "Le garage" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const { ids } = useFavorites();
  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-ink text-[#d9d7d2]">
        <div className="container-page flex h-9 items-center justify-between gap-4 font-mono text-[0.7rem] tracking-wide uppercase">
          <p className="truncate">
            <span className="text-signal">●</span> Rocourt · Liège — visites {SITE.appointmentOnly ? "uniquement sur rendez-vous" : "libres"}
          </p>
          <div className="hidden items-center gap-5 sm:flex">
            {SITE.phone.href && (
              <a href={`tel:${SITE.phone.href}`} className="flex items-center gap-1.5 hover:text-signal"><Phone className="size-3.5" /> {SITE.phone.display}</a>
            )}
            <a href={SITE.instagram} target="_blank" rel="noopener" className="flex items-center gap-1.5 hover:text-signal"><Instagram className="size-3.5" /> @dgn_cars</a>
          </div>
        </div>
      </div>
      <div className="border-b border-white/10 bg-ink text-[#eceae5]">
        <div className="container-page flex h-16 items-center justify-between gap-6 md:h-[72px]">
          <Logo />
          <nav className="hidden items-center lg:flex" aria-label="Navigation principale">
            {NAV.map((n) => {
              const active = pathname.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={cn(
                    "relative px-4 py-2 font-display text-[1.05rem] font-semibold tracking-wide uppercase transition-colors",
                    active ? "text-white" : "text-[#a9aeb3] hover:text-white",
                  )}
                >
                  {n.label}
                  {active && <span className="absolute inset-x-4 -bottom-[17px] h-[3px] bg-signal md:-bottom-[21px]" />}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-1">
            <ThemeToggle className="hover:bg-white/10" />
            <Link href="/favoris" className="relative inline-flex size-10 items-center justify-center rounded-md hover:bg-white/10" aria-label="Mes favoris">
              <Heart className="size-[18px]" strokeWidth={1.75} />
              {ids.length > 0 && (
                <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-sm bg-signal font-mono text-[0.6rem] font-semibold text-signal-foreground">{ids.length}</span>
              )}
            </Link>
            <Button asChild className="ml-2 hidden bg-signal text-signal-foreground sm:inline-flex">
              <Link href="/contact?objet=rendez-vous">Prendre rendez-vous</Link>
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <button className="inline-flex size-10 items-center justify-center rounded-md hover:bg-white/10 lg:hidden" aria-label="Ouvrir le menu">
                  <Menu className="size-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="border-white/10 bg-ink p-6 text-white">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <Logo />
                <nav className="mt-8 flex flex-col border-t border-white/15">
                  {NAV.map((n) => (
                    <SheetClose asChild key={n.href}>
                      <Link href={n.href} className="border-b border-white/15 py-4 font-display text-3xl font-bold uppercase">{n.label}</Link>
                    </SheetClose>
                  ))}
                </nav>
                <SheetClose asChild>
                  <Button asChild size="lg" className="mt-auto bg-signal text-signal-foreground">
                    <Link href="/contact?objet=rendez-vous">Prendre rendez-vous</Link>
                  </Button>
                </SheetClose>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
