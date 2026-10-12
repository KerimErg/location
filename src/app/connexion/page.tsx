import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    <AuthShell title="Bon retour parmi nous" subtitle="Connectez-vous pour gérer vos réservations.">
      <Suspense><LoginForm /></Suspense>
    </AuthShell>
  );
}
