"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const CheckoutForm = dynamic(() => import("@/components/checkout/CheckoutForm"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-10 h-10 text-gold animate-spin mb-4" />
      <p className="text-gray-500 font-serif italic">Preparing your secure checkout...</p>
    </div>
  )
});

export default function CheckoutPageClient() {
  return <CheckoutForm />;
}
