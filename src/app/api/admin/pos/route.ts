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
        const { items, total, discount, customerName, customerEmail, customerPhone, paymentMethod } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // 1. Identify/Merge Customer
        let targetUserId = null;
        if (customerEmail || customerPhone) {
          const existingUser = await prisma.user.findFirst({
            where: {
              OR: [
                customerEmail ? { email: customerEmail } : {},
                customerPhone ? { phone: customerPhone } : {}
              ].filter(cond => Object.keys(cond).length > 0)
            }
          });

          if (existingUser) {
            targetUserId = existingUser.id;
            // Update phone if it was missing
            if (!existingUser.phone && customerPhone) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: { phone: customerPhone }
              });
            }
          } else {
            // Create a new shadow user for this POS customer
            const newUser = await prisma.user.create({
              data: {
                name: customerName,
                email: customerEmail || null,
                phone: customerPhone || null,
                role: "CUSTOMER",
              }
            });
            targetUserId = newUser.id;
          }
        }

        // 2. Create the order
        const order = await prisma.order.create({
            data: {
                total: total,
                discount: discount || 0,
                status: "DELIVERED",
                paymentStatus: "SUCCESS",
                paystackRef: `POS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                shippingDetails: { 
                    name: customerName, 
                    email: customerEmail,
                    phone: customerPhone,
                    type: "IN-STORE",
                    paymentMethod: paymentMethod 
                },
                userId: targetUserId || session.user.id, // If no customer info, link to staff member as fallback or leave null
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.basePrice,
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
