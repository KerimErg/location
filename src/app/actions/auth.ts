"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema, type RegisterInput } from "@/lib/validations";

export async function registerUser(input: RegisterInput): Promise<{ ok: boolean; error?: string }> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message };
  const { name, email, phone, password } = parsed.data;
  if (await prisma.user.findUnique({ where: { email } })) return { ok: false, error: "Un compte existe déjà avec cet e-mail." };
  await prisma.user.create({ data: { name, email, phone: phone || null, passwordHash: await bcrypt.hash(password, 10) } });
  return { ok: true };
}
