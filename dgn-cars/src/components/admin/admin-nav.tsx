"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Car, ExternalLink, Inbox, LayoutDashboard, LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/vehicules", label: "Véhicules", icon: Car },
  { href: "/admin/demandes", label: "Demandes", icon: Inbox },
];

export function AdminNav({ newLeads }: { newLeads: number }) {
  const pathname = usePathname();
  const active = (h: string) => (h === "/admin" ? pathname === h : pathname.startsWith(h));
  return (
    <aside className="border-b bg-card lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-60 lg:shrink-0 lg:flex-col lg:border-r lg:border-b-0">
      <div className="flex items-center justify-between p-4 lg:block lg:p-5">
        <Logo onLight />
        <p className="eyebrow hidden lg:mt-2 lg:block">Gestion</p>
        <ThemeToggle className="lg:hidden" />
      </div>
      <nav className="flex gap-1 overflow-x-auto px-4 pb-3 lg:mt-4 lg:flex-col lg:px-3">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className={cn("flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium", active(l.href) ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
            <l.icon className="size-4" /> {l.label}
            {l.href === "/admin/demandes" && newLeads > 0 && <span className="ml-auto rounded-sm bg-signal px-1.5 font-mono text-[0.68rem] text-signal-foreground">{newLeads}</span>}
          </Link>
        ))}
      </nav>
      <div className="mt-auto hidden gap-1 p-3 lg:grid">
        <Link href="/" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted"><ExternalLink className="size-4" /> Voir le site</Link>
        <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted"><LogOut className="size-4" /> Déconnexion</button>
        <ThemeToggle />
      </div>
    </aside>
  );
}
