// Exécuté au déploiement (vercel-build) : remplit la base uniquement si elle est vide.
// Ne touche jamais à une base qui contient déjà des véhicules.
import { PrismaClient } from "@prisma/client";
import { execSync } from "node:child_process";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.vehicle.count();
  await prisma.$disconnect();
  if (count > 0) {
    console.log(`Base déjà remplie (${count} véhicules) : aucun chargement.`);
    return;
  }
  console.log("Base vide : chargement du stock initial et du compte admin…");
  execSync("tsx prisma/seed.ts", { stdio: "inherit" });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
