"use client";

import { useEffect } from "react";

/** Chaque page s'ouvre en haut (le navigateur ne restaure pas l'ancienne position), sauf lien vers une ancre (#contact…). */
export function RetourHaut() {
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const haut = () => { if (!location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" }); };
    haut();
    const surRetour = (e: PageTransitionEvent) => { if (e.persisted) haut(); };
    window.addEventListener("pageshow", surRetour);
    return () => window.removeEventListener("pageshow", surRetour);
  }, []);
  return null;
}
