import { cache } from "react";
import { prisma } from "./prisma";

export const getAgencies = cache(() => prisma.agency.findMany({ orderBy: [{ city: "asc" }, { name: "asc" }] }));

export const getAgencyOptions = cache(async () =>
  (await getAgencies()).map((a) => ({ slug: a.slug, name: a.name, city: a.city, type: a.type })),
);
