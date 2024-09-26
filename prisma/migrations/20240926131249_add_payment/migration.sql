/*
  Warnings:

  - You are about to drop the column `stripe_current_period_end` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_customer_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_price_id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_subscription_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "predictions" DROP CONSTRAINT "predictions_studioId_fkey";

-- DropIndex
DROP INDEX "users_stripe_customer_id_key";

-- DropIndex
DROP INDEX "users_stripe_subscription_id_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "stripe_current_period_end",
DROP COLUMN "stripe_customer_id",
DROP COLUMN "stripe_price_id",
DROP COLUMN "stripe_subscription_id";

-- CreateTable
CREATE TABLE "stripe_transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stripe_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stripe_transactions_stripeSessionId_key" ON "stripe_transactions"("stripeSessionId");

-- AddForeignKey
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "studios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stripe_transactions" ADD CONSTRAINT "stripe_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
