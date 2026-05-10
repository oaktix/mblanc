import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listVariations() {
  const variations = await prisma.variation.findMany({
    select: { id: true, productId: true, sku: true, price: true }
  });
  console.log(JSON.stringify(variations, null, 2));
}

listVariations()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
