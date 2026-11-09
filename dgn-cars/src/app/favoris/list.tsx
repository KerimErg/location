"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavorites } from "@/components/favorites";
import { VehicleCard, type CardVehicle } from "@/components/vehicles/vehicle-card";

export function FavoritesList({ vehicles }: { vehicles: CardVehicle[] }) {
  const { ids } = useFavorites();
  const list = vehicles.filter((v) => ids.includes(v.id));
  if (!list.length)
    return (
      <div className="flex flex-col items-center border border-dashed py-20 text-center">
        <Heart className="size-10 text-muted-foreground" strokeWidth={1.5} />
        <p className="mt-4 font-display text-2xl font-bold uppercase">Aucun favori pour l&apos;instant</p>
        <Link href="/stock" className="mt-4 underline">Parcourir le stock</Link>
      </div>
    );
  return <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{list.map((v) => <VehicleCard key={v.id} v={v} />)}</div>;
}
