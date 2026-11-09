"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { LeadStatus, VehicleStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { vehicleSchema } from "@/lib/validations";

export type FormState = { error?: string; fieldErrors?: Record<string, string> };

async function assertAdmin() {
  if (!(await getSession())?.user) throw new Error("Accès réservé.");
}

const slugify = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const lines = (s: string) => s.split(/\n/).map((x) => x.trim()).filter(Boolean);

export async function saveVehicle(id: string | null, _: FormState, fd: FormData): Promise<FormState> {
  await assertAdmin();
  const raw = Object.fromEntries(fd);
  const opt = (k: string) => (raw[k] === "" ? undefined : raw[k]);
  const parsed = vehicleSchema.safeParse({
    ...raw,
    previousPrice: opt("previousPrice"),
    engineCc: opt("engineCc"),
    co2: opt("co2"),
    vatDeductible: raw.vatDeductible === "on",
    carPass: raw.carPass === "on",
    featured: raw.featured === "on",
  });
  if (!parsed.success) return { error: "Certains champs sont invalides.", fieldErrors: Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])) };
  const { firstRegistration, options, images, ...d } = parsed.data;
  const data = {
    ...d,
    previousPrice: d.previousPrice || null,
    engineCc: d.engineCc || null,
    co2: d.co2 ?? null,
    firstRegistration: new Date(`${firstRegistration}-01T00:00:00Z`),
    options: lines(options),
    images: lines(images),
  };
  if (id) {
    await prisma.vehicle.update({ where: { id }, data });
  } else {
    const last = await prisma.vehicle.findFirst({ orderBy: { reference: "desc" }, select: { reference: true } });
    const reference = `DGN-${(Number(last?.reference.split("-")[1]) || 2400) + 1}`;
    await prisma.vehicle.create({ data: { ...data, reference, slug: `${slugify(`${d.make} ${d.model} ${d.version}`)}-${reference.toLowerCase()}` } });
  }
  revalidatePath("/", "layout");
  redirect("/admin/vehicules");
}

export async function setVehicleStatus(id: string, status: VehicleStatus) {
  await assertAdmin();
  await prisma.vehicle.update({ where: { id }, data: { status } });
  revalidatePath("/", "layout");
}

export async function deleteVehicle(id: string) {
  await assertAdmin();
  await prisma.vehicle.delete({ where: { id } });
  revalidatePath("/", "layout");
}

export async function setLeadStatus(id: string, status: LeadStatus) {
  await assertAdmin();
  await prisma.lead.update({ where: { id }, data: { status } });
  revalidatePath("/admin", "layout");
}
