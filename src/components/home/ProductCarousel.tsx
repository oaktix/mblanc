"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PRODUCTS = [
  { id: 1, name: "The Executive Navy Two-Piece", price: 250000, category: "Corporate", image: "/product_navy_suit_1778045268960.png", slug: "executive-navy-suit" },
  { id: 2, name: "Royal Midnight Agbada", price: 450000, category: "Agbada", image: "/category_agbada_1778044962710.png", slug: "royal-midnight-agbada" },
  { id: 3, name: "Ivory Silk Kaftan", price: 150000, category: "Kaftans", image: "/category_kaftans_1778044980700.png", slug: "ivory-silk-kaftan" },
  { id: 4, name: "Charcoal Pinstripe Suit", price: 280000, category: "Suits", image: "/category_corporate_1778044937824.png", slug: "charcoal-pinstripe-corporate" },
  { id: 5, name: "Emerald Green Velvet Tuxedo", price: 320000, category: "Corporate", image: "/category_suits_1778045024075.png", slug: "" },
];

export default function ProductCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === "left" ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 bg-cream dark:bg-charcoal text-charcoal dark:text-ivory overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-3xl md:text-4xl font-serif mb-2">The Latest from Our Atelier</h2>
          <p className="text-gray-500 font-light">Freshly crafted pieces, ready to be yours.</p>
        </div>
        <div className="hidden md:flex space-x-4">
          <button 
            onClick={() => scroll("left")}
            className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
          >
            <ChevronLeft size={24} strokeWidth={1} />
          </button>
          <button 
            onClick={() => scroll("right")}
            className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
          >
            <ChevronRight size={24} strokeWidth={1} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pl-4 sm:pl-6 lg:pl-8 pb-12 gap-8"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {PRODUCTS.map((product) => (
          <Link 
            key={product.id} 
            href={product.slug ? `/shop/${product.slug}` : `/shop?category=${product.category}`}
            className="min-w-[280px] md:min-w-[350px] snap-start group cursor-pointer"
          >
            <div className="relative h-[450px] mb-6 overflow-hidden bg-warm-gray dark:bg-black">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-black/80 backdrop-blur-sm">
                <button className="w-full py-3 bg-gold text-black font-semibold uppercase tracking-wider text-xs hover:bg-ivory transition-colors">
                  View Details
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{product.category}</p>
              <h3 className="text-lg font-serif mb-2">{product.name}</h3>
              <p className="text-gold font-medium">₦{product.price.toLocaleString()}</p>
            </div>
          </Link>
        ))}
        <div className="min-w-[280px] md:min-w-[350px] snap-start flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600 h-[450px]">
           <Link href="/shop" className="text-center group">
              <span className="block text-2xl font-serif text-gray-400 group-hover:text-gold transition-colors mb-2">View All</span>
              <span className="block w-8 h-px bg-gray-400 group-hover:bg-gold transition-colors mx-auto group-hover:w-16"></span>
           </Link>
        </div>
      </div>
    </section>
  );
}
