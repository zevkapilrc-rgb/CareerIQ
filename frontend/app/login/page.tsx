"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/src/state/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, KeyRound, ChevronRight, UserCircle2, ArrowLeft,
  Loader2, Sparkles, Lock, Globe2, Eye, EyeOff, User, Check
} from "lucide-react";

const ADMIN_PHONE = "9360097924";
const ADMIN_OTP = "2319";
const API_BASE = "/api";

const TIPS = [
  "Resume Intelligence extracts 50+ data points from your CV instantly.",
  "VR Interview Simulator adjusts difficulty based on your real-time responses.",
  "Skill Gap Analyzer cross-references your profile against 85,000+ live jobs.",
  "Learning Path AI generates a dynamic 6-month roadmap curated to your gaps.",
  "Global Job Scanner maps your profile to opportunities across 15+ tech hubs.",
  "HelixAI acts as your personal mentor for salary negotiations and technical doubts.",
  "Career Forecast AI predicts domain layoff risks and emerging tech trends.",
  "Gamification system turns your career progression into an interactive journey."
];

const STATS = [
  { label: "Data Points Scanned", value: "4.2M+" },
  { label: "Jobs Analyzed", value: "85K+" },
  { label: "Global Markets", value: "15+" },
  { label: "AI Modules", value: "10" },
];

// ─── localStorage user DB ────────────────────────────────────────
function hashPwd(pwd: string): string { return btoa(pwd + "_ciq_salt"); }

function dbGet(): Record<string, { name: string; pwd: string }> {
  if (typeof window === "undefined") return {};
  return JSON.parse(localStorage.getItem("ciq-email-db") || "{}");
}

function dbSet(db: Record<string, { name: string; pwd: string }>) {
  localStorage.setItem("ciq-email-db", JSON.stringify(db));
}

function userExists(email: string): boolean {
  return !!dbGet()[email.toLowerCase()];
}

function registerUser(email: string, name: string, pwd: string): void {
  const db = dbGet();
  db[email.toLowerCase()] = { name, pwd: hashPwd(pwd) };
  dbSet(db);
}

function verifyUser(email: string, pwd: string): { ok: boolean; name: string } {
  const db = dbGet();
  const entry = db[email.toLowerCase()];
  if (!entry) return { ok: false, name: "" };
  return { ok: entry.pwd === hashPwd(pwd), name: entry.name };
}

function nameFromEmail(email: string): string {
  return email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

// ─── Component ───────────────────────────────────────────────────
type AuthMode = "signin" | "signup" | "admin";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [adminPhone, setAdminPhone] = useState("");
  const [adminOtp, setAdminOtp] = useState(["", "", "", ""]);
  const [step, setStep] = useState<"input" | "otp">("input");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);
  const router = useRouter();
  const { loginUser, loginAdmin, role } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const iv = setInterval(() => setTipIdx(i => (i + 1) % TIPS.length), 4000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (mounted && role !== "guest") {
      router.replace(getRedirect());
    }
  }, [mounted, role, router]);

  const getRedirect = (): string => {
    if (typeof window === "undefined") return "/dashboard";
    const r = localStorage.getItem("ciq-redirect-after-login");
    if (r) { localStorage.removeItem("ciq-redirect-after-login"); return `/${r}`; }
    return "/dashboard";
  };

  // ── Sign In ────────────────────────────────────────────────────
  const handleSignIn = async () => {
    setError(""); setSuccess("");
    if (!email.includes("@")) { setError("Enter a valid email address"); return; }
    if (password.length < 4) { setError("Password must be at least 4 characters"); return; }
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email, password }),
      });
      
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("ciq-jwt", data.access_token);
        
        let displayName = nameFromEmail(email);
        const meRes = await fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${data.access_token}` } });
        if (meRes.ok) { 
            const me = await meRes.json(); 
            displayName = me.name || displayName; 
        }
        
        loginUser("", displayName, email);
        const dest = email.toLowerCase() === "zevkapilrc@gmail.com" ? "/admin" : getRedirect();
        router.push(dest);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Invalid credentials.");
      }
    } catch (err) { 
      setError("Could not connect to the database.");
    } finally {
      setLoading(false);
    }
  };

  // ── Sign Up ────────────────────────────────────────────────────
  const handleSignUp = async () => {
    setError(""); setSuccess("");
    if (!name.trim()) { setError("Enter your full name"); return; }
    if (!email.includes("@")) { setError("Enter a valid email address"); return; }
    if (password.length < 4) { setError("Password must be at least 4 characters"); return; }
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email, password }),
      });
      
      if (res.ok) {
        const loginRes = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: email, password }),
        });
        
        if (loginRes.ok) {
          const data = await loginRes.json();
          localStorage.setItem("ciq-jwt", data.access_token);
          loginUser("", name.trim(), email);
          router.push(getRedirect());
        } else {
            setError("Account created, but automatic login failed.");
        }
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Registration failed.");
      }
    } catch (err) { 
        setError("Could not connect to the database.");
    } finally {
        setLoading(false);
    }
  };

  // ── Admin OTP ─────────────────────────────────────────────────
  const handleAdminPhone = () => {
    if (adminPhone !== ADMIN_PHONE) { setError("Not a valid admin number"); return; }
    setError(""); setLoading(true);
    setAdminOtp(["", "", "", ""]);
    setTimeout(() => { setLoading(false); setStep("otp"); }, 700);
  };

  const handleOtpChange = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(-1);
    const nd = [...adminOtp]; nd[i] = d; setAdminOtp(nd);
    if (d && i < 3) { (document.getElementById(`otp-${i + 1}`) as HTMLInputElement)?.focus(); }
  };

  const handleAdminVerify = () => {
    if (adminOtp.join("").length < 4) { setError("Enter all 4 digits"); return; }
    setError(""); setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (adminOtp.join("") === ADMIN_OTP) { loginAdmin(); router.push("/admin"); }
      else setError("Wrong OTP. Try again.");
    }, 700);
  };

  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#0A0A0B]">
      {/* Advanced Ambient Background (Extreme Redesign) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#030305]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0f172a_0%,#000000_100%)]" />
        
        {/* Animated Grid Floor */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: "linear-gradient(rgba(167,139,250,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.15) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            transform: "perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(-200px)",
            transformOrigin: "top center",
          }}
        />

        {/* Global Scanner Sweep */}
        <motion.div
           animate={{ y: ["-100vh", "100vh"] }}
           transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
           className="absolute inset-x-0 h-[1px] opacity-40"
           style={{ 
               background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.8), transparent)",
               boxShadow: "0 0 40px 2px rgba(167,139,250,0.5)" 
           }}
        />

        {/* Liquid Glass Blobs */}
        <motion.div
           animate={{ 
               rotate: 360, 
               borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "60% 40% 30% 70% / 60% 30% 70% 40%", "30% 70% 70% 30% / 30% 30% 70% 70%"] 
           }}
           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
           className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/15 to-blue-600/15 border border-white/5 backdrop-blur-[2px]"
        />
        <motion.div
           animate={{ 
               rotate: -360, 
               borderRadius: ["60% 40% 30% 70% / 60% 30% 70% 40%", "30% 70% 70% 30% / 30% 30% 70% 70%", "60% 40% 30% 70% / 60% 30% 70% 40%"] 
           }}
           transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
           className="absolute -bottom-32 -right-32 w-[700px] h-[700px] bg-gradient-to-bl from-indigo-600/15 to-fuchsia-600/15 border border-white/5 backdrop-blur-[2px]"
        />
      </div>

      {/* Wrapping the card to add a spinning neon border */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-5xl rounded-[2.6rem] p-[2px] overflow-hidden shadow-[0_0_120px_-20px_rgba(124,58,237,0.3)]"
      >
        {/* Animated Spinning Border */}
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
           className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -z-10"
           style={{ 
               transform: "translate(-50%, -50%)",
               background: "conic-gradient(from 0deg, transparent 0 280deg, #c084fc 320deg, #3b82f6 360deg)" 
           }}
        />

        <div className="relative w-full h-full bg-[#09090b]/90 backdrop-blur-[40px] rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row z-10">
          
        {/* Glow behind the actual form container */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-transparent blur-3xl -z-10 pointer-events-none rounded-[3rem]" />

        {/* ── LEFT — Branding ── */}
        <div className="w-full md:w-[42%] p-10 lg:p-12 border-b md:border-b-0 md:border-r border-white/5 relative overflow-hidden flex flex-col justify-between group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 z-0 transition-opacity duration-700 group-hover:opacity-70" />
          
          {/* AI Core Online Indicator */}
          <div className="absolute top-5 left-5 flex items-center gap-2 z-20">
            <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[0.6rem] text-emerald-400/80 font-mono tracking-widest uppercase">Global Network Online</span>
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-col items-center justify-center w-full mt-16 mb-10"
            >
              {/* Main Logo — icon + "CareerIQ" wordmark */}
              <div className="flex items-center justify-center gap-4">
                <motion.img
                  src="/logo-minimal.png"
                  alt="CareerIQ Icon"
                  animate={{ y: [0, -6, 0], scale: [1, 1.02, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    height: 52,
                    width: 52,
                    objectFit: "contain",
                    filter: "drop-shadow(0 4px 24px rgba(99,102,241,0.35))",
                  }}
                />
                <style>{`
                    @keyframes glassShine {
                        0% { background-position: 0% 50%; }
                        100% { background-position: 200% 50%; }
                    }
                `}</style>
                <motion.span 
                    style={{ 
                        fontSize: "2.5rem", fontWeight: 900, letterSpacing: "-0.04em", 
                        background: "linear-gradient(110deg, #a78bfa 35%, #ffffff 50%, #a78bfa 65%)", 
                        backgroundSize: "200% auto",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        textShadow: "0 0 24px rgba(167,139,250,0.4)",
                        animation: "glassShine 3s linear infinite"
                    }}
                >
                    CareerIQ
                </motion.span>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ 
                    fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.25em", 
                    color: "#a78bfa", 
                    marginTop: 12,
                    textShadow: "0 0 12px rgba(167,139,250,0.4)" 
                }}
              >
                NAVIGATE YOUR FUTURE
              </motion.div>
            </motion.div>
          </div>


          <div className="relative z-10 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {STATS.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="bg-white/5 border border-white/5 rounded-xl p-3 text-center"
                >
                  <div className="text-lg font-bold text-blue-100">{s.value}</div>
                  <div className="text-[0.6rem] text-white/40 uppercase tracking-wider mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="h-14 relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tipIdx}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center gap-3 text-xs text-white/55 bg-white/[0.03] rounded-lg px-4 border border-white/5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                  <span className="leading-snug">{TIPS[tipIdx]}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ── RIGHT — Form ── */}
        <div className="w-full md:w-[58%] p-10 lg:p-12 bg-[#0D0D11]/80 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            {/* Mode Tabs */}
            <div className="flex bg-white/5 rounded-xl p-1 mb-8 border border-white/10">
              {(["signin", "signup", "admin"] as AuthMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(""); setSuccess(""); setStep("input"); }}
                  className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all relative ${mode === m ? "text-white" : "text-white/40 hover:text-white/70"}`}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="modeBar"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"
                      style={{ zIndex: -1 }}
                    />
                  )}
                  <span className="flex items-center justify-center gap-1.5">
                    {m === "signin" && <UserCircle2 className="w-3.5 h-3.5" />}
                    {m === "signup" && <User className="w-3.5 h-3.5" />}
                    {m === "admin" && <Lock className="w-3.5 h-3.5" />}
                    {m === "signin" ? "Sign In" : m === "signup" ? "Create Account" : "Admin"}
                  </span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {/* ── SIGN IN ── */}
              {mode === "signin" && step === "input" && (
                <motion.div key="signin" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
                  <div className="mb-7">
                    <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
                    <p className="text-white/40 text-sm">Sign in to continue your career journey.</p>
                  </div>

                  <div className="space-y-4">
                    <InputField icon={<Mail className="w-4 h-4" />} type="email" value={email} onChange={setEmail} placeholder="Email address" onEnter={handleSignIn} />
                    <PasswordField value={password} onChange={setPassword} show={showPwd} onToggle={() => setShowPwd(v => !v)} onEnter={handleSignIn} />

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-white/35 pl-1">
                      New here?{" "}
                      <button onClick={() => setMode("signup")} className="text-purple-400 underline underline-offset-2 hover:text-purple-300">
                        Create a free account
                      </button>
                    </motion.p>

                    {error && <ErrorBox msg={error} />}

                    <ActionButton label="Sign In" icon={<ChevronRight className="w-4 h-4" />} loading={loading} onClick={handleSignIn} />
                  </div>
                </motion.div>
              )}

              {/* ── SIGN UP ── */}
              {mode === "signup" && step === "input" && (
                <motion.div key="signup" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
                  <div className="mb-7">
                    <h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
                    <p className="text-white/40 text-sm">Join CareerIQ — it's free and takes 10 seconds.</p>
                  </div>

                  <div className="space-y-4">
                    <InputField icon={<User className="w-4 h-4" />} type="text" value={name} onChange={setName} placeholder="Full name" onEnter={handleSignUp} />
                    <InputField icon={<Mail className="w-4 h-4" />} type="email" value={email} onChange={setEmail} placeholder="Email address" onEnter={handleSignUp} />
                    <PasswordField value={password} onChange={setPassword} show={showPwd} onToggle={() => setShowPwd(v => !v)} onEnter={handleSignUp} />

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-2 text-xs text-white/35 pl-1 leading-relaxed">
                      <Check className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                      Your account is stored securely. Sign in anytime on any device.
                    </motion.div>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-white/35 pl-1">
                      Already have an account?{" "}
                      <button onClick={() => setMode("signin")} className="text-purple-400 underline underline-offset-2 hover:text-purple-300">
                        Sign in instead
                      </button>
                    </motion.p>

                    {error && <ErrorBox msg={error} />}
                    {success && <SuccessBox msg={success} />}

                    <ActionButton label="Create Account" icon={<ChevronRight className="w-4 h-4" />} loading={loading} onClick={handleSignUp} />
                  </div>
                </motion.div>
              )}

              {/* ── ADMIN INPUT ── */}
              {mode === "admin" && step === "input" && (
                <motion.div key="admin-input" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
                  <div className="mb-7">
                    <h2 className="text-2xl font-bold text-white mb-1">Admin Access</h2>
                    <p className="text-white/40 text-sm">Secure portal for platform administrators.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="relative flex items-center group">
                      <div className="absolute left-4 flex items-center gap-2 text-white/50 font-medium z-10 group-focus-within:text-purple-400 transition-colors border-r border-white/10 pr-3">
                        <Globe2 className="w-4 h-4" /> +91
                      </div>
                      <input
                        value={adminPhone}
                        onChange={e => setAdminPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="Admin Phone Number"
                        maxLength={10}
                        onKeyDown={e => e.key === "Enter" && handleAdminPhone()}
                        className="w-full bg-white/5 border border-white/10 focus:border-purple-500/50 rounded-xl py-3.5 pl-[5.5rem] pr-4 text-white placeholder:text-white/30 outline-none transition-all focus:ring-4 focus:ring-purple-500/10 tracking-widest font-mono"
                      />
                    </div>

                    {error && <ErrorBox msg={error} />}
                    <ActionButton label="Request OTP" icon={<ChevronRight className="w-4 h-4" />} loading={loading} onClick={handleAdminPhone} />
                  </div>
                </motion.div>
              )}

              {/* ── ADMIN OTP ── */}
              {mode === "admin" && step === "otp" && (
                <motion.div key="admin-otp" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }} className="space-y-6">
                  <div>
                    <button onClick={() => { setStep("input"); setAdminOtp(["", "", "", ""]); setError(""); }} className="text-white/40 hover:text-white flex items-center gap-1 text-sm font-medium transition-colors mb-5">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <h2 className="text-2xl font-bold text-white mb-1">Verify Identity</h2>
                    <p className="text-white/40 text-sm">Enter the 4-digit code for administrator access.</p>
                  </div>

                  <div className="flex justify-between gap-3 my-6">
                    {[0, 1, 2, 3].map(i => (
                      <input
                        key={i} id={`otp-${i}`} maxLength={1} value={adminOtp[i]}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => { if (e.key === "Backspace" && !adminOtp[i] && i > 0) (document.getElementById(`otp-${i - 1}`) as HTMLInputElement)?.focus(); }}
                        autoFocus={i === 0}
                        className={`w-16 h-20 text-center text-3xl font-bold rounded-xl outline-none transition-all ${adminOtp[i] ? "bg-purple-500/20 border-2 border-purple-500 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]" : "bg-white/5 border-2 border-white/10 text-white/50 focus:border-purple-500/50"}`}
                      />
                    ))}
                  </div>

                  {error && <ErrorBox msg={error} />}
                  <ActionButton label="Verify & Access" icon={<ChevronRight className="w-4 h-4" />} loading={loading} onClick={handleAdminVerify} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function InputField({ icon, type, value, onChange, placeholder, onEnter }: {
  icon: React.ReactNode; type: string; value: string; onChange: (v: string) => void;
  placeholder: string; onEnter: () => void;
}) {
  return (
    <div className="relative group">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors">{icon}</span>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        onKeyDown={e => e.key === "Enter" && onEnter()}
        className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-white/30 outline-none transition-all focus:ring-4 focus:ring-blue-500/10"
      />
    </div>
  );
}

function PasswordField({ value, onChange, show, onToggle, onEnter }: {
  value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void; onEnter: () => void;
}) {
  return (
    <div className="relative group">
      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-blue-400 transition-colors" />
      <input
        type={show ? "text" : "password"} value={value} onChange={e => onChange(e.target.value)} placeholder="Password (min 4 chars)"
        onKeyDown={e => e.key === "Enter" && onEnter()}
        className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl py-3.5 pl-11 pr-12 text-white placeholder:text-white/30 outline-none transition-all focus:ring-4 focus:ring-blue-500/10"
      />
      <button type="button" onClick={onToggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

function ActionButton({ label, icon, loading, onClick }: { label: string; icon: React.ReactNode; loading: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick} disabled={loading} whileTap={{ scale: 0.98 }}
      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{label} {icon}</>}
    </motion.button>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 p-3 rounded-xl flex items-center gap-2">
      {msg}
    </motion.div>
  );
}

function SuccessBox({ msg }: { msg: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-green-400 text-sm bg-green-400/10 border border-green-400/20 p-3 rounded-xl flex items-center gap-2">
      <Check className="w-4 h-4 flex-shrink-0" /> {msg}
    </motion.div>
  );
}
