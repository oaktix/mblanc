import prisma from "@/lib/prisma";
import Link from "next/link";
import { Search, Eye, Filter, Download } from "lucide-react";
import { Suspense } from "react";
import AdminShell from "@/components/admin/AdminShell";

export const unstable_instant = { prefetch: "static" };

export default function AdminOrdersPage() {
  return (
    <AdminShell>
      <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-serif text-charcoal dark:text-ivory">Order Management</h1>
          <p className="text-gray-500 font-light mt-1">Track and manage bespoke requests and store orders.</p>
        </div>
        <div className="flex gap-4">
          <a href="/api/admin/export?type=orders" download className="px-6 py-2 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-800 text-charcoal dark:text-ivory font-semibold rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50 transition-all">
            <Download size={18} />
            Export
          </a>
        </div>
      </div>

      <div className="bg-white dark:bg-charcoal rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-50 dark:border-gray-900 flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by order ID or name..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>

        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-black text-[10px] uppercase tracking-widest text-gray-500 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 font-bold">Order ID</th>
                <th className="px-6 py-4 font-bold">Customer</th>
                <th className="px-6 py-4 font-bold">Items</th>
                <th className="px-6 py-4 font-bold">Total</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <Suspense fallback={
              <tbody>
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400 italic animate-pulse">
                    Loading orders...
                  </td>
                </tr>
              </tbody>
            }>
              <OrdersList />
            </Suspense>
          </table>
        </div>
      </div>
      </div>
    </AdminShell>
  );
}

async function OrdersList() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
      {orders.length > 0 ? (
        orders.map((order) => (
          <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-black/20 transition-colors">
            <td className="px-6 py-4 text-sm font-mono font-bold text-gold">#{order.id.slice(-6).toUpperCase()}</td>
            <td className="px-6 py-4">
              <div>
                <p className="text-sm font-semibold">{order.user?.name || "Guest Customer"}</p>
                <p className="text-xs text-gray-500">{order.user?.email || "No email"}</p>
              </div>
            </td>
            <td className="px-6 py-4 text-sm">{order.items.length} items</td>
            <td className="px-6 py-4 text-sm font-bold">₦{order.total?.toLocaleString() ?? "0"}</td>
            <td className="px-6 py-4">
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                order.status === "PROCESSING" ? "bg-blue-100 text-blue-700" :
                  "bg-amber-100 text-amber-700"
                }`}>
                {order.status}
              </span>
            </td>
            <td className="px-6 py-4 text-xs text-gray-500">
              {new Date(order.createdAt).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 text-right">
              <Link href={`/admin/orders/${order.id}`} className="p-2 text-gray-400 hover:text-gold transition-colors inline-block">
                <Eye size={18} />
              </Link>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={7} className="px-6 py-12 text-center text-gray-500 italic font-light">
            No orders have been placed yet.
          </td>
        </tr>
      )}
    </tbody>
  );
}
