"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/src/state/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Map, Mic2, BookOpen, Briefcase,
  ChevronDown, LogOut, Settings, BarChart3, User,
  Clock, Flame, Cpu, Globe, TrendingUp, ShieldAlert,
  Menu, X, MoonStar, SunMedium
} from "lucide-react";
import { useTheme } from "@/src/components/Theme/ThemeProvider";
import ThemeToggle from "@/src/components/Theme/ThemeToggle";

// ── 5-Pillar Navigation ────────────────────────────────────────

const PILLARS = [
  {
    id: "resume-studio",
    label: "Resume Forge",
    icon: FileText,
    href: "/resume",
    description: "Upload, analyze & perfect your resume",
    color: "var(--color-accent)",
  },
  {
    id: "career-intel",
    label: "Career Radar",
    icon: Map,
    href: "/career-path",
    description: "Career paths, skill gaps & market forecasts",
    color: "var(--color-primary)",
  },
  {
    id: "interview-prep",
    label: "Interview Arena",
    icon: Mic2,
    href: "/interview",
    description: "AI-powered mock interviews with scoring",
    color: "var(--color-accent)",
  },
  {
    id: "growth-hub",
    label: "Growth Path",
    icon: BookOpen,
    href: "/learning",
    description: "Learning paths, XP & leaderboards",
    color: "var(--color-primary)",
  },
  {
    id: "jobs",
    label: "Job Matches",
    icon: Briefcase,
    href: "/global-scanner",
    description: "Job matches, applications & tracker",
    color: "var(--color-accent)",
  },
];

// ── News ticker items ───────────────────────────────────────────

const DEFAULT_TICKERS = [
  { icon: "Flame", category: "Market Alert", content: "Tech hiring index grew +14.2% in Q2 2026." },
  { icon: "Cpu", category: "AI Integration", content: "Companies prioritizing engineers with LLM & Agentic workflow experience." },
  { icon: "TrendingUp", category: "Skill Premium", content: "Rust & Go proficiency correlates with +24% salary premium." },
  { icon: "Globe", category: "Remote Work", content: "72% of senior backend roles now offer hybrid/remote flexibility." },
  { icon: "ShieldAlert", category: "DevSecOps Surge", content: "Security-focused hiring cycles compressed to avg 12 days." },
];

const TickerIcons: Record<string, React.ReactNode> = {
  Flame: <Flame size={10} className="shrink-0" style={{ color: "var(--color-accent)" }} />,
  Cpu: <Cpu size={10} className="shrink-0" style={{ color: "var(--color-primary-light)" }} />,
  TrendingUp: <TrendingUp size={10} className="shrink-0" style={{ color: "var(--color-primary-light)" }} />,
  Globe: <Globe size={10} className="shrink-0" style={{ color: "var(--color-accent)" }} />,
  ShieldAlert: <ShieldAlert size={10} className="shrink-0" style={{ color: "var(--color-accent)" }} />,
};

// ── Main Component ─────────────────────────────────────────────

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, profile, logout } = useAppStore();
  const { theme, toggleTheme } = useTheme();

  const [timeString, setTimeString] = useState("");
  const [tickers, setTickers] = useState(DEFAULT_TICKERS);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  // Clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  // Close account dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleLogout = useCallback(() => {
    logout();
    router.push("/login");
  }, [logout, router]);

  const isActivePillar = (href: string) => pathname.startsWith(href);

  const userInitials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "HV";

  return (
    <>
      {/* ── Nav Bar ─────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          background: theme === "dark" ? "rgba(11, 15, 25, 0.85)" : "rgba(246, 242, 235, 0.85)",
          backdropFilter: "blur(20px) saturate(1.5)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {/* Top strip — Live ticker */}
        <div
          className="flex items-center justify-between px-6 h-8 overflow-hidden text-[10px] font-mono tracking-wide"
          style={{ borderBottom: "1px solid var(--border)", background: "rgba(122, 23, 48, 0.02)" }}
        >
          <div className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981] shrink-0" />
            <span className="uppercase tracking-widest font-bold" style={{ color: "var(--color-primary-light)", fontSize: 9 }}>Live Market Feed</span>
          </div>
          {/* Marquee */}
          <div className="flex-1 overflow-hidden mx-6 relative">
            <div
              className="flex gap-0 animate-marquee hover:[animation-play-state:paused] whitespace-nowrap"
              style={{ animationDuration: "60s" }}
            >
              {[...tickers, ...tickers].map((t, i) => (
                <span key={i} className="flex items-center gap-1.5 pr-12 select-none" style={{ color: "var(--text-muted)" }}>
                  {TickerIcons[t.icon]}
                  <strong style={{ color: "var(--text-sub)" }}>{t.category}:</strong>
                  <span>{t.content}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0" style={{ color: "var(--text-muted)" }}>
            <Clock size={10} />
            <span>{timeString}</span>
          </div>
        </div>

        {/* Main nav row */}
        <div className="flex items-center justify-between px-6 h-14">
          {/* Logo */}
          <Link href={role === "guest" ? "/" : "/dashboard"} className="flex items-center gap-2.5 shrink-0 group">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold font-display shrink-0 transition-transform group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, var(--color-accent), var(--color-primary))",
                color: "var(--color-bg-dark)",
              }}
            >
              HV
            </div>
            <span className="text-sm font-bold tracking-tight font-display hidden sm:block" style={{ color: "var(--text)" }}>
              HIREVIX
            </span>
          </Link>

          {/* Desktop 5-Pillar Nav */}
          {role !== "guest" && (
            <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                const active = isActivePillar(pillar.href);
                return (
                  <Link
                    key={pillar.id}
                    href={pillar.href}
                    className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-display transition-all duration-200 group"
                    style={{
                      color: active ? "var(--text)" : "var(--text-muted)",
                      background: active ? "rgba(247, 244, 236, 0.06)" : "transparent",
                    }}
                  >
                    <Icon
                      size={13}
                      style={{ color: active ? pillar.color : "var(--text-muted)", transition: "color 0.2s" }}
                    />
                    <span className="group-hover:text-[var(--text)] transition-colors">{pillar.label}</span>
                    {active && (
                      <motion.div
                        layoutId="pillar-indicator"
                        className="absolute -bottom-[1px] left-2 right-2 h-[2px] rounded-full"
                        style={{ background: pillar.color }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right side actions */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />

            {role === "guest" ? (
              <Link
                href="/login"
                className="px-4 py-1.5 rounded-lg text-xs font-bold font-display transition-all duration-200"
                style={{
                  background: "var(--color-accent)",
                  color: "var(--color-bg-dark)",
                }}
              >
                Sign In
              </Link>
            ) : (
              /* Account Dropdown */
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setAccountOpen((o) => !o)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg transition-all duration-200 group"
                  style={{ background: accountOpen ? "rgba(247, 244, 236, 0.06)" : "transparent" }}
                >
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold font-display shrink-0"
                    style={{
                      background: "linear-gradient(135deg, var(--color-accent), var(--color-primary))",
                      color: "var(--color-bg-dark)",
                    }}
                  >
                    {userInitials}
                  </div>
                  <span className="hidden md:block text-xs font-semibold max-w-[100px] truncate" style={{ color: "var(--text-sub)" }}>
                    {profile?.name?.split(" ")[0] || "Account"}
                  </span>
                  <ChevronDown
                    size={12}
                    className="transition-transform duration-200"
                    style={{
                      color: "var(--text-muted)",
                      transform: accountOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-xl overflow-hidden"
                      style={{
                        background: "rgba(11, 15, 25, 0.95)",
                        border: "1px solid rgba(247, 244, 236, 0.08)",
                        backdropFilter: "blur(24px)",
                        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
                      }}
                    >
                      {/* Profile header */}
                      <div className="px-4 py-3.5" style={{ borderBottom: "1px solid rgba(247, 244, 236, 0.06)" }}>
                        <p className="text-xs font-bold font-display truncate" style={{ color: "var(--text)" }}>
                          {profile?.name || "User"}
                        </p>
                        <p className="text-[10px] mt-0.5 truncate font-mono" style={{ color: "var(--text-muted)" }}>
                          {profile?.email || ""}
                        </p>
                        {role === "admin" && (
                          <span
                            className="inline-block mt-1.5 text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded font-display"
                            style={{ background: "rgba(232, 163, 61, 0.15)", color: "var(--accent)", border: "1px solid rgba(232, 163, 61, 0.2)" }}
                          >
                            Admin
                          </span>
                        )}
                      </div>

                      {/* Menu items */}
                      <div className="py-1.5">
                        {[
                          { href: "/dashboard", icon: BarChart3, label: "Dashboard" },
                          { href: "/analytics", icon: TrendingUp, label: "My Analytics" },
                          { href: "/settings", icon: Settings, label: "Settings" },
                        ].map(({ href, icon: Icon, label }) => (
                          <Link
                            key={href}
                            href={href}
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold transition-colors"
                            style={{ color: "var(--text-muted)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                          >
                            <Icon size={13} />
                            {label}
                          </Link>
                        ))}
                      </div>

                      {/* Logout */}
                      <div style={{ borderTop: "1px solid rgba(247, 244, 236, 0.06)" }} className="py-1.5">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-semibold transition-colors"
                          style={{ color: "var(--coral)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                        >
                          <LogOut size={13} />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile hamburger */}
            {role !== "guest" && (
              <button
                className="lg:hidden p-1.5 rounded-lg transition-colors"
                style={{ color: "var(--text-muted)" }}
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle navigation"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Mobile Full-screen Overlay ─────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-40 flex flex-col pt-24 pb-8 px-6"
            style={{ background: "rgba(11, 15, 25, 0.98)", backdropFilter: "blur(24px)" }}
          >
            <div className="flex flex-col gap-2">
              {PILLARS.map((pillar, i) => {
                const Icon = pillar.icon;
                const active = isActivePillar(pillar.href);
                return (
                  <motion.div
                    key={pillar.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      href={pillar.href}
                      className="flex items-center gap-4 p-4 rounded-xl transition-all"
                      style={{
                        background: active ? "rgba(247, 244, 236, 0.06)" : "rgba(247, 244, 236, 0.02)",
                        border: `1px solid ${active ? "rgba(247, 244, 236, 0.1)" : "rgba(247, 244, 236, 0.04)"}`,
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${pillar.color}18`, border: `1px solid ${pillar.color}30` }}
                      >
                        <Icon size={18} style={{ color: pillar.color }} />
                      </div>
                      <div>
                        <p className="text-sm font-bold font-display" style={{ color: "var(--text)" }}>{pillar.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{pillar.description}</p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-auto pt-6" style={{ borderTop: "1px solid rgba(247, 244, 236, 0.06)" }}>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 text-sm font-semibold"
                style={{ color: "var(--coral)" }}
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
