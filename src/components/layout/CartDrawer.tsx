"use client";

import { useCartStore } from "@/store/useCartStore";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-black shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="flex flex-col h-full">
          
          <div className="p-6 border-b border-gray-100 dark:border-gray-900 flex justify-between items-center">
            <h2 className="text-xl font-serif text-charcoal dark:text-ivory uppercase tracking-widest">Shopping Cart</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-charcoal rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <ShoppingBag size={48} className="text-gray-300 mb-4" strokeWidth={1} />
                <p className="text-gray-500 font-light italic mb-8">Your cart is empty.</p>
                <Link 
                  href="/shop" 
                  onClick={onClose}
                  className="px-8 py-3 border border-gold text-gold font-semibold uppercase tracking-widest text-xs hover:bg-gold hover:text-black transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {items.map((item) => (
                  <div key={`${item.id}-${item.variationId}`} className="flex gap-4">
                    <div className="w-20 h-24 bg-cream dark:bg-charcoal flex-shrink-0 overflow-hidden">
                       <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <h3 className="text-sm font-serif">{item.name}</h3>
                        <p className="text-sm font-medium">₦{item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2 text-[10px] uppercase text-gray-500 mb-4 font-bold">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.color && <span>|</span>}
                        {item.color && <span>Color: {item.color}</span>}
                        {!item.size && !item.color && <span>Standard</span>}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center border border-gray-200 dark:border-gray-800 rounded">
                           <button 
                             onClick={() => updateQuantity(item.id, item.quantity - 1, item.variationId)}
                             className="p-1 hover:bg-gray-50 dark:hover:bg-charcoal"
                           >
                             <Minus size={14} />
                           </button>
                           <span className="px-3 text-xs font-medium">{item.quantity}</span>
                           <button 
                             onClick={() => updateQuantity(item.id, item.quantity + 1, item.variationId)}
                             className="p-1 hover:bg-gray-50 dark:hover:bg-charcoal"
                           >
                             <Plus size={14} />
                           </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id, item.variationId)}
                          className="text-xs text-gray-400 hover:text-burgundy underline underline-offset-4"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="p-6 border-t border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-charcoal/50">
              <div className="flex justify-between mb-6">
                <span className="text-sm uppercase tracking-widest text-gray-500 font-light">Subtotal</span>
                <span className="text-xl font-medium text-gold">₦{getTotalPrice().toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-gray-400 italic mb-6">Shipping and taxes calculated at checkout.</p>
              <Link 
                href="/checkout"
                onClick={onClose}
                className="block w-full py-5 bg-burgundy text-white text-center font-semibold uppercase tracking-[0.2em] text-sm hover:bg-black transition-colors"
              >
                Checkout
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
