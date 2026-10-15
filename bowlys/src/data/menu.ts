/**
 * ─────────────────────────────────────────────────────────────
 *  LA CARTE BOWLY'S — source unique des produits et des prix.
 *
 *  • prix en euros TTC (nombre, ex. 8.9 pour 8,90 €)
 *  • photo : chemin dans /public/images, ou null (emplacement « Photo à venir »)
 *  • illustration : true si la photo n'est PAS une photo de vos produits
 *    (le site affiche alors la mention « Photo d'illustration »)
 *  • allergenes : null tant que la liste n'est pas validée
 *    → à compléter AVANT publication (règlement INCO, 14 allergènes)
 *  • description : textes de départ à relire et valider
 * ─────────────────────────────────────────────────────────────
 */

export type Allergene =
  | "gluten" | "crustacés" | "œufs" | "poissons" | "arachides" | "soja" | "lait"
  | "fruits à coque" | "céleri" | "moutarde" | "sésame" | "sulfites" | "lupin" | "mollusques";

export type CategorieId = "mantis" | "lahmacuns" | "menus" | "accompagnements" | "boissons";

export type Option = { id: string; nom: string; prix: number };

export type Produit = {
  id: string;
  categorie: CategorieId;
  nom: string;
  description: string;
  prix: number;
  photo: string | null;
  illustration?: boolean;
  allergenes: Allergene[] | null;
  /** Options payantes proposées à l'ajout (ids de la liste OPTIONS). */
  options?: string[];
  /** Pour les menus : composition à renseigner (laisser vide tant qu'elle n'est pas définie). */
  composition?: string[];
  vedette?: boolean;
};

/** Catégories de la carte. `photo` : image de la tuile (null = tuile aux couleurs BOWLY'S). */
export const CATEGORIES: { id: CategorieId; nom: string; accroche: string; photo: string | null }[] = [
  { id: "mantis", nom: "Mantis", accroche: "Raviolis turcs, sauce yaourt", photo: "/images/illustration-manti-beurre.webp" },
  { id: "lahmacuns", nom: "Lahmacuns", accroche: "Pâte fine, cuite au four", photo: "/images/illustration-lahmacun-garniture.webp" },
  { id: "menus", nom: "Menus", accroche: "Le repas complet", photo: "/images/illustration-manti-assiette.webp" },
  { id: "accompagnements", nom: "Accompagnements", accroche: "Pour compléter votre repas", photo: null },
  { id: "boissons", nom: "Boissons", accroche: "Bien fraîches", photo: null },
];

/** Options proposées dans la fiche produit (reprennent les prix des accompagnements). */
export const OPTIONS: Option[] = [
  { id: "sauce-piquante", nom: "Sauce piquante", prix: 0.5 },
  { id: "fromage", nom: "Fromage", prix: 1.0 },
  { id: "pain", nom: "Pain supplémentaire", prix: 1.0 },
];

export const PRODUITS: Produit[] = [
  // ── MANTIS ──────────────────────────────────────────
  {
    id: "manti-original", categorie: "mantis", nom: "Manti Original", prix: 8.9,
    description: "Nos raviolis turcs à la viande, nappés de sauce yaourt et de beurre pimenté.",
    photo: "/images/illustration-manti-beurre.webp", illustration: true,
    allergenes: null, options: ["sauce-piquante", "pain"], vedette: true,
  },
  {
    id: "manti-nature", categorie: "mantis", nom: "Manti Nature", prix: 7.5,
    description: "La version tout en douceur, servie avec la sauce yaourt.",
    photo: "/images/illustration-manti-yaourt.webp", illustration: true,
    allergenes: null, options: ["sauce-piquante", "pain"], vedette: true,
  },
  {
    id: "manti-patates", categorie: "mantis", nom: "Manti Patates", prix: 8.5,
    description: "Des raviolis farcis à la pomme de terre, servis avec la sauce yaourt.",
    photo: null, allergenes: null, options: ["sauce-piquante", "pain"],
  },

  // ── LAHMACUNS ───────────────────────────────────────
  {
    id: "lahmacun-original", categorie: "lahmacuns", nom: "Lahmacun Original", prix: 6.5,
    description: "La galette fine et croustillante, garnie et cuite au four.",
    photo: null, allergenes: null, options: ["fromage", "sauce-piquante"], vedette: true,
  },
  {
    id: "lahmacun-cheese", categorie: "lahmacuns", nom: "Lahmacun Cheese", prix: 7.5,
    description: "Le lahmacun avec du fromage fondu.",
    photo: null, allergenes: null, options: ["sauce-piquante"],
  },
  {
    id: "lahmacun-spicy", categorie: "lahmacuns", nom: "Lahmacun Spicy", prix: 8.0,
    description: "Le lahmacun en version relevée, pour les amateurs de piquant.",
    photo: null, allergenes: null, options: ["fromage"],
  },

  // ── MENUS (composition à définir) ───────────────────
  {
    id: "menu-manti", categorie: "menus", nom: "Menu Manti", prix: 10.9,
    description: "Le menu autour de notre manti.",
    photo: "/images/illustration-manti-assiette.webp", illustration: true,
    allergenes: null, composition: [],
  },
  {
    id: "menu-lahmacun", categorie: "menus", nom: "Menu Lahmacun", prix: 8.5,
    description: "Le menu autour de notre lahmacun.",
    photo: null, allergenes: null, composition: [],
  },
  {
    id: "menu-mix", categorie: "menus", nom: "Menu Mix", prix: 13.9,
    description: "Manti et lahmacun réunis dans un seul menu.",
    photo: null, allergenes: null, composition: [],
  },

  // ── ACCOMPAGNEMENTS ─────────────────────────────────
  { id: "extra-sauce-piquante", categorie: "accompagnements", nom: "Sauce piquante", prix: 0.5, description: "Pour relever votre plat.", photo: null, allergenes: null },
  { id: "extra-fromage", categorie: "accompagnements", nom: "Fromage", prix: 1.0, description: "Une portion de fromage.", photo: null, allergenes: null },
  { id: "extra-pain", categorie: "accompagnements", nom: "Pain supplémentaire", prix: 1.0, description: "Pour saucer jusqu'au bout.", photo: null, allergenes: null },
  { id: "extra-boisson", categorie: "accompagnements", nom: "Boisson 33 cl", prix: 1.5, description: "Une canette au choix.", photo: null, allergenes: null },

  // ── BOISSONS ────────────────────────────────────────
  { id: "coca-cola", categorie: "boissons", nom: "Coca-Cola", prix: 1.5, description: "33 cl.", photo: null, allergenes: null },
  { id: "coca-cola-zero", categorie: "boissons", nom: "Coca-Cola Zéro", prix: 1.5, description: "33 cl.", photo: null, allergenes: null },
  { id: "sprite", categorie: "boissons", nom: "Sprite", prix: 1.5, description: "33 cl.", photo: null, allergenes: null },
  { id: "fanta", categorie: "boissons", nom: "Fanta", prix: 1.5, description: "33 cl.", photo: null, allergenes: null },
  { id: "eau", categorie: "boissons", nom: "Eau", prix: 1.0, description: "Plate.", photo: null, allergenes: null },
];

export const produitsDe = (c: CategorieId) => PRODUITS.filter((p) => p.categorie === c);
export const optionsDe = (p: Produit) => (p.options ?? []).map((id) => OPTIONS.find((o) => o.id === id)!).filter(Boolean);
