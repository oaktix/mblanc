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

        // 1. Verification Log
        console.log(">>> [PAYSTACK WEBHOOK] Headers received, verifying signature...");

        const hash = crypto
            .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
            .update(body)
            .digest('hex');

        if (hash !== paystackSignature) {
            console.error(">>> [PAYSTACK WEBHOOK] Signature Mismatch! Verification failed.");
            return new Response('Invalid signature', { status: 401 });
        }

        const event = JSON.parse(body);
        console.log(">>> [PAYSTACK WEBHOOK] Event Type:", event.event);
        console.log(">>> [PAYSTACK WEBHOOK] Reference:", event.data?.reference);

        // 2. Process Successful Charge
        if (event.event === 'charge.success') {
            const { reference, customer } = event.data;

            console.log(">>> [PAYSTACK WEBHOOK] Updating database for Order:", reference);

            const order = await prisma.order.update({
                where: { id: reference },
                data: { status: OrderStatus.PROCESSING },
                include: { user: true }
            });

            console.log(">>> [PAYSTACK WEBHOOK] Database updated successfully.");

            // 3. Email Logic
            const recipientEmail = customer.email || order.user?.email;

            if (recipientEmail) {
                console.log(">>> [PAYSTACK WEBHOOK] Attempting to send email to:", recipientEmail);

                try {
                    const emailResponse = await resend.emails.send({
                        from: 'MBlanc Fits <orders@mblancfits.com>',
                        to: recipientEmail,
                        subject: `Order Confirmed - #${order.id}`,
                        html: `<h1 style="color: #800020;">Order Confirmed</h1><p>Order #${order.id} is being processed.</p>`
                    });
                    console.log(">>> [PAYSTACK WEBHOOK] Resend API Response:", emailResponse);
                } catch (emailErr) {
                    console.error(">>> [PAYSTACK WEBHOOK] Resend API Error:", emailErr);
                }
            } else {
                console.warn(">>> [PAYSTACK WEBHOOK] No recipient email found. Skipping email.");
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (err: any) {
        console.error('>>> [PAYSTACK WEBHOOK] Critical Error:', err.message);
        return new Response(`Webhook Error: ${err.message}`, { status: 500 });
    }
}