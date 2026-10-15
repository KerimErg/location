import Image from "next/image";
import { Logo } from "./Logo";

/**
 * Photo produit carrée ou rectangulaire.
 * - `src` null → emplacement propre « Photo à venir » (bleu ciel + logo).
 * - `illustration` → mention « Photo d'illustration » (photo qui n'est pas celle de vos produits).
 */
export function Photo({
  src, alt, illustration, className = "", sizes = "(max-width: 768px) 100vw, 33vw", priorite = false, sombre = false, zoom = true, vignette = false,
}: {
  src: string | null; alt: string; illustration?: boolean; className?: string; sizes?: string; priorite?: boolean; sombre?: boolean; zoom?: boolean; vignette?: boolean;
}) {
  return (
    <div className={`${/\babsolute\b/.test(className) ? "" : "relative"} overflow-hidden ${sombre ? "bg-encre-2" : "bg-bleu-ciel"} ${className}`}>
      {src ? (
        <>
          <Image
            src={src} alt={alt} fill sizes={sizes} priority={priorite}
            className={`object-cover ${zoom ? "transition-transform duration-[1.2s] ease-[var(--ease-pro)] group-hover:scale-[1.06]" : ""}`}
          />
          {illustration && !vignette && (
            <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
              Photo d&apos;illustration
            </span>
          )}
        </>
      ) : (
        <div role="img" aria-label={`Photo à venir : ${alt}`} className="absolute inset-0 grid place-items-center">
          <div className="grid justify-items-center gap-3">
            <Logo variante="icone" titre="" className={`w-[min(34%,120px)] min-w-10 ${sombre ? "text-white/25" : "text-bleu/25"}`} />
            {!vignette && <span className={`text-[0.62rem] font-bold uppercase tracking-[0.18em] ${sombre ? "text-white/45" : "text-bleu/60"}`}>Photo à venir</span>}
          </div>
        </div>
      )}
    </div>
  );
}
