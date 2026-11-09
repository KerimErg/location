"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { VehiclePhoto } from "./vehicle-photo";

export function Gallery({ images, alt, sold }: { images: string[]; alt: string; sold?: boolean }) {
  const [i, setI] = useState(0);
  return (
    <div>
      <VehiclePhoto src={images[i]} alt={alt} priority sizes="(min-width:1024px) 60vw, 100vw" className="aspect-[16/10] border" imgClassName={cn(sold && "grayscale")} />
      {images.length > 1 && (
        <div className="mt-2 grid grid-cols-5 gap-2">
          {images.map((src, k) => (
            <button key={src} type="button" onClick={() => setI(k)} aria-label={`Photo ${k + 1}`} className={cn("border-2", k === i ? "border-signal" : "border-transparent")}>
              <VehiclePhoto src={src} alt="" sizes="160px" className="aspect-[4/3]" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
