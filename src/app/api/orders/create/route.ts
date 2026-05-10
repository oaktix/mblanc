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

        // 1. Validate all products exist before starting transaction
        // Using (prisma as any) to bypass stale local types due to EPERM during generation
        const p = prisma as any;

        for (const item of items) {
            const product = await p.product.findUnique({
                where: { id: String(item.id).replace(/-+$/, "").trim() }
            });
            if (!product) {
                return NextResponse.json({ error: `Product "${item.name}" is no longer available. Please clear your cart.` }, { status: 400 });
            }
        }

        // 2. Handle User (Guest or Authenticated)
        let finalUserId = session?.user?.id || null;

        if (!finalUserId && shippingDetails?.email) {
            const guestEmail = shippingDetails.email.toLowerCase();
            const guestUser = await p.user.upsert({
                where: { email: guestEmail },
                update: {
                    name: shippingDetails.name || undefined,
                    phone: shippingDetails.phone || undefined,
                },
                create: {
                    email: guestEmail,
                    name: shippingDetails.name || "Guest Client",
                    phone: shippingDetails.phone || null,
                    role: "CUSTOMER",
                },
            });
            finalUserId = guestUser.id;
        }

        // 3. Create Order
        const order = await p.order.create({
            data: {
                total: total,
                discount: discount || 0,
                couponCode: couponCode || null,
                status: "PENDING",
                paymentStatus: "PENDING",
                shippingDetails: shippingDetails,
                notes: notes || null,
                userId: finalUserId,
            },
        });

        // 4. Update Coupon (if valid)
        if (couponCode) {
            try {
                await p.coupon.update({
                    where: { code: couponCode },
                    data: { usageCount: { increment: 1 } }
                });
            } catch (e) {
                console.warn("Coupon update failed (might be invalid code):", couponCode);
            }
        }

        // 5. Create OrderItems
        for (const item of items) {
            const cleanProductId = String(item.id).replace(/-+$/, "").trim();
            const cleanVariationId = item.variationId
                ? String(item.variationId).replace(/-+$/, "").trim()
                : null;

            await p.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: cleanProductId,
                    quantity: Number(item.quantity),
                    price: Number(item.price),
                    ...(cleanVariationId && cleanVariationId !== ""
                        ? { variationId: cleanVariationId }
                        : {}),
                },
            });
        }

        return NextResponse.json({ id: order.id }, { status: 201 });

    } catch (error: any) {
        console.error(">>> [ORDER_CREATE] CRITICAL ERROR:", error);
        return NextResponse.json(
            { error: "Failed to create order. Please check your network or cart items.", details: error.message },
            { status: 500 }
        );
    }
}