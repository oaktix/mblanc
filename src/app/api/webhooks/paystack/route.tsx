import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { resend } from '@/lib/resend';
import { OrderStatus } from '@prisma/client';
import { OrderConfirmationEmail } from '@/components/emails/OrderConfirmationEmail';
import { generateOrderReceiptBuffer } from '@/lib/pdf-server';

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
            const { reference, customer } = event.data;

            console.log(">>> [PAYSTACK WEBHOOK] Processing Reference:", reference);

            // Find order and check if it's already processed
            const existingOrder = await prisma.order.findUnique({
                where: { id: reference },
                include: { 
                    user: true,
                    items: {
                        include: {
                            product: true,
                            variation: true
                        }
                    }
                }
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
                include: { 
                    user: true,
                    items: {
                        include: {
                            product: true,
                            variation: true
                        }
                    }
                }
            });

            console.log(">>> [PAYSTACK WEBHOOK] Database updated successfully.");

            // 4. Email & Receipt Logic
            const shipping = order.shippingDetails as Record<string, string>;
            const recipientEmail = shipping?.email || customer.email || order.user?.email;
            const adminEmail = "thebespokecity@gmail.com";

            if (recipientEmail) {
                console.log(">>> [PAYSTACK WEBHOOK] Generating PDF and sending emails...");

                try {
                    // Prepare items data for Email/PDF
                    const formattedItems = order.items.map(item => ({
                        name: item.product.name,
                        quantity: item.quantity,
                        price: item.price,
                        size: item.variation?.size,
                        color: item.variation?.color,
                    }));

                    let pdfBuffer: Buffer | null = null;
                    try {
                        pdfBuffer = await generateOrderReceiptBuffer({
                            id: order.id,
                            customerName: shipping?.name || 'Valued Client',
                            items: formattedItems,
                            total: order.total,
                            shippingAddress: `${shipping?.address}, ${shipping?.city}`,
                        });
                    } catch (pdfError) {
                        console.error('>>> [PAYSTACK WEBHOOK] PDF Generation Failed:', pdfError);
                    }

                    // 4. Send Confirmation Email to Customer
                    const attachments = pdfBuffer ? [
                        {
                            content: pdfBuffer,
                            filename: `MBlanc_Receipt_${order.id.slice(-6).toUpperCase()}.pdf`,
                        }
                    ] : [];

                    await resend.emails.send({
                        from: 'MBlanc Bespoke <hello@mblancfits.com>',
                        to: shipping?.email || order.user?.email || adminEmail,
                        subject: `Order Confirmation - #MBLANC-${order.id.slice(-6).toUpperCase()}`,
                        react: (
                            <OrderConfirmationEmail 
                                orderId={order.id}
                                customerName={shipping?.name || order.user?.name || 'Valued Client'}
                                items={formattedItems}
                                total={order.total}
                                shippingAddress={shipping?.address || ''}
                                shippingCity={shipping?.city || ''}
                            />
                        ),
                        attachments: attachments,
                    });

                    // Send to Admin
                    await resend.emails.send({
                        from: 'MBlanc Bespoke <hello@mblancfits.com>',
                        to: adminEmail,
                        subject: `New Order Received - #${order.id.slice(-6).toUpperCase()}`,
                        html: `
                            <div style="font-family: sans-serif; padding: 20px;">
                                <h2>New Order Alert</h2>
                                <p>A new order has been paid and confirmed.</p>
                                <hr />
                                <p><strong>Order ID:</strong> #${order.id}</p>
                                <p><strong>Customer:</strong> ${shipping?.name} (${recipientEmail})</p>
                                <p><strong>Amount:</strong> ₦${order.total.toLocaleString()}</p>
                                <p><strong>Items:</strong> ${formattedItems.map(i => `${i.name} (x${i.quantity})`).join(', ')}</p>
                                <p><strong>Address:</strong> ${shipping?.address}, ${shipping?.city}</p>
                                <hr />
                                <p>Please log in to the admin panel to manage this order.</p>
                            </div>
                        `,
                    });

                    console.log(">>> [PAYSTACK WEBHOOK] Emails sent successfully.");
                } catch (err: unknown) {
                    console.error(">>> [PAYSTACK WEBHOOK] Email/PDF Error:", err instanceof Error ? err.message : err);
                }
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (err: unknown) {
        console.error('>>> [PAYSTACK WEBHOOK] Critical Error:', err instanceof Error ? err.message : err);
        return new Response(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`, { status: 500 });
    }
}