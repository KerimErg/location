import { prisma } from "./prisma";
import { ACTIVE_STATUSES } from "./constants";

/** Ids des véhicules déjà réservés sur la période [pickupAt, returnAt). */
export async function unavailableVehicleIds(pickupAt: Date, returnAt: Date, excludeReservationId?: string) {
  const rows = await prisma.reservation.findMany({
    where: {
      status: { in: ACTIVE_STATUSES },
      pickupAt: { lt: returnAt },
      returnAt: { gt: pickupAt },
      ...(excludeReservationId ? { id: { not: excludeReservationId } } : {}),
    },
    select: { vehicleId: true },
  });
  return new Set(rows.map((r) => r.vehicleId));
}

export async function isVehicleAvailable(vehicleId: string, pickupAt: Date, returnAt: Date) {
  return !(await unavailableVehicleIds(pickupAt, returnAt)).has(vehicleId);
}
