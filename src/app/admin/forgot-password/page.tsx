"use client";

import { useState } from "react";
import { Mail, Loader2, ChevronRight, KeyRound, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("Password reset instructions have been sent to your email.");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to process request");
      }
    } catch (err) {
      setStatus("error");
      setMessage("An unexpected error occurred");
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-charcoal p-10 border border-gold/30 shadow-[0_0_50px_rgba(212,175,55,0.1)] rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gold"></div>
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 border border-gold/20 mb-6">
               <KeyRound className="text-gold" size={32} />
            </div>
            <h1 className="text-2xl font-serif text-ivory mb-2 tracking-[0.1em] uppercase">Reset Password</h1>
            <p className="text-[10px] text-gold uppercase tracking-[0.3em] font-bold">Atelier Personnel Recovery</p>
          </div>

          {status === "success" ? (
            <div className="text-center space-y-6">
              <div className="p-4 bg-gold/10 border border-gold/30 text-gold text-xs rounded-lg font-bold">
                {message}
              </div>
              <Link 
                href="/admin/login"
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-ivory hover:text-gold transition-colors font-bold"
              >
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === "error" && (
                <div className="p-4 bg-burgundy/10 border border-burgundy/30 text-burgundy text-xs text-center rounded-lg font-bold">
                  {message}
                </div>
              )}

              <p className="text-xs text-gray-400 text-center leading-relaxed">
                Enter your authorized personnel email and we'll send you instructions to reset your security password.
              </p>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-bold">Personnel Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-black border border-gray-800 rounded-xl text-sm text-ivory focus:outline-none focus:border-gold transition-all"
                    placeholder="name@mblancfits.com"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={status === "loading"}
                className="w-full py-4 bg-gold text-black font-bold uppercase tracking-[0.3em] text-[10px] rounded-xl hover:bg-ivory transition-all flex items-center justify-center gap-2 group shadow-lg shadow-gold/10"
              >
                {status === "loading" ? <Loader2 className="animate-spin" size={16} /> : "Request Reset"}
                {status !== "loading" && <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />}
              </button>

              <div className="text-center">
                <Link 
                  href="/admin/login"
                  className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-gold transition-colors font-bold"
                >
                   Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
