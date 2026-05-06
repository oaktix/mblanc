import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: "Royal Midnight Agbada",
      slug: "royal-midnight-agbada",
      category: "Agbada",
      description: "A majestic three-piece Agbada set in deep midnight blue with intricate silver embroidery. Perfect for prestigious traditional ceremonies.",
      basePrice: 450000,
      sku: "MB-AG-001",
      stock: 5,
      status: "PUBLISHED",
      images: ["/placeholder-agbada.jpg"],
    },
    {
      name: "The Executive Navy Two-Piece",
      slug: "executive-navy-suit",
      category: "Suits",
      description: "A sharp, modern-cut navy suit tailored from premium Italian wool. Designed for the boardroom and beyond.",
      basePrice: 280000,
      sku: "MB-SU-001",
      stock: 10,
      status: "PUBLISHED",
      images: ["/placeholder-suit.jpg"],
    },
    {
      name: "Ivory Silk Kaftan",
      slug: "ivory-silk-kaftan",
      category: "Kaftans",
      description: "Elegant and breathable silk-blend Kaftan in ivory, featuring subtle hand-stitched detailing on the neckline.",
      basePrice: 150000,
      sku: "MB-KF-001",
      stock: 15,
      status: "PUBLISHED",
      images: ["/placeholder-kaftan.jpg"],
    },
    {
      name: "Charcoal Pinstripe Corporate Fit",
      slug: "charcoal-pinstripe-corporate",
      category: "Corporate",
      description: "Exude authority with this charcoal pinstripe tailored fit. Uncompromising quality for the modern professional.",
      basePrice: 180000,
      sku: "MB-CF-001",
      stock: 8,
      status: "PUBLISHED",
      images: ["/placeholder-corporate.jpg"],
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    });
  }

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
