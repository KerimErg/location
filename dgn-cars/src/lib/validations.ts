import { z } from "zod";

const phone = z.string().trim().regex(/^\+?[\d\s./-]{8,18}$/, "Numéro de téléphone invalide");
const base = {
  name: z.string().trim().min(2, "Indiquez votre nom"),
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide"),
  phone,
  message: z.string().trim().max(1500).optional().or(z.literal("")),
  consent: z.literal(true, { message: "Merci d'accepter d'être recontacté" }),
};

export const testDriveSchema = z.object({
  ...base,
  vehicleId: z.string().min(1),
  preferredDate: z.string().min(1, "Choisissez une date"),
  preferredSlot: z.enum(["matin", "apres-midi", "soir"]),
});

export const tradeInSchema = z.object({
  ...base,
  plate: z.string().trim().toUpperCase().regex(/^[0-9A-Z]{1,3}-?[A-Z]{3}-?[0-9]{3}$|^[0-9A-Z-]{4,10}$/, "Plaque invalide (ex. 1-ABC-123)"),
  make: z.string().trim().min(2, "Marque requise"),
  model: z.string().trim().min(1, "Modèle requis"),
  year: z.coerce.number().int().min(1980, "Année invalide").max(new Date().getFullYear(), "Année invalide"),
  mileage: z.coerce.number().int().min(0).max(999999),
  fuel: z.string().min(1),
  condition: z.enum(["excellent", "bon", "moyen", "a-reparer"]),
});

export const financeSchema = z.object({
  ...base,
  vehicleId: z.string().optional(),
  amount: z.coerce.number().int().min(1000),
  deposit: z.coerce.number().int().min(0),
  months: z.coerce.number().int().min(12).max(84),
});

export const contactSchema = z.object({ ...base, subject: z.string().trim().min(2, "Objet requis") });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const vehicleSchema = z.object({
  make: z.string().trim().min(1, "Requis"),
  model: z.string().trim().min(1, "Requis"),
  version: z.string().trim().min(1, "Requis"),
  firstRegistration: z.string().regex(/^\d{4}-\d{2}$/, "Format AAAA-MM"),
  mileage: z.coerce.number().int().min(0),
  price: z.coerce.number().int().min(1, "Prix requis"),
  previousPrice: z.coerce.number().int().min(0).optional(),
  vatDeductible: z.boolean(),
  fuel: z.enum(["ESSENCE", "DIESEL", "HYBRIDE", "HYBRIDE_RECHARGEABLE", "ELECTRIQUE"]),
  gearbox: z.enum(["MANUELLE", "AUTOMATIQUE"]),
  body: z.enum(["CITADINE", "COMPACTE", "BERLINE", "BREAK", "SUV", "COUPE", "CABRIOLET", "MONOSPACE"]),
  powerKw: z.coerce.number().int().min(1),
  engineCc: z.coerce.number().int().min(0).optional(),
  euroNorm: z.string().trim().min(1),
  co2: z.coerce.number().int().min(0).optional(),
  doors: z.coerce.number().int().min(2).max(5),
  seats: z.coerce.number().int().min(1).max(9),
  color: z.string().trim().min(1),
  owners: z.coerce.number().int().min(1).max(9),
  carPass: z.boolean(),
  carPassUrl: z.string().trim().url("URL invalide").optional().or(z.literal("")),
  externalUrl: z.string().trim().url("URL invalide").optional().or(z.literal("")),
  warrantyMonths: z.coerce.number().int().min(0).max(36),
  options: z.string(),
  description: z.string().trim().min(10, "10 caractères minimum"),
  images: z.string(),
  status: z.enum(["DISPONIBLE", "RESERVE", "VENDU"]),
  featured: z.boolean(),
});

export type TestDriveInput = z.input<typeof testDriveSchema>;
export type TradeInInput = z.input<typeof tradeInSchema>;
export type FinanceInput = z.input<typeof financeSchema>;
export type ContactInput = z.input<typeof contactSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
