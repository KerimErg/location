"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/forms/fields";
import { loginSchema, type LoginInput } from "@/lib/validations";

export default function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const form = useForm<LoginInput>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });
  const { errors, isSubmitting } = form.formState;
  return (
    <div className="flex min-h-dvh items-center justify-center bg-ink px-4">
      <form
        noValidate
        className="w-full max-w-sm border bg-card p-8"
        onSubmit={form.handleSubmit(async (d) => {
          setError(undefined);
          const res = await signIn("credentials", { ...d, redirect: false });
          if (res?.error) return setError("Identifiants incorrects.");
          router.push("/admin");
          router.refresh();
        })}
      >
        <Logo onLight />
        <h1 className="mt-8 text-4xl">Espace gestion</h1>
        <div className="mt-6 grid gap-4">
          <Field label="E-mail" htmlFor="email" error={errors.email?.message}><Input id="email" type="email" autoComplete="email" {...form.register("email")} /></Field>
          <Field label="Mot de passe" htmlFor="password" error={errors.password?.message}><Input id="password" type="password" autoComplete="current-password" {...form.register("password")} /></Field>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <Button type="submit" disabled={isSubmitting} className="bg-signal text-signal-foreground">{isSubmitting ? "Connexion…" : "Se connecter"}</Button>
        </div>
      </form>
    </div>
  );
}
