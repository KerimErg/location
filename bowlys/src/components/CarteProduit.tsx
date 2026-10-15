"use client";

import { Plus } from "lucide-react";
import type { Produit } from "@/data/menu";
import { prix } from "@/lib/format";
import { usePanier } from "@/lib/panier";
import { site } from "@/config/site";
import { Photo } from "./Photo";

/** Fiche produit de la carte : toute la carte ouvre le détail, le « + » ajoute (ou ouvre les options). */
export function CarteProduit({ produit, grand = false }: { produit: Produit; grand?: boolean }) {
  const { ajouter, ouvrirProduit } = usePanier();
  const aOptions = (produit.options?.length ?? 0) > 0;
  const petit = !produit.photo && (produit.categorie === "boissons" || produit.categorie === "extras");

  return (
    <article className="group relative flex flex-col rounded-[22px] bg-white ring-1 ring-trait transition-[box-shadow,transform] duration-500 ease-[var(--ease-pro)] hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(11,15,26,.45)] hover:ring-bleu/40">
      {!petit && (
        <Photo
          src={produit.photo}
          alt={produit.nom}
          illustration={produit.illustration}
          className={`aspect-square rounded-t-[22px] ${grand ? "" : ""}`}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
        />
      )}
      <div className={`flex flex-1 flex-col gap-1.5 ${petit ? "p-5" : "p-4 sm:p-5"}`}>
        <h3 className={`font-display font-black leading-tight ${grand ? "text-xl sm:text-2xl" : "text-[1.05rem] sm:text-lg"}`}>
          {/* Bouton étiré : toute la carte est cliquable et accessible au clavier */}
          <button type="button" onClick={() => ouvrirProduit(produit)} className="text-left after:absolute after:inset-0 after:rounded-[22px] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-3 focus-visible:after:outline-bleu">
            {produit.nom}
          </button>
        </h3>
        <p className="line-clamp-2 text-sm text-gris">{produit.description}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <span className="font-display text-lg font-black text-bleu">{prix(produit.prix)}</span>
          {site.commande.panierActif && (
            <button
              type="button"
              onClick={() => (aOptions ? ouvrirProduit(produit) : ajouter(produit.id))}
              aria-label={aOptions ? `Choisir les options et ajouter ${produit.nom}` : `Ajouter ${produit.nom} au panier`}
              className="relative z-10 grid size-11 place-items-center rounded-full bg-bleu text-white shadow-[0_8px_18px_-8px_rgba(0,87,231,.8)] transition-[transform,background] duration-300 hover:rotate-90 hover:bg-bleu-fonce active:scale-90"
            >
              <Plus className="size-5" strokeWidth={3} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
