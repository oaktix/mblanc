"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Lock, Loader2, ChevronRight, ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setErrorState("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setErrorState("Password must be at least 8 characters");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("Security password updated successfully.");
      } else {
        setErrorState(data.error || "Failed to reset password");
      }
    } catch (err) {
      setErrorState("An unexpected error occurred");
    }
  };

  const setErrorState = (msg: string) => {
    setStatus("error");
    setMessage(msg);
  };

  if (!token) {
    return (
      <div className="text-center space-y-6">
        <div className="p-4 bg-burgundy/10 border border-burgundy/30 text-burgundy text-xs rounded-lg font-bold">
          Invalid or missing recovery token.
        </div>
        <Link href="/admin/forgot-password" className="text-gold uppercase tracking-widest text-[10px]">
           Request New Reset Link
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-charcoal p-10 border border-gold/30 shadow-[0_0_50px_rgba(212,175,55,0.1)] rounded-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gold"></div>
      
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/10 border border-gold/20 mb-6">
           <ShieldCheck className="text-gold" size={32} />
        </div>
        <h1 className="text-2xl font-serif text-ivory mb-2 tracking-[0.1em] uppercase">New Password</h1>
        <p className="text-[10px] text-gold uppercase tracking-[0.3em] font-bold">Security Credential Update</p>
      </div>

      {status === "success" ? (
        <div className="text-center space-y-8">
          <div className="flex flex-col items-center gap-4">
             <CheckCircle2 className="text-gold" size={48} />
             <p className="text-sm text-ivory font-medium">{message}</p>
          </div>
          <Link 
            href="/admin/login"
            className="w-full py-4 bg-gold text-black font-bold uppercase tracking-[0.3em] text-[10px] rounded-xl hover:bg-ivory transition-all flex items-center justify-center gap-2"
          >
            Go to Login <ChevronRight size={16} />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {status === "error" && (
            <div className="p-4 bg-burgundy/10 border border-burgundy/30 text-burgundy text-xs text-center rounded-lg font-bold">
              {message}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-bold">New Security Password</label>
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
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-bold">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 bg-black border border-gray-800 rounded-xl text-sm text-ivory focus:outline-none focus:border-gold transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={status === "loading"}
            className="w-full py-4 bg-gold text-black font-bold uppercase tracking-[0.3em] text-[10px] rounded-xl hover:bg-ivory transition-all flex items-center justify-center gap-2 group shadow-lg shadow-gold/10"
          >
            {status === "loading" ? <Loader2 className="animate-spin" size={16} /> : "Update Credentials"}
            {status !== "loading" && <ChevronRight className="group-hover:translate-x-1 transition-transform" size={16} />}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Suspense fallback={<div className="text-gold animate-pulse text-center">Loading Portal...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
