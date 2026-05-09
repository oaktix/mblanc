import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Don't reveal if user exists for security
      return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpiry: expiry,
      },
    });

    const resetLink = `${process.env.NEXTAUTH_URL}/admin/reset-password?token=${token}`;

    // Send email
    try {
      await resend.emails.send({
        from: "MBLANC Atelier <onboarding@resend.dev>", // Replace with verified domain in production
        to: email,
        subject: "Security: Password Reset Request",
        html: `
          <div style="font-family: serif; background-color: #000; color: #f5f5f0; padding: 40px; text-align: center; border: 1px solid #d4af37;">
            <h1 style="color: #d4af37; letter-spacing: 0.2em; text-transform: uppercase;">MBLANC</h1>
            <p style="text-transform: uppercase; letter-spacing: 0.1em; font-size: 12px; color: #888;">Security Portal Recovery</p>
            <div style="margin: 40px 0; padding: 20px; border-top: 1px solid #333; border-bottom: 1px solid #333;">
              <p>You requested a password reset for your Atelier personnel account.</p>
              <p style="margin-top: 20px;">
                <a href="${resetLink}" style="background-color: #d4af37; color: #000; padding: 15px 30px; text-decoration: none; font-weight: bold; text-transform: uppercase; border-radius: 5px;">Reset Security Password</a>
              </p>
            </div>
            <p style="font-size: 10px; color: #666;">If you did not request this, please ignore this email. This link will expire in 1 hour.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error(">>> Error sending reset email:", emailError);
      // Still return success so we don't leak info, but log it
    }

    return NextResponse.json({ message: "Reset link generated" });
  } catch (error) {
    console.error(">>> Forgot password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
