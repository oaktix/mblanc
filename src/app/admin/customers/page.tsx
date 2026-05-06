import prisma from "@/lib/prisma";
import { Search, Mail, Phone, Calendar, ShoppingBag } from "lucide-react";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      orders: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-serif text-charcoal dark:text-ivory">Client Directory</h1>
        <p className="text-gray-500 font-light mt-1">Manage your relationship with the distinguished clientele of MBlanc.</p>
      </div>

      <div className="bg-white dark:bg-charcoal rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-50 dark:border-gray-900 flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-black text-[10px] uppercase tracking-widest text-gray-500 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 font-bold">Client</th>
                <th className="px-6 py-4 font-bold">Contact</th>
                <th className="px-6 py-4 font-bold">Join Date</th>
                <th className="px-6 py-4 font-bold">Orders</th>
                <th className="px-6 py-4 font-bold">Total Spent</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50/50 dark:hover:bg-black/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cream dark:bg-black border border-gold/20 flex items-center justify-center font-serif text-gold text-xs">
                        {customer.name?.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <Mail size={12} className="text-gold" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400">
                        <Phone size={12} />
                        Not provided
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={14} />
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs">
                      <ShoppingBag size={14} className="text-gray-400" />
                      {customer.orders.length} orders
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-burgundy">
                    ₦{customer.orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[10px] uppercase tracking-widest font-bold text-gold hover:text-black dark:hover:text-ivory transition-colors">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
