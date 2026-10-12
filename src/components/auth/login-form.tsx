"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, type LoginInput } from "@/lib/validations";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get("callbackUrl") ?? "/compte";
  const callbackUrl = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/compte";
  const [error, setError] = useState<string>();
  const form = useForm<LoginInput>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });
  const { errors, isSubmitting } = form.formState;

  const onSubmit = form.handleSubmit(async (data) => {
    setError(undefined);
    const res = await signIn("credentials", { ...data, redirect: false });
    if (res?.error) return setError("E-mail ou mot de passe incorrect.");
    router.push(callbackUrl);
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <Label htmlFor="email" className="mb-2">E-mail</Label>
        <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...form.register("email")} />
        {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="password" className="mb-2">Mot de passe</Label>
        <Input id="password" type="password" autoComplete="current-password" aria-invalid={!!errors.password} {...form.register("password")} />
        {errors.password && <p className="mt-1.5 text-xs text-destructive">{errors.password.message}</p>}
      </div>
      {error && <p className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Connexion…" : "Se connecter"}</Button>
      <p className="text-center text-sm text-muted-foreground">
        Pas encore de compte ? <Link href={`/inscription?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-medium text-primary hover:underline">Créer un compte</Link>
      </p>
      <div className="rounded-2xl border border-dashed p-4 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">Comptes de démonstration</p>
        <p className="mt-1">Client : client@testlocation.fr / Client123!</p>
        <p>Admin : admin@testlocation.fr / Admin123!</p>
      </div>
    </form>
  );
}
