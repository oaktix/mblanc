import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { resend } from '@/lib/resend';
import { OrderStatus } from '@prisma/client';
import { OrderConfirmationEmail } from '@/components/emails/OrderConfirmationEmail';
import { render } from '@react-email/render';

export async function POST(req: Request) {
    console.log(">>> [PAYSTACK WEBHOOK] Request Received");

    try {
        const body = await req.text();
        const paystackSignature = req.headers.get('x-paystack-signature');

        if (process.env.RESEND_API_KEY?.startsWith('re_dummy')) {
            console.warn(">>> [PAYSTACK WEBHOOK] WARNING: Using dummy Resend API key!");
        }

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

        console.log(">>> [PAYSTACK WEBHOOK] Full Event Body:", JSON.stringify({
            event: event.event,
            data: {
                reference: event.data?.reference,
                customer: {
                    email: event.data?.customer?.email,
                    first_name: event.data?.customer?.first_name,
                    last_name: event.data?.customer?.last_name
                },
                metadata: event.data?.metadata
            }
        }, null, 2));

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
            const shipping = (order.shippingDetails || {}) as Record<string, string>;
            const recipientEmail = (shipping?.email || customer?.email || order.user?.email || "").trim();
            const adminEmail = process.env.ADMIN_EMAIL || "thebespokecity@gmail.com";

            console.log(">>> [PAYSTACK WEBHOOK] Recipient Email Calculation:", {
                shippingEmail: shipping?.email,
                customerEmail: customer?.email,
                userEmail: order.user?.email,
                resolved: recipientEmail
            });

            if (recipientEmail && recipientEmail.includes('@')) {
                try {
                    // Prepare items data for Email
                    const formattedItems = order.items.map(item => ({
                        name: String(item.product.name),
                        quantity: Number(item.quantity),
                        price: Number(item.price),
                        size: item.variation?.size ? String(item.variation.size) : null,
                        color: item.variation?.color ? String(item.variation.color) : null,
                    }));

                    // 4. Send Confirmation Email to Customer
                    try {
                        // 4a. Render Email to HTML locally to catch rendering errors
                        let emailHtml = "";
                        try {
                            emailHtml = await render(
                                <OrderConfirmationEmail 
                                    orderId={order.id}
                                    customerName={String(shipping?.name || order.user?.name || 'Valued Client')}
                                    items={formattedItems}
                                    total={order.total}
                                    shippingAddress={String(shipping?.address || '')}
                                    shippingCity={String(shipping?.city || '')}
                                />
                            );
                            console.log(">>> [PAYSTACK WEBHOOK] Email rendered to HTML successfully.");
                        } catch (renderError) {
                            console.error(">>> [PAYSTACK WEBHOOK] Email Rendering Failed:", renderError);
                            // Fallback to simple HTML if React rendering fails
                            emailHtml = `<h1>Order Confirmation</h1><p>Hi, your order #${order.id.slice(-6).toUpperCase()} is confirmed.</p>`;
                        }

                        const response = await resend.emails.send({
                            from: 'MBlanc Bespoke <hello@mblancfits.com>',
                            to: recipientEmail,
                            reply_to: 'thebespokecity@gmail.com',
                            subject: `Order Confirmation - #MBLANC-${order.id.slice(-6).toUpperCase()}`,
                            html: emailHtml,
                        });
                        
                        if (response.error) {
                            console.error(">>> [PAYSTACK WEBHOOK] Buyer email Resend error:", response.error);
                        } else {
                            console.log(`>>> [PAYSTACK WEBHOOK] Buyer email accepted by Resend. ID: ${response.data?.id}`);
                        }
                    } catch (customerEmailErr) {
                        console.error(">>> [PAYSTACK WEBHOOK] Customer email failed:", customerEmailErr);
                    }

                    // 5. Send to Admin
                    try {
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
                        console.log(">>> [PAYSTACK WEBHOOK] Admin notification email sent.");
                    } catch (adminEmailErr) {
                        console.error(">>> [PAYSTACK WEBHOOK] Admin email failed:", adminEmailErr);
                    }

                    console.log(">>> [PAYSTACK WEBHOOK] Emails sent successfully.");
                } catch (err: unknown) {
                    console.error(">>> [PAYSTACK WEBHOOK] Email processing error:", err instanceof Error ? err.message : err);
                }
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (err: unknown) {
        console.error('>>> [PAYSTACK WEBHOOK] Critical Error:', err instanceof Error ? err.message : err);
        return new Response(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`, { status: 500 });
    }
}