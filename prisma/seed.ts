import { PrismaClient, type Category, type Fuel, type Transmission } from "@prisma/client";
import bcrypt from "bcryptjs";
import vehicles from "./data/vehicles.json";
import agencies from "./data/agencies.json";

const prisma = new PrismaClient();

const extras = [
  { code: "GPS", name: "GPS connecté", description: "Navigation avec trafic en temps réel.", price: 7, pricing: "PER_DAY", maxPrice: 70, icon: "Navigation", order: 1 },
  { code: "DRIVER", name: "Conducteur additionnel", description: "Partagez le volant en toute sérénité.", price: 9, pricing: "PER_DAY", maxPrice: 90, icon: "UserPlus", order: 2 },
  { code: "BABY", name: "Siège bébé", description: "Homologué i-Size, de 0 à 13 kg.", price: 8, pricing: "PER_DAY", maxPrice: 60, icon: "Baby", order: 3 },
  { code: "BOOSTER", name: "Rehausseur", description: "Pour les enfants de 15 à 36 kg.", price: 5, pricing: "PER_DAY", maxPrice: 40, icon: "Armchair", order: 4 },
  { code: "SNOW", name: "Chaînes neige", description: "Obligatoires en zone montagne l'hiver.", price: 29, pricing: "PER_RENTAL", maxPrice: null, icon: "Snowflake", order: 5 },
  { code: "WIFI", name: "Wi-Fi 4G embarqué", description: "Internet illimité pour tous les passagers.", price: 6, pricing: "PER_DAY", maxPrice: 60, icon: "Wifi", order: 6 },
] as const;

const reviews = [
  { author: "Camille R.", city: "Lyon", rating: 5, comment: "Réservation en deux minutes, véhicule impeccable et retour express. Je ne loue plus ailleurs.", vehicle: "Atlas SUV" },
  { author: "Thomas B.", city: "Paris", rating: 5, comment: "Le Vortex GT pour notre anniversaire de mariage : une expérience exceptionnelle, accueil aux petits soins.", vehicle: "Vortex GT" },
  { author: "Inès M.", city: "Marseille", rating: 4, comment: "Très bon rapport qualité-prix, l'application est fluide. Petite attente à l'agence un samedi matin.", vehicle: "Nova City" },
  { author: "Julien D.", city: "Bordeaux", rating: 5, comment: "Déménagement avec le Cargo Pro 20 m³, nickel. Tarif clair, aucune mauvaise surprise au retour.", vehicle: "Cargo Pro 20 m³" },
  { author: "Sarah K.", city: "Nice", rating: 5, comment: "La Volt E est un bonheur à conduire. Recharge complète au départ, conseils au top.", vehicle: "Volt E" },
  { author: "Marc L.", city: "Lille", rating: 5, comment: "Annulation gratuite très pratique quand mon vol a été décalé. Service client réactif 24/7.", vehicle: "Strada Sedan" },
];

async function main() {
  await prisma.reservationExtra.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.extra.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.agency.deleteMany();
  await prisma.review.deleteMany();
  await prisma.user.deleteMany();

  const [admin, client] = await Promise.all([
    prisma.user.create({
      data: { email: "admin@testlocation.fr", name: "Admin TestLocation", role: "ADMIN", passwordHash: await bcrypt.hash("Admin123!", 10) },
    }),
    prisma.user.create({
      data: { email: "client@testlocation.fr", name: "Claire Martin", phone: "06 12 34 56 78", passwordHash: await bcrypt.hash("Client123!", 10) },
    }),
  ]);

  for (const a of agencies) await prisma.agency.create({ data: a });
  for (const e of extras) await prisma.extra.create({ data: { ...e } });
  for (const v of vehicles) {
    const { type: _type, ...rest } = v;
    await prisma.vehicle.create({
      data: {
        ...rest,
        category: v.category as Category,
        transmission: v.transmission as Transmission,
        fuel: v.fuel as Fuel,
        deposit: v.pricePerDay > 150 ? 2500 : v.pricePerDay > 80 ? 1200 : 800,
        images: JSON.stringify(["front34", "side", "rear34"].map((view) => `/vehicles/${v.slug}-${view}.png`)),
      },
    });
  }
  for (const r of reviews) await prisma.review.create({ data: r });

  // Quelques réservations de démonstration
  const allVehicles = await prisma.vehicle.findMany();
  const allAgencies = await prisma.agency.findMany();
  const day = 24 * 3600 * 1000;
  const base = new Date();
  base.setHours(10, 0, 0, 0);
  const demo = [
    { offset: -20, days: 4, status: "COMPLETED" as const },
    { offset: -2, days: 5, status: "ONGOING" as const },
    { offset: 6, days: 3, status: "CONFIRMED" as const },
    { offset: 14, days: 7, status: "CONFIRMED" as const },
    { offset: 3, days: 2, status: "PENDING" as const },
    { offset: -40, days: 3, status: "CANCELLED" as const },
  ];
  let i = 0;
  for (const d of demo) {
    const v = allVehicles[(i * 5) % allVehicles.length];
    const ag = allAgencies[i % allAgencies.length];
    const pickupAt = new Date(base.getTime() + d.offset * day);
    const returnAt = new Date(pickupAt.getTime() + d.days * day);
    const basePrice = v.pricePerDay * d.days;
    await prisma.reservation.create({
      data: {
        reference: `TL-${(482910 + i * 7331).toString(36).toUpperCase()}`,
        status: d.status,
        userId: i % 2 === 0 ? client.id : null,
        vehicleId: v.id,
        pickupAgencyId: ag.id,
        returnAgencyId: ag.id,
        pickupAt,
        returnAt,
        days: d.days,
        basePrice,
        total: basePrice,
        firstName: i % 2 === 0 ? "Claire" : "Hugo",
        lastName: i % 2 === 0 ? "Martin" : "Bernard",
        email: i % 2 === 0 ? client.email : "hugo.bernard@example.com",
        phone: "06 12 34 56 78",
        birthDate: new Date("1990-04-12"),
        licenseNumber: `12AB${34567 + i}`,
      },
    });
    i++;
  }

  console.log(`Seed OK — admin: ${admin.email} / Admin123! · client: ${client.email} / Client123!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
