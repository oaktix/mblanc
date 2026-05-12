import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { resend } from '@/lib/resend';
import { OrderStatus } from '@prisma/client';
import { OrderConfirmationEmail } from '@/components/emails/OrderConfirmationEmail';
import { generateOrderReceiptBuffer } from '@/lib/pdf-server';
import { render } from '@react-email/render';

/**
 * TransactPay Webhook Handler
 * 
 * TransactPay sends POST requests to this endpoint with payment status updates.
 * The webhook payload includes the order reference and payment status.
 * 
 * NOTE: Replace the signature verification below with TransactPay's actual
 * verification method once their webhook signing docs are available.
 */
export async function POST(req: Request) {
    console.log(">>> [TRANSACTPAY WEBHOOK] Request Received");

    try {
        const body = await req.text();
        const event = JSON.parse(body);

        console.log(">>> [TRANSACTPAY WEBHOOK] Full Event Body:", JSON.stringify(event, null, 2));

        if (process.env.RESEND_API_KEY?.startsWith('re_dummy')) {
            console.warn(">>> [TRANSACTPAY WEBHOOK] WARNING: Using dummy Resend API key!");
        }

        // TODO: Add TransactPay signature verification once API keys are configured
        // TransactPay may send a signature header for verification — check their docs.
        // For now, we validate by checking the order exists and matches expected data.

        const reference = event?.data?.reference || event?.reference;
        const status = event?.data?.status || event?.status;

        if (!reference) {
            console.error(">>> [TRANSACTPAY WEBHOOK] No reference in payload");
            return NextResponse.json({ error: "No reference provided" }, { status: 400 });
        }

        console.log(">>> [TRANSACTPAY WEBHOOK] Processing Reference:", reference, "Status:", status);

        // Check if payment was successful
        const isSuccessful = status?.toLowerCase() === "successful" || 
                             status?.toLowerCase() === "success" ||
                             event?.event === "charge.success";

        if (!isSuccessful) {
            console.log(">>> [TRANSACTPAY WEBHOOK] Non-success status:", status);
            return NextResponse.json({ received: true }, { status: 200 });
        }

        // Find order
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
            console.error(`>>> [TRANSACTPAY WEBHOOK] Order ${reference} not found in DB.`);
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // IDEMPOTENCY CHECK: If already paid, don't process again
        if (existingOrder.paymentStatus === "SUCCESS") {
            console.log(">>> [TRANSACTPAY WEBHOOK] Order already processed. Skipping.");
            return NextResponse.json({ received: true }, { status: 200 });
        }

        // Verify this order was intended for TransactPay
        if (existingOrder.paymentProvider !== "transactpay") {
            console.warn(`>>> [TRANSACTPAY WEBHOOK] Order ${reference} has provider "${existingOrder.paymentProvider}", expected "transactpay".`);
        }

        // Update Order Status
        const order = await prisma.order.update({
            where: { id: reference },
            data: {
                status: OrderStatus.PROCESSING,
                paymentStatus: "SUCCESS",
                transactpayRef: event?.data?.transactionId || reference,
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

        console.log(">>> [TRANSACTPAY WEBHOOK] Database updated successfully.");

        // Email & Receipt Logic (same as Paystack webhook)
        const shipping = (order.shippingDetails || {}) as Record<string, any>;
        console.log(">>> [TRANSACTPAY WEBHOOK] Raw Shipping Details from DB:", JSON.stringify(shipping, null, 2));
        const recipientEmail = (shipping?.email || order.user?.email || "").trim();
        const adminEmail = process.env.ADMIN_EMAIL || "thebespokecity@gmail.com";

        console.log(">>> [TRANSACTPAY WEBHOOK] Recipient Email Calculation:", {
            shippingEmail: shipping?.email,
            userEmail: order.user?.email,
            resolved: recipientEmail
        });

        if (recipientEmail && recipientEmail.includes('@')) {
            console.log(">>> [TRANSACTPAY WEBHOOK] Generating PDF and sending emails...");

            try {
                const formattedItems = order.items.map((item) => ({
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
                    console.error('>>> [TRANSACTPAY WEBHOOK] PDF Generation Failed:', pdfError);
                }

                // 4. Send Confirmation Email to Customer
                try {
                    const attachments = pdfBuffer ? [
                        {
                            content: pdfBuffer,
                            filename: `MBlanc_Receipt_${order.id.slice(-6).toUpperCase()}.pdf`,
                        }
                    ] : [];

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
                        console.log(">>> [TRANSACTPAY WEBHOOK] Email rendered to HTML successfully.");
                    } catch (renderError) {
                        console.error(">>> [TRANSACTPAY WEBHOOK] Email Rendering Failed:", renderError);
                        // Fallback to simple HTML if React rendering fails
                        emailHtml = `<h1>Order Confirmation</h1><p>Hi, your order #${order.id.slice(-6).toUpperCase()} is confirmed.</p>`;
                    }

                    const response = await resend.emails.send({
                        from: 'MBlanc Bespoke <hello@mblancfits.com>',
                        to: recipientEmail,
                        subject: `Order Confirmation - #MBLANC-${order.id.slice(-6).toUpperCase()}`,
                        html: emailHtml,
                        attachments: attachments,
                    });
                    
                    if (response.error) {
                        console.error(">>> [TRANSACTPAY WEBHOOK] Buyer email Resend error:", response.error);
                    } else {
                        console.log(`>>> [TRANSACTPAY WEBHOOK] Buyer email accepted by Resend. ID: ${response.data?.id}`);
                    }
                } catch (customerEmailErr) {
                    console.error(">>> [TRANSACTPAY WEBHOOK] Customer email failed:", customerEmailErr);
                    // Log full error for debugging
                    if (typeof customerEmailErr === 'object') {
                        console.error(JSON.stringify(customerEmailErr, null, 2));
                    }
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
                                <p>A new order has been paid via <strong>TransactPay</strong> and confirmed.</p>
                                <hr />
                                <p><strong>Order ID:</strong> #${order.id}</p>
                                <p><strong>Customer:</strong> ${shipping?.name} (${recipientEmail})</p>
                                <p><strong>Amount:</strong> ₦${order.total.toLocaleString()}</p>
                                <p><strong>Payment Gateway:</strong> TransactPay</p>
                                <p><strong>Items:</strong> ${formattedItems.map((i) => `${i.name} (x${i.quantity})`).join(', ')}</p>
                                <p><strong>Address:</strong> ${shipping?.address}, ${shipping?.city}</p>
                                <hr />
                                <p>Please log in to the admin panel to manage this order.</p>
                            </div>
                        `,
                    });
                    console.log(">>> [TRANSACTPAY WEBHOOK] Admin notification email sent.");
                } catch (adminEmailErr) {
                    console.error(">>> [TRANSACTPAY WEBHOOK] Admin email failed:", adminEmailErr);
                }

                console.log(">>> [TRANSACTPAY WEBHOOK] Emails sent successfully.");
            } catch (err: unknown) {
                console.error(">>> [TRANSACTPAY WEBHOOK] Email/PDF Error:", err instanceof Error ? err.message : err);
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (err: unknown) {
        console.error('>>> [TRANSACTPAY WEBHOOK] Critical Error:', err instanceof Error ? err.message : err);
        return new Response(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`, { status: 500 });
    }
}
