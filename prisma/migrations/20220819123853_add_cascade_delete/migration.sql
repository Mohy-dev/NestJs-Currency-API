-- DropForeignKey
ALTER TABLE "exchange_rates" DROP CONSTRAINT "exchange_rates_currencyId_fkey";

-- AddForeignKey
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "currencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
