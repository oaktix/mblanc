"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Lock, Mail, Loader2, ChevronRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials for Atelier access");
      } else {
        // Force a hard redirect to the dashboard
        window.location.href = "/admin";
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-charcoal p-10 border border-gold/30 shadow-[0_0_50px_rgba(212,175,55,0.1)] rounded-2xl relative overflow-hidden">
          {/* Decorative accents */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gold"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 border border-gold/20 mb-6">
               <ShieldCheck className="text-gold" size={32} />
            </div>
            <h1 className="text-3xl font-serif text-ivory mb-2 tracking-[0.2em] uppercase">MBLANC</h1>
            <p className="text-[10px] text-gold uppercase tracking-[0.4em] font-bold">Internal Management Portal</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-burgundy/10 border border-burgundy/30 text-burgundy text-xs text-center rounded-lg font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-bold">Security Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 bg-black border border-gray-800 rounded-xl text-sm text-ivory focus:outline-none focus:border-gold transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex justify-end mt-2">
                <Link 
                  href="/admin/forgot-password" 
                  className="text-[10px] text-gray-500 hover:text-gold transition-colors font-bold uppercase tracking-widest"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-gold text-black font-bold uppercase tracking-[0.3em] text-[10px] rounded-xl hover:bg-ivory transition-all flex items-center justify-center gap-2 group shadow-lg shadow-gold/10"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : "Authenticate Access"}
              {!loading && <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
             <Link href="/" className="text-[10px] uppercase tracking-[0.2em] text-gray-500 hover:text-gold transition-colors font-bold">
                Back to Public Storefront
             </Link>
          </div>
        </div>
        
        <p className="text-center text-[8px] text-gray-600 uppercase tracking-widest mt-8 font-light">
          Authorized personnel only. All access attempts are logged for security.
        </p>
      </div>
    </main>
  );
}
