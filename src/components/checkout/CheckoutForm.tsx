"use client";

import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { useRouter } from "next/navigation";

export default function CheckoutForm() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const config = {
    email: email,
    amount: getTotalPrice() * 100,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_placeholder",
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = () => {
    clearCart();
    router.push("/checkout/success");
  };

  const onClose = () => {
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || loading) return;

    setLoading(true);

    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          total: getTotalPrice(),
          shippingDetails: { name, email, address, city }
        })
      });

      if (!response.ok) throw new Error("Failed to create order");

      const order = await response.json();

      // Passing the reference directly into the call to satisfy types
      const paymentConfig: any = {
        ...config,
        reference: order.id,
        onSuccess,
        onClose,
      };

      initializePayment(paymentConfig);

    } catch (error) {
      setLoading(false);
      console.error("Order error:", error);
      alert("Could not initialize checkout. Please try again.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-16">
      <div className="w-full lg:w-2/3">
        <h2 className="text-2xl font-serif mb-8 uppercase tracking-widest">Shipping Details</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 py-3 focus:outline-none focus:border-gold transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 py-3 focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Shipping Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 py-3 focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 py-3 focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 bg-burgundy text-white font-semibold uppercase tracking-[0.2em] text-sm hover:bg-black transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? "Processing..." : `Complete Purchase ₦${getTotalPrice().toLocaleString()}`}
          </button>
        </form>
      </div>

      <div className="w-full lg:w-1/3">
        <div className="bg-cream dark:bg-charcoal p-8 border border-gold/10">
          <h2 className="text-xl font-serif mb-6 uppercase tracking-widest border-b border-gold/20 pb-4">Order Summary</h2>
          <div className="space-y-6 mb-8">
            {items.map((item) => (
              <div key={`${item.id}-${item.variationId}`} className="flex justify-between text-sm">
                <span className="font-light">{item.name} x {item.quantity}</span>
                <span>₦{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t border-gold/20 pt-4 font-bold">
            <span className="uppercase tracking-widest">Total</span>
            <span className="text-gold">₦{getTotalPrice().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}