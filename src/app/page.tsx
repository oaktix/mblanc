import { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "MBlanc Bespoke | Luxury Menswear & Custom Tailoring",
  description: "Nigeria's premier destination for custom-tailored luxury menswear. From regal Agbadas to sophisticated corporate suits, we craft garments for the gentleman who commands presence.",
  openGraph: {
    images: ["/images/hero-agbada.jpg"],
  },
  twitter: {
    images: ["/images/hero-agbada.jpg"],
  },
};

export default async function Home() {
  const p = prisma as any;
  
  let latestProducts = [];
  let dynamicCategories = [];

  try {
    // Fetch latest products
    if (p.product) {
      latestProducts = await p.product.findMany({
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
    }

    // Fetch dynamic categories
    if (p.category) {
      dynamicCategories = await p.category.findMany({
        orderBy: { name: "asc" }
      });
    }
  } catch (err) {
    console.error("Homepage data fetch error:", err);
  }

  return (
    <HomeClient 
      latestProducts={latestProducts || []} 
      categories={dynamicCategories || []} 
    />
  );
}
