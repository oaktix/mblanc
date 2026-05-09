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

        // 1. Create the parent Order record first
        const order = await prisma.order.create({
            data: {
                total: total,
                status: "PENDING",
                paymentStatus: "PENDING",
                shippingDetails: shippingDetails, // Stores email, address, etc. as JSON
                userId: session?.user?.id || null,
            },
        });


        // 2. Create OrderItems one by one to ensure ID sanitization
        for (const item of items) {
            // CLEANING: Strip the "--" or any trailing hyphens found in your logs
            const cleanProductId = String(item.id).replace(/-+$/, "").trim();

            // Clean variationId if it exists, otherwise keep as null
            const cleanVariationId = item.variationId
                ? String(item.variationId).replace(/-+$/, "").trim()
                : null;


            await prisma.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: cleanProductId,
                    quantity: Number(item.quantity),
                    price: Number(item.price),
                    // Only connect variation if the cleaned string is valid
                    ...(cleanVariationId && cleanVariationId !== ""
                        ? { variationId: cleanVariationId }
                        : {}),
                },
            });
        }

        // 3. Return the order ID to the frontend so it can initialize Paystack
        return NextResponse.json({ id: order.id }, { status: 201 });

    } catch (error: any) {
        console.error(">>> [ORDER_CREATE] CRITICAL ERROR:", error);

        // Return the specific error message to help you debug in the browser console
        return NextResponse.json(
            { error: "Failed to initialize checkout" },
            { status: 500 }
        );
    }
}