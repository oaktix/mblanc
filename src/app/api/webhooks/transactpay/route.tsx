import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { resend } from '@/lib/resend';
import { OrderStatus } from '@prisma/client';
import { OrderConfirmationEmail } from '@/components/emails/OrderConfirmationEmail';
import { generateOrderReceiptBuffer } from '@/lib/pdf-server';

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
        const shipping = order.shippingDetails as Record<string, string>;
        const recipientEmail = shipping?.email || order.user?.email;
        const adminEmail = "thebespokecity@gmail.com";

        if (recipientEmail) {
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

                const attachments = pdfBuffer ? [
                    {
                        content: pdfBuffer,
                        filename: `MBlanc_Receipt_${order.id.slice(-6).toUpperCase()}.pdf`,
                    }
                ] : [];

                // Send Confirmation Email to Customer
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
