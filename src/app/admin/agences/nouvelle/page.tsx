import { PageHeader } from "@/components/admin/page-header";
import { AgencyForm } from "@/components/admin/agency-form";

export const metadata = { title: "Nouvelle agence" };

export default function NewAgencyPage() {
  return (
    <div className="max-w-4xl">
      <PageHeader title="Nouvelle agence" />
      <AgencyForm />
    </div>
  );
}
