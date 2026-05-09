"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Camera, Music2 } from "lucide-react";
import { getSiteSettings } from "@/app/actions/settings";
import Logo from "./Logo";

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
    async function loadSettings() {
      const data = await getSiteSettings();
      setSettings(data);
    }
    loadSettings();
  }, []);

  return (
    <footer className="bg-black text-ivory border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="block mb-6">
              <img 
                src={settings?.footerLogo || "/footer-logo.png"} 
                alt={settings?.siteName || "MBLANC"} 
                className="h-20 w-auto object-contain brightness-110 contrast-110" 
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Where Tradition Meets Tailored Excellence. Discover Nigeria's premier destination for custom-tailored menswear.
            </p>
          </div>

          <div>
            <h4 className="text-gold font-semibold uppercase tracking-wider text-sm mb-6">Shop</h4>
            <ul className="space-y-4">
              <li><Link href="/shop?category=Corporate" className="text-gray-400 hover:text-white transition-colors text-sm">Corporate Fits</Link></li>
              <li><Link href="/shop?category=Agbada" className="text-gray-400 hover:text-white transition-colors text-sm">Regal Agbadas</Link></li>
              <li><Link href="/shop?category=Kaftans" className="text-gray-400 hover:text-white transition-colors text-sm">Elegant Kaftans</Link></li>
              <li><Link href="/shop?category=Suits" className="text-gray-400 hover:text-white transition-colors text-sm">Bespoke Suits</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold font-semibold uppercase tracking-wider text-sm mb-6">Explore</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">Our Story</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Book a Fitting</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold font-semibold uppercase tracking-wider text-sm mb-6">Visit Us</h4>
            <address className="not-italic text-sm text-gray-400 leading-relaxed space-y-2">
              <p>460 Yusuf Abubakar Yusuf Street</p>
              <p>Beside Purple Heart</p>
              <p>Abuja, Nigeria</p>
              <p className="pt-2 text-white">+234 904 757 6899</p>
              <p className="pt-2 text-white hover:text-gold transition-colors underline decoration-gold/30 underline-offset-4">hello@mblancfits.com</p>
            </address>
            <div className="flex gap-4 mt-8">
               <a href="https://www.instagram.com/thebespokecity_" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors">
                  <Camera size={20} />
               </a>
               <a href="https://tiktok.com/@_mblancbespoke" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gold transition-colors">
                  <Music2 size={20} />
               </a>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {year} MBlanc Bespoke. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 font-medium">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
