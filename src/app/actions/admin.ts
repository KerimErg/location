"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ReservationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { agencySchema, vehicleSchema } from "@/lib/validations";

export type FormState = { error?: string; fieldErrors?: Record<string, string> };

async function assertAdmin() {
  const session = await getSession();
  if (session?.user.role !== "ADMIN") throw new Error("Accès réservé aux administrateurs.");
}

const fieldErrors = (issues: { path: PropertyKey[]; message: string }[]) =>
  Object.fromEntries(issues.map((i) => [String(i.path[0]), i.message]));

export async function saveVehicle(id: string | null, _: FormState, formData: FormData): Promise<FormState> {
  await assertAdmin();
  const raw = Object.fromEntries(formData);
  const parsed = vehicleSchema.safeParse({ ...raw, featured: raw.featured === "on", active: raw.active === "on" });
  if (!parsed.success) return { error: "Certains champs sont invalides.", fieldErrors: fieldErrors(parsed.error.issues) };
  const images = parsed.data.images.split(/\n|,/).map((s) => s.trim()).filter(Boolean);
  const data = { ...parsed.data, images: JSON.stringify(images) };
  const clash = await prisma.vehicle.findFirst({ where: { slug: data.slug, ...(id && { id: { not: id } }) } });
  if (clash) return { error: "Ce slug est déjà utilisé.", fieldErrors: { slug: "Slug déjà utilisé" } };
  if (id) await prisma.vehicle.update({ where: { id }, data });
  else await prisma.vehicle.create({ data });
  revalidatePath("/", "layout");
  redirect("/admin/vehicules");
}

export async function toggleVehicle(id: string, active: boolean) {
  await assertAdmin();
  await prisma.vehicle.update({ where: { id }, data: { active } });
  revalidatePath("/", "layout");
}

export async function deleteVehicle(id: string): Promise<{ ok: boolean; error?: string }> {
  await assertAdmin();
  if (await prisma.reservation.count({ where: { vehicleId: id } }))
    return { ok: false, error: "Ce véhicule a des réservations : désactivez-le plutôt que de le supprimer." };
  await prisma.vehicle.delete({ where: { id } });
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function saveAgency(id: string | null, _: FormState, formData: FormData): Promise<FormState> {
  await assertAdmin();
  const parsed = agencySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Certains champs sont invalides.", fieldErrors: fieldErrors(parsed.error.issues) };
  const clash = await prisma.agency.findFirst({ where: { slug: parsed.data.slug, ...(id && { id: { not: id } }) } });
  if (clash) return { error: "Ce slug est déjà utilisé.", fieldErrors: { slug: "Slug déjà utilisé" } };
  if (id) await prisma.agency.update({ where: { id }, data: parsed.data });
  else await prisma.agency.create({ data: parsed.data });
  revalidatePath("/", "layout");
  redirect("/admin/agences");
}

export async function updateReservationStatus(id: string, status: ReservationStatus) {
  await assertAdmin();
  await prisma.reservation.update({ where: { id }, data: { status } });
  revalidatePath("/admin", "layout");
  revalidatePath("/compte");
}
