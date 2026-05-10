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
            // CRITICAL FIX: The cart ID might be in the format 'productId-size-color'
            // We need to extract the actual database CUID which is the first part.
            const realProductId = String(item.id).split('-')[0].trim();
            
            console.log(`>>> [CHECKOUT] Validating Product ID: ${realProductId} (Original Cart ID: ${item.id})`);

            const product = await p.product.findUnique({
                where: { id: realProductId }
            });

            if (!product) {
                // Fallback to slug if not found by ID
                const productBySlug = await p.product.findUnique({
                    where: { slug: item.slug || realProductId }
                });

                if (!productBySlug) {
                    console.error(`>>> [CHECKOUT] Product NOT FOUND: ${realProductId}`);
                    return NextResponse.json({ 
                        error: `Product "${item.name}" is no longer available. Please clear your cart and try again.`,
                        details: `ID: ${realProductId}`
                    }, { status: 400 });
                }
            }
        }

        // 2. Identify/Capture Customer from Checkout Fields
        let finalUserId = null;
        const checkoutEmail = shippingDetails?.email?.toLowerCase() || null;
        const checkoutPhone = shippingDetails?.phone || null;
        const checkoutName = shippingDetails?.name || "Guest Client";

        if (checkoutEmail || checkoutPhone) {
            const existingUser = await p.user.findFirst({
                where: {
                    OR: [
                        checkoutEmail ? { email: checkoutEmail } : {},
                        checkoutPhone ? { phone: checkoutPhone } : {}
                    ].filter(cond => Object.keys(cond).length > 0)
                }
            });

            if (existingUser) {
                // Update existing user with latest info from checkout
                const updatedUser = await p.user.update({
                    where: { id: existingUser.id },
                    data: {
                        name: checkoutName,
                        phone: checkoutPhone || existingUser.phone,
                        // Ensure role is CUSTOMER if it's not ADMIN/STAFF
                        role: (existingUser.role === "ADMIN" || existingUser.role === "STAFF") ? existingUser.role : "CUSTOMER"
                    }
                });
                finalUserId = updatedUser.id;
            } else {
                // Create new customer profile
                const newUser = await p.user.create({
                    data: {
                        email: checkoutEmail,
                        phone: checkoutPhone,
                        name: checkoutName,
                        role: "CUSTOMER",
                    }
                });
                finalUserId = newUser.id;
            }
        } else if (session?.user?.id) {
            finalUserId = session.user.id;
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
            // Again, extract the real product ID
            const realProductId = String(item.id).split('-')[0].trim();
            const cleanVariationId = item.variationId ? String(item.variationId).trim() : null;

            console.log(`>>> [CHECKOUT] Creating OrderItem for product: ${realProductId}, variation: ${cleanVariationId}`);

            await p.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: realProductId,
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
            { error: "Failed to create order. Please contact support.", details: error.message },
            { status: 500 }
        );
    }
}