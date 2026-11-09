import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FavoritesList } from "./list";

export const metadata: Metadata = { title: "Mes favoris", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const vehicles = await prisma.vehicle.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="container-page pt-10 pb-24 md:pt-14">
      <p className="eyebrow">Sélection</p>
      <h1 className="mt-3 text-5xl md:text-7xl">Mes favoris</h1>
      <p className="mt-3 mb-10 text-muted-foreground">Enregistrés sur cet appareil. Cliquez sur le cœur d&apos;une annonce pour l&apos;ajouter.</p>
      <FavoritesList vehicles={vehicles} />
    </div>
  );
}
