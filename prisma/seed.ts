/*eslint-disable*/
import { PrismaClient } from '@prisma/client';
import { data } from '../data';
import process from 'process';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.createMany({
    data: data,
  });
}

main()
  .catch((e) => {
    throw e;
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
