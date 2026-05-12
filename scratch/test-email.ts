import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.error("No RESEND_API_KEY found in .env");
  process.exit(1);
}

const resend = new Resend(apiKey);

async function testEmail() {
  console.log("Sending test admin order notification to admin@mblancfits.com and backup...");
  try {
    const data = await resend.emails.send({
      from: 'MBlanc Bespoke <hello@mblancfits.com>',
      to: ['admin@mblancfits.com', 'thebespokecity@gmail.com'],
      subject: 'New Order Received - #TEST01',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>New Order Alert</h2>
          <p>This is a <strong>test email</strong> confirming that admin order notifications are working correctly.</p>
          <hr />
          <p><strong>Order ID:</strong> #TEST-ORDER-01</p>
          <p><strong>Customer:</strong> Test Customer (test@example.com)</p>
          <p><strong>Amount:</strong> ₦50,000</p>
          <p><strong>Items:</strong> White Agbada (x1)</p>
          <p><strong>Address:</strong> 12 Lagos Street, Abuja</p>
          <hr />
          <p>If you received this, email delivery to thebespokecity@gmail.com is working correctly ✅</p>
        </div>
      `,
    });

    console.log("Response:", JSON.stringify(data, null, 2));

    if (data.error) {
      console.error("❌ Failed to send:", data.error);
    } else {
      console.log("✅ Email sent successfully! Message ID:", data.data?.id);
    }
  } catch (error) {
    console.error("❌ Exception thrown:", error);
  }
}

testEmail();
