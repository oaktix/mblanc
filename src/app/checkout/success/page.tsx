import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <main className="pt-24 min-h-screen bg-cream dark:bg-black flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-charcoal p-12 text-center border border-gold/20 shadow-2xl">
        <CheckCircle2 size={64} className="text-gold mx-auto mb-6" strokeWidth={1} />
        <h1 className="text-3xl font-serif mb-4 text-charcoal dark:text-ivory">Thank You</h1>
        <p className="text-gray-500 font-light mb-10 leading-relaxed">
          Your order has been placed successfully. A master tailor will review your request and contact you within 24 hours to begin the consultation process.
        </p>
        <Link 
          href="/shop"
          className="block w-full py-4 bg-burgundy text-white font-semibold uppercase tracking-widest text-sm hover:bg-black transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    </main>
  );
}
