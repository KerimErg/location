/**
 * Informations du garage — à vérifier / compléter avant la mise en ligne.
 * Tout le site lit ces valeurs : un seul fichier à modifier.
 */
export const SITE = {
  name: "DGN Cars",
  legalName: "DGN CARS SRL",
  tagline: "Voitures d'occasion contrôlées à Liège",
  vat: "BE 0792.432.392",
  address: {
    street: "Rue François Lefèbvre 145",
    postalCode: "4000",
    city: "Rocourt (Liège)",
    country: "Belgique",
    // Coordonnées approximatives (Rocourt) — à vérifier sur la carte.
    lat: 50.6735,
    lng: 5.5528,
  },
  // Coordonnées publiées sur AutoScout24 (fiche DGN Cars) — à vérifier.
  contact: "Yalçin Dogan",
  phone: { display: "+32 4 268 41 33", href: "+3242684133" },
  mobile: { display: "+32 499 23 67 37", href: "+32499236737" },
  whatsapp: "32499236737", // sans + ni espaces
  email: "", // ex. "contact@dgncars.be"
  appointmentOnly: true,
  hours: [
    { days: "Lundi – Vendredi", hours: "10:00 – 18:00 · sur RDV" },
    { days: "Samedi – Dimanche", hours: "10:00 – 18:00 · sur RDV" },
  ],
  instagram: "https://www.instagram.com/dgn_cars/",
  autoscout: "https://www.autoscout24.be/fr/professional/dgn-cars",
  url: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
};

export const fullAddress = `${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city}`;
export const mapsUrl = `https://www.openstreetmap.org/?mlat=${SITE.address.lat}&mlon=${SITE.address.lng}#map=17/${SITE.address.lat}/${SITE.address.lng}`;
