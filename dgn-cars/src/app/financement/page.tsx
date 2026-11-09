import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PHOTOS } from "@/config/photos";
import { PageHeader } from "@/components/page-header";
import { FinanceSimulator } from "@/components/forms/finance-simulator";

export const metadata: Metadata = { title: "Financement", description: "Simulez la mensualité de votre voiture d'occasion : prêt à tempérament de 24 à 72 mois." };

export default async function FinancePage({ searchParams }: { searchParams: Promise<{ vehicule?: string }> }) {
  const { vehicule } = await searchParams;
  const v = vehicule ? await prisma.vehicle.findUnique({ where: { id: vehicule } }) : null;
  return (
    <>
      <PageHeader eyebrow="Services · Financement" title={<>Financer votre<br />voiture</>} image={PHOTOS.engine} imageAlt="Compartiment moteur, capot ouvert">
        Prêt à tempérament de 24 à 72 mois avec nos partenaires financiers. Estimez votre mensualité, on s&apos;occupe du dossier.
      </PageHeader>
      <div className="container-page py-16 lg:py-20">
        <FinanceSimulator initialPrice={v?.price ?? 7500} vehicleId={v?.id} vehicleName={v ? `${v.make} ${v.model} ${v.version}` : undefined} />
      </div>
    </>
  );
}
