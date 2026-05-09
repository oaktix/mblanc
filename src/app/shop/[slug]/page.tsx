import prisma from "@/lib/prisma";
import { Metadata } from "next";
import ProductDetailClient from "@/components/shop/ProductDetailClient";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) return {};

  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | MBlanc Bespoke`,
      description: product.description.slice(0, 160),
      images: product.images?.[0] ? [product.images[0]] : ["/logo.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images?.[0] ? [product.images[0]] : ["/logo.png"],
    }
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { variations: true },
  });

  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
