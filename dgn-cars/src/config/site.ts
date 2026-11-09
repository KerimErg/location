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
  // TODO : renseigner le vrai numéro (format affiché + format international pour les liens).
  phone: { display: "+32 4XX XX XX XX", href: "" },
  whatsapp: "", // ex. "32470123456" (sans + ni espaces)
  email: "", // ex. "contact@dgncars.be"
  appointmentOnly: true,
  hours: [
    { days: "Lundi – Vendredi", hours: "Sur rendez-vous" },
    { days: "Samedi", hours: "Sur rendez-vous" },
    { days: "Dimanche", hours: "Fermé" },
  ],
  instagram: "https://www.instagram.com/dgn_cars/",
  autoscout: "https://www.autoscout24.be/fr/professional/region/liege/bassenge/",
  url: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
};

export const fullAddress = `${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city}`;
export const mapsUrl = `https://www.openstreetmap.org/?mlat=${SITE.address.lat}&mlon=${SITE.address.lng}#map=17/${SITE.address.lat}/${SITE.address.lng}`;
