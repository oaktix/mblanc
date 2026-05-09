import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const order = await prisma.order.findFirst({
    orderBy: { createdAt: "desc" },
  });
  console.log(JSON.stringify(order));
}

main().catch(console.error).finally(() => prisma.$disconnect());
