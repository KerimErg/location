import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Créer un compte" };

export default function RegisterPage() {
  return (
    <AuthShell title="Créer un compte" subtitle="Réservez plus vite et suivez toutes vos locations.">
      <Suspense><RegisterForm /></Suspense>
    </AuthShell>
  );
}
