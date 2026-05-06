import { Orderstatus as OrderStatus } from '@prisma/client';
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Printer, Truck, CheckCircle, XCircle } from "lucide-react";
import { revalidatePath } from "next/cache";

import { resend } from "@/lib/resend";
import { OrderUpdateEmail } from "@/components/emails/OrderUpdateEmail";

async function updateOrderstatus as OrderStatus(orderId: string, status as OrderStatus: string) {
  "use server";
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: status as OrderStatus },
    include: { user: true },
  });

  if (order.user?.email) {
    try {
      await resend.emails.send({
        from: "MBlanc Bespoke <hello@mblancfits.com>",
        to: order.user.email,
        subject: `Order Update: #${order.id.slice(-6).toUpperCase()} is now ${status as OrderStatus}`,
        react: OrderUpdateEmail({
          orderId: order.id,
          customerName: order.user.name || "Gentleman",
          status as OrderStatus: status as OrderStatus,
        }),
      });
    } catch (error) {
      console.error("Failed to send email notification:", error);
    }
  }

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div>
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link
            href="/admin/orders"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gold transition-colors mb-4"
          >
            <ChevronLeft size={16} />
            Back to Orders
          </Link>
          <h1 className="text-3xl font-serif text-charcoal dark:text-ivory">Order #{order.id.slice(-6).toUpperCase()}</h1>
          <p className="text-gray-500 font-light mt-1">Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-800 text-charcoal dark:text-ivory font-semibold rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50 transition-all">
            <Printer size={18} />
            Print Invoice
          </button>
          <form action={async () => {
            "use server";
            await updateOrderstatus as OrderStatus(order.id, "DELIVERED");
          }}>
            <button type="submit" className="px-6 py-2 bg-burgundy text-white font-semibold rounded-lg text-sm flex items-center gap-2 hover:bg-black transition-all">
              <CheckCircle size={18} />
              Mark Delivered
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Left: Order Items & Customer Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-charcoal rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-50 dark:border-gray-900">
              <h2 className="text-lg font-serif">Order Items</h2>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-900">
              {order.items.map((item) => (
                <div key={item.id} className="p-6 flex items-center gap-6">
                  <div className="w-16 h-20 bg-cream dark:bg-black rounded-md flex-shrink-0 border border-gold/10"></div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold">{item.product.name}</h3>
                    <p className="text-xs text-gray-500 italic mt-1">SKU: {item.product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">₦{item.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-gray-50 dark:bg-black/50 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">₦{order.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium">₦0.00</span>
              </div>
              <div className="flex justify-between text-lg font-serif border-t border-gray-200 dark:border-gray-800 pt-3 mt-3">
                <span>Total</span>
                <span className="text-gold font-bold">₦{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-charcoal p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-serif mb-6">Customer Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Personal Info</label>
                <p className="text-sm font-semibold">{order.user?.name || "Guest Customer"}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{order.user?.email || "No email provided"}</p>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Shipping Address</label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  460 Yusuf Abubakar Yusuf Street<br />
                  Beside Purple Heart<br />
                  Abuja, Nigeria
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Order status as OrderStatus Timeline */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-charcoal p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-serif mb-6">Order status as OrderStatus</h2>
            <div className="space-y-6 relative">
              <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-gray-100 dark:bg-gray-800"></div>

              <div className="flex gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-gold flex items-center justify-center text-black">
                  <CheckCircle size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold">Order Placed</p>
                  <p className="text-xs text-gray-500">The customer initiated the bespoke request.</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${["PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status as OrderStatus) ? "bg-gold text-black" : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                  }`}>
                  <Truck size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold">Artisan Crafting</p>
                  <p className="text-xs text-gray-500">Garment is being meticulously tailored in our atelier.</p>
                </div>
              </div>

              <div className="flex gap-4 relative z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${order.status as OrderStatus === "DELIVERED" ? "bg-gold text-black" : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                  }`}>
                  <CheckCircle size={14} />
                </div>
                <div>
                  <p className="text-sm font-bold">Delivered</p>
                  <p className="text-xs text-gray-500">Order successfully reached the client.</p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-50 dark:border-gray-900">
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-4 font-bold">Update status as OrderStatus</label>
              <div className="grid grid-cols-1 gap-3">
                {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((status as OrderStatus) => (
                <form key={status as OrderStatus} action={async () => {
                  "use server";
                  await updateOrderstatus as OrderStatus(order.id, status as OrderStatus);
                }}>
                  <button
                    type="submit"
                    className={`w-full py-2 px-4 text-xs font-bold rounded-lg border transition-all ${order.status as OrderStatus === status as OrderStatus
                        ? "bg-gold border-gold text-black"
                        : "border-gray-200 dark:border-gray-800 text-gray-500 hover:border-gold hover:text-gold"
                      }`}
                  >
                    {status as OrderStatus}
                  </button>
                </form>
                    ))}
              </div>
            </div>
          </div>

          <div className="bg-burgundy/10 p-6 rounded-xl border border-burgundy/20">
            <h3 className="text-sm font-bold text-burgundy mb-2">Internal Note</h3>
            <p className="text-xs text-burgundy/70 font-light italic">
              Client requested extra tapering on the trousers. Ensure master tailor is aware before final fitting.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

