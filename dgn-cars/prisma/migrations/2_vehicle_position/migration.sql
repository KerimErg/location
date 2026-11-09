-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 1000;

-- CreateIndex
CREATE INDEX "Vehicle_position_idx" ON "Vehicle"("position");
