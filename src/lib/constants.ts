import type { Category, Fuel, Protection, ReservationStatus, Transmission } from "@prisma/client";

export const CATEGORIES: { value: Category; label: string; slug: string; tagline: string; from: number }[] = [
  { value: "CITADINE", label: "Citadine", slug: "citadine", tagline: "Agile et économique en ville", from: 39 },
  { value: "BERLINE", label: "Berline", slug: "berline", tagline: "Confort sur les longs trajets", from: 59 },
  { value: "SUV", label: "SUV", slug: "suv", tagline: "Espace et polyvalence", from: 79 },
  { value: "UTILITAIRE", label: "Utilitaire", slug: "utilitaire", tagline: "Pour vos projets et déménagements", from: 95 },
  { value: "PREMIUM", label: "Premium", slug: "premium", tagline: "L'exception à chaque virage", from: 179 },
  { value: "ELECTRIQUE", label: "Électrique", slug: "electrique", tagline: "Zéro émission, 100 % plaisir", from: 49 },
];

export const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label])) as Record<Category, string>;
export const categoryFromSlug = (slug?: string | null) => CATEGORIES.find((c) => c.slug === slug)?.value;

export const TRANSMISSION_LABEL: Record<Transmission, string> = { MANUAL: "Manuelle", AUTOMATIC: "Automatique" };
export const FUEL_LABEL: Record<Fuel, string> = { PETROL: "Essence", DIESEL: "Diesel", HYBRID: "Hybride", ELECTRIC: "Électrique" };

export const STATUS_LABEL: Record<ReservationStatus, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  ONGOING: "En cours",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
};
export const STATUS_VARIANT: Record<ReservationStatus, "warning" | "info" | "success" | "secondary" | "danger"> = {
  PENDING: "warning",
  CONFIRMED: "info",
  ONGOING: "success",
  COMPLETED: "secondary",
  CANCELLED: "danger",
};

export const PROTECTIONS: { value: Protection; label: string; pricePerDay: number; excess: number; perks: string[]; recommended?: boolean }[] = [
  { value: "BASIC", label: "Essentielle", pricePerDay: 0, excess: 1500, perks: ["Responsabilité civile", "Assistance 24/7", "Franchise 1 500 €"] },
  { value: "PLUS", label: "Sérénité", pricePerDay: 14, excess: 500, perks: ["Tout Essentielle", "Bris de glace & pneus", "Franchise réduite à 500 €"], recommended: true },
  { value: "PREMIUM", label: "Intégrale", pricePerDay: 24, excess: 0, perks: ["Tout Sérénité", "Franchise 0 €", "Vol & vandalisme couverts"] },
];

export const ACTIVE_STATUSES: ReservationStatus[] = ["PENDING", "CONFIRMED", "ONGOING"];
export const ONE_WAY_FEE = 49;
export const MIN_DRIVER_AGE = 21;
