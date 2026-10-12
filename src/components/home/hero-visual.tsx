"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Move3d } from "lucide-react";
import { cn } from "@/lib/utils";

const CarScene = dynamic(() => import("./car-scene"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function HeroVisual() {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [loaded, setLoaded] = useState(false);
  const onLoaded = useCallback(() => setLoaded(true), []);

  useEffect(() => setWebgl(hasWebGL()), []);

  return (
    <div className="absolute inset-0">
      {/* Fallback image pendant le chargement du modèle .glb (ou sans WebGL) */}
      <div className={cn("pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-700", loaded ? "opacity-0" : "opacity-100")}>
        <Image
          src="/images/hero-fallback.png"
          alt="Coupé TestLocation Vortex GT Signature"
          width={1600}
          height={900}
          priority
          className="w-[120%] max-w-none translate-y-[6%] object-contain opacity-90 md:w-[85%]"
        />
      </div>
      {webgl && (
        <div className={cn("absolute inset-0 transition-opacity duration-1000", loaded ? "opacity-100" : "opacity-0")}>
          <CarScene onLoaded={onLoaded} />
        </div>
      )}
      {loaded && (
        <div className="pointer-events-none absolute right-6 bottom-[46%] hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 backdrop-blur md:flex lg:bottom-48">
          <Move3d className="size-3.5" /> Faites pivoter le véhicule
        </div>
      )}
    </div>
  );
}
