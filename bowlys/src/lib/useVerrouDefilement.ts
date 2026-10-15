"use client";

import { useEffect, type RefObject } from "react";

/** Bloque le défilement de la page, ferme avec Échap et garde le focus clavier dans la fenêtre ouverte. */
export function useFenetre(ouvert: boolean, ref: RefObject<HTMLElement | null>, fermer: () => void) {
  useEffect(() => {
    if (!ouvert) return;
    const avant = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const el = ref.current;
    const focusables = () =>
      el ? [...el.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])')] : [];
    requestAnimationFrame(() => focusables()[0]?.focus({ preventScroll: true }));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") fermer();
      if (e.key === "Tab") {
        const f = focusables();
        if (!f.length) return;
        const [a, z] = [f[0], f[f.length - 1]];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      avant?.focus?.({ preventScroll: true });
    };
  }, [ouvert, ref, fermer]);
}
