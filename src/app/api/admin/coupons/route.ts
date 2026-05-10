import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "STAFF")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const p = prisma as any;
  try {
    const coupons = await p.coupon.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(coupons);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { code, type, value, scope, minPurchase, maxUsages, expiresAt } = body;

  const p = prisma as any;
  try {
    const coupon = await p.coupon.create({
      data: {
        code: code.toUpperCase(),
        type,
        value: Number(value),
        scope: scope || "SITEWIDE",
        minPurchase: minPurchase ? Number(minPurchase) : null,
        maxUsages: maxUsages ? Number(maxUsages) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      }
    });
    return NextResponse.json(coupon, { status: 201 });
  } catch (error: any) {
    console.error("Coupon creation error:", error);
    return NextResponse.json({ error: "Coupon code already exists or invalid data" }, { status: 409 });
  }
}
