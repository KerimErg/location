"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Building2, CalendarRange, Car, ExternalLink, LayoutDashboard, LogOut, Users } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/reservations", label: "Réservations", icon: CalendarRange },
  { href: "/admin/vehicules", label: "Véhicules", icon: Car },
  { href: "/admin/agences", label: "Agences", icon: Building2 },
  { href: "/admin/clients", label: "Clients", icon: Users },
];

export function AdminNav() {
  const pathname = usePathname();
  const active = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));
  return (
    <>
      {/* Desktop */}
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r bg-card p-5 lg:flex">
        <Logo />
        <p className="mt-1 ml-11 text-xs font-medium tracking-widest text-muted-foreground uppercase">Admin</p>
        <nav className="mt-8 grid gap-1">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition", active(l.href) ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
              <l.icon className="size-4" /> {l.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto grid gap-1">
          <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"><ExternalLink className="size-4" /> Voir le site</Link>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-muted-foreground hover:bg-muted"><LogOut className="size-4" /> Déconnexion</button>
          <ThemeToggle className="mt-2" />
        </div>
      </aside>
      {/* Mobile */}
      <div className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Logo />
          <ThemeToggle />
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-3">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className={cn("flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium", active(l.href) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
              <l.icon className="size-3.5" /> {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
