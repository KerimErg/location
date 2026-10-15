"use client";

/**
 * Panier côté navigateur.
 * - Conservé dans le stockage local du navigateur (cookie non nécessaire, aucune donnée envoyée).
 * - Les prix sont toujours recalculés depuis `data/menu.ts` : impossible de les altérer côté client.
 * - Brancher un vrai paiement plus tard : voir `site.commande.envoi` et README.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { OPTIONS, PRODUITS, type Produit } from "@/data/menu";

export type Ligne = { cle: string; produitId: string; options: string[]; qte: number };

type Ctx = {
  lignes: Ligne[];
  nbArticles: number;
  total: number;
  ajouter: (produitId: string, options?: string[], qte?: number) => void;
  changerQte: (cle: string, delta: number) => void;
  retirer: (cle: string) => void;
  vider: () => void;
  panierOuvert: boolean;
  ouvrirPanier: (v?: boolean) => void;
  produitOuvert: Produit | null;
  ouvrirProduit: (p: Produit | null) => void;
  message: string | null;
  bump: number;
};

const PanierCtx = createContext<Ctx | null>(null);
const CLE_STOCKAGE = "bowlys-panier-v1";

export const produitParId = (id: string) => PRODUITS.find((p) => p.id === id);
export const prixLigne = (l: Ligne) => {
  const p = produitParId(l.produitId);
  if (!p) return 0;
  const opts = l.options.reduce((s, id) => s + (OPTIONS.find((o) => o.id === id)?.prix ?? 0), 0);
  return (p.prix + opts) * l.qte;
};

export function PanierProvider({ children }: { children: ReactNode }) {
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [charge, setCharge] = useState(false);
  const [panierOuvert, setPanierOuvert] = useState(false);
  const [produitOuvert, setProduitOuvert] = useState<Produit | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [bump, setBump] = useState(0);

  // Lecture du panier enregistré (ignore les produits qui n'existent plus).
  useEffect(() => {
    try {
      const brut = localStorage.getItem(CLE_STOCKAGE);
      if (brut) setLignes((JSON.parse(brut) as Ligne[]).filter((l) => produitParId(l.produitId) && l.qte > 0));
    } catch {
      /* stockage indisponible : panier vide */
    }
    setCharge(true);
  }, []);
  useEffect(() => {
    if (!charge) return;
    try { localStorage.setItem(CLE_STOCKAGE, JSON.stringify(lignes)); } catch { /* sans effet */ }
  }, [lignes, charge]);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 2600);
    return () => clearTimeout(t);
  }, [message]);

  const ajouter = useCallback((produitId: string, options: string[] = [], qte = 1) => {
    const p = produitParId(produitId);
    if (!p) return;
    const cle = [produitId, ...[...options].sort()].join("|");
    setLignes((ls) => {
      const ex = ls.find((l) => l.cle === cle);
      return ex ? ls.map((l) => (l.cle === cle ? { ...l, qte: Math.min(l.qte + qte, 30) } : l)) : [...ls, { cle, produitId, options, qte }];
    });
    setMessage(`${p.nom} ajouté au panier`);
    setBump((b) => b + 1);
  }, []);

  const changerQte = useCallback((cle: string, delta: number) => {
    setLignes((ls) => ls.flatMap((l) => (l.cle !== cle ? [l] : l.qte + delta <= 0 ? [] : [{ ...l, qte: Math.min(l.qte + delta, 30) }])));
  }, []);
  const retirer = useCallback((cle: string) => setLignes((ls) => ls.filter((l) => l.cle !== cle)), []);
  const vider = useCallback(() => setLignes([]), []);

  const value = useMemo<Ctx>(() => ({
    lignes,
    nbArticles: lignes.reduce((s, l) => s + l.qte, 0),
    total: lignes.reduce((s, l) => s + prixLigne(l), 0),
    ajouter, changerQte, retirer, vider,
    panierOuvert, ouvrirPanier: (v = true) => setPanierOuvert(v),
    produitOuvert, ouvrirProduit: setProduitOuvert,
    message, bump,
  }), [lignes, ajouter, changerQte, retirer, vider, panierOuvert, produitOuvert, message, bump]);

  return <PanierCtx.Provider value={value}>{children}</PanierCtx.Provider>;
}

export function usePanier() {
  const c = useContext(PanierCtx);
  if (!c) throw new Error("usePanier doit être utilisé dans <PanierProvider>");
  return c;
}
