"use client";

import { useCartStore } from "@/store/useCartStore";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";

export default function AddToCartButton({ 
  product, 
  selectedSize, 
  selectedColor, 
  price 
}: { 
  product: any,
  selectedSize?: string | null,
  selectedColor?: string | null,
  price?: number
}) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    const matchingVariant = product.variations?.find((v: any) => 
      (selectedSize ? v.size === selectedSize : true) && 
      (selectedColor ? v.color === selectedColor : true)
    );

    addItem({
      id: `${product.id}-${selectedSize || ""}-${selectedColor || ""}`,
      name: product.name,
      slug: product.slug,
      price: price || product.basePrice,
      image: product.images[0] || "",
      quantity: 1,
      variationId: matchingVariant?.id,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleAddToCart}
      className={`w-full py-5 font-semibold uppercase tracking-[0.2em] text-sm transition-all flex items-center justify-center gap-3 ${
        added ? "bg-green-600 text-white" : "bg-burgundy text-white hover:bg-black"
      }`}
    >
      <ShoppingBag size={18} />
      {added ? "Added to Cart" : "Add to Cart"}
    </button>
  );
}
