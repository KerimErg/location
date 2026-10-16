"use client";

import { useEffect } from "react";

/**
 * Retour arrière / avant : le navigateur remet la page là où on était.
 * Arrivée par un lien : la page s'ouvre en haut (sauf lien vers une ancre, ex. #contact).
 */
export function RetourHaut() {
  useEffect(() => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type !== "navigate" || location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);
  return null;
}
