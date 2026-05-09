import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const orderId = "cmoyke9u40001vwismqk50r33";
  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: "PENDING",
      status: "PENDING",
    }
  });
  console.log("Order reset to PENDING.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
