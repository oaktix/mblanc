"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Tag, Calendar, Users, Percent, DollarSign, Loader2, X, Check, AlertCircle } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
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
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      // Defensive check: Ensure data is an array
      if (Array.isArray(data)) {
        setCoupons(data);
      } else {
        console.error("API did not return an array:", data);
        setCoupons([]);
      }
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsAdding(false);
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
        await fetchCoupons();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to save coupon");
      }
    } catch (err) {
      alert("Error saving coupon");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon permanently?")) return;
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (res.ok) await fetchCoupons();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const toggleStatus = async (id: string, current: boolean) => {
    try {
      await fetch(`/api/admin/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      await fetchCoupons();
    } catch (err) {
      console.error("Toggle failed");
    }
  };

  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-serif text-charcoal dark:text-ivory italic">Promotions & Coupons</h1>
            <p className="text-gray-500 font-light mt-1 flex items-center gap-2">
              <Tag size={14} className="text-gold" />
              Manage promotional incentives and seasonal discounts.
            </p>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="w-full md:w-auto px-8 py-3 bg-burgundy text-white font-bold rounded-lg text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg"
          >
            {isAdding ? <X size={18} /> : <Plus size={18} />}
            {isAdding ? "Cancel" : "New Coupon"}
          </button>
        </div>

        {isAdding && (
          <div className="bg-white dark:bg-charcoal rounded-xl border border-gold/10 p-8 mb-10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500">
            <h3 className="text-lg font-serif mb-8 italic border-b border-gold/10 pb-4">Create Master Coupon</h3>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold">Coupon Code</label>
                <input required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="E.G. ATELIER25" className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:border-gold font-mono" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold">Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:border-gold">
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FLAT">Flat Fee (₦)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold">Value</label>
                <div className="relative">
                  <input type="number" required value={formData.value} onChange={e => setFormData({...formData, value: parseFloat(e.target.value)})} className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:border-gold" />
                  <span className="absolute left-3 top-3.5 text-gray-400">{formData.type === "PERCENTAGE" ? <Percent size={14} /> : <DollarSign size={14} />}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold">Min Purchase (₦)</label>
                <input type="number" value={formData.minPurchase} onChange={e => setFormData({...formData, minPurchase: parseFloat(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:border-gold" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold">Usage Limit</label>
                <input type="number" placeholder="Leave empty for unlimited" value={formData.maxUsages || ""} onChange={e => setFormData({...formData, maxUsages: parseInt(e.target.value) || 0})} className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:border-gold" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold">Expiry Date</label>
                <div className="relative">
                  <input type="date" value={formData.expiresAt} onChange={e => setFormData({...formData, expiresAt: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm outline-none focus:border-gold" />
                  <Calendar size={14} className="absolute left-3 top-3.5 text-gray-400" />
                </div>
              </div>
              <div className="md:col-span-4 flex justify-end gap-4 mt-4">
                <button type="submit" className="px-12 py-4 bg-gold text-black font-bold rounded-lg text-xs uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all shadow-xl">
                  {loading ? <Loader2 className="animate-spin" /> : "Save Promotional Code"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white dark:bg-charcoal rounded-xl border border-gold/5 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-black/40 text-[10px] uppercase tracking-widest text-gray-500 border-b border-gold/10">
                  <th className="px-8 py-5 font-bold">Coupon Details</th>
                  <th className="px-8 py-5 font-bold">Type & Value</th>
                  <th className="px-8 py-5 font-bold">Performance</th>
                  <th className="px-8 py-5 font-bold">Status</th>
                  <th className="px-8 py-5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-zinc-900">
                {loading && coupons.length === 0 ? (
                  <tr><td colSpan={5} className="px-8 py-20 text-center"><Loader2 className="animate-spin mx-auto text-gold mb-2" /><p className="text-xs text-gray-400 italic">Curating promotions...</p></td></tr>
                ) : coupons.length === 0 ? (
                  <tr><td colSpan={5} className="px-8 py-20 text-center"><AlertCircle className="mx-auto text-gray-300 mb-2" /><p className="text-sm text-gray-400 italic">No coupons found in your atelier.</p></td></tr>
                ) : coupons.map(coupon => (
                  <tr key={coupon.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold font-mono text-base text-burgundy dark:text-gold tracking-tighter">{coupon.code}</span>
                        <span className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">Exp: {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "Lifetime"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <span className={`p-1.5 rounded-full ${coupon.type === "PERCENTAGE" ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"}`}>
                          {coupon.type === "PERCENTAGE" ? <Percent size={12} /> : <DollarSign size={12} />}
                        </span>
                        <span className="font-serif text-lg">{coupon.type === "PERCENTAGE" ? `${coupon.value}%` : `₦${coupon.value.toLocaleString()}`}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                           <span className="text-sm font-medium">{coupon.usageCount} <span className="text-[10px] text-gray-400 font-light">Uses</span></span>
                           <div className="w-16 h-1 bg-gray-100 dark:bg-zinc-800 rounded-full mt-1 overflow-hidden">
                              <div className="h-full bg-gold" style={{ width: `${Math.min(100, (coupon.usageCount / (coupon.maxUsages || 100)) * 100)}%` }}></div>
                           </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => toggleStatus(coupon.id, coupon.isActive)}
                        className={`flex items-center gap-2 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest transition-all ${coupon.isActive ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-700"}`}
                      >
                        {coupon.isActive ? <Check size={10} /> : <AlertCircle size={10} />}
                        {coupon.isActive ? "Active" : "Paused"}
                      </button>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        {/* Edit Button */}
                        <button 
                          className="p-2.5 text-gray-400 hover:text-gold hover:bg-gold/10 rounded-full transition-all"
                          title="Edit Coupon"
                        >
                          <Edit2 size={16} />
                        </button>
                        {/* Delete Button */}
                        <button 
                          onClick={() => handleDelete(coupon.id)} 
                          className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                          title="Delete Coupon"
                        >
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
    </AdminShell>
  );
}
