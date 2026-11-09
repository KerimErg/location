import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminTitle } from "@/components/admin/admin-title";
import { VehicleForm } from "@/components/admin/vehicle-form";

export const metadata = { title: "Modifier un véhicule" };

export default async function EditVehicle({ params }: { params: Promise<{ id: string }> }) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: (await params).id } });
  if (!vehicle) notFound();
  return (
    <div className="max-w-5xl">
      <AdminTitle title={`${vehicle.make} ${vehicle.model}`} sub={`${vehicle.reference} · ${vehicle.version}`} />
      <VehicleForm vehicle={vehicle} />
    </div>
  );
}
