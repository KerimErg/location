// Photos libres de droits (licence Unsplash : usage commercial libre, attribution facultative).
export const unsplash = (id: string, w = 1600) => `https://unsplash.com/photos/${id}/download?w=${w}`;

export const PHOTOS = {
  hero: unsplash("81NrHQ6TBqE", 2400), // Golf GTI en showroom
  workshop: unsplash("jL9zfzTVSwY"), // vidange à l'atelier
  hands: unsplash("Fd6osyVbtG4"), // mains + clé sur moteur
  engine: unsplash("u3RhNe3QJeM"), // compartiment moteur
  lot: unsplash("Mk79t0-sB_w"), // parc de véhicules
};
