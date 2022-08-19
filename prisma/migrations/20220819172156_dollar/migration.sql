/*
  Warnings:

  - You are about to drop the column `euroRate` on the `currencies` table. All the data in the column will be lost.
  - You are about to drop the column `rate` on the `currencies` table. All the data in the column will be lost.
  - Added the required column `code` to the `exchange_rates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `exchange_rates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rate` to the `exchange_rates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "currencies" DROP COLUMN "euroRate",
DROP COLUMN "rate",
ADD COLUMN     "dollarRate" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "exchange_rates" ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "rate" DOUBLE PRECISION NOT NULL;
