import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const apiKey = process.env.RESEND_API_KEY;
const resend = new Resend(apiKey);

async function testExternalEmail() {
  const externalEmail = 'oaktix.test@gmail.com'; // A random external email
  console.log(`Testing delivery to EXTERNAL address: ${externalEmail}...`);
  
  try {
    const data = await resend.emails.send({
      from: 'MBlanc Bespoke <hello@mblancfits.com>',
      to: externalEmail,
      subject: 'External Delivery Test',
      html: '<p>If you receive this, Resend is allowed to send to external addresses.</p>'
    });

    console.log("Response:", JSON.stringify(data, null, 2));

    if (data.error) {
      console.error("❌ Failed to send to external address:", data.error);
      if (data.error.name === 'restricted_access' || data.error.message?.includes('verified')) {
        console.error("🚩 DIAGNOSIS: Your Resend account is restricted to verified emails only. You need to verify your domain or add this email to your verified list.");
      }
    } else {
      console.log("✅ Sent successfully to external address!");
    }
  } catch (error) {
    console.error("❌ Exception:", error);
  }
}

testExternalEmail();
