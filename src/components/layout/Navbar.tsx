"use client";

import Link from "next/link";
import { ShoppingBag, User, Search, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { getSiteSettings } from "@/app/actions/settings";
import CartDrawer from "./CartDrawer";
import Logo from "./Logo";

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const cartItemsCount = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    async function loadSettings() {
      const data = await getSiteSettings();
      setSettings(data);
    }
    loadSettings();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-black/95 backdrop-blur-lg h-24 shadow-2xl border-gold/20" 
          : "bg-transparent h-40 border-transparent"
      } border-b text-ivory transition-colors duration-500`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            
            {/* Mobile Menu Trigger */}
            <div className="flex items-center md:hidden">
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="text-ivory hover:text-gold transition-colors p-2"
              >
                <Menu size={24} />
              </button>
            </div>

            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex-shrink-0 flex items-center justify-center flex-1 md:flex-none"
            >
              <Link href="/">
                <img 
                  src={settings?.headerLogo || "/header-logo.png"} 
                  alt={settings?.siteName || "MBLANC"} 
                  className="h-20 md:h-32 w-auto object-contain brightness-110 transition-all" 
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-12">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="relative text-[10px] font-bold uppercase tracking-[0.2em] group py-2"
                >
                  <span className="group-hover:text-gold transition-colors duration-300">{link.name}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-4 md:space-x-8">
              <Link href="/shop">
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-ivory hover:text-gold transition-colors hidden sm:block"
                >
                  <Search size={18} strokeWidth={1.5} />
                </motion.button>
              </Link>
              <Link href="/auth/login" className="hidden sm:block">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-ivory hover:text-gold transition-colors"
                >
                  <User size={18} strokeWidth={1.5} />
                </motion.div>
              </Link>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCartOpen(true)}
                className="text-ivory hover:text-gold transition-colors relative p-2"
              >
                <ShoppingBag size={18} strokeWidth={1.5} />
                <AnimatePresence>
                  {isMounted && cartItemsCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-0 right-0 bg-burgundy text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                    >
                      {cartItemsCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[80%] max-w-sm bg-black z-[70] md:hidden p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  <img 
                    src={settings?.headerLogo || "/header-logo.png"} 
                    alt="MBLANC" 
                    className="h-12 w-auto object-contain brightness-110" 
                  />
                </Link>
                <button onClick={() => setIsMenuOpen(false)} className="text-ivory">
                  <X size={24} />
                </button>
              </div>
              
              <nav className="flex flex-col space-y-8">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Link 
                      href={link.href} 
                      onClick={() => setIsMenuOpen(false)}
                      className="text-2xl font-serif text-ivory hover:text-gold transition-colors"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto pt-8 border-t border-white/10 space-y-6">
                <Link href="/auth/login" className="flex items-center gap-4 text-ivory/60 hover:text-gold transition-colors">
                  <User size={20} />
                  <span className="uppercase tracking-widest text-xs">Account</span>
                </Link>
                <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                  <button className="w-full py-4 bg-gold text-black font-bold uppercase tracking-widest text-xs">
                    Book a Fitting
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}


