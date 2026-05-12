import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testPlainText() {
  const to = 'thebespokecity@gmail.com';
  console.log(`Sending PLAIN TEXT email to ${to}...`);
  
  try {
    const data = await resend.emails.send({
      from: 'MBlanc <hello@mblancfits.com>',
      to: to,
      subject: 'Plain Text Test',
      text: 'This is a plain text email. If you receive this, your domain and Resend account are working for text-only delivery.'
    });

    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Exception:", error);
  }
}

testPlainText();
