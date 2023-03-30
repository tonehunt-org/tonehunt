/*
  Warnings:

  - The primary key for the `Counts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Counts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Counts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Counts_id_name_key";

-- AlterTable
ALTER TABLE "Counts" DROP CONSTRAINT "Counts_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Counts_pkey" PRIMARY KEY ("name");

-- CreateIndex
CREATE UNIQUE INDEX "Counts_name_key" ON "Counts"("name");
