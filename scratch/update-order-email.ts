import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const orderId = "cmoyke9u40001vwismqk50r33";
  await prisma.order.update({
    where: { id: orderId },
    data: {
      shippingDetails: {
        city: "Lagos",
        name: "Gahdej The Prince",
        email: "gahdejtheprince@gmail.com",
        address: "123 Royal Palace St",
      }
    }
  });
  console.log("Order updated with test email.");
}

main().catch(console.error).finally(() => prisma.$disconnect());
