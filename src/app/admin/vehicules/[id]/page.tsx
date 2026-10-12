import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { VehicleForm } from "@/components/admin/vehicle-form";

export const metadata = { title: "Modifier un véhicule" };

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) notFound();
  return (
    <div className="max-w-4xl">
      <PageHeader title={vehicle.name} description="Modifier le véhicule" />
      <VehicleForm vehicle={vehicle} />
    </div>
  );
}
