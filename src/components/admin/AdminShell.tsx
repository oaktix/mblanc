"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useSession, signOut } from "next-auth/react";
import { Menu, LogOut } from "lucide-react";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-ivory dark:bg-black flex">
      <div className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 fixed md:sticky top-0 h-screen z-50`}>
        <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
      {isSidebarOpen && (
        <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" />
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-gold/20 px-6 md:px-10 py-5 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-charcoal dark:text-ivory p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors">
              <Menu size={24} />
            </button>
            <div className="hidden md:block">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">Atelier Management</p>
              <h2 className="text-sm font-serif text-charcoal dark:text-ivory italic">MBlanc Bespoke Portal</h2>
            </div>
            <img src="/header-logo.png" alt="MBLANC" className="h-20 w-auto object-contain md:hidden" />
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-charcoal dark:text-ivory truncate max-w-[150px]">
                {session?.user?.name || "Atelier Manager"}
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">{session?.user?.role || "Active Session"}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-cream dark:bg-charcoal border border-gold/20 flex items-center justify-center font-serif text-gold uppercase shadow-inner">
              {session?.user?.name?.[0] || "A"}
            </div>
            <button 
              onClick={() => signOut({ callbackUrl: "/admin" })}
              className="p-2 text-gray-400 hover:text-burgundy hover:bg-burgundy/5 rounded-lg transition-all"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>
        <main className="p-6 md:p-10 w-full overflow-x-hidden">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
