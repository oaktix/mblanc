"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Layout, 
  Package2, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut,
  Pen,
  X,
  Tag,
  Grid
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: Layout },
  { name: "Products", href: "/admin/products", icon: Package2 },
  { name: "Categories", href: "/admin/categories", icon: Grid },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Coupons", href: "/admin/coupons", icon: Tag, adminOnly: true },
  { name: "POS System", href: "/admin/pos", icon: Pen },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Staff Portal", href: "/admin/staff", icon: Users, adminOnly: true },
  { name: "Settings", href: "/admin/settings", icon: Settings, adminOnly: true },
];

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const userRole = session?.user?.role;

  const filteredNavItems = NAV_ITEMS.filter(item => {
    if (status === "loading") return !item.adminOnly; // Show basic items while loading
    if (item.adminOnly && userRole !== "ADMIN") return false;
    return true;
  });

  return (
    <aside className="w-64 h-screen bg-black text-ivory flex flex-col border-r border-white/10">
      <div className="p-8 border-b border-white/10 flex justify-between items-center">
        <div>
          <Link href="/">
            <img src="/header-logo.png" alt="MBLANC" className="h-24 w-auto object-contain" />
          </Link>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gold mt-2 font-bold">Atelier Portal</p>
        </div>
        <button onClick={onClose} className="md:hidden text-gray-500 hover:text-white">
           <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={onClose}
              className={`flex items-center w-full gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-left group ${
                isActive 
                  ? "bg-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} className={`${isActive ? "text-black" : "group-hover:text-gold"} transition-colors`} />
              <span className={`text-sm ${isActive ? "font-bold" : "font-medium"}`}>{item.name}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-black"></div>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 bg-zinc-900/50">
        <div className="px-4 py-3 mb-4 bg-gold/5 border border-gold/20 rounded-lg">
           <p className="text-[8px] uppercase tracking-widest text-gold font-bold mb-1">Session Active</p>
           <p className="text-xs font-bold truncate text-white">{session?.user?.name || "Staff User"}</p>
           <p className="text-[9px] text-gray-500 uppercase tracking-widest">{userRole || "Authenticating..."}</p>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-burgundy/10 hover:text-burgundy transition-all w-full group"
        >
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Exit Portal</span>
        </button>
      </div>
    </aside>
  );
}
