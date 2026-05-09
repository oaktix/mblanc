"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Tag, Calendar, Users, Percent, DollarSign, Loader2, X } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    code: "",
    type: "PERCENTAGE",
    value: 0,
    scope: "SITEWIDE",
    minPurchase: 0,
    maxPurchase: 0,
    maxUsages: 0,
    expiresAt: "",
  });

  const fetchCoupons = async () => {
    const res = await fetch("/api/admin/coupons");
    const data = await res.json();
    setCoupons(data);
    setLoading(false);
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setFormData({
      code: "",
      type: "PERCENTAGE",
      value: 0,
      scope: "SITEWIDE",
      minPurchase: 0,
      maxPurchase: 0,
      maxUsages: 0,
      expiresAt: "",
    });
    setIsAdding(false);
    await fetchCoupons();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
    await fetchCoupons();
  };

  const toggleStatus = async (id: string, current: boolean) => {
    await fetch(`/api/admin/coupons/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !current }),
    });
    await fetchCoupons();
  };

  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-serif text-charcoal dark:text-ivory">Promotions & Coupons</h1>
            <p className="text-gray-500 font-light mt-1">Generate and manage promotional codes for your clientele.</p>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="px-6 py-2 bg-burgundy text-white font-semibold rounded-lg text-sm flex items-center gap-2 hover:bg-black transition-all"
          >
            <Plus size={18} />
            Create Coupon
          </button>
        </div>

        {isAdding && (
          <div className="bg-white dark:bg-charcoal rounded-xl border border-gold/20 p-8 mb-10 shadow-xl">
            <h3 className="text-lg font-serif mb-6 italic">New Promotional Code</h3>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Code</label>
                <input required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="E.G. LUXE20" className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:border-gold">
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FLAT">Flat (₦)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Value</label>
                <input type="number" required value={formData.value} onChange={e => setFormData({...formData, value: parseFloat(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Min Purchase</label>
                <input type="number" value={formData.minPurchase} onChange={e => setFormData({...formData, minPurchase: parseFloat(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Max Purchase</label>
                <input type="number" value={formData.maxPurchase} onChange={e => setFormData({...formData, maxPurchase: parseFloat(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Usage Limit</label>
                <input type="number" value={formData.maxUsages} onChange={e => setFormData({...formData, maxUsages: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:border-gold" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Expiry Date</label>
                <input type="date" value={formData.expiresAt} onChange={e => setFormData({...formData, expiresAt: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:border-gold" />
              </div>
              <div className="md:col-span-4 flex justify-end gap-4">
                <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-2 text-sm font-medium text-gray-500">Cancel</button>
                <button type="submit" className="px-10 py-2 bg-gold text-black font-bold rounded-lg text-sm hover:bg-black hover:text-white transition-all">Save Coupon</button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white dark:bg-charcoal rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-black text-[10px] uppercase tracking-widest text-gray-500 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 font-bold">Code</th>
                <th className="px-6 py-4 font-bold">Discount</th>
                <th className="px-6 py-4 font-bold">Usage</th>
                <th className="px-6 py-4 font-bold">Expiry</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center italic text-gray-400">Loading coupons...</td></tr>
              ) : coupons.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-10 text-center italic text-gray-400">No active coupons.</td></tr>
              ) : coupons.map(coupon => (
                <tr key={coupon.id} className="hover:bg-gray-50/50 dark:hover:bg-black/20 transition-colors">
                  <td className="px-6 py-4"><span className="font-bold font-mono text-sm">{coupon.code}</span></td>
                  <td className="px-6 py-4 text-sm font-medium">{coupon.type === "PERCENTAGE" ? `${coupon.value}%` : `₦${coupon.value.toLocaleString()}`}</td>
                  <td className="px-6 py-4 text-xs">{coupon.usageCount} / {coupon.maxUsages || "∞"}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "Never"}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleStatus(coupon.id, coupon.isActive)} className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${coupon.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(coupon.id)} className="p-2 text-gray-400 hover:text-burgundy transition-colors"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
