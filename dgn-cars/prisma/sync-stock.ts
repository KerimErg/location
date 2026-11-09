// Exécuté à chaque déploiement (vercel-build) :
// - crée le compte admin s'il n'existe pas ;
// - ajoute les véhicules du stock initial absents de la base (repérés par leur lien AutoScout24) ;
// - met à jour l'ordre d'affichage et la mise en avant de ces véhicules.
// Ne supprime ni ne modifie jamais le reste (prix, statut, textes édités dans l'admin).
import { PrismaClient, type Body, type Fuel, type Gearbox } from "@prisma/client";
import bcrypt from "bcryptjs";
import STOCK from "./data/stock-autoscout24.json";

const prisma = new PrismaClient();
const slugify = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function main() {
  if ((await prisma.admin.count()) === 0) {
    await prisma.admin.create({ data: { email: "admin@dgncars.be", name: "DGN Cars", passwordHash: await bcrypt.hash("Admin123!", 10) } });
    console.log("Compte admin créé.");
  }
  const last = await prisma.vehicle.findFirst({ orderBy: { reference: "desc" }, select: { reference: true } });
  let n = (Number(last?.reference.split("-")[1]) || 2400) + 1;
  let added = 0;
  for (const v of STOCK) {
    const { reg, ...data } = v;
    const existing = v.externalUrl ? await prisma.vehicle.findFirst({ where: { externalUrl: v.externalUrl }, select: { id: true } }) : null;
    if (existing) {
      await prisma.vehicle.update({ where: { id: existing.id }, data: { position: v.position, featured: v.featured } });
      continue;
    }
    const reference = `DGN-${n++}`;
    await prisma.vehicle.create({
      data: {
        ...data,
        fuel: v.fuel as Fuel,
        gearbox: v.gearbox as Gearbox,
        body: v.body as Body,
        reference,
        slug: `${slugify(`${v.make} ${v.model} ${v.version}`)}-${reference.toLowerCase()}`,
        firstRegistration: new Date(`${reg}-01T00:00:00Z`),
      },
    });
    added++;
  }
  console.log(`Stock synchronisé : ${added} véhicule(s) ajouté(s), ${STOCK.length - added} déjà présent(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
