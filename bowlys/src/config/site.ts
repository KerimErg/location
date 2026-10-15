/**
 * ─────────────────────────────────────────────────────────────
 *  CONFIGURATION DE LA MARQUE BOWLY'S
 *  Modifiez ce fichier pour changer les coordonnées, horaires,
 *  réseaux sociaux et options de commande.
 *
 *  Règle : `null` = information pas encore connue.
 *  Le site masque automatiquement un champ à `null`,
 *  ou affiche « à venir » quand c'est utile au client.
 * ─────────────────────────────────────────────────────────────
 */

export type Jour = "lundi" | "mardi" | "mercredi" | "jeudi" | "vendredi" | "samedi" | "dimanche";
/** Une plage horaire, ex. { ouverture: "11:30", fermeture: "14:30" }. Tableau vide = fermé ce jour-là. */
export type Plage = { ouverture: string; fermeture: string };

export const site = {
  nom: "BOWLY'S",
  nomCourt: "Bowly's",
  slogan: "Manti & Lahmacun",
  description:
    "BOWLY'S, la street food turque autrement : manti généreux, lahmacuns croustillants et recettes pleines de saveurs.",

  /** Adresse du domaine une fois en ligne (ex. "https://bowlys.fr"). Sert au SEO et au partage. */
  url: "https://bowlys.fr" as string | null, // domaine prévu ; à corriger si différent

  restaurant: {
    rue: "14 rue Jean Monnet",
    codePostal: "67300",
    ville: "Schiltigheim",
    pays: "FR",
  } as { rue: string; codePostal: string; ville: string; pays: string } | null,

  telephone: null as string | null, // ex. "+33 3 88 00 00 00"
  email: null as string | null, // ex. "contact@bowlys.fr"

  /** Horaires par jour. `null` = horaires pas encore communiqués (le site affiche « Horaires à venir »). */
  horaires: null as Record<Jour, Plage[]> | null,

  reseaux: {
    instagram: "https://www.instagram.com/bowlys/" as string | null,
    tiktok: null as string | null,
  },

  /** Lien d'avis Google (laisser null tant qu'il n'existe pas). */
  avisGoogle: null as string | null,

  commande: {
    /** Affiche les boutons « Ajouter » et le panier. */
    panierActif: true,
    /** Modes proposés au client à l'étape de commande. */
    retraitSurPlace: true,
    livraison: false,
    /**
     * Branchement réel de la commande. Tant que c'est `null`, rien n'est envoyé
     * au restaurant et aucun paiement n'a lieu : le client en est clairement informé.
     * Futur : "stripe" | "sumup" | "api-caisse"...
     */
    envoi: null as null | "stripe",
    /** Liens plateformes, affichés seulement s'ils sont renseignés. */
    uberEats: null as string | null,
    deliveroo: null as string | null,
  },
};

export function adresseLigne(): string | null {
  const r = site.restaurant;
  return r ? `${r.rue}, ${r.codePostal} ${r.ville}` : null;
}

export function lienItineraire(): string | null {
  const a = adresseLigne();
  return a ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(a)}` : null;
}

export const JOURS: Jour[] = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
