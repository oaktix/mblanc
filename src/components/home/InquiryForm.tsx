"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { sendInquiryAction } from "@/app/actions/contact";

export default function InquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await sendInquiryAction(formData);

    if (result.success) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 8000);
    } else {
      setError(result.error || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <section className="py-24 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left Side: Content */}
          <div className="w-full lg:w-1/3">
            <h2 className="text-4xl font-serif mb-6 text-charcoal dark:text-ivory">
              Have a Vision? <br /> Let's Bring It to Life.
            </h2>
            <div className="w-16 h-1 bg-gold mb-6"></div>
            <p className="text-gray-500 font-light leading-relaxed mb-8">
              Whether you have a specific design in mind or need guidance on your next statement piece, our team is here to assist. Fill out the form, and a master tailor will be in touch shortly.
            </p>
            <div className="space-y-4 text-sm text-charcoal dark:text-gray-400">
              <p><strong>Email:</strong> hello@mblancfits.com</p>
              <p><strong>Phone:</strong> +234 904 757 6899</p>
              <p><strong>Atelier:</strong> 460 Yusuf Abubakar Yusuf Street, Abuja</p>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="w-full lg:w-2/3">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center bg-cream dark:bg-charcoal p-12 text-center border border-gold/30">
                <CheckCircle2 size={64} className="text-gold mb-6" strokeWidth={1} />
                <h3 className="text-2xl font-serif mb-2">Inquiry Received</h3>
                <p className="text-gray-500">Thank you for reaching out. A member of our team will contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-cream dark:bg-charcoal p-8 md:p-12 space-y-6">
                {error && <div className="p-4 bg-burgundy/10 text-burgundy text-xs italic border border-burgundy/20">{error}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                    <input type="text" id="name" name="name" required className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 py-3 focus:outline-none focus:border-gold transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                    <input type="email" id="email" name="email" required className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 py-3 focus:outline-none focus:border-gold transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Phone Number</label>
                    <input type="tel" id="phone" name="phone" className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 py-3 focus:outline-none focus:border-gold transition-colors" />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Inquiry Subject</label>
                    <select id="subject" name="subject" required className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 py-3 focus:outline-none focus:border-gold transition-colors appearance-none cursor-pointer">
                      <option value="General Inquiry">Select a subject...</option>
                      <option value="Custom Order">Custom Order</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Collaboration">Collaboration</option>
                      <option value="Bulk Order / Wedding Party">Bulk Order / Wedding Party</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Message</label>
                  <textarea id="message" name="message" rows={4} required className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 py-3 focus:outline-none focus:border-gold transition-colors resize-none placeholder-gray-400" placeholder="Tell us about your vision..."></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full md:w-auto px-10 py-4 bg-burgundy text-white font-semibold tracking-wider uppercase text-sm hover:bg-black transition-colors mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading && <Loader2 className="animate-spin" size={16} />}
                  {loading ? "Sending..." : "Send Inquiry"}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
