-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Favorite" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Model" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "link" VARCHAR(255);

-- AlterTable
ALTER TABLE "ModelDownload" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;
