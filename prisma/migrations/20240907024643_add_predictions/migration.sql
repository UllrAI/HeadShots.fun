-- CreateTable
CREATE TABLE "predictions" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "predictions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "studios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
