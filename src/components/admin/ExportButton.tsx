"use client";

import { useState } from "react";
import { Download, Calendar, Loader2, X } from "lucide-react";

export default function ExportButton({ type = "orders" }: { type?: string }) {
  const [showDates, setShowDates] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    let url = `/api/admin/export?type=${type}`;
    if (fromDate) url += `&from=${fromDate}`;
    if (toDate) url += `&to=${toDate}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Export failed");
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `mblanc_${type}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setShowDates(false);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setShowDates(!showDates)}
        className="px-6 py-2 bg-white dark:bg-charcoal border border-gray-200 dark:border-gray-800 text-charcoal dark:text-ivory font-semibold rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
      >
        <Download size={18} />
        Export {type.charAt(0).toUpperCase() + type.slice(1)}
      </button>

      {showDates && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-charcoal border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl z-50 p-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gold flex items-center gap-2">
              <Calendar size={14} />
              Filter by Date
            </h3>
            <button onClick={() => setShowDates(false)} className="text-gray-400 hover:text-charcoal"><X size={16} /></button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">From Date</label>
              <input 
                type="date" 
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-gray-50 dark:bg-black focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">To Date</label>
              <input 
                type="date" 
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-xs bg-gray-50 dark:bg-black focus:outline-none focus:border-gold"
              />
            </div>
            <button 
              onClick={handleExport}
              disabled={loading}
              className="w-full py-2.5 bg-gold text-black font-bold rounded-lg text-xs hover:bg-black hover:text-gold transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Generating...
                </>
              ) : (
                "Download Report"
              )}
            </button>
            <p className="text-[10px] text-gray-400 text-center italic">Leave blank to export all data</p>
          </div>
        </div>
      )}
    </div>
  );
}
