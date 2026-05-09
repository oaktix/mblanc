"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserPlus, Shield, Loader2, ChevronLeft, Save } from "lucide-react";
import { createStaffAccount, updateStaffAccount } from "@/app/actions/staff";
import Link from "next/link";

const staffSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  role: z.enum(["STAFF", "ADMIN"]),
});

type StaffFormValues = z.infer<typeof staffSchema>;

interface StaffFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function StaffForm({ initialData, isEditing = false }: StaffFormProps) {
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: initialData || { role: "STAFF" }
  });

  const onSubmit = async (values: StaffFormValues) => {
    setLoading(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    
    let result;
    if (isEditing && initialData?.id) {
      result = await updateStaffAccount(initialData.id, formData);
    } else {
      if (!values.password) {
        alert("Password is required for new accounts");
        setLoading(false);
        return;
      }
      result = await createStaffAccount(formData);
    }

    if (result?.error) {
      alert(result.error);
    }
    setLoading(false);
  };

  return (
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
          <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">
            {isEditing ? "New Password (Leave blank to keep current)" : "Initial Password"}
          </label>
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

      <button 
        disabled={loading}
        className="w-full py-4 bg-burgundy text-white font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : (isEditing ? <Save size={18} /> : <UserPlus size={18} />)}
        {isEditing ? "Update Account" : "Create Account"}
      </button>
    </form>
  );
}
