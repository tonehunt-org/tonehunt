/*
  Warnings:

  - A unique constraint covering the columns `[profileId,targetId]` on the table `Follow` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Follow_profileId_targetId_key" ON "Follow"("profileId", "targetId");
