import Image from "next/image";
import type { Category } from "@prisma/client";
import { CATEGORY_LABEL } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Visuel d'un véhicule : la photo si elle existe, sinon un placeholder sobre
 * teinté de la couleur du véhicule (aucune image générée ni modèle 3D).
 */
export function VehicleVisual({
  src,
  alt,
  color,
  category,
  sizes,
  priority,
  className,
  imgClassName,
}: {
  src?: string;
  alt: string;
  color: string;
  category: Category;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-surface", className)}>
      {src ? (
        // Les URL distantes (Unsplash) redirigent vers leur CDN : on laisse le navigateur les charger directement.
        <Image src={src} alt={alt} fill priority={priority} unoptimized={src.startsWith("http")} sizes={sizes ?? "100vw"} className={cn("object-cover", imgClassName)} />
      ) : (
        <div className="absolute inset-0" aria-label={alt} role="img">
          <div className="absolute -right-1/4 -bottom-1/3 size-[90%] rounded-full opacity-35 blur-3xl" style={{ background: color }} />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:32px_32px] opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
          <span className="absolute right-5 bottom-3 font-display text-5xl font-extrabold tracking-tighter text-foreground/[0.07] uppercase select-none sm:text-6xl">
            {CATEGORY_LABEL[category]}
          </span>
          <span className="absolute bottom-5 left-5 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="size-3 rounded-full ring-2 ring-background" style={{ background: color }} />
            Photo non contractuelle
          </span>
        </div>
      )}
    </div>
  );
}
