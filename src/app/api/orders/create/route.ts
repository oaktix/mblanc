import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { items, total, shippingDetails } = body;

        const order = await prisma.order.create({
            data: {
                total: total,
                status: "PENDING",
                paymentStatus: "PENDING",
                shippingDetails: shippingDetails,
                userId: (session?.user as any)?.id || null,
                items: {
                    create: items.map((item: any) => {
                        // Base item data
                        const itemData: any = {
                            quantity: item.quantity,
                            price: item.price,
                            product: {
                                connect: { id: item.id }
                            }
                        };

                        // ONLY connect variation if the ID exists and is not an empty string
                        if (item.variationId && item.variationId.trim() !== "") {
                            itemData.variation = {
                                connect: { id: item.variationId }
                            };
                        }

                        return itemData;
                    }),
                },
            },
        });

        return NextResponse.json({ id: order.id }, { status: 201 });

    } catch (error: any) {
        console.error(">>> [ORDER_CREATE] DATABASE ERROR:", error);

        // This will help us see if it's a variation error specifically
        return NextResponse.json(
            { error: "Database constraint error", details: error.message },
            { status: 500 }
        );
    }
}