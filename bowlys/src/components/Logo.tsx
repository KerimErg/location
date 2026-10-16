import type { CSSProperties } from "react";

/**
 * Logo officiel BOWLY'S (fichiers dans /public/logo).
 * Les PNG servent de masque : la couleur suit `color` (rouge, blanc...).
 * Pour un nouveau logo : remplacez les fichiers en gardant les mêmes noms.
 */
const VARIANTES = {
  /** logo rond complet (arcs + BOWLY'S + LAHMACUN) */
  complet: { src: "/logo/bowlys-logo.png", ratio: "812 / 702" },
  /** emblème : le même logo rond, pour les petits usages */
  icone: { src: "/logo/bowlys-logo.png", ratio: "812 / 702" },
  /** BOWLY'S + LAHMACUN sur deux lignes, sans les arcs (en-tête) */
  texte: { src: "/logo/bowlys-texte.png", ratio: "806 / 234" },
  /** BOWLY'S seul */
  nom: { src: "/logo/bowlys-nom.png", ratio: "806 / 138" },
} as const;

export function Logo({
  variante = "complet",
  className = "",
  titre = "BOWLY'S Lahmacun",
}: {
  variante?: keyof typeof VARIANTES;
  className?: string;
  titre?: string;
}) {
  const v = VARIANTES[variante];
  return (
    <span
      {...(titre ? { role: "img", "aria-label": titre } : { "aria-hidden": true })}
      className={`logo-masque ${className}`}
      style={{ "--m": `url(${v.src})`, aspectRatio: v.ratio } as CSSProperties}
    />
  );
}
