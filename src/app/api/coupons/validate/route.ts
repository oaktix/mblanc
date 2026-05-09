import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { code, amount } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
      include: { products: true }
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: "Invalid or inactive coupon" }, { status: 404 });
    }

    // Check expiry
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }

    // Check usage limit
    if (coupon.maxUsages && coupon.usageCount >= coupon.maxUsages) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }

    // Check minimum purchase
    if (coupon.minPurchase && amount < coupon.minPurchase) {
      return NextResponse.json({ 
        error: `Minimum purchase of ₦${coupon.minPurchase.toLocaleString()} required` 
      }, { status: 400 });
    }

    // Check maximum purchase restriction
    if (coupon.maxPurchase && amount > coupon.maxPurchase) {
      return NextResponse.json({ 
        error: `Coupon only valid for orders up to ₦${coupon.maxPurchase.toLocaleString()}` 
      }, { status: 400 });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === "PERCENTAGE") {
      discount = (amount * coupon.value) / 100;
    } else {
      discount = coupon.value;
    }

    return NextResponse.json({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount: Math.min(discount, amount), 
      scope: coupon.scope
    });

  } catch (error) {
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
