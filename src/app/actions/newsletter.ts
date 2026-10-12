"use server";

import { prisma } from "@/lib/prisma";
import { newsletterSchema } from "@/lib/validations";

export type NewsletterState = { ok?: boolean; message?: string };

export async function subscribeNewsletter(_: NewsletterState, formData: FormData): Promise<NewsletterState> {
  const parsed = newsletterSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0].message };
  await prisma.newsletterSubscriber.upsert({ where: { email: parsed.data.email }, update: {}, create: { email: parsed.data.email } });
  return { ok: true, message: "Merci ! Vos offres exclusives arrivent bientôt dans votre boîte mail." };
}
