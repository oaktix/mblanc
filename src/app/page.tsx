"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import AboutExcerpt from "@/components/home/AboutExcerpt";
import Categories from "@/components/home/Categories";
import ProductCarousel from "@/components/home/ProductCarousel";
import InquiryForm from "@/components/home/InquiryForm";
import CtaBar from "@/components/home/CtaBar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-black text-ivory">
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="/atelier_portrait_image_1778044902370.png" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 mix-blend-multiply"></div>
        </motion.div>
        
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-4xl sm:text-5xl md:text-7xl font-serif text-ivory mb-6 leading-tight md:leading-tight"
          >
            Crafted for the Gentleman <br className="hidden md:block" /> Who Commands Presence
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "4rem" }}
            transition={{ duration: 1, delay: 1 }}
            className="h-1 bg-[#D4AF37] mb-8"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="text-base md:text-xl text-cream mb-10 max-w-2xl font-light leading-relaxed"
          >
            Bespoke tailoring that honors tradition while defining modern luxury. Every stitch tells your story.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button className="px-8 py-4 bg-[#D4AF37] text-black font-semibold tracking-wider uppercase text-xs sm:text-sm hover:bg-ivory transition-colors w-full sm:w-auto">
              Explore Collections
            </button>
            <button className="px-8 py-4 border border-[#D4AF37] text-[#D4AF37] font-semibold tracking-wider uppercase text-xs sm:text-sm hover:bg-[#D4AF37] hover:text-black transition-colors w-full sm:w-auto">
              Book a Fitting
            </button>
          </motion.div>
        </div>
      </section>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <AboutExcerpt />
      </motion.div>
      <Categories />
      <ProductCarousel />
      <InquiryForm />
      <CtaBar />
    </main>
  );
}
