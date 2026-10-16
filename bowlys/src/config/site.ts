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
  slogan: "Lahmacun",
  description:
    "BOWLY'S, le lahmacun autrement : box de lahmacuns petit format, dürüm grand format à composer, desserts et boissons. Sur place ou à emporter à Schiltigheim.",

  /** Adresse du domaine une fois en ligne (ex. "https://bowlys.fr"). Sert au SEO et au partage. */
  url: "https://bowlys.fr" as string | null, // domaine prévu ; à corriger si différent

  restaurant: {
    rue: "14 rue Jean Monnet",
    codePostal: "67300",
    ville: "Schiltigheim",
    pays: "FR",
  } as { rue: string; codePostal: string; ville: string; pays: string } | null,

  telephone: "06 06 06 06 06" as string | null,
  email: null as string | null, // ex. "contact@bowlys.fr"

  /**
   * Horaires par jour (heure de Paris). `null` = pas encore communiqués.
   * ⚠️ HORAIRES PROVISOIRES à confirmer avant la mise en ligne.
   * Fermeture après minuit : écrire "00:00", "01:00"...
   */
  horaires: {
    lundi: [{ ouverture: "11:30", fermeture: "23:00" }],
    mardi: [{ ouverture: "11:30", fermeture: "23:00" }],
    mercredi: [{ ouverture: "11:30", fermeture: "23:00" }],
    jeudi: [{ ouverture: "11:30", fermeture: "23:00" }],
    vendredi: [{ ouverture: "11:30", fermeture: "00:00" }],
    samedi: [{ ouverture: "11:30", fermeture: "00:00" }],
    dimanche: [{ ouverture: "12:00", fermeture: "23:00" }],
  } as Record<Jour, Plage[]> | null,

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

/** Plan Google Maps intégrable (chargé seulement quand le visiteur le demande). */
export function lienPlanIntegre(): string | null {
  const a = adresseLigne();
  return a ? `https://maps.google.com/maps?q=${encodeURIComponent(a)}&z=16&output=embed` : null;
}

export function lienItineraire(): string | null {
  const a = adresseLigne();
  return a ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(a)}` : null;
}

export const JOURS: Jour[] = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
