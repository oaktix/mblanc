"use client";

import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect } from "react";
import { usePaystackPayment } from "react-paystack";
import { motion } from "framer-motion";

export default function CheckoutForm() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // 1. Paystack Configuration
  const config = {
    reference: orderId || "",
    email: email,
    amount: getTotalPrice() * 100, // Paystack uses Kobo (Naira * 100)
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    // Clear the cart before leaving
    clearCart();

    // Use window.location for a hard redirect to ensure the page 
    // updates and clears all previous states immediately.
    window.location.assign("/checkout/success");
  };

  const onClose = () => {
    setLoading(false);
    setOrderId(null);
  };

  // 2. Trigger Payment Popup when Order ID is generated
  useEffect(() => {
    if (orderId) {
      // Corrected: Passing callbacks inside an object as the single argument
      initializePayment({ onSuccess, onClose });
    }
  }, [orderId, initializePayment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || loading) return;

    setLoading(true);

    try {
      // 3. Create the order in your database
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          total: getTotalPrice(),
          shippingDetails: { name, email, address, city }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Failed to create order");
      }

      const orderData = await response.json();

      // 4. Set orderId to trigger the useEffect above
      setOrderId(orderData.id);

    } catch (error: any) {
      setLoading(false);
      console.error("Order error:", error);
      alert(error.message || "Could not initialize checkout. Please try again.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-16 p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-2/3"
      >
        <h2 className="text-2xl font-serif mb-8 uppercase tracking-widest text-burgundy">Shipping Details</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 py-3 focus:outline-none focus:border-burgundy transition-colors"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 py-3 focus:outline-none focus:border-burgundy transition-colors"
                placeholder="email@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Shipping Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 py-3 focus:outline-none focus:border-burgundy transition-colors"
              placeholder="123 Street Name, Area"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 py-3 focus:outline-none focus:border-burgundy transition-colors"
              placeholder="Lagos"
            />
          </div>

          <div className="flex items-start gap-3 mt-8 mb-6">
            <input 
              type="checkbox" 
              id="terms" 
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 w-4 h-4 accent-burgundy"
            />
            <label htmlFor="terms" className="text-sm text-gray-500">
              I have read and agree to the <a href="/terms" target="_blank" className="text-burgundy hover:underline">Terms of Service</a> and <a href="/privacy" target="_blank" className="text-burgundy hover:underline">Privacy Policy</a>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !acceptedTerms}
            className={`w-full py-5 bg-burgundy text-white font-semibold uppercase tracking-[0.2em] text-sm transition-colors ${(loading || !acceptedTerms) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black'}`}
          >
            {loading ? "Processing..." : `Pay ₦${getTotalPrice().toLocaleString()}`}
          </button>
        </form>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full lg:w-1/3"
      >
        <div className="bg-cream dark:bg-charcoal p-8 border border-gold/10 rounded">
          <h2 className="text-xl font-serif mb-6 uppercase tracking-widest border-b border-gold/20 pb-4 text-burgundy">Order Summary</h2>
          <div className="space-y-4 mb-8">
            {items.map((item) => (
              <div key={`${item.id}-${item.variationId}`} className="flex justify-between text-sm">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800 dark:text-gray-200">{item.name}</span>
                  <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                </div>
                <span className="font-semibold">₦{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between border-t border-gold/20 pt-4 font-bold text-lg">
            <span className="uppercase tracking-widest text-gray-600">Total</span>
            <span className="text-burgundy">₦{getTotalPrice().toLocaleString()}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}