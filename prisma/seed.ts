/*eslint-disable*/
import { PrismaClient } from '@prisma/client';
import { users, currencies, exchangeRates } from '../data';
import process from 'process';
// import { PrismaService } from '../src/prisma/prisma.service';

const prisma = new PrismaClient();
// let clean: PrismaService;
// clean.cleanDb();

async function main() {
  const user = await prisma.user.createMany({
    data: users,
  });
  const currency = await prisma.currency.createMany({
    data: currencies,
  });
  const exchangeRate = await prisma.exchangeRate.createMany(
    {
      data: exchangeRates,
    },
  );
}

main()
  .catch((e) => {
    throw e;
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
