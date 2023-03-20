-- CreateTable
CREATE TABLE "ModelDownload" (
    "id" SERIAL NOT NULL,
    "modelId" TEXT NOT NULL,
    "profileId" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ModelDownload_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ModelDownload" ADD CONSTRAINT "ModelDownload_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelDownload" ADD CONSTRAINT "ModelDownload_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
