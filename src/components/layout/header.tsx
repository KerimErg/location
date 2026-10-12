"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { CalendarCheck, LayoutDashboard, LogOut, Menu, User } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/vehicules", label: "Véhicules" },
  { href: "/vehicules?categorie=premium", label: "Premium" },
  { href: "/vehicules?categorie=utilitaire", label: "Utilitaires" },
  { href: "/agences", label: "Agences" },
  { href: "/#faq", label: "Aide" },
];

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const overHero = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        overHero ? "bg-transparent text-white" : "border-b bg-background/80 backdrop-blur-xl",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-6 md:h-18">
        <Logo inverted={overHero} />
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                overHero ? "text-white/80 hover:bg-white/10 hover:text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <ThemeToggle className={cn(overHero && "text-white hover:bg-white/10")} />
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("rounded-full", overHero && "text-white hover:bg-white/10")} aria-label="Mon compte">
                  <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {session.user.name?.slice(0, 1).toUpperCase()}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div>{session.user.name}</div>
                  <div className="text-xs font-normal text-muted-foreground">{session.user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/compte"><CalendarCheck /> Mes réservations</Link>
                </DropdownMenuItem>
                {session.user.role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin"><LayoutDashboard /> Administration</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut /> Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" size="sm" className={cn("hidden sm:inline-flex", overHero && "text-white hover:bg-white/10")}>
              <Link href="/connexion"><User /> Connexion</Link>
            </Button>
          )}
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/vehicules">Réserver</Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={cn("lg:hidden", overHero && "text-white hover:bg-white/10")} aria-label="Ouvrir le menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-6">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <Logo />
              <nav className="mt-6 flex flex-col">
                {NAV.map((n) => (
                  <SheetClose asChild key={n.href}>
                    <Link href={n.href} className="border-b py-4 font-display text-xl font-semibold">
                      {n.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto grid gap-2">
                <SheetClose asChild>
                  <Button asChild size="lg"><Link href="/vehicules">Réserver un véhicule</Link></Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild size="lg" variant="outline">
                    <Link href={session?.user ? "/compte" : "/connexion"}>{session?.user ? "Mon compte" : "Connexion"}</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
