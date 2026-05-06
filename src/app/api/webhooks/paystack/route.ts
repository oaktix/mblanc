import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { resend } from '@/lib/resend';
import { OrderStatus } from '@prisma/client';

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const paystackSignature = req.headers.get('x-paystack-signature');

        // 1. Verify the request is actually from Paystack
        const hash = crypto
            .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
            .update(body)
            .digest('hex');

        if (hash !== paystackSignature) {
            return new Response('Invalid signature', { status: 401 });
        }

        const event = JSON.parse(body);

        // 2. Listen for a successful charge
        if (event.event === 'charge.success') {
            const { reference, customer } = event.data;

            // 3. Update Order in Database 
            // Using PROCESSING as your schema does not have a PAID status
            const order = await prisma.order.update({
                where: { id: reference },
                data: {
                    status: OrderStatus.PROCESSING
                },
                include: {
                    user: true
                }
            });

            // 4. Send Confirmation Email via Resend
            if (order) {
                // Use the email from the Paystack event or the database
                const recipientEmail = customer.email || order.user?.email;

                if (recipientEmail) {
                    await resend.emails.send({
                        from: 'MBlanc Fits <hello@mblancfits.com>',
                        to: recipientEmail,
                        subject: `Order Confirmed - #${order.id}`,
                        html: `
              <div style="font-family: serif; color: #1a1a1a; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                <h1 style="color: #800020; text-align: center;">Order Confirmed</h1>
                <p>Thank you for choosing MBlanc Fits.</p>
                <p>Your payment was successful, and your order <strong>#${order.id}</strong> is now being <strong>processed</strong>.</p>
                <p>We will notify you once your items have been shipped.</p>
                <hr style="border: 0; border-top: 1px solid #eee;" />
                <p style="font-size: 12px; color: #666; text-align: center;">If you have any questions, please contact our support team.</p>
              </div>
            `
                    });
                    console.log(`Email sent successfully to ${recipientEmail}`);
                }
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (err) {
        console.error('Webhook Error:', err);
        return new Response('Webhook handler failed', { status: 500 });
    }
}