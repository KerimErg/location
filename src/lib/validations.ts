import { z } from "zod";
import { MIN_DRIVER_AGE } from "./constants";

const phone = z.string().trim().regex(/^(\+?\d[\d\s.-]{7,17})$/, "Numéro de téléphone invalide");

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Indiquez votre nom complet"),
    email: z.string().trim().toLowerCase().email("Adresse e-mail invalide"),
    phone: phone.optional().or(z.literal("")),
    password: z
      .string()
      .min(8, "8 caractères minimum")
      .regex(/[A-Z]/, "Au moins une majuscule")
      .regex(/\d/, "Au moins un chiffre"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "Les mots de passe ne correspondent pas", path: ["confirm"] });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const searchSchema = z
  .object({
    pickupAgency: z.string().min(1, "Choisissez une agence de départ"),
    returnAgency: z.string().min(1, "Choisissez une agence de retour"),
    pickupDate: z.string().min(1, "Date de départ requise"),
    pickupTime: z.string().min(1),
    returnDate: z.string().min(1, "Date de retour requise"),
    returnTime: z.string().min(1),
  })
  .refine((d) => `${d.returnDate}T${d.returnTime}` > `${d.pickupDate}T${d.pickupTime}`, {
    message: "Le retour doit être après le départ",
    path: ["returnDate"],
  });

export const driverSchema = z.object({
  firstName: z.string().trim().min(2, "Prénom requis"),
  lastName: z.string().trim().min(2, "Nom requis"),
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide"),
  phone,
  birthDate: z
    .string()
    .min(1, "Date de naissance requise")
    .refine((v) => {
      const d = new Date(v);
      if (isNaN(d.getTime())) return false;
      const age = (Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000);
      return age >= MIN_DRIVER_AGE && age < 100;
    }, `Le conducteur doit avoir au moins ${MIN_DRIVER_AGE} ans`),
  licenseNumber: z.string().trim().min(6, "Numéro de permis invalide").max(20, "Numéro de permis invalide"),
  flightNumber: z.string().trim().max(10).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  acceptTerms: z.literal(true, { message: "Vous devez accepter les conditions générales" }),
});

export const reservationSchema = driverSchema.extend({
  vehicleId: z.string().min(1),
  pickupAgencyId: z.string().min(1),
  returnAgencyId: z.string().min(1),
  pickupAt: z.string().datetime(),
  returnAt: z.string().datetime(),
  protection: z.enum(["BASIC", "PLUS", "PREMIUM"]),
  extras: z.array(z.object({ id: z.string(), quantity: z.number().int().min(0).max(3) })),
});

export const vehicleSchema = z.object({
  name: z.string().trim().min(2, "Nom requis"),
  slug: z.string().trim().min(2).regex(/^[a-z0-9-]+$/, "Uniquement minuscules, chiffres et tirets"),
  category: z.enum(["CITADINE", "BERLINE", "SUV", "UTILITAIRE", "PREMIUM", "ELECTRIQUE"]),
  transmission: z.enum(["MANUAL", "AUTOMATIC"]),
  fuel: z.enum(["PETROL", "DIESEL", "HYBRID", "ELECTRIC"]),
  seats: z.coerce.number().int().min(1).max(9),
  doors: z.coerce.number().int().min(2).max(5),
  luggage: z.coerce.number().int().min(0).max(12),
  pricePerDay: z.coerce.number().int().min(1, "Prix requis"),
  deposit: z.coerce.number().int().min(0),
  power: z.coerce.number().int().min(1),
  consumption: z.string().trim().min(1),
  year: z.coerce.number().int().min(2000).max(2100),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Couleur hex invalide"),
  colorName: z.string().trim().min(1),
  description: z.string().trim().min(10, "10 caractères minimum"),
  images: z.string().trim().min(1, "Au moins une image"),
  featured: z.boolean(),
  active: z.boolean(),
});

export const agencySchema = z.object({
  name: z.string().trim().min(2),
  slug: z.string().trim().min(2).regex(/^[a-z0-9-]+$/),
  city: z.string().trim().min(2),
  address: z.string().trim().min(3),
  postalCode: z.string().trim().min(4).max(6),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  phone: z.string().trim().min(6),
  hours: z.string().trim().min(3),
  type: z.enum(["city", "airport", "station"]),
});

export const newsletterSchema = z.object({ email: z.string().trim().toLowerCase().email("Adresse e-mail invalide") });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type DriverInput = z.infer<typeof driverSchema>;
export type ReservationInput = z.infer<typeof reservationSchema>;
export type VehicleInput = z.infer<typeof vehicleSchema>;
export type AgencyInput = z.infer<typeof agencySchema>;
