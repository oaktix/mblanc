"use client";

import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, CreditCard, Save, ImagePlus, Loader2 } from "lucide-react";
import { updateSiteSettings, getSiteSettings } from "@/app/actions/settings";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({
    siteName: "MBlanc Bespoke",
    contactEmail: "hello@mblancfits.com",
    headerLogo: null,
    footerLogo: null,
  });

  useEffect(() => {
    async function loadSettings() {
      const data = await getSiteSettings();
      setSettings(data);
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setSettings({ ...settings, [field]: data.url });
      }
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const formData = new FormData();
    Object.entries(settings).forEach(([key, val]) => {
      if (val) formData.append(key, val as string);
    });
    
    await updateSiteSettings(formData);
    setSaving(false);
    alert("Settings saved successfully!");
  };

  if (loading) return <div className="p-20 text-center font-serif italic text-gold">Loading Atelier Config...</div>;

  return (
    <AdminShell>
      <div className="max-w-4xl space-y-10 pb-20">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-charcoal dark:text-ivory">Atelier Settings</h1>
          <p className="text-gray-500 font-light mt-1">Configure the core parameters of your bespoke empire.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-gold text-black font-bold uppercase tracking-widest text-xs rounded-lg flex items-center gap-2 hover:bg-black hover:text-gold transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Identity Section */}
      <div className="bg-white dark:bg-charcoal p-8 rounded-2xl border border-gray-100 dark:border-gray-800">
         <div className="flex items-center gap-3 mb-8">
            <Palette className="text-gold" size={20} />
            <h2 className="text-xl font-serif">Brand Identity</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
               <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Brand Name</label>
               <input 
                 type="text" 
                 value={settings.siteName}
                 onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                 className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-gold transition-all"
               />
            </div>
            <div>
               <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Contact Email</label>
               <input 
                 type="email" 
                 value={settings.contactEmail}
                 onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                 className="w-full bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-gold transition-all"
               />
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Header Logo */}
            <div>
               <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Header Logo</label>
               <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-black border border-dashed border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                     {settings.headerLogo ? (
                        <img src={settings.headerLogo} alt="Header" className="w-full h-full object-contain" />
                     ) : (
                        <Palette size={24} className="text-gray-200" />
                     )}
                  </div>
                  <label className="cursor-pointer px-4 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:text-gold hover:border-gold transition-all">
                     Upload Logo
                     <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "headerLogo")} />
                  </label>
               </div>
            </div>

            {/* Footer Logo */}
            <div>
               <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Footer Logo</label>
               <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-black border border-dashed border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
                     {settings.footerLogo ? (
                        <img src={settings.footerLogo} alt="Footer" className="w-full h-full object-contain" />
                     ) : (
                        <Palette size={24} className="text-gray-200" />
                     )}
                  </div>
                  <label className="cursor-pointer px-4 py-2 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:text-gold hover:border-gold transition-all">
                     Upload Logo
                     <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e, "footerLogo")} />
                  </label>
               </div>
            </div>
         </div>
      </div>

      <div className="bg-white dark:bg-charcoal p-8 rounded-2xl border border-gray-100 dark:border-gray-800">
         <div className="flex items-center gap-3 mb-8">
            <CreditCard className="text-gold" size={20} />
            <h2 className="text-xl font-serif">Payments &amp; Checkout</h2>
         </div>
         <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-black rounded-xl">
               <div>
                  <p className="text-sm font-bold">TransactPay Integration</p>
                  <p className="text-xs text-gray-500">Accept cards, bank transfers, and OPay wallet payments.</p>
               </div>
               <div className="flex items-center gap-3">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-green-500">Active</span>
                  <div className="w-12 h-6 bg-gold rounded-full relative cursor-pointer">
                     <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full"></div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="mt-12 p-8 bg-burgundy/5 border border-burgundy/10 rounded-2xl">
         <div className="flex items-start gap-4">
            <Globe className="text-burgundy mt-1" size={20} />
            <div>
               <h4 className="text-sm font-bold text-burgundy mb-1">System Status: Operational</h4>
               <p className="text-xs text-burgundy/60 font-light">
                 Connected to Supabase (US-East) • Next.js 15.1.4 • TransactPay Live API Enabled
               </p>
            </div>
         </div>
      </div>
      </div>
    </AdminShell>
  );
}
