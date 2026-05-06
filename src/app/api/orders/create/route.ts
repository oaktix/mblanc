import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { items, total, shippingDetails } = body;

        // 1. VERIFICATION STEP
        // Check if the products actually exist before trying to create the order
        const productIds = items.map((i: any) => i.id);
        const existingProducts = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true }
        });

        if (existingProducts.length !== items.length) {
            const foundIds = existingProducts.map(p => p.id);
            const missingIds = productIds.filter((id: string) => !foundIds.includes(id));

            console.error(">>> [ORDER_CREATE] Missing Product IDs in DB:", missingIds);
            return NextResponse.json({
                error: "Some items in your cart no longer exist. Please clear cart and try again.",
                missingIds
            }, { status: 400 });
        }

        // 2. CREATE ORDER
        const order = await prisma.order.create({
            data: {
                total: total,
                status: "PENDING",
                paymentStatus: "PENDING",
                shippingDetails: shippingDetails,
                userId: (session?.user as any)?.id || null,
                items: {
                    create: items.map((item: any) => ({
                        // Use 'connect' to be explicit about the relationship
                        product: {
                            connect: { id: item.id }
                        },
                        quantity: item.quantity,
                        price: item.price,
                        // Only add variation if it exists
                        ...(item.variationId && {
                            variation: {
                                connect: { id: item.variationId }
                            }
                        })
                    })),
                },
            },
        });

        return NextResponse.json({ id: order.id }, { status: 201 });

    } catch (error: any) {
        console.error(">>> [ORDER_CREATE] CRITICAL ERROR:", error);
        return NextResponse.json(
            { error: "Database constraint error", details: error.message },
            { status: 500 }
        );
    }
}