import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  let data: any[] = [];
  let filename = "export.csv";

  try {
    if (type === "products") {
      data = await prisma.product.findMany({
        select: { id: true, name: true, sku: true, category: true, basePrice: true, stock: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });
      filename = "mblanc_products.csv";
    } else if (type === "orders") {
      data = await prisma.order.findMany({
        select: { id: true, total: true, paymentStatus: true, status: true, userId: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });
      filename = "mblanc_orders.csv";
    } else if (type === "customers") {
      data = await prisma.user.findMany({
        where: { role: "CUSTOMER" },
        select: { id: true, name: true, email: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });
      filename = "mblanc_customers.csv";
    } else {
      return new NextResponse("Invalid export type", { status: 400 });
    }

    if (data.length === 0) {
      return new NextResponse("No data to export", { status: 404 });
    }

    // Convert JSON to CSV
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(row => 
      Object.values(row).map(val => {
        if (val instanceof Date) return `"${val.toISOString()}"`;
        if (typeof val === "string") return `"${val.replace(/"/g, '""')}"`;
        return val;
      }).join(",")
    );
    
    const csvContent = [headers, ...rows].join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
