"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteOrderButton({ 
  orderId, 
  variant = "full" 
}: { 
  orderId: string, 
  variant?: "full" | "icon" 
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this order? This action is permanent.")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete order");
      }

      if (variant === "full") {
        router.push("/admin/orders");
      }
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  if (variant === "icon") {
    return (
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
        title="Delete Order"
      >
        {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
      </button>
    );
  }

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-6 py-2 border border-red-200 text-red-600 font-semibold rounded-lg text-sm flex items-center gap-2 hover:bg-red-50 transition-all disabled:opacity-50"
    >
      {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
      Delete Order
    </button>
  );
}
