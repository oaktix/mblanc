"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  products: any[];
}

export default function ProductCarousel({ products }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === "left" ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // If no products provided, don't render placeholders anymore to ensure accuracy
  if (!products || products.length === 0) return null;

  return (
    <section className="py-24 bg-cream dark:bg-charcoal text-charcoal dark:text-ivory overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-3xl md:text-4xl font-serif mb-2 italic">The Latest from Our Atelier</h2>
          <p className="text-gray-500 font-light tracking-wide uppercase text-[10px] font-bold">Newly Crafted Masterpieces</p>
        </div>
        <div className="hidden md:flex space-x-4">
          <button 
            onClick={() => scroll("left")}
            className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center hover:bg-gold hover:text-black transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll("right")}
            className="w-12 h-12 rounded-full border border-gold/20 flex items-center justify-center hover:bg-gold hover:text-black transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pl-4 sm:pl-6 lg:pl-8 pb-12 gap-8"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <Link 
            key={product.id} 
            href={`/shop/${product.slug}`}
            className="min-w-[280px] md:min-w-[350px] snap-start group cursor-pointer"
          >
            <div className="relative h-[450px] mb-6 overflow-hidden bg-warm-gray dark:bg-black border border-gold/5">
              {product.images?.[0] ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                  <span className="font-serif italic text-gold/20">MBlanc Bespoke</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500"></div>
              <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-black/90 backdrop-blur-md">
                <button className="w-full py-4 bg-gold text-black font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-ivory transition-colors">
                  Inquire Now
                </button>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-2 font-bold">{product.category}</p>
              <h3 className="text-xl font-serif mb-2 group-hover:text-gold transition-colors">{product.name}</h3>
              <p className="text-gold font-medium tracking-widest text-sm italic">₦{product.basePrice.toLocaleString()}</p>
            </div>
          </Link>
        ))}
        <div className="min-w-[280px] md:min-w-[350px] snap-start flex items-center justify-center border border-dashed border-gold/20 h-[450px] bg-black/5 rounded-sm">
           <Link href="/shop" className="text-center group p-10">
              <span className="block text-xl font-serif text-gray-400 group-hover:text-gold transition-all mb-4 uppercase tracking-widest">Explore Collection</span>
              <div className="w-12 h-px bg-gold/30 group-hover:w-24 transition-all mx-auto"></div>
           </Link>
        </div>
      </div>
    </section>
  );
}
