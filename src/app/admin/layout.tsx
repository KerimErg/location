import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";

export const metadata: Metadata = { title: { default: "Administration", template: "%s · Admin TestLocation" }, robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="min-h-dvh bg-surface lg:flex">
      <AdminNav />
      <div className="min-w-0 flex-1 p-4 md:p-8">{children}</div>
    </div>
  );
}
