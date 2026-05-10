import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Resend } from "resend";
import { POSReceiptEmail } from "@/components/emails/POSReceiptEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, orderId, customerName, items, total, discount, paymentMethod } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: "MBlanc Bespoke <orders@mblancfits.com>",
      to: [email],
      subject: `Receipt for Order #${orderId.slice(-6).toUpperCase()} - MBlanc Bespoke`,
      react: POSReceiptEmail({
        orderId,
        customerName,
        items,
        total,
        discount,
        paymentMethod,
      }),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error sending POS receipt email:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
