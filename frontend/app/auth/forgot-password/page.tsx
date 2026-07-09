"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Sparkles, ArrowLeft, CheckCircle } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import PremiumButton from "@/src/components/ui/PremiumButton";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { resetPassword } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await resetPassword(email);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#09090B] relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#7a1730]/8 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#c9975a]/5 blur-[90px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[420px] border border-white/[0.06] rounded-2xl overflow-hidden bg-[#121214]/60 backdrop-blur-xl shadow-2xl relative z-10 p-8 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text)] font-display mb-2">Check Your Email</h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            We&apos;ve sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.
          </p>
          <Link href="/auth/login">
            <PremiumButton className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </PremiumButton>
          </Link>
        </motion.div>
      </div>
    );
  }

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
          <Link href="/auth/login" className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text)] mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--text)] font-display tracking-tight">HIREVIX</h1>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-semibold">Reset Password</p>
            </div>
          </div>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Enter your email address and we&apos;ll send you a link to reset your password.
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

            <PremiumButton type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
              <Mail className="w-4 h-4" />
            </PremiumButton>
          </form>

          <div className="mt-6 pt-6 border-t border-white/[0.05] text-center">
            <p className="text-sm text-[var(--text-muted)]">
              Remember your password?{" "}
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
