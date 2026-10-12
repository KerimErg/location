import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-8", className)}>
      <rect width="32" height="32" rx="9" fill="#FF5F00" />
      <path d="M8 11.5h16" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M16 11.5v11" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="23" cy="22" r="2.2" fill="#0A0A0A" />
    </svg>
  );
}

export function Logo({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label="TestLocation — accueil">
      <LogoMark className="transition-transform duration-300 group-hover:-rotate-6" />
      <span className={cn("font-display text-[1.15rem] font-bold tracking-tight", inverted && "text-white")}>
        Test<span className="text-primary">Location</span>
      </span>
    </Link>
  );
}
