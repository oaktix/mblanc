"use client";

import { useState } from "react";
import { Edit, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface EditUserModalProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
  };
  triggerComponent?: React.ReactNode;
}

export default function EditUserModal({ user, triggerComponent }: EditUserModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    role: user.role,
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user");

      setIsOpen(false);
      router.refresh(); // Refresh the page to show updated data
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer inline-block">
        {triggerComponent || (
          <button className="p-2 bg-gray-50 dark:bg-black text-gray-500 hover:text-gold transition-colors rounded" title="Edit Member">
            <Edit size={16} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-charcoal w-full max-w-md rounded-xl shadow-2xl border border-gold/20 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-serif text-charcoal dark:text-ivory">Edit User</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-burgundy transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-burgundy/10 border border-burgundy/30 text-burgundy text-xs rounded-lg font-bold">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1 font-bold">Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:border-gold outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1 font-bold">Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:border-gold outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1 font-bold">Role</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:border-gold outline-none"
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="STAFF">Staff</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <label className="block text-[10px] uppercase tracking-widest text-burgundy mb-1 font-bold">New Password (Optional)</label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Leave blank to keep current"
                  className="w-full px-3 py-2 bg-burgundy/5 border border-burgundy/20 rounded-lg text-sm focus:border-burgundy outline-none"
                />
                <p className="text-[10px] text-gray-500 mt-1">If filled, this will reset the user's password.</p>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-charcoal dark:hover:text-ivory transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-6 py-2 bg-gold text-black text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-ivory transition-all flex items-center gap-2"
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
