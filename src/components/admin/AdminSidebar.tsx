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
  X
} from "lucide-react";
import { signOut } from "next-auth/react";
import Logo from "../layout/Logo";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: Layout },
  { name: "Products", href: "/admin/products", icon: Package2 },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "POS System", href: "/admin/pos", icon: Pen },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Staff Portal", href: "/admin/staff", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-black text-ivory flex flex-col border-r border-white/10">
      <div className="p-8 border-b border-white/10 flex justify-between items-center">
        <div>
          <Link href="/">
            <img src="/header-logo.png" alt="MBLANC" className="h-24 w-auto object-contain" />
          </Link>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-2">Atelier Portal</p>
        </div>
        <button onClick={onClose} className="md:hidden text-gray-500 hover:text-white">
           <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? "bg-gold text-black" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-burgundy/20 hover:text-burgundy transition-colors w-full"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
