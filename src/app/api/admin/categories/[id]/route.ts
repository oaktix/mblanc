import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { name, image } = await req.json();

  try {
    const oldCategory = await prisma.category.findUnique({ where: { id } });
    if (!oldCategory) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    const slug = name ? name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") : oldCategory.slug;

    const category = await prisma.category.update({
      where: { id },
      data: { 
        name: name || oldCategory.name, 
        slug, 
        image: image !== undefined ? image : oldCategory.image 
      }
    });

    // If name changed, we should ideally update products. 
    // But since the relation is loose (string-based), we should do it here if name changed.
    if (name && name !== oldCategory.name) {
      await prisma.product.updateMany({
        where: { category: oldCategory.name },
        data: { category: name }
      });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ message: "Category deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
