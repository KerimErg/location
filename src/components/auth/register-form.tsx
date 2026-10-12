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
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { registerUser } from "@/app/actions/auth";

const FIELDS = [
  ["name", "Nom complet", "text", "name"],
  ["email", "E-mail", "email", "email"],
  ["phone", "Téléphone (optionnel)", "tel", "tel"],
  ["password", "Mot de passe", "password", "new-password"],
  ["confirm", "Confirmer le mot de passe", "password", "new-password"],
] as const;

export function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get("callbackUrl") ?? "/compte";
  const callbackUrl = raw.startsWith("/") && !raw.startsWith("//") ? raw : "/compte";
  const [error, setError] = useState<string>();
  const form = useForm<RegisterInput>({ resolver: zodResolver(registerSchema), defaultValues: { name: "", email: "", phone: "", password: "", confirm: "" } });
  const { errors, isSubmitting } = form.formState;

  const onSubmit = form.handleSubmit(async (data) => {
    setError(undefined);
    const res = await registerUser(data);
    if (!res.ok) return setError(res.error);
    await signIn("credentials", { email: data.email, password: data.password, redirect: false });
    router.push(callbackUrl);
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {FIELDS.map(([name, label, type, ac]) => (
        <div key={name}>
          <Label htmlFor={name} className="mb-2">{label}</Label>
          <Input id={name} type={type} autoComplete={ac} aria-invalid={!!errors[name]} {...form.register(name)} />
          {errors[name] && <p className="mt-1.5 text-xs text-destructive">{errors[name]?.message}</p>}
        </div>
      ))}
      <p className="text-xs text-muted-foreground">8 caractères minimum, dont une majuscule et un chiffre.</p>
      {error && <p className="rounded-xl bg-destructive/10 p-3 text-sm font-medium text-destructive">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Création…" : "Créer mon compte"}</Button>
      <p className="text-center text-sm text-muted-foreground">
        Déjà inscrit ? <Link href={`/connexion?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="font-medium text-primary hover:underline">Se connecter</Link>
      </p>
    </form>
  );
}
