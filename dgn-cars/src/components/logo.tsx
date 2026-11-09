import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <Link href="/" aria-label="DGN Cars — accueil" className={cn("group inline-flex items-stretch font-display text-2xl leading-none font-bold uppercase", className)}>
      <span className="bg-signal px-2 pt-1.5 pb-1 text-signal-foreground">DGN</span>
      <span className={cn("border-y-2 border-r-2 px-2 pt-1 pb-0.5 tracking-wider", inverted ? "border-white/80 text-white" : "border-foreground")}>Cars</span>
    </Link>
  );
}
