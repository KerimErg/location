import Image from "next/image";
import { Car } from "lucide-react";
import { cn } from "@/lib/utils";

/** Photo de véhicule. Les URL distantes (Unsplash) sont chargées directement par le navigateur. */
export function VehiclePhoto({ src, alt, sizes, priority, className, imgClassName }: { src?: string; alt: string; sizes?: string; priority?: boolean; className?: string; imgClassName?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes ?? "100vw"} priority={priority} unoptimized={src.startsWith("http")} className={cn("object-cover", imgClassName)} />
      ) : (
        <div className="blueprint absolute inset-0 flex items-center justify-center text-steel" role="img" aria-label={alt}>
          <Car className="size-12" strokeWidth={1} />
        </div>
      )}
    </div>
  );
}
