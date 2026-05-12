import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testAccountOwner() {
  const to = 'thryveeonline@gmail.com'; // The verified account owner email
  console.log(`Sending test email to ACCOUNT OWNER: ${to}...`);
  
  try {
    const data = await resend.emails.send({
      from: 'MBlanc <hello@mblancfits.com>',
      to: to,
      subject: 'Account Owner Test',
      html: '<p>If you receive this, the API key is working perfectly for the account owner.</p>'
    });

    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Exception:", error);
  }
}

testAccountOwner();
