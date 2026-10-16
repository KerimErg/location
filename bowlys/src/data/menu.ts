/**
 * ─────────────────────────────────────────────────────────────
 *  LA CARTE BOWLY'S — source unique des produits et des prix.
 *
 *  • prix en euros TTC (nombre, ex. 6.9 pour 6,90 €)
 *  • photo : chemin dans /public/images (null = emplacement « Photo à venir »)
 *  • badge : petite mention mise en avant (ex. « Best seller »)
 *  • groupes : choix proposés à l'ajout (format, lahmacun, crudités, sauce...)
 *      - type "unique"   : un seul choix (le premier est sélectionné par défaut)
 *      - type "multiple" : plusieurs choix possibles (`parDefaut` = cochés au départ)
 *  • allergenes : null tant que la liste n'est pas validée
 *    → à compléter AVANT publication (règlement INCO, 14 allergènes)
 * ─────────────────────────────────────────────────────────────
 */

export type Allergene =
  | "gluten" | "crustacés" | "œufs" | "poissons" | "arachides" | "soja" | "lait"
  | "fruits à coque" | "céleri" | "moutarde" | "sésame" | "sulfites" | "lupin" | "mollusques";

export type CategorieId = "box" | "durum" | "desserts" | "boissons";

export type Choix = { id: string; nom: string; prix?: number; photo?: string };
export type Groupe = { id: string; titre: string; type: "unique" | "multiple"; choix: Choix[]; parDefaut?: string[] };

export type Produit = {
  id: string;
  categorie: CategorieId;
  nom: string;
  description: string;
  prix: number;
  photo: string | null;
  badge?: string;
  allergenes: Allergene[] | null;
  groupes?: Groupe[];
};

/** Catégories de la carte. `photo` : image de la catégorie (bandeau et vitrine). */
export const CATEGORIES: { id: CategorieId; nom: string; accroche: string; photo: string | null }[] = [
  { id: "box", nom: "Box Lahmacun", accroche: "Lahmacun petit format", photo: "/images/carte/box-nature.webp" },
  { id: "durum", nom: "Dürüm", accroche: "Lahmacun grand format", photo: "/images/carte/durum.webp" },
  { id: "desserts", nom: "Desserts", accroche: "Pour finir en douceur", photo: "/images/carte/tiramisu.webp" },
  { id: "boissons", nom: "Boissons", accroche: "Bien fraîches", photo: null },
];

/* ── Groupes de choix réutilisés ─────────────────────── */
const FORMAT_BOX: Groupe = {
  id: "format", titre: "Format", type: "multiple",
  choix: [{ id: "5", nom: "5 lahmacuns (petit format)", prix: 2.9 }],
};

const CHOIX_LAHMACUN: Groupe = {
  id: "lahmacun", titre: "1. Choisis ton lahmacun", type: "unique",
  choix: [
    { id: "nature", nom: "Nature", photo: "/images/choix/lahmacun-nature.webp" },
    { id: "poulet", nom: "Poulet", photo: "/images/choix/lahmacun-poulet.webp" },
    { id: "boeuf", nom: "Bœuf", photo: "/images/choix/lahmacun-boeuf.webp" },
    { id: "vegetarien", nom: "Végétarien", photo: "/images/choix/lahmacun-vegetarien.webp" },
  ],
};

const CRUDITES: Groupe = {
  id: "crudites", titre: "2. Ajoute tes crudités", type: "multiple",
  choix: [
    { id: "salade", nom: "Salade", photo: "/images/choix/salade.webp" },
    { id: "tomate", nom: "Tomate", photo: "/images/choix/tomate.webp" },
    { id: "oignon", nom: "Oignon", photo: "/images/choix/oignon.webp" },
    { id: "carotte", nom: "Carotte", photo: "/images/choix/carotte.webp" },
    { id: "concombre", nom: "Concombre", photo: "/images/choix/concombre.webp" },
  ],
  parDefaut: ["salade", "tomate", "oignon", "carotte", "concombre"],
};

const SAUCE: Groupe = {
  id: "sauce", titre: "3. Choisis ta sauce", type: "unique",
  choix: [
    { id: "blanche", nom: "Sauce blanche", photo: "/images/choix/sauce-blanche.webp" },
    { id: "piquante", nom: "Sauce piquante", photo: "/images/choix/sauce-piquante.webp" },
  ],
};

export const PRODUITS: Produit[] = [
  // ── BOX LAHMACUN (petit format) ─────────────────────
  {
    id: "box-nature", categorie: "box", nom: "Box Nature", prix: 6.9, badge: "Best seller",
    description: "Viande hachée, tomates, oignons, persil et épices.",
    photo: "/images/carte/box-nature.webp", allergenes: null, groupes: [FORMAT_BOX],
  },
  {
    id: "box-vegetarien", categorie: "box", nom: "Box Végétarien", prix: 5.9,
    description: "Légumes grillés, tomates, oignons, persil et épices.",
    photo: "/images/carte/box-vegetarien.webp", allergenes: null, groupes: [FORMAT_BOX],
  },
  {
    id: "box-poulet", categorie: "box", nom: "Box Poulet", prix: 7.5,
    description: "Poulet, tomates, oignons, persil et épices.",
    photo: "/images/carte/box-poulet.webp", allergenes: null, groupes: [FORMAT_BOX],
  },
  {
    id: "box-boeuf", categorie: "box", nom: "Box Émincé de bœuf", prix: 7.9,
    description: "Bœuf émincé, tomates, oignons, persil et épices.",
    photo: "/images/carte/box-boeuf.webp", allergenes: null, groupes: [FORMAT_BOX],
  },

  // ── DÜRÜM (lahmacun grand format) ───────────────────
  {
    id: "durum", categorie: "durum", nom: "Dürüm Lahmacun", prix: 6.9,
    description: "Le lahmacun grand format roulé : choisis ton lahmacun, tes crudités et ta sauce.",
    photo: "/images/carte/durum.webp", allergenes: null, groupes: [CHOIX_LAHMACUN, CRUDITES, SAUCE],
  },

  // ── DESSERTS ────────────────────────────────────────
  { id: "panna-cotta", categorie: "desserts", nom: "Panna cotta", prix: 3, description: "Panna cotta et son coulis.", photo: "/images/carte/panna-cotta.webp", allergenes: null },
  { id: "tiramisu", categorie: "desserts", nom: "Tiramisu", prix: 3, description: "Le classique au cacao.", photo: "/images/carte/tiramisu.webp", allergenes: null },

  // ── BOISSONS ────────────────────────────────────────
  { id: "coca-cola", categorie: "boissons", nom: "Coca-Cola", prix: 1.6, description: "Canette.", photo: "/images/carte/boisson-coca-cola.webp", allergenes: null },
  { id: "fanta", categorie: "boissons", nom: "Fanta", prix: 1.6, description: "Canette.", photo: "/images/carte/boisson-fanta.webp", allergenes: null },
  { id: "sprite", categorie: "boissons", nom: "Sprite", prix: 1.6, description: "Canette.", photo: "/images/carte/boisson-sprite.webp", allergenes: null },
  { id: "ayran", categorie: "boissons", nom: "Ayran", prix: 1.6, description: "La boisson turque au yaourt.", photo: "/images/carte/boisson-ayran.webp", allergenes: null },
  { id: "eau", categorie: "boissons", nom: "Eau", prix: 1.6, description: "Bouteille.", photo: "/images/carte/boisson-eau.webp", allergenes: null },
];

export const produitsDe = (c: CategorieId) => PRODUITS.filter((p) => p.categorie === c);

/** Une option du panier s'écrit "groupe:choix" (ex. "sauce:blanche"). */
export function choixDe(p: Produit, cle: string): { groupe: Groupe; choix: Choix } | null {
  const [g, c] = cle.split(":");
  const groupe = p.groupes?.find((x) => x.id === g);
  const choix = groupe?.choix.find((x) => x.id === c);
  return groupe && choix ? { groupe, choix } : null;
}

/** Sélection de départ d'un produit (premier choix des groupes uniques + `parDefaut`). */
export function selectionInitiale(p: Produit): string[] {
  return (p.groupes ?? []).flatMap((g) =>
    g.type === "unique" ? [`${g.id}:${g.choix[0].id}`] : (g.parDefaut ?? []).map((c) => `${g.id}:${c}`),
  );
}
