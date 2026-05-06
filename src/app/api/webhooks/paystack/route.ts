import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { resend } from '@/lib/resend';
import { OrderStatus } from '@prisma/client';

export async function POST(req: Request) {
    console.log(">>> [PAYSTACK WEBHOOK] Request Received");

    try {
        const body = await req.text();
        const paystackSignature = req.headers.get('x-paystack-signature');

        // 1. Signature Verification
        const hash = crypto
            .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
            .update(body)
            .digest('hex');

        if (hash !== paystackSignature) {
            console.error(">>> [PAYSTACK WEBHOOK] Signature Mismatch!");
            return new Response('Invalid signature', { status: 401 });
        }

        const event = JSON.parse(body);

        // 2. Process Successful Charge
        if (event.event === 'charge.success') {
            const { reference, customer } = event.data;

            console.log(">>> [PAYSTACK WEBHOOK] Processing Reference:", reference);

            // SAFETY CHECK: Find order first to avoid Prisma crash
            const existingOrder = await prisma.order.findUnique({
                where: { id: reference }
            });

            if (!existingOrder) {
                console.error(`>>> [PAYSTACK WEBHOOK] Order ${reference} not found in DB.`);
                return NextResponse.json({ error: "Order not found" }, { status: 404 });
            }

            // Update Order Status and Payment Status
            const order = await prisma.order.update({
                where: { id: reference },
                data: {
                    status: OrderStatus.PROCESSING,
                    paymentStatus: "SUCCESS",
                    paystackRef: reference // Saving the reference for record keeping
                },
                include: { user: true }
            });

            console.log(">>> [PAYSTACK WEBHOOK] Database updated successfully.");

            // 3. Email Logic (Pulling from JSON shippingDetails)
            const shipping = order.shippingDetails as any;
            const recipientEmail = customer.email || shipping?.email || order.user?.email;

            if (recipientEmail) {
                console.log(">>> [PAYSTACK WEBHOOK] Sending email to:", recipientEmail);

                try {
                    await resend.emails.send({
                        from: 'MBlanc Fits <orders@mblancfits.com>',
                        to: recipientEmail,
                        subject: `Order Confirmed - #${order.id}`,
                        html: `
                            <div style="font-family: serif; color: #333;">
                                <h1 style="color: #800020;">MBLANC FITS</h1>
                                <h2>Order Confirmed</h2>
                                <p>Thank you for your purchase. Your order <strong>#${order.id}</strong> is now being processed.</p>
                                <p>Amount Paid: ₦${(order.total).toLocaleString()}</p>
                            </div>
                        `
                    });
                    console.log(">>> [PAYSTACK WEBHOOK] Email sent successfully.");
                } catch (emailErr) {
                    console.error(">>> [PAYSTACK WEBHOOK] Resend Error:", emailErr);
                }
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (err: any) {
        console.error('>>> [PAYSTACK WEBHOOK] Critical Error:', err.message);
        return new Response(`Webhook Error: ${err.message}`, { status: 500 });
    }
}