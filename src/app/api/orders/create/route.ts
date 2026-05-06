import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { items, total, shippingDetails } = body;

        // 1. First, create the Order record
        const order = await prisma.order.create({
            data: {
                total: total,
                status: "PENDING",
                paymentStatus: "PENDING",
                shippingDetails: shippingDetails,
                userId: (session?.user as any)?.id || null,
            },
        });

        // 2. Then, create the OrderItems linked to that Order
        // Using a Promise.all to handle multiple items safely
        await Promise.all(
            items.map((item: any) =>
                prisma.orderItem.create({
                    data: {
                        orderId: order.id,
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                        // Only connect variation if it's a valid string
                        ...(item.variationId && item.variationId.trim() !== ""
                            ? { variationId: item.variationId }
                            : {}),
                    },
                })
            )
        );

        return NextResponse.json({ id: order.id }, { status: 201 });

    } catch (error: any) {
        console.error(">>> [ORDER_CREATE] CRITICAL ERROR:", error);

        // If the order was created but items failed, you might want to handle that,
        // but for now, we just return the specific error message.
        return NextResponse.json(
            { error: "Order creation failed", details: error.message },
            { status: 500 }
        );
    }
}