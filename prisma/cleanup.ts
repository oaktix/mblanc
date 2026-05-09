import prisma from "@/lib/prisma";

// Run: npx tsx prisma/cleanup.ts
async function cleanup() {
  console.log("🧹 Starting database cleanup...");

  // Delete in dependency order
  await prisma.couponUsage.deleteMany({});
  console.log("✅ Cleared coupon usages");

  await prisma.coupon.deleteMany({});
  console.log("✅ Cleared coupons");

  await prisma.orderItem.deleteMany({});
  console.log("✅ Cleared order items");

  await prisma.order.deleteMany({});
  console.log("✅ Cleared orders");

  await prisma.user.deleteMany({ where: { role: "CUSTOMER" } });
  console.log("✅ Cleared customer directory");

  // Delete all products EXCEPT the one test product
  const testProduct = await prisma.product.findFirst({ orderBy: { createdAt: "asc" } });
  if (testProduct) {
    await prisma.product.deleteMany({ where: { id: { not: testProduct.id } } });
    console.log(`✅ Kept 1 test product: "${testProduct.name}" — all others deleted`);
  } else {
    // No products at all — create a test product
    await prisma.product.create({
      data: {
        name: "MBlanc Signature Agbada",
        slug: "mblanc-signature-agbada-test",
        category: "Agbada",
        description: "A test product for payment verification. Do not remove.",
        basePrice: 150000,
        sku: "TEST-001",
        stock: 10,
        status: "PUBLISHED",
        images: [],
      },
    });
    console.log("✅ Created 1 test product");
  }

  // Seed default categories
  const cats = [
    { name: "Agbada", slug: "agbada" },
    { name: "Suits", slug: "suits" },
    { name: "Kaftans", slug: "kaftans" },
    { name: "Corporate", slug: "corporate" },
  ];
  for (const cat of cats) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✅ Seeded default categories");

  console.log("\n🎉 Cleanup complete. Database is ready for production.");
}

cleanup()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
