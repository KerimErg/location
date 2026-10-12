import type { Protection } from "@prisma/client";
import { ONE_WAY_FEE, PROTECTIONS } from "./constants";

const HOUR = 3600 * 1000;

/** Nombre de jours facturés : tranches de 24h, avec 59 minutes de tolérance. */
export function rentalDays(pickupAt: Date, returnAt: Date) {
  const ms = returnAt.getTime() - pickupAt.getTime();
  if (ms <= 0) return 0;
  return Math.max(1, Math.ceil((ms - HOUR + 60_000) / (24 * HOUR)));
}

/** Tarif dégressif selon la durée. */
export function durationDiscountRate(days: number) {
  if (days >= 28) return 0.2;
  if (days >= 7) return 0.12;
  if (days >= 3) return 0.05;
  return 0;
}

export type ExtraLine = { id: string; code: string; name: string; price: number; pricing: "PER_DAY" | "PER_RENTAL"; maxPrice: number | null; quantity: number };

export function extraLinePrice(e: Pick<ExtraLine, "price" | "pricing" | "maxPrice" | "quantity">, days: number) {
  const unit = e.pricing === "PER_DAY" ? Math.min(e.price * days, e.maxPrice ?? Infinity) : e.price;
  return unit * e.quantity;
}

export function quote(input: {
  pricePerDay: number;
  pickupAt: Date;
  returnAt: Date;
  protection?: Protection;
  extras?: ExtraLine[];
  oneWay?: boolean;
}) {
  const days = rentalDays(input.pickupAt, input.returnAt);
  const basePrice = input.pricePerDay * days;
  const discount = Math.round(basePrice * durationDiscountRate(days));
  const prot = PROTECTIONS.find((p) => p.value === (input.protection ?? "BASIC"))!;
  const protectionPrice = prot.pricePerDay * days;
  const extrasLines = (input.extras ?? []).filter((e) => e.quantity > 0).map((e) => ({ ...e, total: extraLinePrice(e, days) }));
  const extrasPrice = extrasLines.reduce((s, e) => s + e.total, 0);
  const oneWayFee = input.oneWay ? ONE_WAY_FEE : 0;
  const total = basePrice - discount + protectionPrice + extrasPrice + oneWayFee;
  return { days, basePrice, discount, protectionPrice, extrasLines, extrasPrice, oneWayFee, total };
}
