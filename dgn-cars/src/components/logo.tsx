import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Logo officiel DGN Cars (fond transparent, prévu pour un fond sombre). */
export function Logo({ className, onLight, size = "md" }: { className?: string; onLight?: boolean; size?: "md" | "lg" }) {
  return (
    <Link
      href="/"
      aria-label="DGN Cars — accueil"
      className={cn("inline-flex items-center", onLight && "rounded-md bg-ink px-2.5 py-1.5", className)}
    >
      <Image src="/logo-dgn.png" alt="DGN Cars — Achat · Vente · Reprise" width={720} height={259} priority className={size === "lg" ? "h-20 w-auto" : "h-11 w-auto md:h-12"} />
    </Link>
  );
}
