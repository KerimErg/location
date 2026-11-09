-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Fuel" AS ENUM ('ESSENCE', 'DIESEL', 'HYBRIDE', 'HYBRIDE_RECHARGEABLE', 'ELECTRIQUE');

-- CreateEnum
CREATE TYPE "Gearbox" AS ENUM ('MANUELLE', 'AUTOMATIQUE');

-- CreateEnum
CREATE TYPE "Body" AS ENUM ('CITADINE', 'COMPACTE', 'BERLINE', 'BREAK', 'SUV', 'COUPE', 'CABRIOLET', 'MONOSPACE');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('DISPONIBLE', 'RESERVE', 'VENDU');

-- CreateEnum
CREATE TYPE "LeadType" AS ENUM ('ESSAI', 'REPRISE', 'FINANCEMENT', 'CONTACT');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NOUVEAU', 'EN_COURS', 'TRAITE', 'ARCHIVE');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "firstRegistration" TIMESTAMP(3) NOT NULL,
    "mileage" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "previousPrice" INTEGER,
    "vatDeductible" BOOLEAN NOT NULL DEFAULT false,
    "fuel" "Fuel" NOT NULL,
    "gearbox" "Gearbox" NOT NULL,
    "body" "Body" NOT NULL,
    "powerKw" INTEGER NOT NULL,
    "engineCc" INTEGER,
    "euroNorm" TEXT NOT NULL,
    "co2" INTEGER,
    "doors" INTEGER NOT NULL,
    "seats" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "owners" INTEGER NOT NULL DEFAULT 1,
    "carPass" BOOLEAN NOT NULL DEFAULT true,
    "warrantyMonths" INTEGER NOT NULL DEFAULT 12,
    "options" TEXT[],
    "description" TEXT NOT NULL,
    "images" TEXT[],
    "status" "VehicleStatus" NOT NULL DEFAULT 'DISPONIBLE',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "type" "LeadType" NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'NOUVEAU',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "message" TEXT,
    "preferredDate" TIMESTAMP(3),
    "vehicleId" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_slug_key" ON "Vehicle"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_reference_key" ON "Vehicle"("reference");

-- CreateIndex
CREATE INDEX "Vehicle_status_make_idx" ON "Vehicle"("status", "make");

-- CreateIndex
CREATE INDEX "Lead_status_createdAt_idx" ON "Lead"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

