/*
  Warnings:

  - The primary key for the `ModelDownload` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "ModelDownload" DROP CONSTRAINT "ModelDownload_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ModelDownload_pkey" PRIMARY KEY ("id");
