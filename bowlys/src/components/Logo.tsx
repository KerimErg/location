import type { CSSProperties } from "react";

/**
 * Logo officiel BOWLY'S (fichiers dans /public/logo).
 * Les PNG servent de masque : la couleur suit `color` (bleu, blanc...).
 * Pour un nouveau logo : remplacez les fichiers en gardant les mêmes noms.
 */
const VARIANTES = {
  complet: { src: "/logo/bowlys-logo.png", ratio: "1036 / 630" },
  icone: { src: "/logo/bowlys-icone.png", ratio: "436 / 326" },
  nom: { src: "/logo/bowlys-nom.png", ratio: "1036 / 184" },
} as const;

export function Logo({
  variante = "complet",
  className = "",
  titre = "BOWLY'S, Manti & Lahmacun",
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
