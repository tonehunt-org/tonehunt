-- CreateTable
CREATE TABLE "Counts" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "Counts_pkey" PRIMARY KEY ("id")
);
