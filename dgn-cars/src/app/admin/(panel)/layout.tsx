import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = { title: { default: "Gestion", template: "%s · Gestion DGN Cars" }, robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const newLeads = await prisma.lead.count({ where: { status: "NOUVEAU" } });
  return (
    <div className="min-h-dvh lg:flex">
      <AdminNav newLeads={newLeads} />
      <div className="min-w-0 flex-1 p-4 md:p-8">{children}</div>
    </div>
  );
}
