"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="px-6 py-2 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-800 text-charcoal dark:text-ivory font-semibold rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50 transition-all print:hidden"
    >
      <Printer size={18} />
      Print Invoice
    </button>
  );
}
