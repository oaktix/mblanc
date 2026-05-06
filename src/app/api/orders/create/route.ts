import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { items, total, shippingDetails } = body;

        // 1. Create the Order
        const order = await prisma.order.create({
            data: {
                total: total,
                status: "PENDING",
                paymentStatus: "PENDING",
                shippingDetails: shippingDetails,
                userId: (session?.user as any)?.id || null,
            },
        });

        // 2. Create OrderItems with strict cleaning
        for (const item of items) {
            // Clean the IDs to remove any hidden whitespace/newlines
            const cleanProductId = String(item.id).trim();
            const cleanVariationId = item.variationId ? String(item.variationId).trim() : null;

            console.log(`>>> [DEBUG] Attempting to link Product: "${cleanProductId}" to Order: "${order.id}"`);

            await prisma.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: cleanProductId,
                    quantity: Number(item.quantity),
                    price: Number(item.price),
                    // Only include variationId if it's not null/empty
                    ...(cleanVariationId && cleanVariationId !== "" ? { variationId: cleanVariationId } : {}),
                },
            });
        }

        return NextResponse.json({ id: order.id }, { status: 201 });

    } catch (error: any) {
        console.error(">>> [ORDER_CREATE] CRITICAL ERROR:", error);
        return NextResponse.json(
            { error: "Order creation failed", details: error.message },
            { status: 500 }
        );
    }
}