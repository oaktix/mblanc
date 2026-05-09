import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import EditProductForm from "@/components/admin/EditProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { variations: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <AdminShell>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-charcoal dark:text-ivory">Edit Product</h1>
          <p className="text-gray-500 font-light mt-1">Update the details for <span className="italic text-gold">{product.name}</span></p>
        </div>
        <EditProductForm product={product} categories={categories} />
      </div>
    </AdminShell>
  );
}
