import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const apiKey = process.env.RESEND_API_KEY;
const resend = new Resend(apiKey);

async function troubleshootResend() {
  console.log("--- RESEND DEEP TROUBLESHOOTER ---");
  
  const testRecipients = [
    'thebespokecity@gmail.com', // Primary Admin (likely verified)
    'oaktix.test@gmail.com'      // External (unverified)
  ];

  for (const to of testRecipients) {
    console.log(`\nTesting delivery to: ${to}`);
    
    // Test 1: Sending from Custom Domain
    console.log(`Attempt 1: Sending from hello@mblancfits.com...`);
    const res1 = await resend.emails.send({
      from: 'MBlanc Bespoke <hello@mblancfits.com>',
      to: to,
      subject: `Test from Custom Domain [${new Date().toLocaleTimeString()}]`,
      html: `<p>Testing delivery from custom domain to ${to}</p>`
    });
    console.log("Result 1:", JSON.stringify(res1, null, 2));

    // Test 2: Sending from Resend Default (Onboarding)
    // NOTE: This usually only works to the email that signed up for Resend
    console.log(`Attempt 2: Sending from onboarding@resend.dev...`);
    const res2 = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: to,
      subject: `Test from Onboarding Domain [${new Date().toLocaleTimeString()}]`,
      html: `<p>Testing delivery from onboarding@resend.dev to ${to}</p>`
    });
    console.log("Result 2:", JSON.stringify(res2, null, 2));
  }

  console.log("\n--- TROUBLESHOOTER COMPLETE ---");
  console.log("ADVICE:");
  console.log("1. If Attempt 1 fails but Attempt 2 succeeds, your domain 'mblancfits.com' is not verified in Resend.");
  console.log("2. If both say 'success' but you receive neither, check Spam/Junk.");
  console.log("3. If both say 'success' but only the admin gets it, your account is in Sandbox mode.");
}

troubleshootResend();
