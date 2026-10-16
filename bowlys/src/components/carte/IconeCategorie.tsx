import type { CategorieId } from "@/data/menu";

/** Pictogrammes au trait des catégories. */
export function IconeCategorie({ id, className = "" }: { id: CategorieId; className?: string }) {
  const traits: Record<CategorieId, React.ReactNode> = {
    box: (
      <>
        <ellipse cx="24" cy="25" rx="17" ry="14" />
        <path d="M14 21c3 1.5 5-1 8 .5M23 29c3 1.5 5-1 8 .5M27 19.5c2 1 4 0 6 1M15 29.5c2 .8 3.5 0 5 .8" />
      </>
    ),
    durum: (
      <>
        <path d="M10 33 33 10a6 6 0 0 1 8.5 8.5L18.5 41.5A6 6 0 0 1 10 33z" />
        <path d="M33 10c-2 4-1 7 2 8s6 0 6.5.5" />
        <path d="M17 26l5 5M22 21l5 5" />
      </>
    ),
    desserts: (
      <>
        <path d="M13 18h22l-3 22H16z" />
        <path d="M14 26h20" />
        <path d="M24 18c0-4 2-7 5-8M24 11c-1-2-3-3-5-3" />
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
