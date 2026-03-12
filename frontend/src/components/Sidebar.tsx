"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/src/state/useAppStore";

// ─── SVG Icon Components ──────────────────────────────────────
const icons: Record<string, React.ReactNode> = {
    home: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    dashboard: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    resume: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    interview: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 012-2h6a2 2 0 012 2v1.662"/></svg>,
    careerPath: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    skills: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    learning: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
    analytics: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    gamification: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    chatbot: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    skillDna: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>,
    forecast: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    globalJobs: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
    contact: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    login: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>,
    logout: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    admin: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.94a10 10 0 010 14.12m-14.14 0a10 10 0 010-14.12"/></svg>,
    bell: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
};

const coreModules = [
    { href: "/", iconKey: "home", label: "Home" },
    { href: "/dashboard", iconKey: "dashboard", label: "Dashboard" },
    { href: "/resume", iconKey: "resume", label: "Resume AI" },
    { href: "/interview", iconKey: "interview", label: "Interview Sim" },
    { href: "/career-path", iconKey: "careerPath", label: "Career Path" },
    { href: "/skills", iconKey: "skills", label: "Skill Gap" },
    { href: "/learning", iconKey: "learning", label: "Learning Path" },
];
const insights = [
    { href: "/analytics", iconKey: "analytics", label: "Analytics" },
    { href: "/gamification", iconKey: "gamification", label: "Gamification" },
    { href: "/chatbot", iconKey: "chatbot", label: "AI Chatbot" },
];
const advanced = [
    { href: "/skill-dna", iconKey: "skillDna", label: "Skill DNA" },
    { href: "/forecast", iconKey: "forecast", label: "AI Forecast" },
    { href: "/global-scanner", iconKey: "globalJobs", label: "Global Jobs" },
];

function NavLink({ href, iconKey, label, active }: { href: string; iconKey: string; label: string; active: boolean }) {
    return (
        <Link href={href} className={`sidebar-link ${active ? "active" : ""}`}>
            <span className="icon" style={{ display: "flex", alignItems: "center" }}>{icons[iconKey]}</span>
            {label}
        </Link>
    );
}

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { role, profile, notifications, notificationsRead, logout, markNotificationsRead } = useAppStore();
    const unread = notifications.filter(n => !n.read).length;

    const initials = profile?.name
        ? profile.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
        : "?";

    if (pathname === "/login") return null;

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <Link href="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 8 }}>
                    <img src="/logo.png" alt="CareerIQ" style={{ width: 32, height: 32, borderRadius: 8 }} />
                    <span style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
                        Career<span className="iq">IQ</span>
                    </span>
                    <span className="badge">v3</span>
                </Link>
                {/* Notification bell */}
                <Link href="/notifications" style={{ marginLeft: "auto", position: "relative", textDecoration: "none", color: "var(--text-muted)", display: "flex", alignItems: "center" }} onClick={() => markNotificationsRead()}>
                    {icons.bell}
                    {!notificationsRead && unread > 0 && (
                        <span style={{ position: "absolute", top: -4, right: -4, background: "#ef4444", color: "white", borderRadius: "50%", width: 16, height: 16, fontSize: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{unread}</span>
                    )}
                </Link>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, paddingTop: 8, overflowY: "auto" }}>
                <div className="sidebar-section-label">Core Modules</div>
                {coreModules.map(l => <NavLink key={l.href} {...l} active={pathname === l.href} />)}

                <div className="sidebar-section-label">Insights</div>
                {insights.map(l => <NavLink key={l.href} {...l} active={pathname === l.href} />)}

                <div className="sidebar-section-label">Advanced AI</div>
                {advanced.map(l => <NavLink key={l.href} {...l} active={pathname === l.href} />)}

                {/* Admin — only visible to admin */}
                {role === "admin" && (
                    <>
                        <div className="sidebar-section-label">Admin</div>
                        <NavLink href="/admin" iconKey="admin" label="Admin Panel" active={pathname === "/admin"} />
                    </>
                )}

                {/* Support */}
                <div className="sidebar-section-label">Support</div>
                <NavLink href="/contact" iconKey="contact" label="Contact Us" active={pathname === "/contact"} />
                {role === "guest" ? (
                    <NavLink href="/login" iconKey="login" label="Login" active={pathname === "/login"} />
                ) : (
                    <button onClick={() => { logout(); router.push("/login"); }} className="sidebar-link" style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer", color: "#f87171" }}>
                        <span className="icon" style={{ display: "flex", alignItems: "center" }}>{icons.logout}</span>Logout
                    </button>
                )}
            </nav>

            {/* Profile (bottom) */}
            {profile && role !== "guest" ? (
                <Link href="/profile" style={{ textDecoration: "none" }}>
                    <div className="sidebar-user" style={{ cursor: "pointer" }}>
                        <div className="sidebar-avatar" style={{ fontSize: "0.85rem", background: "linear-gradient(135deg,#663399,#9b59b6)", fontWeight: 800 }}>{initials}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="sidebar-user-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.name}</div>
                            <div className="sidebar-user-role">{profile.level} · {profile.xp} XP</div>
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "rgba(163,119,157,0.6)" }}>→</div>
                    </div>
                </Link>

            ) : (
                <div className="sidebar-user">
                    <div className="sidebar-avatar" style={{ background: "rgba(255,255,255,0.1)", fontSize: "0.85rem", fontWeight: 800 }}>?</div>
                    <div>
                        <div className="sidebar-user-name">Guest</div>
                        <div className="sidebar-user-role"><Link href="/login" style={{ color: "#a78bfa" }}>Sign In</Link></div>
                    </div>
                </div>
            )}
        </aside>
    );
}
