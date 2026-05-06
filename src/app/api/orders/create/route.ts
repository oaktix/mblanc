import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { items, total, shippingDetails } = body;

        // 1. Create the Order normally
        const order = await prisma.order.create({
            data: {
                total: total,
                status: "PENDING",
                paymentStatus: "PENDING",
                shippingDetails: shippingDetails,
                userId: (session?.user as any)?.id || null,
            },
        });

        // 2. Use Raw SQL to insert items
        // This bypasses Prisma's client-side foreign key checks
        for (const item of items) {
            const productId = String(item.id).trim();
            const price = Number(item.price);
            const qty = Number(item.quantity);
            const varId = item.variationId ? String(item.variationId).trim() : null;

            console.log(`>>> [SQL EXEC] Linking Product ${productId} to Order ${order.id}`);

            await prisma.$executeRaw`
        INSERT INTO "OrderItem" ("id", "orderId", "productId", "quantity", "price", "variationId")
        VALUES (
          ${crypto.randomUUID()}, 
          ${order.id}, 
          ${productId}, 
          ${qty}, 
          ${price}, 
          ${varId}
        )
      `;
        }

        return NextResponse.json({ id: order.id }, { status: 201 });

    } catch (error: any) {
        console.error(">>> [ORDER_CREATE] SQL ERROR:", error.message);
        return NextResponse.json(
            { error: "Database rejected the order items", details: error.message },
            { status: 500 }
        );
    }
}