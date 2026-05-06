"use server";

import { resend } from "@/lib/resend";
import { getSiteSettings } from "./settings";

export async function sendInquiryAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;
  const phone = formData.get("phone") as string;

  const settings = await getSiteSettings();
  const brandEmail = "hello@mblancfits.com"; // Use verified domain address

  try {
    const { data, error } = await resend.emails.send({
      from: `MBlanc Concierge <hello@mblancfits.com>`,
      to: [brandEmail],
      replyTo: email,
      subject: `New Inquiry: ${subject || "General Inquiry"} - from ${name}`,
      html: `
        <div style="font-family: serif; padding: 40px; background-color: #fcfaf7; color: #1a1a1a;">
          <h1 style="color: #D4AF37; font-size: 24px; border-bottom: 1px solid #D4AF37; padding-bottom: 10px;">New Atelier Inquiry</h1>
          <p style="font-size: 16px; margin-top: 20px;">You have received a new message from the <strong>MBlanc Bespoke</strong> inquiry form.</p>
          
          <div style="background-color: white; padding: 20px; border: 1px solid #eee; margin-top: 30px;">
            <p><strong>Client:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          <p style="font-size: 12px; color: #888; margin-top: 40px;">This email was sent from the MBlanc Bespoke Concierge system.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { error: "Failed to send email. Please try again later." };
    }

    return { success: true };
  } catch (error) {
    console.error("Inquiry error:", error);
    return { error: "An unexpected error occurred." };
  }
}
