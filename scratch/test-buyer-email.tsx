import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import path from 'path';
import React from 'react';
import { OrderConfirmationEmail } from '../src/components/emails/OrderConfirmationEmail';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const apiKey = process.env.RESEND_API_KEY || '';
if (!apiKey) {
  console.error('RESEND_API_KEY not set');
  process.exit(1);
}

const resend = new Resend(apiKey);

async function testBuyerEmail() {
  console.log('Sending test buyer order confirmation...');
  const formattedItems = [{ name: 'Sample Garment', quantity: 1, price: 50000 }];
  try {
    const data = await resend.emails.send({
      from: 'MBlanc Bespoke <hello@mblancfits.com>',
      to: ['buyer@example.com'],
      subject: 'Order Confirmation - #TESTBUYER01',
      react: (
        <OrderConfirmationEmail
          orderId="TESTBUYER01"
          customerName="John Doe"
          items={formattedItems}
          total={50000}
          shippingAddress="123 Test St"
          shippingCity="Lagos"
        />
      ),
    });
    console.log('Response:', JSON.stringify(data, null, 2));
    if (data.error) {
      console.error('❌ Failed to send buyer email:', data.error);
    } else {
      console.log('✅ Buyer email sent successfully! ID:', data.data?.id);
    }
  } catch (err) {
    console.error('❌ Exception sending buyer email:', err);
  }
}

testBuyerEmail();
