import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listProducts() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, sku: true }
  });
  console.log(JSON.stringify(products, null, 2));
}

listProducts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
