import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const resend = new Resend(process.env.RESEND_API_KEY);

async function mockWebhookFlow() {
    console.log("--- MOCK WEBHOOK FLOW START ---");
    
    // Mocking the data we'd get from Prisma
    const order = {
        id: "mock-order-id-123456",
        total: 75000,
        shippingDetails: {
            name: "Test Buyer",
            email: "oaktix.test@gmail.com", // CHANGE THIS to your test email
            address: "123 Mock Street",
            city: "Lagos"
        },
        items: [
            {
                product: { name: "Silk Agbada" },
                quantity: 1,
                price: 75000,
                variation: { size: "XL", color: "Blue" }
            }
        ]
    };

    const shipping = order.shippingDetails;
    const recipientEmail = (shipping?.email || "").trim();
    const adminEmail = process.env.ADMIN_EMAIL || "thebespokecity@gmail.com";

    console.log("Recipient Calculation:", { resolved: recipientEmail });

    if (recipientEmail && recipientEmail.includes('@')) {
        console.log("Sending Buyer Email...");
        const response = await resend.emails.send({
            from: 'MBlanc Bespoke <hello@mblancfits.com>',
            to: recipientEmail,
            subject: `Order Confirmation - #MBLANC-${order.id.slice(-6).toUpperCase()}`,
            html: `<h1>Order Confirmed</h1><p>Hi ${shipping.name}, your order ${order.id} is confirmed.</p>`
        });

        if (response.error) {
            console.error("❌ Buyer Email Error:", response.error);
        } else {
            console.log("✅ Buyer Email Accepted. ID:", response.data?.id);
        }

        console.log("Sending Admin Email...");
        const adminResponse = await resend.emails.send({
            from: 'MBlanc Bespoke <hello@mblancfits.com>',
            to: adminEmail,
            subject: `New Order Received - #${order.id.slice(-6).toUpperCase()}`,
            html: `<h1>New Order</h1><p>Order ${order.id} was placed by ${shipping.name}.</p>`
        });

        if (adminResponse.error) {
            console.error("❌ Admin Email Error:", adminResponse.error);
        } else {
            console.log("✅ Admin Email Accepted. ID:", adminResponse.data?.id);
        }
    } else {
        console.error("❌ No valid recipient email found!");
    }
    
    console.log("--- MOCK WEBHOOK FLOW END ---");
}

mockWebhookFlow();
