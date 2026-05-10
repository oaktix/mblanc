import { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "MBlanc Bespoke | Luxury Menswear & Custom Tailoring",
  description: "Nigeria's premier destination for custom-tailored luxury menswear. From regal Agbadas to sophisticated corporate suits, we craft garments for the gentleman who commands presence.",
};

export default async function Home() {
  const p = prisma as any;

  // Fetch latest products
  const latestProducts = await p.product.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: 6,
    select: {
      id: true,
      name: true,
      slug: true,
      basePrice: true,
      category: true,
      images: true,
    }
  });

  // Fetch dynamic categories
  const dynamicCategories = await p.category.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <HomeClient 
      latestProducts={latestProducts} 
      categories={dynamicCategories} 
    />
  );
}
