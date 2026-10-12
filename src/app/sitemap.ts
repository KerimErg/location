import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const vehicles = await prisma.vehicle.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } });
  return [
    { url: base, priority: 1 },
    { url: `${base}/vehicules`, priority: 0.9 },
    { url: `${base}/agences`, priority: 0.7 },
    ...vehicles.map((v) => ({ url: `${base}/vehicules/${v.slug}`, lastModified: v.updatedAt, priority: 0.8 })),
  ];
}
