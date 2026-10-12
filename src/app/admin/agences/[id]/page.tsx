import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { AgencyForm } from "@/components/admin/agency-form";

export const metadata = { title: "Modifier une agence" };

export default async function EditAgencyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agency = await prisma.agency.findUnique({ where: { id } });
  if (!agency) notFound();
  return (
    <div className="max-w-4xl">
      <PageHeader title={agency.name} description="Modifier l'agence" />
      <AgencyForm agency={agency} />
    </div>
  );
}
