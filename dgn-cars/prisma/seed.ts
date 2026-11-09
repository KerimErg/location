import { PrismaClient, type Body, type Fuel, type Gearbox } from "@prisma/client";
import bcrypt from "bcryptjs";
import STOCK from "./data/stock-autoscout24.json";

const prisma = new PrismaClient();

const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function main() {
  await prisma.lead.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.admin.deleteMany();

  await prisma.admin.create({ data: { email: "admin@dgncars.be", name: "DGN Cars", passwordHash: await bcrypt.hash("Admin123!", 10) } });

  // Stock réel relevé sur la fiche AutoScout24 de DGN Cars.
  let n = 2401;
  for (const v of STOCK) {
    const { reg, ...rest } = v;
    const reference = `DGN-${n++}`;
    await prisma.vehicle.create({
      data: {
        ...rest,
        fuel: v.fuel as Fuel,
        gearbox: v.gearbox as Gearbox,
        body: v.body as Body,
        reference,
        slug: `${slugify(`${v.make} ${v.model} ${v.version}`)}-${reference.toLowerCase()}`,
        firstRegistration: new Date(`${reg}-01T00:00:00Z`),
      },
    });
  }

  const first = await prisma.vehicle.findFirstOrThrow({ where: { featured: true } });
  await prisma.lead.createMany({
    data: [
      { type: "ESSAI", name: "Exemple — demande d'essai", email: "exemple@example.com", phone: "+32 470 00 00 00", vehicleId: first.id, preferredDate: new Date(Date.now() + 3 * 864e5), message: "Données de démonstration." },
      { type: "REPRISE", name: "Exemple — reprise", email: "exemple2@example.com", phone: "+32 470 00 00 01", details: { plaque: "1-ABC-123", marque: "Peugeot", modele: "308", annee: 2016, km: 142000 }, message: "Données de démonstration." },
    ],
  });

  console.log(`Seed OK — ${STOCK.length} véhicules · admin : admin@dgncars.be / Admin123!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
