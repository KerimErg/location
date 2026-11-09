import type { Body, Fuel, Gearbox, LeadStatus, LeadType, VehicleStatus } from "@prisma/client";

export const FUEL: Record<Fuel, string> = {
  ESSENCE: "Essence",
  DIESEL: "Diesel",
  HYBRIDE: "Hybride",
  HYBRIDE_RECHARGEABLE: "Hybride rechargeable",
  ELECTRIQUE: "Électrique",
};
export const GEARBOX: Record<Gearbox, string> = { MANUELLE: "Manuelle", AUTOMATIQUE: "Automatique" };
export const BODY: Record<Body, string> = {
  CITADINE: "Citadine",
  COMPACTE: "Compacte",
  BERLINE: "Berline",
  BREAK: "Break",
  SUV: "SUV",
  COUPE: "Coupé",
  CABRIOLET: "Cabriolet",
  MONOSPACE: "Monospace",
};
export const STATUS: Record<VehicleStatus, string> = { DISPONIBLE: "Disponible", RESERVE: "Réservé", VENDU: "Vendu" };
export const LEAD_TYPE: Record<LeadType, string> = { ESSAI: "Essai / visite", REPRISE: "Reprise", FINANCEMENT: "Financement", CONTACT: "Contact" };
export const LEAD_STATUS: Record<LeadStatus, string> = { NOUVEAU: "Nouveau", EN_COURS: "En cours", TRAITE: "Traité", ARCHIVE: "Archivé" };

export const kwToHp = (kw: number) => Math.round(kw * 1.35962);
