import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import prisma from "@/lib/prisma";
import { TrendingUp, ShoppingBag, Users, Package2, ArrowUpRight } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import ExportButton from "@/components/admin/ExportButton";
import { Suspense } from "react";

export const unstable_instant = { prefetch: "static" };

export default function AdminPage() {
  return (
    <AdminShell>
      <Suspense fallback={<div className="animate-pulse h-screen bg-gray-100 dark:bg-black/20 rounded-xl"></div>}>
        <DashboardContent />
      </Suspense>
    </AdminShell>
  );
}

async function DashboardContent() {
  const session = await getServerSession(authOptions);
  const isAuthenticated =
    session?.user?.role === "ADMIN" || session?.user?.role === "STAFF";

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  const [totalRevenue, totalOrders, totalCustomers, totalProducts, recentOrders, latestProducts, dailySales] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "SUCCESS" } }),
    prisma.order.count({ where: { paymentStatus: "SUCCESS" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count(),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } }
    }),
    prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: "desc" }
    }),
    // Fetch sales for last 7 days
    prisma.order.groupBy({
      by: ['createdAt'],
      where: { 
        paymentStatus: "SUCCESS",
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      },
      _sum: { total: true }
    })
  ]);

  // Process daily sales for the chart
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const chartData = last7Days.map(date => {
    const dayTotal = dailySales
      .filter(s => new Date(s.createdAt).toDateString() === date.toDateString())
      .reduce((acc, curr) => acc + (curr._sum.total || 0), 0);
    
    return {
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      value: dayTotal
    };
  });

  const STATS = [
    { name: "Total Revenue", value: `₦${(totalRevenue._sum.total || 0).toLocaleString()}`, icon: TrendingUp, change: "+0%", color: "text-green-600" },
    { name: "Total Orders", value: totalOrders.toString(), icon: ShoppingBag, change: "+0%", color: "text-blue-600" },
    { name: "Active Customers", value: totalCustomers.toString(), icon: Users, change: "+0%", color: "text-purple-600" },
    { name: "Total Products", value: totalProducts.toString(), icon: Package2, change: "0%", color: "text-amber-600" },
  ];

  return (
    <div className="pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-serif text-charcoal dark:text-ivory">Dashboard Overview</h1>
          <p className="text-gray-500 font-light mt-1">Monitor your atelier&apos;s performance and orders in real-time.</p>
        </div>
        <div className="flex gap-3">
          <a href="/admin/orders" className="px-5 py-2.5 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-800 text-charcoal dark:text-ivory font-medium rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50 transition-all">
            Manage Orders
          </a>
          <ExportButton type="orders" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white dark:bg-charcoal p-6 border border-gray-100 dark:border-gray-800 shadow-sm rounded-xl hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-lg bg-gray-50 dark:bg-black/40 ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${stat.change.startsWith("+") ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest">{stat.name}</p>
              <p className="text-2xl font-bold text-charcoal dark:text-ivory mt-1 font-serif">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Sales Chart Section */}
      <div className="mb-12 bg-white dark:bg-charcoal p-8 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-serif text-charcoal dark:text-ivory">Sales Performance</h2>
            <p className="text-sm text-gray-400 font-light">Daily revenue for the past 7 days</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <div className="w-3 h-3 bg-gold rounded-full"></div>
            <span>Revenue (NGN)</span>
          </div>
        </div>
        
        <div className="h-64 w-full flex items-end gap-2 md:gap-4 px-2">
          {chartData.map((data, i) => {
            const maxValue = Math.max(...chartData.map(d => d.value), 100000);
            const height = (data.value / maxValue) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                <div className="relative w-full flex justify-center">
                  {/* Tooltip */}
                  <div className="absolute -top-12 bg-charcoal text-white text-[10px] py-1.5 px-2.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl pointer-events-none">
                    ₦{data.value.toLocaleString()}
                  </div>
                  {/* Bar */}
                  <div 
                    className="w-full max-w-[40px] bg-gradient-to-t from-gold/40 to-gold rounded-t-lg transition-all duration-700 ease-out hover:brightness-110 cursor-pointer"
                    style={{ height: `${Math.max(height, 5)}%` }}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{data.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-charcoal p-8 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-8 border-b border-gray-50 dark:border-gray-900 pb-4">
            <h2 className="text-xl font-serif text-charcoal dark:text-ivory">Recent Orders</h2>
            <a href="/admin/orders" className="text-xs font-bold text-gold hover:underline uppercase tracking-widest">View All</a>
          </div>
          <div className="space-y-6">
            {recentOrders.length > 0 ? recentOrders.map((order) => (
              <div key={order.id} className="flex justify-between items-center group cursor-pointer hover:bg-gray-50 dark:hover:bg-black/20 p-2 -m-2 rounded-xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cream dark:bg-black rounded-full flex items-center justify-center font-serif text-gold text-lg border border-gold/10">
                    {order.user?.name?.[0] || "O"}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-charcoal dark:text-ivory group-hover:text-gold transition-colors">Order #{order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-[11px] text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()} • {order.user?.name || "Guest Customer"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-charcoal dark:text-ivory">₦{order.total.toLocaleString()}</p>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                    order.status === "DELIVERED" ? "bg-green-100 text-green-700" : 
                    order.status === "CANCELLED" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className="py-10 text-center">
                <ShoppingBag className="mx-auto text-gray-200 mb-3" size={40} />
                <p className="text-gray-400 text-sm">No orders yet</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-charcoal p-8 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-8 border-b border-gray-50 dark:border-gray-900 pb-4">
            <h2 className="text-xl font-serif text-charcoal dark:text-ivory">Latest Products</h2>
            <a href="/admin/products" className="text-xs font-bold text-gold hover:underline uppercase tracking-widest">View All</a>
          </div>
          <div className="space-y-6">
            {latestProducts.length > 0 ? latestProducts.map((product) => (
              <div key={product.id} className="flex justify-between items-center group cursor-pointer hover:bg-gray-50 dark:hover:bg-black/20 p-2 -m-2 rounded-xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-14 bg-gray-50 dark:bg-black rounded-lg overflow-hidden border border-gray-100 dark:border-gray-900 flex items-center justify-center">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package2 className="text-gold/30" size={20} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-charcoal dark:text-ivory group-hover:text-gold transition-colors">{product.name}</p>
                    <p className="text-[11px] text-gray-500">{product.category} • {new Date(product.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-charcoal dark:text-ivory">₦{product.basePrice.toLocaleString()}</p>
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                    product.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {product.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className="py-10 text-center">
                <Package2 className="mx-auto text-gray-200 mb-3" size={40} />
                <p className="text-gray-400 text-sm">No products added</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
