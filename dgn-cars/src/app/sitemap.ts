import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { SITE } from "@/config/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vehicles = await prisma.vehicle.findMany({ where: { status: { not: "VENDU" } }, select: { slug: true, updatedAt: true } });
  const pages = ["", "/stock", "/reprise", "/financement", "/garage", "/contact"].map((p) => ({ url: `${SITE.url}${p}`, priority: p ? 0.7 : 1 }));
  return [...pages, ...vehicles.map((v) => ({ url: `${SITE.url}/stock/${v.slug}`, lastModified: v.updatedAt, priority: 0.8 }))];
}
