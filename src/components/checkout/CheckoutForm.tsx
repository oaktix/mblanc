"use client";

import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { X, MessageSquare, Shield, CreditCard, Landmark } from "lucide-react";
import Script from "next/script";

// Extend window to include TransactPay SDK
declare global {
  interface Window {
    CheckoutNS?: {
      PaymentCheckout: new (config: any) => { init: () => void };
    };
  }
}

export default function CheckoutForm() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  // Payment Gateway State
  const [transactpayReady, setTransactpayReady] = useState(false);
  
  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  
  // Order/Process State
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = getTotalPrice();
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = subtotal - discount;

  // ─── TransactPay Handler ───────────────────────────────────────────
  const initializeTransactpayPayment = useCallback(() => {
    if (!window.CheckoutNS) {
      alert("TransactPay is still loading. Please wait a moment and try again.");
      setLoading(false);
      setOrderId("");
      return;
    }

    // Split name for first/last
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || "Customer";
    const lastName = nameParts.slice(1).join(" ") || "MBlanc";

    const checkout = new window.CheckoutNS.PaymentCheckout({
      firstName,
      lastName,
      mobile: phone || "+2340000000000",
      country: "NG",
      email: email,
      currency: "NGN",
      amount: Number(total.toFixed(2)), // TransactPay expects MAJOR units (naira), NOT kobo
      reference: orderId,
      merchantReference: orderId,
      description: `MBlanc Bespoke Order #${orderId.slice(-6).toUpperCase()}`,
      apiKey: process.env.NEXT_PUBLIC_TRANSACTPAY_API_KEY || "",
      encryptionKey: process.env.NEXT_PUBLIC_TRANSACTPAY_ENCRYPTION_KEY || "",
      onCompleted: (data: any) => {
        console.log(">>> [TRANSACTPAY] Payment completed:", data);
        if (data?.status?.toLowerCase() === "successful") {
          clearCart();
          window.location.href = `/checkout/success?order=${orderId}`;
        } else {
          alert("Payment was not successful. Please try again.");
          setLoading(false);
          setOrderId("");
        }
      },
      onClose: () => {
        console.warn(">>> [TRANSACTPAY] Payment window closed by user.");
        setLoading(false);
        setOrderId("");
      },
      onError: (error: any) => {
        console.error(">>> [TRANSACTPAY] Payment error:", error);
        alert("An error occurred during payment. Please try again.");
        setLoading(false);
        setOrderId("");
      },
    });

    checkout.init();
  }, [name, phone, email, total, orderId, clearCart]);

  // ─── Trigger Payment When Order Is Created ─────────────────────────
  useEffect(() => {
    if (orderId && email) {
      initializeTransactpayPayment();
    }
  }, [orderId, email, initializeTransactpayPayment]);

  // ─── Coupon Handler ────────────────────────────────────────────────
  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsValidatingCoupon(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, amount: subtotal }),
      });
      const data = await res.json();
      if (res.ok) {
        setAppliedCoupon(data);
      } else {
        setCouponError(data.error);
        setAppliedCoupon(null);
      }
    } catch {
      setCouponError("Failed to validate coupon");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  // ─── Submit Handler ────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || loading) return;

    setLoading(true);

    try {
      // Create the order in the database
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          total: total,
          discount: discount,
          couponCode: appliedCoupon?.code || null,
          shippingDetails: { name, email, phone, address, city },
          notes: notes,
          paymentProvider: "transactpay",
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || "Failed to create order");
      }

      const orderData = await response.json();

      // Set orderId to trigger the useEffect above
      setOrderId(orderData.id);

    } catch (error: any) {
      setLoading(false);
      console.error("Order error:", error);
      alert(error.message || "Could not initialize checkout. Please try again.");
    }
  };

  return (
    <>
      {/* Load TransactPay SDK */}
      <Script
        src="https://payment-web-sdk.transactpay.ai/v1/checkout"
        strategy="lazyOnload"
        onLoad={() => setTransactpayReady(true)}
        onError={() => console.warn("TransactPay SDK failed to load")}
      />

      <div className="flex flex-col lg:flex-row gap-16 p-4 md:p-8">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-2/3"
        >
          <h2 className="text-2xl font-serif mb-8 uppercase tracking-widest text-burgundy border-b border-gold/10 pb-4 italic">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-gray-300 dark:border-gray-800 py-3 focus:outline-none focus:border-gold transition-colors font-light"
                  placeholder="e.g. Yusuf Abubakar"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-gray-300 dark:border-gray-800 py-3 focus:outline-none focus:border-gold transition-colors font-light"
                  placeholder="yusuf@example.com"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-gray-300 dark:border-gray-800 py-3 focus:outline-none focus:border-gold transition-colors font-light"
                  placeholder="+234..."
                />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">City / Region</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full bg-transparent border-b border-gray-300 dark:border-gray-800 py-3 focus:outline-none focus:border-gold transition-colors font-light"
                  placeholder="Abuja"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">Full Delivery Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full bg-transparent border-b border-gray-300 dark:border-gray-800 py-3 focus:outline-none focus:border-gold transition-colors font-light"
                placeholder="House Number, Street, District"
              />
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                <MessageSquare size={12} /> Special Instructions / Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full bg-gray-50 dark:bg-zinc-900/30 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-gold transition-colors font-light text-sm resize-none"
                placeholder="E.g. I prefer the fit extra slim at the waist..."
              />
            </div>

            {/* ─── Payment Method ───────────────────────────────────── */}
            <div className="space-y-3 mt-8">
              <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                <CreditCard size={12} className="inline mr-1.5 -mt-0.5" />
                Payment Method
              </label>

              {/* TransactPay (sole gateway) */}
              <div className="relative p-5 rounded-xl border-2 border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-lg shadow-emerald-500/10">
                <div className="absolute top-3 right-3 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-500/10 text-emerald-500">
                    <Landmark size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-charcoal dark:text-ivory">
                      TransactPay
                    </h4>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Cards, Bank Transfer, OPay Wallet
                </p>
              </div>

              <div className="flex items-center gap-2 mt-2 px-1">
                <Shield size={12} className="text-green-500 flex-shrink-0" />
                <p className="text-[10px] text-gray-400">
                  All transactions are secured with 256-bit SSL encryption. Your card details are never stored on our servers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 mt-8 mb-8 p-4 bg-gray-50 dark:bg-zinc-900/50 rounded-lg border border-gold/5">
              <input 
                type="checkbox" 
                id="terms" 
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 accent-gold"
              />
              <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
                I certify that all measurements and details provided are accurate. I have read and agree to the <a href="/terms" target="_blank" className="text-gold hover:underline font-bold">Terms of Service</a> and <a href="/privacy" target="_blank" className="text-gold hover:underline font-bold">Privacy Policy</a>.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !acceptedTerms || items.length === 0}
              className={`w-full py-5 bg-burgundy text-white font-bold uppercase tracking-[0.3em] text-xs transition-all duration-500 shadow-xl ${(loading || !acceptedTerms || items.length === 0) ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:bg-black hover:tracking-[0.4em]'}`}
            >
              {loading ? "Processing Securely..." : `Complete Payment — ₦${total.toLocaleString()}`}
            </button>
          </form>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-1/3"
        >
          <div className="bg-cream dark:bg-charcoal p-8 border border-gold/10 rounded-xl shadow-2xl sticky top-24">
            <h2 className="text-xl font-serif mb-6 uppercase tracking-widest border-b border-gold/20 pb-4 text-burgundy italic">Order Summary</h2>
            <div className="space-y-4 mb-8">
              {items.map((item) => (
                <div key={`${item.id}-${item.variationId}`} className="flex justify-between text-sm group">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-gold transition-colors">{item.name}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono italic">
                      {item.variationId ? "Bespoke Variant" : "Standard Fit"} x {item.quantity}
                    </span>
                  </div>
                  <span className="font-semibold text-charcoal dark:text-ivory">₦{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Coupon Input */}
            <div className="border-t border-gold/10 pt-6 mb-6">
               <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-2 font-bold">Promotional Code</label>
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={couponCode}
                   onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                   placeholder="E.G. WELCOME10"
                   className="flex-1 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 px-4 py-3 text-xs focus:border-gold outline-none rounded-lg font-mono"
                 />
                 <button 
                   onClick={handleApplyCoupon}
                   disabled={isValidatingCoupon || !couponCode}
                   className="px-6 py-2 bg-charcoal text-ivory text-[10px] font-bold uppercase rounded-lg hover:bg-gold hover:text-black transition-all disabled:opacity-50"
                 >
                   {isValidatingCoupon ? "..." : "Apply"}
                 </button>
               </div>
               {couponError && <p className="text-burgundy text-[10px] mt-2 italic font-medium">{couponError}</p>}
               {appliedCoupon && (
                 <div className="mt-3 flex justify-between items-center bg-green-50 dark:bg-green-900/10 p-3 rounded-lg border border-green-100 dark:border-green-900/30">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-green-700 dark:text-green-400">"{appliedCoupon.code}" Applied</span>
                      <span className="text-[8px] text-green-600 dark:text-green-500 uppercase tracking-widest">Discount Active</span>
                   </div>
                   <button onClick={() => setAppliedCoupon(null)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors">
                      <X size={14} className="text-red-500" />
                   </button>
                 </div>
               )}
            </div>

            <div className="space-y-4 border-t border-gold/20 pt-6">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 uppercase tracking-[0.2em]">Subtotal</span>
                <span className="font-medium text-charcoal dark:text-ivory">₦{subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs">
                  <span className="text-green-600 uppercase tracking-[0.2em] font-bold">Discount Applied</span>
                  <span className="font-bold text-green-600">- ₦{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-6 font-bold text-2xl border-t border-gold/10">
                <span className="uppercase tracking-[0.2em] text-gray-400 text-[10px] mt-2">Grand Total</span>
                <span className="text-burgundy">₦{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment Gateway Badge */}
            <div className="mt-6 pt-4 border-t border-gold/10 flex items-center justify-center gap-2">
              <span className="text-[9px] uppercase tracking-[0.15em] text-gray-400">Powered by</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                TransactPay
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}