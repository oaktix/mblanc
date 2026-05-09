import React from 'react';
import { generateOrderReceiptBuffer } from '../src/lib/pdf-server';
import { resend } from '../src/lib/resend';
import { OrderConfirmationEmail } from '../src/components/emails/OrderConfirmationEmail';

async function testDelivery() {
  console.log(">>> Starting Delivery Test...");

  const testOrder = {
    id: "test-order-123456789",
    customerName: "Test Client",
    total: 150000,
    items: [
      {
        name: "Midnight Blue Bespoke Suit",
        quantity: 1,
        price: 150000,
        size: "L",
        color: "Midnight Blue"
      }
    ],
    shippingAddress: "123 Test Street, Abuja",
  };

  try {
    console.log(">>> Generating PDF...");
    const pdfBuffer = await generateOrderReceiptBuffer({
      id: testOrder.id,
      customerName: testOrder.customerName,
      items: testOrder.items,
      total: testOrder.total,
      shippingAddress: testOrder.shippingAddress,
    });
    console.log(">>> PDF Generated successfully. Size:", pdfBuffer.length);

    console.log(">>> Sending Email via Resend...");
    const { data, error } = await resend.emails.send({
      from: 'MBlanc Bespoke <orders@mblancfits.com>',
      to: 'hello@mblancfits.com', // Sending to admin as test
      subject: `TEST: Order Confirmed - #${testOrder.id.slice(-6).toUpperCase()}`,
      react: React.createElement(OrderConfirmationEmail, {
        orderId: testOrder.id,
        customerName: testOrder.customerName,
        total: testOrder.total,
        items: testOrder.items,
        shippingAddress: testOrder.shippingAddress,
        shippingCity: "Abuja",
      }),
      attachments: [
        {
          filename: `MBLANC-Receipt-TEST.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    if (error) {
      console.error(">>> Resend Error:", error);
    } else {
      console.log(">>> Email sent successfully! ID:", data?.id);
    }
  } catch (err) {
    console.error(">>> Delivery Test Failed:", err);
  }
}

testDelivery();
