"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Ruler, ShieldCheck, Truck, ArrowLeft } from "lucide-react";
import Link from "next/link";
import AddToCartButton from "@/components/shop/AddToCartButton";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      const { slug } = await params;
      const res = await fetch(`/api/products/${slug}`);
      const data = await res.json();
      setProduct(data);
      setCurrentPrice(data.basePrice);
      setLoading(false);
    }
    fetchData();
  }, [params]);

  useEffect(() => {
    if (product?.variations?.length > 0) {
      const variant = product.variations.find((v: any) => 
        (selectedSize ? v.size === selectedSize : true) && 
        (selectedColor ? v.color === selectedColor : true)
      );
      if (variant) {
        setCurrentPrice(variant.price);
      } else {
        setCurrentPrice(product.basePrice);
      }
    }
  }, [selectedSize, selectedColor, product]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-black">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text- gold font-serif italic text-2xl tracking-widest"
      >
        MBLANC
      </motion.div>
    </div>
  );

  if (!product) return <div>Product not found</div>;

  return (
    <main className="pt-24 min-h-screen bg-white dark:bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
           <Link href="/shop" className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-gold transition-colors">
              <ArrowLeft size={14} /> Back to Shop
           </Link>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Images Gallery */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2"
          >
            <div className="relative h-[600px] bg-cream dark:bg-charcoal border border-gold/10 overflow-hidden group">
               {product.images?.[0] ? (
                 <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
               ) : (
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-serif italic text-charcoal/20 dark:text-white/20">{product.name}</span>
                 </div>
               )}
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4">
               {product.images?.slice(1).map((img: string, i: number) => (
                 <motion.div 
                   key={i} 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.2 + (i * 0.1) }}
                   className="h-24 bg-cream dark:bg-charcoal border border-gold/10 overflow-hidden"
                 >
                    <img src={img} alt="Variation" className="w-full h-full object-cover" />
                 </motion.div>
               ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2">
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
               className="mb-8"
             >
                <p className="text-xs uppercase tracking-[0.3em] text-gold font-semibold mb-2">{product.category}</p>
                <h1 className="text-4xl md:text-6xl font-serif text-charcoal dark:text-ivory mb-4 leading-tight">{product.name}</h1>
                <p className="text-3xl text-gold font-light">₦{currentPrice.toLocaleString()}</p>
             </motion.div>

             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: "4rem" }}
               transition={{ duration: 1, delay: 0.5 }}
               className="h-1 bg-gold mb-8"
             ></motion.div>

             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 1, delay: 0.8 }}
               className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300 mb-10"
             >
                <p className="text-lg leading-relaxed font-light">{product.description}</p>
             </motion.div>

             {/* Variant Selectors */}
             {product.variations?.length > 0 && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 1 }}
                 className="space-y-6 mb-10"
               >
                 {Array.from(new Set(product.variations.map((v: any) => v.size).filter(Boolean))).length > 0 && (
                   <div>
                     <label className="block text-xs uppercase tracking-widest text-gray-400 mb-3 font-bold">Select Size</label>
                     <div className="flex flex-wrap gap-3">
                       {Array.from(new Set(product.variations.map((v: any) => v.size).filter(Boolean))).map((size: any) => (
                         <button 
                           key={size}
                           onClick={() => setSelectedSize(size)}
                           className={`px-6 py-2 border text-xs tracking-widest uppercase transition-all ${selectedSize === size ? "border-gold bg-gold text-black" : "border-gray-200 dark:border-gray-800 text-gray-500 hover:border-gold"}`}
                         >
                           {size}
                         </button>
                       ))}
                     </div>
                   </div>
                 )}

                 {Array.from(new Set(product.variations.map((v: any) => v.color).filter(Boolean))).length > 0 && (
                   <div>
                     <label className="block text-xs uppercase tracking-widest text-gray-400 mb-3 font-bold">Select Color</label>
                     <div className="flex flex-wrap gap-3">
                       {Array.from(new Set(product.variations.map((v: any) => v.color).filter(Boolean))).map((color: any) => (
                         <button 
                           key={color}
                           onClick={() => setSelectedColor(color)}
                           className={`px-6 py-2 border text-xs tracking-widest uppercase transition-all ${selectedColor === color ? "border-gold bg-gold text-black" : "border-gray-200 dark:border-gray-800 text-gray-500 hover:border-gold"}`}
                         >
                           {color}
                         </button>
                       ))}
                     </div>
                   </div>
                 )}
               </motion.div>
             )}

             {/* Action Buttons */}
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: 1.2 }}
               className="space-y-4 mb-12"
             >
                 <AddToCartButton 
                   product={product} 
                   selectedSize={selectedSize}
                   selectedColor={selectedColor}
                   price={currentPrice}
                 />
                <a 
                  href={`https://wa.me/2349047576899?text=${encodeURIComponent(`Hello MBlanc Bespoke, I'm interested in booking a bespoke fitting for the ${product.name}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-5 border border-gold text-gold font-semibold uppercase tracking-[0.2em] text-sm hover:bg-gold hover:text-black transition-colors text-center"
                >
                   Book a Bespoke Fitting
                </a>
             </motion.div>

             {/* Features/Trust */}
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 1, delay: 1.5 }}
               className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-gray-100 dark:border-gray-900"
             >
                <div className="flex items-start gap-4">
                   <Ruler size={24} className="text-gold flex-shrink-0" strokeWidth={1} />
                   <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest mb-2">Bespoke Fit</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Every piece is tailored to your exact measurements.</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <ShieldCheck size={24} className="text-gold flex-shrink-0" strokeWidth={1} />
                   <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest mb-2">Premium Quality</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Only the finest fabrics and artisan craftsmanship.</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <Truck size={24} className="text-gold flex-shrink-0" strokeWidth={1} />
                   <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest mb-2">Worldwide Shipping</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Luxury delivered to your doorstep, anywhere.</p>
                   </div>
                </div>
             </motion.div>
          </div>

        </div>
      </div>
    </main>
  );
}

