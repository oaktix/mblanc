import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { items, total, shippingDetails } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        const order = await prisma.order.create({
            data: {
                total: total,
                status: "PENDING",
                paymentStatus: "PENDING",
                // Since your schema uses a Json type for shippingDetails,
                // we pass the object directly here.
                shippingDetails: shippingDetails,
                userId: (session?.user as any)?.id || null,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                        // Match your OrderItem schema (variationId instead of variantName)
                        variationId: item.variationId || null,
                    })),
                },
            },
        });

        return NextResponse.json({ id: order.id }, { status: 201 });

    } catch (error: any) {
        console.error("ORDER_CREATION_ERROR:", error);
        return NextResponse.json(
            { error: "Failed to create order. Check server console for details." },
            { status: 500 }
        );
    }
}