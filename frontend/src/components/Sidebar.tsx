"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/src/state/useAppStore";
import {
  X, ChevronDown, ChevronRight, User, LogOut, Bell, Lock,
  LayoutDashboard, FileText, MessageSquare, Compass,
  Target, GraduationCap, LineChart, Trophy, TrendingUp,
  Globe, Mail, LogIn, Shield, Brain, Gamepad2,
  Activity, Search, Sparkles, Settings, Zap,
  CheckSquare, Trash2, CheckCircle, Lightbulb, AlertTriangle,
  Command, Menu
} from "lucide-react";

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   NAVIGATION CONFIGURATION
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  requiresResume?: boolean;
}

const COMMAND_CENTER: NavItem = {
  href: "/dashboard",
  icon: <LayoutDashboard size={17} strokeWidth={1.8} />,
  label: "Command Center",
};

const INTELLIGENCE_MODULES: NavItem[] = [
  { href: "/resume", icon: <FileText size={17} strokeWidth={1.8} />, label: "Resume Forge" },
  { href: "/interview", icon: <MessageSquare size={17} strokeWidth={1.8} />, label: "Interview Arena", requiresResume: true },
  { href: "/career-path", icon: <Compass size={17} strokeWidth={1.8} />, label: "Career Radar", requiresResume: true },
  { href: "/skills", icon: <Target size={17} strokeWidth={1.8} />, label: "Skill Analysis", requiresResume: true },
  { href: "/learning", icon: <GraduationCap size={17} strokeWidth={1.8} />, label: "Growth Path", requiresResume: true },
];

const INSIGHTS_MODULES: NavItem[] = [
  { href: "/analytics", icon: <LineChart size={17} strokeWidth={1.8} />, label: "Market Intelligence" },
  { href: "/forecast", icon: <TrendingUp size={17} strokeWidth={1.8} />, label: "AI Forecast" },
  { href: "/global-scanner", icon: <Globe size={17} strokeWidth={1.8} />, label: "Job Matches" },
];

const ARENA_MODULES: NavItem[] = [
  { href: "/gamification", icon: <Gamepad2 size={17} strokeWidth={1.8} />, label: "Skill Arena" },
  { href: "/leaderboard", icon: <Trophy size={17} strokeWidth={1.8} />, label: "Leaderboard" },
];

const UTILITY_MODULES: NavItem[] = [
  { href: "/chatbot", icon: <Sparkles size={17} strokeWidth={1.8} />, label: "AI Mentor" },
  { href: "/skill-dna", icon: <Brain size={17} strokeWidth={1.8} />, label: "Skill DNA" },
  { href: "/contact", icon: <Mail size={17} strokeWidth={1.8} />, label: "Support" },
];

const GAMES_LIST = [
  { id: "typing", label: "Syntax Speed" },
  { id: "quiz", label: "CS Fundamentals" },
  { id: "bughunt", label: "Bug Hunter" },
  { id: "flashcard", label: "Flashcards" },
  { id: "pattern", label: "Pattern Match" },
  { id: "algorace", label: "Algo Race" },
  { id: "sql", label: "SQL Master" },
  { id: "regex", label: "Regex Master" },
  { id: "stack", label: "Stack Builder" },
  { id: "translator", label: "Code Translator" },
];

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   SECTION LABEL
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-5 pt-6 pb-2">
      <span
        className="text-[10px] font-bold uppercase tracking-[0.08em] text-zinc-500"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {children}
      </span>
    </div>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   NAV LINK COMPONENT
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function NavLink({
  item,
  active,
  isLocked,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  isLocked?: boolean;
  onNavigate: () => void;
}) {
  const router = useRouter();
  const { role } = useAppStore();

  const handleClick = (e: React.MouseEvent) => {
    onNavigate();
    if (isLocked) {
      e.preventDefault();
      return;
    }
    if (role === "guest" && item.href !== "/" && item.href !== "/dashboard" && item.href !== "/contact") {
      e.preventDefault();
      const target = item.href.startsWith("/") ? item.href.slice(1) : item.href;
      localStorage.setItem("ciq-redirect-after-login", target);
      router.push("/login");
    }
  };

  return (
    <Link href={item.href} onClick={handleClick} className="no-underline block">
      <div
        className={`
          group relative flex items-center gap-3 px-5 py-[9px] mx-2 rounded-xl
          text-[13px] font-medium tracking-[-0.01em] cursor-pointer
          transition-all duration-200 ease-out
          ${active
            ? "bg-[var(--color-primary)]/[0.08] text-[var(--text)]"
            : isLocked
            ? "opacity-30 cursor-not-allowed text-zinc-600"
            : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.025]"
          }
        `}
        style={{ fontFamily: "var(--font-body)" }}
      >
        {/* Active indicator bar */}
        {active && (
          <motion.div
            layoutId="sidebar-active-indicator"
            className="absolute left-0 top-[6px] bottom-[6px] w-[3px] rounded-full bg-[var(--color-primary)]"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}

        {/* Icon */}
        <span
          className={`flex-shrink-0 transition-colors duration-200 ${
            active
              ? "text-[var(--color-accent)]"
              : "text-zinc-500 group-hover:text-zinc-300"
          }`}
        >
          {item.icon}
        </span>

        {/* Label */}
        <span className="flex-1 truncate">{item.label}</span>

        {/* Badge */}
        {item.badge && (
          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/25 text-[var(--color-accent)] tracking-wider">
            {item.badge}
          </span>
        )}

        {/* Lock icon */}
        {isLocked && (
          <Lock size={12} className="text-zinc-600 flex-shrink-0" />
        )}
      </div>
    </Link>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   NOTIFICATIONS PANEL
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

function NotificationsPanel({
  isOpen,
  onClose,
  panelRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  panelRef: React.Ref<HTMLDivElement>;
}) {
  const { notifications, markNotificationsRead, clearNotifications, addNotification } = useAppStore();

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle size={13} className="text-emerald-400" />;
      case "warning": return <AlertTriangle size={13} className="text-amber-400" />;
      default: return <Lightbulb size={13} className="text-[var(--accent)]" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-full left-3 right-3 mt-2 z-50
            bg-[#111113]/95 border border-white/[0.07] rounded-2xl
            shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
            <span className="text-xs font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
              Notifications
            </span>
            <div className="flex gap-2">
              <button
                onClick={markNotificationsRead}
                title="Mark all read"
                className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-colors"
              >
                <CheckSquare size={12} />
              </button>
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  title="Clear all"
                  className="p-1 rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[260px] overflow-y-auto no-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center py-8 px-4 gap-3 text-center">
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                  <Bell size={16} className="text-zinc-600" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400 font-medium">All caught up</p>
                  <p className="text-[10px] text-zinc-600 mt-0.5">No new notifications</p>
                </div>
                <button
                  onClick={() => {
                    addNotification("7-day learning streak! Keep it up!", "success");
                    addNotification("Your career score improved by 4 points", "info");
                  }}
                  className="mt-1 px-3 py-1.5 text-[10px] font-bold rounded-lg
                    bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/25 text-[var(--color-accent)]
                    hover:bg-[var(--color-primary)]/20 transition-colors"
                >
                  Generate Samples
                </button>
              </div>
            ) : (
              <div className="p-2 flex flex-col gap-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl transition-colors duration-150
                      ${n.read
                        ? "hover:bg-white/[0.015]"
                        : "bg-[var(--color-primary)]/[0.04] hover:bg-[var(--color-primary)]/[0.06]"
                      }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">{getIcon(n.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-zinc-300 leading-relaxed font-medium">{n.message}</p>
                      <p className="text-[10px] text-zinc-600 mt-0.5 font-semibold">{n.time}</p>
                    </div>
                    {!n.read && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 flex-shrink-0 shadow-[0_0_6px_rgba(122,23,48,0.4)]" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MAIN SIDEBAR COMPONENT
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    role, profile, notifications, notificationsRead,
    logout, markNotificationsRead, authReady,
    sidebarOpen, setSidebarOpen,
  } = useAppStore();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const [notifOpen, setNotifOpen] = useState(false);
  const [arenaOpen, setArenaOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on route change
  useEffect(() => {
    setNotifOpen(false);
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  // Click outside to close notifications
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNotifOpen(false);
    };
    if (notifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [notifOpen]);

  // Don't render on login or before auth
  if (!authReady || pathname === "/login") return null;

  const isLocked = (item: NavItem) => {
    if (!item.requiresResume) return false;
    return !profile || !profile.skills || profile.skills.length === 0;
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <aside
      className={`
        fixed top-0 left-0 z-[35] h-screen
        w-[var(--sidebar-width)] flex flex-col
        bg-[#0A0A0C]/[0.92] backdrop-blur-[40px] backdrop-saturate-[1.6]
        border-r border-white/[0.05]
        transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${sidebarOpen ? "translate-x-0" : ""}
      `}
      style={{
        // Mobile: hidden by default via CSS media query in globals.css
      }}
    >
      {/* â”€â”€â”€ Header â”€â”€â”€ */}
      <div className="relative flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
        <Link
          href="/"
          className="no-underline flex items-center gap-3 group"
          onClick={closeSidebar}
        >
          <Image
            src="/logo.png"
            alt="HIREVIX"
            width={30}
            height={30}
            className="rounded-lg shadow-[0_0_12px_rgba(109,0,26,0.25)] transition-transform duration-300 group-hover:scale-105"
            priority
          />
          <div className="flex flex-col">
            <span
              className="text-[15px] font-extrabold tracking-[-0.02em] text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              HIREVIX
            </span>
            <span className="text-[9px] font-semibold tracking-[0.04em] text-zinc-500 uppercase">
              AI Career OS
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              if (!notifOpen) markNotificationsRead();
            }}
            className={`relative w-7 h-7 rounded-lg flex items-center justify-center
              border transition-all duration-200
              ${notifOpen
                ? "text-[var(--color-accent)] border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10"
                : "text-zinc-500 border-white/[0.06] bg-white/[0.02] hover:text-white hover:border-white/[0.1]"
              }`}
          >
            <Bell size={13} />
            {!notificationsRead && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[var(--color-primary)] text-white text-[8px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(122,23,48,0.5)]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Mobile Close */}
          <button
            className="sidebar-close-btn hidden text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-white/[0.05] transition-colors"
            onClick={closeSidebar}
          >
            <X size={16} />
          </button>
        </div>

        {/* Notifications Dropdown */}
        <NotificationsPanel isOpen={notifOpen} onClose={() => setNotifOpen(false)} panelRef={notifRef} />
      </div>

      {/* â”€â”€â”€ Command Center (Hero Link) â”€â”€â”€ */}
      <div className="px-2 pt-3 pb-1">
        <Link href="/dashboard" onClick={closeSidebar} className="no-underline block">
          <div
            className={`
              flex items-center gap-3 px-4 py-2.5 rounded-xl
              text-[13px] font-semibold tracking-[-0.01em]
              transition-all duration-200
              ${isActive("/dashboard")
                ? "bg-gradient-to-r from-[var(--color-primary)]/15 to-[var(--color-primary)]/5 text-white border border-[var(--color-primary)]/20"
                : "text-zinc-300 hover:bg-white/[0.03] hover:text-white border border-transparent"
              }
            `}
            style={{ fontFamily: "var(--font-body)" }}
          >
            <LayoutDashboard
              size={17}
              strokeWidth={1.8}
              className={isActive("/dashboard") ? "text-[var(--color-accent)]" : "text-zinc-500"}
            />
            <span>Command Center</span>
            {isActive("/dashboard") && (
              <Zap size={12} className="ml-auto text-[var(--color-accent)] animate-pulse" />
            )}
          </div>
        </Link>
      </div>

      {/* â”€â”€â”€ Scrollable Navigation â”€â”€â”€ */}
      <nav className="flex-1 overflow-y-auto no-scrollbar pb-4">
        {/* Intelligence Modules */}
        <SectionLabel>Intelligence</SectionLabel>
        {INTELLIGENCE_MODULES.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(item.href)}
            isLocked={isLocked(item)}
            onNavigate={closeSidebar}
          />
        ))}

        {/* Insights & Forecasts */}
        <SectionLabel>Insights</SectionLabel>
        {INSIGHTS_MODULES.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(item.href)}
            onNavigate={closeSidebar}
          />
        ))}

        {/* Skill Arena */}
        <SectionLabel>Arena</SectionLabel>
        {ARENA_MODULES.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(item.href)}
            onNavigate={closeSidebar}
          />
        ))}

        {/* Collapsible Games Sub-Menu */}
        <div className="px-2">
          <button
            onClick={() => setArenaOpen(!arenaOpen)}
            className="w-full flex items-center gap-3 px-3 py-2 mx-0 rounded-xl
              text-[13px] font-medium text-zinc-500 hover:text-zinc-300
              hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Activity size={15} strokeWidth={1.8} className="text-zinc-600" />
            <span className="flex-1 text-left">Practice Games</span>
            <ChevronDown
              size={13}
              className={`text-zinc-600 transition-transform duration-300 ${arenaOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {arenaOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden ml-6"
              >
                <div className="flex flex-col gap-0.5 py-1 border-l border-white/[0.04] ml-2 pl-3">
                  {GAMES_LIST.map((game) => {
                    const gameActive =
                      pathname === "/gamification" &&
                      typeof window !== "undefined" &&
                      window.location.search.includes(`game=${game.id}`);
                    return (
                      <Link
                        key={game.id}
                        href={`/gamification?game=${game.id}`}
                        onClick={closeSidebar}
                        className="no-underline"
                      >
                        <div
                          className={`py-1.5 px-3 text-[12px] rounded-lg transition-colors duration-150
                            ${gameActive
                              ? "text-[var(--color-accent)] font-semibold bg-[var(--color-primary)]/[0.06]"
                              : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
                            }`}
                        >
                          {game.label}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Utility */}
        <SectionLabel>Utility</SectionLabel>
        {UTILITY_MODULES.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(item.href)}
            onNavigate={closeSidebar}
          />
        ))}



        {/* Guest: Login Link */}
        {role === "guest" && (
          <div className="px-2 mt-2">
            <NavLink
              item={{
                href: "/login",
                icon: <LogIn size={17} strokeWidth={1.8} />,
                label: "Sign In",
              }}
              active={isActive("/login")}
              onNavigate={closeSidebar}
            />
          </div>
        )}
      </nav>

      {/* â”€â”€â”€ User Identity Card (Bottom) â”€â”€â”€ */}
      {profile && role !== "guest" && (
        <div className="border-t border-white/[0.04] px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <Link href="/profile" onClick={closeSidebar} className="no-underline flex-shrink-0">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden
                  transition-all duration-200 border
                  ${isActive("/profile")
                    ? "border-[var(--color-primary)]/40 shadow-[0_0_12px_rgba(122,23,48,0.3)]"
                    : "border-white/[0.08] hover:border-white/[0.15]"
                  }
                  bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)]`}
              >
                {profile.resumeAnalysis?.customProfileFields?.photoUrl ? (
                  <img
                    src={profile.resumeAnalysis.customProfileFields.photoUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    className="text-[11px] font-extrabold text-zinc-100"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {profile.name ? profile.name.trim().charAt(0).toUpperCase() : "U"}
                  </span>
                )}
              </div>
            </Link>

            {/* Name & Role */}
            <div className="flex-1 min-w-0">
              <p
                className="text-[12px] font-semibold text-zinc-200 truncate"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {profile.name || "User"}
              </p>
              <p className="text-[10px] text-zinc-600 font-medium">
                {profile.level || "Explorer"} Â· {profile.xp?.toLocaleString() || 0} XP
              </p>
            </div>

            {/* Settings & Logout */}
            <div className="flex items-center gap-1">
              <Link href="/profile" onClick={closeSidebar} className="no-underline">
                <button className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.04] transition-colors">
                  <Settings size={14} />
                </button>
              </Link>
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/[0.06] transition-colors"
                title="Sign Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

