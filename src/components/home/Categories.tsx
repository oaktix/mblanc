"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, Crown, Sparkles, Scissors } from "lucide-react";

const CATEGORIES = [
  {
    name: "Corporate Fits",
    icon: Briefcase,
    description: "Power suits and executive wear tailored for the boardroom",
    href: "/shop?category=Corporate",
    image: "/images/category-corporate.jpg"
  },
  {
    name: "Agbada",
    icon: Crown,
    description: "Regal, flowing traditional wear for ceremonies and celebrations",
    href: "/shop?category=Agbada",
    image: "/images/category-agbada.jpg"
  },
  {
    name: "Kaftans",
    icon: Sparkles,
    description: "Elegant, comfortable traditional wear for any occasion",
    href: "/shop?category=Kaftans",
    image: "/images/category-kaftan.jpg"
  },
  {
    name: "Suits",
    icon: Scissors,
    description: "Classic and contemporary bespoke suits for every gentleman",
    href: "/shop?category=Suits",
    image: "/images/category-suits.jpg"
  },
];

export default function Categories() {
  return (
    <section className="py-24 bg-white dark:bg-black text-charcoal dark:text-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="w-16 h-1 bg-gold mx-auto mb-6"></div>
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Our Masterpieces</h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-light">
            Explore our curated categories, each piece crafted with meticulous attention to detail and cultural pride.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {CATEGORIES.map((category, idx) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link href={category.href} className="group block">
                  <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden mb-6 bg-warm-gray dark:bg-charcoal flex flex-col items-center justify-center p-6 sm:p-8 text-center transition-transform duration-500 group-hover:-translate-y-2">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                      <img 
                        src={category.image} 
                        alt={category.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                      <div className="absolute inset-0 bg-black/40 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 z-20 flex items-center justify-center -m-8">
                        <span className="text-gold border border-gold px-6 py-2 uppercase tracking-widest text-xs sm:text-sm font-semibold">View Category</span>
                      </div>
                      <Icon size={40} className="text-gold mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
                      <h3 className="text-xl sm:text-2xl font-serif mb-2 sm:mb-4 text-white">{category.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-200 relative z-0 line-clamp-2">
                        {category.description}
                      </p>
                      <span className="md:hidden mt-4 text-[10px] text-gold uppercase tracking-[0.2em] font-bold">Explore →</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
