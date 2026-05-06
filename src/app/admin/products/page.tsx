import prisma from "@/lib/prisma";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, ExternalLink } from "lucide-react";
import Image from "next/image";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-serif text-charcoal dark:text-ivory">Products Inventory</h1>
          <p className="text-gray-500 font-light mt-1">Manage your boutique collections and inventory.</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="px-6 py-2 bg-burgundy text-white font-semibold rounded-lg text-sm flex items-center gap-2 hover:bg-black transition-all"
        >
          <Plus size={18} />
          Add New Product
        </Link>
      </div>

      <div className="bg-white dark:bg-charcoal rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-50 dark:border-gray-900 flex justify-between items-center">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div className="flex gap-4">
             <button className="text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors">Export CSV</button>
             <button className="text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors">Filters</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-black text-[10px] uppercase tracking-widest text-gray-500 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 font-bold">Product</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Price</th>
                <th className="px-6 py-4 font-bold">Stock</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-black/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-14 bg-cream dark:bg-black rounded-md flex-shrink-0 flex items-center justify-center border border-gold/10">
                        {/* Image Placeholder */}
                        <span className="text-[10px] font-serif italic text-gold/50">Img</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-charcoal dark:text-ivory">{product.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-black rounded-md text-gray-600 dark:text-gray-400">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">₦{product.basePrice.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full italic uppercase tracking-wider ${
                      product.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link href={`/shop/${product.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-gold transition-colors">
                        <ExternalLink size={16} />
                      </Link>
                      <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-burgundy transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
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
