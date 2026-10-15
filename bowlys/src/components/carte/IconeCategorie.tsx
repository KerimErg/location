import type { CategorieId } from "@/data/menu";
import { Logo } from "../Logo";

/** Pictogrammes au trait des catégories (le manti reprend l'emblème du logo). */
export function IconeCategorie({ id, className = "" }: { id: CategorieId; className?: string }) {
  if (id === "mantis") return <Logo variante="icone" titre="" className={className} />;
  const traits: Record<Exclude<CategorieId, "mantis">, React.ReactNode> = {
    lahmacuns: (
      <>
        <ellipse cx="24" cy="26" rx="17" ry="14" />
        <path d="M14 22c3 1.5 5-1 8 .5M23 30c3 1.5 5-1 8 .5M27 20.5c2 1 4 0 6 1M15 30.5c2 .8 3.5 0 5 .8" />
        <path d="M33 7l5 5-6 3z" />
      </>
    ),
    menus: (
      <>
        <path d="M11 19h26l-2.5 21h-21z" />
        <path d="M18 19v-3a6 6 0 0 1 12 0v3" />
        <path d="M17 28h14" />
      </>
    ),
    accompagnements: (
      <>
        <path d="M20 6h8v6l3 4v26H17V16l3-4z" />
        <path d="M17 25h14M17 33h14" />
      </>
    ),
    boissons: (
      <>
        <rect x="15" y="12" width="18" height="30" rx="4" />
        <path d="M15 19h18M15 35h18" />
        <path d="M26 12l3-7h4" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{traits[id]}</g>
    </svg>
  );
}
