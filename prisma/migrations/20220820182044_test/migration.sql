/*
  Warnings:

  - Added the required column `userId` to the `currencies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "currencies" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "dollarRate" ON "currencies"("dollarRate");

-- CreateIndex
CREATE INDEX "rate" ON "exchange_rates"("rate");

-- AddForeignKey
ALTER TABLE "currencies" ADD CONSTRAINT "currencies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
