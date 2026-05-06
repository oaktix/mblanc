"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserPlus, Shield, Loader2, ChevronLeft } from "lucide-react";
import { createStaffAccount } from "@/app/actions/staff";
import Link from "next/link";

const staffSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["STAFF", "ADMIN"]),
});

type StaffFormValues = z.infer<typeof staffSchema>;

const CAPABILITIES = [
  { id: "inventory", name: "Inventory Management", description: "Add and edit products" },
  { id: "orders", name: "Order Tracking", description: "Update order status and notify clients" },
  { id: "pos", name: "POS Operations", description: "Process in-store sales and receipts" },
  { id: "customers", name: "Customer Management", description: "View customer history and details" },
];

export default function NewStaffPage() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: { role: "STAFF" }
  });

  const onSubmit = async (values: StaffFormValues) => {
    setLoading(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value));
    
    const result = await createStaffAccount(formData);
    if (result?.error) {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-10">
        <Link 
          href="/admin/staff" 
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gold transition-colors mb-4"
        >
          <ChevronLeft size={16} />
          Back to Staff Portal
        </Link>
        <h1 className="text-3xl font-serif text-charcoal dark:text-ivory">Add Team Member</h1>
        <p className="text-gray-500 font-light mt-1">Onboard a new artisan or staff member to the atelier portal.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white dark:bg-charcoal p-10 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Full Name</label>
              <input 
                {...register("name")}
                className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-gold transition-colors"
                placeholder="Amina Bello"
              />
              {errors.name && <p className="text-burgundy text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Email Address</label>
              <input 
                {...register("email")}
                type="email"
                className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-gold transition-colors"
                placeholder="amina@mblancfits.com"
              />
              {errors.email && <p className="text-burgundy text-xs mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Initial Password</label>
            <input 
              {...register("password")}
              type="password"
              className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-gold transition-colors"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-burgundy text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Access Role</label>
            <div className="flex gap-4">
              <label className="flex-1">
                <input {...register("role")} type="radio" value="STAFF" className="sr-only peer" />
                <div className="text-center py-3 rounded-lg border border-gray-200 dark:border-gray-800 peer-checked:border-gold peer-checked:bg-gold/10 peer-checked:text-gold cursor-pointer transition-all font-bold">STAFF</div>
              </label>
              <label className="flex-1">
                <input {...register("role")} type="radio" value="ADMIN" className="sr-only peer" />
                <div className="text-center py-3 rounded-lg border border-gray-200 dark:border-gray-800 peer-checked:border-burgundy peer-checked:bg-burgundy/10 peer-checked:text-burgundy cursor-pointer transition-all font-bold">ADMIN</div>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-50 dark:border-gray-900">
           <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-6 font-bold flex items-center gap-2">
             <Shield size={14} className="text-gold" />
             Atelier Capabilities
           </label>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CAPABILITIES.map((cap) => (
                <div key={cap.id} className="p-4 bg-gray-50 dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 flex items-start gap-3">
                   <input type="checkbox" defaultChecked className="mt-1 accent-gold" />
                   <div>
                      <p className="text-xs font-bold">{cap.name}</p>
                      <p className="text-[10px] text-gray-500 font-light">{cap.description}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <button 
          disabled={loading}
          className="w-full py-4 bg-burgundy text-white font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
          Create Account
        </button>
      </form>
    </div>
  );
}
