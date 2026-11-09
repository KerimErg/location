"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { contactSchema, financeSchema, testDriveSchema, tradeInSchema, type ContactInput, type FinanceInput, type TestDriveInput, type TradeInInput } from "@/lib/validations";

export type LeadResult = { ok: true } | { ok: false; error: string };

const fail = (e: { issues: { message: string }[] }): LeadResult => ({ ok: false, error: e.issues[0]?.message ?? "Formulaire invalide" });
// Champ piège invisible : rempli uniquement par les robots.
const isBot = (hp?: string) => !!hp && hp.trim().length > 0;

export async function requestTestDrive(input: TestDriveInput & { website?: string }): Promise<LeadResult> {
  if (isBot(input.website)) return { ok: true };
  const parsed = testDriveSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error);
  const d = parsed.data;
  const vehicle = await prisma.vehicle.findUnique({ where: { id: d.vehicleId } });
  if (!vehicle) return { ok: false, error: "Véhicule introuvable." };
  if (vehicle.status === "VENDU") return { ok: false, error: "Ce véhicule vient d'être vendu." };
  await prisma.lead.create({
    data: { type: "ESSAI", name: d.name, email: d.email, phone: d.phone, message: d.message || null, vehicleId: vehicle.id, preferredDate: new Date(d.preferredDate), details: { creneau: d.preferredSlot } },
  });
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function requestTradeIn(input: TradeInInput & { website?: string }): Promise<LeadResult> {
  if (isBot(input.website)) return { ok: true };
  const parsed = tradeInSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error);
  const { name, email, phone, message, consent, ...car } = parsed.data;
  void consent;
  await prisma.lead.create({ data: { type: "REPRISE", name, email, phone, message: message || null, details: car } });
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function requestFinance(input: FinanceInput & { website?: string }): Promise<LeadResult> {
  if (isBot(input.website)) return { ok: true };
  const parsed = financeSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error);
  const { name, email, phone, message, consent, vehicleId, ...sim } = parsed.data;
  void consent;
  const vehicle = vehicleId ? await prisma.vehicle.findUnique({ where: { id: vehicleId }, select: { id: true } }) : null;
  await prisma.lead.create({ data: { type: "FINANCEMENT", name, email, phone, message: message || null, vehicleId: vehicle?.id ?? null, details: sim } });
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function sendContact(input: ContactInput & { website?: string }): Promise<LeadResult> {
  if (isBot(input.website)) return { ok: true };
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error);
  const { name, email, phone, message, subject } = parsed.data;
  await prisma.lead.create({ data: { type: "CONTACT", name, email, phone, message: message || null, details: { objet: subject } } });
  revalidatePath("/admin", "layout");
  return { ok: true };
}
