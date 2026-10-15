import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { CATEGORIES, PRODUITS } from "@/data/menu";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.url) return [];
  const u = (p: string) => `${site.url}${p}`;
  return [
    { url: u("/"), changeFrequency: "weekly", priority: 1 },
    { url: u("/carte/"), changeFrequency: "weekly", priority: 0.9 },
    ...CATEGORIES.map((c) => ({ url: u(`/carte/${c.id}/`), priority: 0.8 })),
    ...PRODUITS.map((p) => ({ url: u(`/carte/${p.categorie}/${p.id}/`), priority: 0.6 })),
  ];
}
