"use server";

import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { reservationSchema, type ReservationInput } from "@/lib/validations";
import { quote } from "@/lib/pricing";
import { ACTIVE_STATUSES } from "@/lib/constants";

export type ActionResult = { ok: true; reference: string } | { ok: false; error: string };

const newReference = () => `TL-${randomBytes(5).toString("hex").toUpperCase()}`;

export async function createReservation(input: ReservationInput): Promise<ActionResult> {
  const parsed = reservationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Données invalides" };
  const d = parsed.data;
  const pickupAt = new Date(d.pickupAt);
  const returnAt = new Date(d.returnAt);
  if (returnAt <= pickupAt) return { ok: false, error: "Le retour doit être après le départ." };
  if (pickupAt.getTime() < Date.now() - 15 * 60_000) return { ok: false, error: "La date de départ est passée." };

  const session = await getSession();

  try {
    const reference = await prisma.$transaction(async (tx) => {
      const [vehicle, pickup, ret, extras] = await Promise.all([
        tx.vehicle.findUnique({ where: { id: d.vehicleId } }),
        tx.agency.findUnique({ where: { id: d.pickupAgencyId } }),
        tx.agency.findUnique({ where: { id: d.returnAgencyId } }),
        tx.extra.findMany({ where: { id: { in: d.extras.map((e) => e.id) } } }),
      ]);
      if (!vehicle?.active || !pickup || !ret) throw new Error("Véhicule ou agence introuvable.");

      const conflict = await tx.reservation.findFirst({
        where: { vehicleId: vehicle.id, status: { in: ACTIVE_STATUSES }, pickupAt: { lt: returnAt }, returnAt: { gt: pickupAt } },
      });
      if (conflict) throw new Error("Ce véhicule vient d'être réservé sur ces dates. Choisissez un autre véhicule.");

      // Prix recalculé côté serveur : le client n'envoie jamais de montant.
      const lines = extras.map((e) => ({ ...e, quantity: d.extras.find((x) => x.id === e.id)?.quantity ?? 0 }));
      const q = quote({ pricePerDay: vehicle.pricePerDay, pickupAt, returnAt, protection: d.protection, extras: lines, oneWay: pickup.id !== ret.id });

      const r = await tx.reservation.create({
        data: {
          reference: newReference(),
          status: "CONFIRMED",
          userId: session?.user.id ?? null,
          vehicleId: vehicle.id,
          pickupAgencyId: pickup.id,
          returnAgencyId: ret.id,
          pickupAt,
          returnAt,
          days: q.days,
          protection: d.protection,
          basePrice: q.basePrice,
          discount: q.discount,
          protectionPrice: q.protectionPrice,
          extrasPrice: q.extrasPrice,
          oneWayFee: q.oneWayFee,
          total: q.total,
          firstName: d.firstName,
          lastName: d.lastName,
          email: d.email,
          phone: d.phone,
          birthDate: new Date(d.birthDate),
          licenseNumber: d.licenseNumber.toUpperCase(),
          flightNumber: d.flightNumber || null,
          notes: d.notes || null,
          extras: { create: q.extrasLines.map((e) => ({ extraId: e.id, quantity: e.quantity, price: e.total })) },
        },
      });
      return r.reference;
    });
    revalidatePath("/compte");
    revalidatePath("/admin");
    return { ok: true, reference };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Une erreur est survenue." };
  }
}

/** Annulation gratuite jusqu'à 48 h avant le départ (client) — sans limite pour l'admin. */
export async function cancelReservation(id: string): Promise<{ ok: boolean; error?: string }> {
  const session = await getSession();
  if (!session?.user) return { ok: false, error: "Connectez-vous pour annuler." };
  const r = await prisma.reservation.findUnique({ where: { id } });
  if (!r) return { ok: false, error: "Réservation introuvable." };
  const isAdmin = session.user.role === "ADMIN";
  const owns = r.userId === session.user.id || r.email === session.user.email;
  if (!isAdmin && !owns) return { ok: false, error: "Action non autorisée." };
  if (!["PENDING", "CONFIRMED"].includes(r.status)) return { ok: false, error: "Cette réservation ne peut plus être annulée." };
  if (!isAdmin && r.pickupAt.getTime() - Date.now() < 48 * 3600_000)
    return { ok: false, error: "L'annulation en ligne n'est plus possible à moins de 48 h du départ. Contactez-nous." };
  await prisma.reservation.update({ where: { id }, data: { status: "CANCELLED" } });
  revalidatePath("/compte");
  revalidatePath("/admin/reservations");
  return { ok: true };
}
