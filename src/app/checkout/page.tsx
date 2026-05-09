import { Metadata } from "next";
import CheckoutPageClient from "@/components/checkout/CheckoutPageClient";

export const metadata: Metadata = {
  title: "Checkout | Finalize Your Bespoke Order",
  description: "Securely complete your MBlanc Bespoke order. Luxury tailoring delivered to your doorstep.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return (
    <main className="pt-24 min-h-screen bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-charcoal dark:text-ivory mb-4">Checkout</h1>
          <p className="text-gray-500 font-light italic">Complete your order to begin the bespoke journey.</p>
        </div>
        <CheckoutPageClient />
      </div>
    </main>
  );
}
