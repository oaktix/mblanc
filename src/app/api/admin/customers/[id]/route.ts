import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Check if user is trying to delete an admin/staff
    const userToDelete = await prisma.user.findUnique({
        where: { id }
    });

    if (!userToDelete) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (userToDelete.role === "ADMIN" || userToDelete.role === "STAFF") {
        return NextResponse.json({ error: "Cannot delete administrative accounts via this endpoint" }, { status: 403 });
    }

    // Delete the user (cascades might handle orders, or we set them to null)
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting customer:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
