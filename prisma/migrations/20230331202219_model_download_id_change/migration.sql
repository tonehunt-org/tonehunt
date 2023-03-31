/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `ModelDownload` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ModelDownload" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "ModelDownload_id_seq";

-- CreateIndex
CREATE INDEX "ModelDownload_id_idx" ON "ModelDownload"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ModelDownload_id_key" ON "ModelDownload"("id");
