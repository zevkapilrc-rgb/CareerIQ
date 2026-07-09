"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import PremiumButton from "@/src/components/ui/PremiumButton";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signUp(email, password, name);
    if (error) {
      setError(error.message);
    } else {
      router.push("/auth/login?message=check-email");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#09090B] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#7a1730]/8 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#c9975a]/5 blur-[90px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[420px] border border-white/[0.06] rounded-2xl overflow-hidden bg-[#121214]/60 backdrop-blur-xl shadow-2xl relative z-10"
      >
        {/* Header */}
        <div className="p-8 border-b border-white/[0.05]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--text)] font-display tracking-tight">HIREVIX</h1>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-semibold">Create Account</p>
            </div>
          </div>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Join HireVix to unlock AI-powered career intelligence and personalized growth paths.
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block font-display">
                Full Name
              </label>
              <div className="flex items-center gap-2 bg-black/45 border border-white/[0.08] rounded-xl px-3.5 h-11 focus-within:border-[var(--color-primary)]/60 transition-colors">
                <User size={14} className="text-zinc-500 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-transparent border-none text-[var(--text)] text-sm outline-none w-full font-semibold placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block font-display">
                Email Address
              </label>
              <div className="flex items-center gap-2 bg-black/45 border border-white/[0.08] rounded-xl px-3.5 h-11 focus-within:border-[var(--color-primary)]/60 transition-colors">
                <Mail size={14} className="text-zinc-500 flex-shrink-0" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-transparent border-none text-[var(--text)] text-sm outline-none w-full font-semibold placeholder:text-zinc-600"
                />
              </div>
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest block font-display">
                Password
              </label>
              <div className="flex items-center gap-2 bg-black/45 border border-white/[0.08] rounded-xl px-3.5 h-11 focus-within:border-[var(--color-primary)]/60 transition-colors">
                <Lock size={14} className="text-zinc-500 flex-shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-transparent border-none text-[var(--text)] text-sm outline-none w-full font-semibold placeholder:text-zinc-600"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 bottom-2.5 text-zinc-500 hover:text-zinc-400 outline-none transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <PremiumButton type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
              <ArrowRight className="w-4 h-4" />
            </PremiumButton>
          </form>

          <div className="mt-6 pt-6 border-t border-white/[0.05] text-center">
            <p className="text-sm text-[var(--text-muted)]">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[var(--color-accent)] hover:underline font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
