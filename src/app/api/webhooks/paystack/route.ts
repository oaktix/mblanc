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
        if (!paystackSignature) {
            return new Response('No signature provided', { status: 401 });
        }

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
            const { reference, customer, amount } = event.data;

            console.log(">>> [PAYSTACK WEBHOOK] Processing Reference:", reference);

            // Find order and check if it's already processed
            const existingOrder = await prisma.order.findUnique({
                where: { id: reference },
                include: { user: true }
            });

            if (!existingOrder) {
                console.error(`>>> [PAYSTACK WEBHOOK] Order ${reference} not found in DB.`);
                // Return 200 anyway so Paystack stops retrying, or 404 if you want to debug
                return NextResponse.json({ error: "Order not found" }, { status: 404 });
            }

            // IDEMPOTENCY CHECK: If already paid, don't send email again
            if (existingOrder.paymentStatus === "SUCCESS") {
                console.log(">>> [PAYSTACK WEBHOOK] Order already processed. Skipping.");
                return NextResponse.json({ received: true }, { status: 200 });
            }

            // 3. Update Order Status and Payment Status
            const order = await prisma.order.update({
                where: { id: reference },
                data: {
                    status: OrderStatus.PROCESSING,
                    paymentStatus: "SUCCESS",
                    paystackRef: reference
                },
                include: { user: true }
            });

            console.log(">>> [PAYSTACK WEBHOOK] Database updated successfully.");

            // 4. Email Logic
            const shipping = order.shippingDetails as any;
            const recipientEmail = shipping?.email || customer.email || order.user?.email;

            if (recipientEmail) {
                console.log(">>> [PAYSTACK WEBHOOK] Sending email to:", recipientEmail);

                try {
                    await resend.emails.send({
                        from: 'MBlanc Fits <orders@mblancfits.com>',
                        to: recipientEmail,
                        subject: `Order Confirmed - #${order.id.slice(-6).toUpperCase()}`,
                        html: `
                            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                                <h1 style="color: #800020; text-align: center;">MBLANC FITS</h1>
                                <hr style="border: 0; border-top: 1px solid #eee;" />
                                <h2 style="text-align: center;">Order Confirmed</h2>
                                <p>Hi ${shipping?.name || 'there'},</p>
                                <p>Thank you for your purchase. Your order is now being processed.</p>
                                <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
                                    <p><strong>Order ID:</strong> #${order.id}</p>
                                    <p><strong>Amount Paid:</strong> ₦${(order.total).toLocaleString()}</p>
                                    <p><strong>Shipping to:</strong> ${shipping?.address}, ${shipping?.city}</p>
                                </div>
                                <p style="margin-top: 20px; font-size: 12px; color: #666; text-align: center;">
                                    If you have any questions, reply to this email.
                                </p>
                            </div>
                        `
                    });
                    console.log(">>> [PAYSTACK WEBHOOK] Email sent successfully.");
                } catch (emailErr) {
                    console.error(">>> [PAYSTACK WEBHOOK] Resend Error:", emailErr);
                    // We don't return an error response here because the DB update was successful
                }
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (err: any) {
        console.error('>>> [PAYSTACK WEBHOOK] Critical Error:', err.message);
        return new Response(`Webhook Error: ${err.message}`, { status: 500 });
    }
}