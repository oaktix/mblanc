"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import { sendInquiryAction } from "@/app/actions/contact";

export default function ContactClient() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const result = await sendInquiryAction(formData);

    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || "Failed to send inquiry.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-ivory dark:bg-black pb-24">
      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center bg-black overflow-hidden mb-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/perfection.jpg" 
            alt="Perfection in Tailoring" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent mix-blend-multiply"></div>
        </div>
        <div className="relative z-20 text-center px-4 mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-gold uppercase tracking-[0.4em] text-xs mb-4 block">Concierge Services</span>
            <h1 className="text-4xl md:text-6xl font-serif text-ivory mb-6">Begin Your Bespoke Journey</h1>
            <div className="h-1 w-20 bg-gold mx-auto" />
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-12"
          >
            <div>
               <h2 className="text-2xl font-serif text-charcoal dark:text-ivory mb-8 italic">The Atelier Location</h2>
               <div className="space-y-8">
                  <div className="flex gap-6">
                     <div className="w-12 h-12 bg-white dark:bg-charcoal shadow-sm flex items-center justify-center shrink-0 border border-gold/10">
                        <MapPin className="text-gold" size={20} />
                     </div>
                     <div>
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-1 font-bold">Address</p>
                        <p className="text-lg text-charcoal dark:text-ivory font-light leading-relaxed">
                           460 Yusuf Abubakar Yusuf Street,<br />
                           Beside Purple Heart, Abuja, Nigeria
                        </p>
                     </div>
                  </div>

                  <div className="flex gap-6">
                     <div className="w-12 h-12 bg-white dark:bg-charcoal shadow-sm flex items-center justify-center shrink-0 border border-gold/10">
                        <Phone className="text-gold" size={20} />
                     </div>
                     <div>
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-1 font-bold">Phone</p>
                        <p className="text-lg text-charcoal dark:text-ivory font-light">+234 904 757 6899</p>
                     </div>
                  </div>

                  <div className="flex gap-6">
                     <div className="w-12 h-12 bg-white dark:bg-charcoal shadow-sm flex items-center justify-center shrink-0 border border-gold/10">
                        <Mail className="text-gold" size={20} />
                     </div>
                     <div>
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-1 font-bold">Email</p>
                        <p className="text-lg text-charcoal dark:text-ivory font-light">hello@mblancfits.com</p>
                     </div>
                  </div>

                  <div className="flex gap-6">
                     <div className="w-12 h-12 bg-white dark:bg-charcoal shadow-sm flex items-center justify-center shrink-0 border border-gold/10">
                        <Clock className="text-gold" size={20} />
                     </div>
                     <div>
                        <p className="text-xs uppercase tracking-widest text-gray-400 mb-1 font-bold">Hours</p>
                        <p className="text-lg text-charcoal dark:text-ivory font-light">Mon — Sat: 10AM — 7PM</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-gold/5 border border-gold/10 rounded-sm italic text-charcoal/70 dark:text-ivory/70">
               "For clients requiring private fittings outside of standard hours or at their residence, please coordinate directly with our head concierge."
            </div>
          </motion.div>

          {/* Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-charcoal p-10 md:p-12 shadow-2xl border border-gold/10 relative"
          >
            {submitted ? (
               <div className="py-20 text-center">
                  <CheckCircle2 size={64} className="text-gold mx-auto mb-6" strokeWidth={1} />
                  <h3 className="text-2xl font-serif mb-4">Inquiry Received</h3>
                  <p className="text-gray-500 font-light max-w-xs mx-auto">
                     Thank you for reaching out. Our head concierge will contact you within 24 hours to begin your journey.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="mt-8 text-gold uppercase tracking-widest text-[10px] font-bold border-b border-gold/30 pb-1">Send another message</button>
               </div>
            ) : (
               <>
                  <div className="mb-10">
                     <h3 className="text-2xl font-serif mb-2">General Inquiry</h3>
                     <p className="text-gray-500 text-sm font-light">Please provide your details and we will contact you within 24 hours.</p>
                  </div>

                  {error && <div className="mb-6 p-4 bg-burgundy/10 text-burgundy text-xs italic border border-burgundy/20">{error}</div>}

                  <form onSubmit={handleSubmit} className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Full Name</label>
                           <input 
                              type="text" 
                              name="name"
                              required
                              placeholder="e.g. Yusuf Abubakar"
                              className="w-full bg-transparent border-b border-gray-200 dark:border-gray-800 py-3 focus:outline-none focus:border-gold transition-all font-light"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Email Address</label>
                           <input 
                              type="email" 
                              name="email"
                              required
                              placeholder="yusuf@example.com"
                              className="w-full bg-transparent border-b border-gray-200 dark:border-gray-800 py-3 focus:outline-none focus:border-gold transition-all font-light"
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Inquiry Type</label>
                        <select name="subject" className="w-full bg-transparent border-b border-gray-200 dark:border-gray-800 py-3 focus:outline-none focus:border-gold transition-all font-light appearance-none cursor-pointer">
                           <option>Private Fitting Appointment</option>
                           <option>Custom Wedding Ensemble</option>
                           <option>Corporate Partnership</option>
                           <option>General Inquiry</option>
                        </select>
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Message</label>
                        <textarea 
                           name="message"
                           rows={4}
                           required
                           placeholder="How may we assist you in your sartorial pursuit?"
                           className="w-full bg-transparent border-b border-gray-200 dark:border-gray-800 py-3 focus:outline-none focus:border-gold transition-all font-light resize-none"
                        ></textarea>
                     </div>

                     <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-5 bg-black text-gold font-bold uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-3 hover:bg-gold hover:text-black transition-all disabled:opacity-50"
                     >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                        {loading ? "Sending Inquiry..." : "Send Inquiry"}
                     </button>
                  </form>
               </>
            )}

            <div className="mt-12 pt-8 border-t border-gray-50 dark:border-gray-900 flex items-center gap-4 text-gray-400">
               <MessageSquare size={18} />
               <p className="text-xs italic">Prefer a direct conversation? WhatsApp us at +234 904 757 6899</p>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
