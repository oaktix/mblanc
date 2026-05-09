"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, Crown, Sparkles, Scissors, Stars } from "lucide-react";

interface Props {
  categories: any[];
}

// Icon mapping for dynamic categories
const ICON_MAP: Record<string, any> = {
  "Corporate": Briefcase,
  "Agbada": Crown,
  "Kaftans": Sparkles,
  "Suits": Scissors,
  "Default": Stars
};

export default function Categories({ categories }: Props) {
  // If no categories from DB, use placeholders (or handle empty state)
  const displayCategories = categories.length > 0 ? categories : [];

  if (displayCategories.length === 0) return null;

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
          <h2 className="text-4xl md:text-5xl font-serif mb-4 italic">Our Collections</h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-light tracking-wide">
            Explore our curated masterpieces, each crafted with meticulous attention to detail and cultural pride.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayCategories.map((category, idx) => {
            const Icon = ICON_MAP[category.name] || ICON_MAP["Default"];
            return (
              <motion.div
                key={category.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link href={`/shop?category=${category.name}`} className="group block">
                  <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden mb-6 bg-warm-gray dark:bg-charcoal flex flex-col items-center justify-center p-6 sm:p-8 text-center transition-transform duration-500 group-hover:-translate-y-2 border border-gold/5">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                      {category.image ? (
                        <img 
                          src={category.image} 
                          alt={category.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-zinc-900"></div>
                      )}
                      <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center w-full">
                      <div className="absolute inset-0 bg-black/40 opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 z-20 flex items-center justify-center -m-8">
                        <span className="text-gold border border-gold px-6 py-2 uppercase tracking-[0.3em] text-[10px] font-bold bg-black/50 backdrop-blur-sm">Explore Collection</span>
                      </div>
                      <Icon size={32} className="text-gold mb-6 group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
                      <h3 className="text-xl sm:text-2xl font-serif mb-2 text-white italic">{category.name}</h3>
                      <p className="text-[10px] text-gray-300 uppercase tracking-widest font-bold opacity-80">
                         MBlanc Bespoke
                      </p>
                      <span className="md:hidden mt-6 text-[10px] text-gold border border-gold/30 px-4 py-1.5 uppercase tracking-[0.2em] font-bold">Explore →</span>
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
