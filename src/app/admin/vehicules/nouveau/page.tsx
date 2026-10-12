import { PageHeader } from "@/components/admin/page-header";
import { VehicleForm } from "@/components/admin/vehicle-form";

export const metadata = { title: "Nouveau véhicule" };

export default function NewVehiclePage() {
  return (
    <div className="max-w-4xl">
      <PageHeader title="Nouveau véhicule" />
      <VehicleForm />
    </div>
  );
}
