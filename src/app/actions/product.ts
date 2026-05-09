"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const category = formData.get("category") as string;
  const basePrice = parseFloat(formData.get("basePrice") as string);
  const sku = formData.get("sku") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const imageUrls = JSON.parse(formData.get("images") as string || "[]");
  const variations = JSON.parse(formData.get("variations") as string || "[]");

  const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

  try {
    await prisma.product.create({
      data: {
        name,
        slug,
        category,
        basePrice,
        sku,
        description,
        status,
        stock: parseInt(formData.get("stock") as string || "0"),
        images: imageUrls,
        variations: {
          create: variations.map((v: any) => ({
            size: v.size || null,
            color: v.color || null,
            price: parseFloat(v.price.toString()),
            sku: v.sku,
            stock: parseInt(v.stock.toString()),
          })),
        },
      },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return { error: "Failed to create product" };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { error: "Failed to delete product" };
  }
}
