import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        
        // Ensure only ADMIN or STAFF can use POS
        if (!session || session.user.role === "CUSTOMER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { items, total, customerName, paymentMethod } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // Create the order
        const order = await prisma.order.create({
            data: {
                total: total,
                status: "DELIVERED", // POS sales are usually delivered immediately
                paymentStatus: "SUCCESS",
                paystackRef: `POS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                shippingDetails: { 
                    name: customerName, 
                    type: "IN-STORE",
                    paymentMethod: paymentMethod 
                },
                userId: session.user.id,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.basePrice,
                        // variationId: item.variationId || null,
                    }))
                }
            },
        });

        console.log(`>>> [POS_SALE_CREATED] ID: ${order.id}`);

        return NextResponse.json({ id: order.id }, { status: 201 });

    } catch (error: any) {
        console.error(">>> [POS_API] ERROR:", error);
        return NextResponse.json(
            { error: "Failed to record POS sale", details: error.message },
            { status: 500 }
        );
    }
}
