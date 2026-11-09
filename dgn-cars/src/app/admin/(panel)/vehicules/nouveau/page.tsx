import { AdminTitle } from "@/components/admin/admin-title";
import { VehicleForm } from "@/components/admin/vehicle-form";

export const metadata = { title: "Nouveau véhicule" };

export default function NewVehicle() {
  return (
    <div className="max-w-5xl">
      <AdminTitle title="Nouveau véhicule" sub="La référence de stock est attribuée automatiquement." />
      <VehicleForm />
    </div>
  );
}
