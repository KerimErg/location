import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { loginSchema } from "./validations";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 7 * 24 * 3600 },
  pages: { signIn: "/admin/connexion" },
  providers: [
    CredentialsProvider({
      name: "Identifiants",
      credentials: { email: { type: "email" }, password: { type: "password" } },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;
        const admin = await prisma.admin.findUnique({ where: { email: parsed.data.email } });
        if (!admin || !(await bcrypt.compare(parsed.data.password, admin.passwordHash))) return null;
        return { id: admin.id, email: admin.email, name: admin.name };
      },
    }),
  ],
};

export const getSession = () => getServerSession(authOptions);

export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user) redirect("/admin/connexion");
  return session.user;
}
