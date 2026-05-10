import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { items, total, discount, couponCode, shippingDetails, notes } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        const p = prisma as any;

        // 1. Validate all products exist
        for (const item of items) {
            const searchId = String(item.id).trim();
            const product = await p.product.findUnique({
                where: { id: searchId }
            });

            if (!product) {
                const productBySlug = await p.product.findUnique({
                    where: { slug: item.slug || searchId }
                });

                if (!productBySlug) {
                    return NextResponse.json({ 
                        error: `Product "${item.name}" is no longer available. Please clear your cart.`,
                        details: `ID: ${searchId}`
                    }, { status: 400 });
                }
            }
        }

        // 2. Handle User
        let finalUserId = session?.user?.id || null;

        if (!finalUserId && shippingDetails?.email) {
            const guestEmail = shippingDetails.email.toLowerCase();
            // REMOVING 'phone' temporarily because the generated Prisma client is stuck on an old version 
            // that doesn't recognize the 'phone' field yet.
            const guestUser = await p.user.upsert({
                where: { email: guestEmail },
                update: {
                    name: shippingDetails.name || undefined,
                },
                create: {
                    email: guestEmail,
                    name: shippingDetails.name || "Guest Client",
                    role: "CUSTOMER",
                },
            });
            finalUserId = guestUser.id;
        }

        // 3. Create Order
        const order = await p.order.create({
            data: {
                total: Number(total),
                discount: Number(discount) || 0,
                couponCode: couponCode || null,
                status: "PENDING",
                paymentStatus: "PENDING",
                shippingDetails: shippingDetails,
                notes: notes || null,
                userId: finalUserId,
            },
        });

        // 4. Update Coupon
        if (couponCode) {
            try {
                await p.coupon.update({
                    where: { code: couponCode },
                    data: { usageCount: { increment: 1 } }
                });
            } catch (e) {
                console.warn("Coupon update failed:", couponCode);
            }
        }

        // 5. Create OrderItems
        for (const item of items) {
            const cleanProductId = String(item.id).trim();
            const cleanVariationId = item.variationId ? String(item.variationId).trim() : null;

            await p.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: cleanProductId,
                    quantity: Number(item.quantity),
                    price: Number(item.price),
                    ...(cleanVariationId && cleanVariationId !== "" && cleanVariationId !== "null"
                        ? { variationId: cleanVariationId }
                        : {}),
                },
            });
        }

        return NextResponse.json({ id: order.id }, { status: 201 });

    } catch (error: any) {
        console.error(">>> [ORDER_CREATE] CRITICAL ERROR:", error);
        return NextResponse.json(
            { error: "Failed to create order. Please try again.", details: error.message },
            { status: 500 }
        );
    }
}