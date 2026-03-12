"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/src/state/useAppStore";

const ADMIN_PHONE = "9360097924";
const ADMIN_OTP = "2319";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ─── Background data ──────────────────────────────────────────────
const ORBS = [
    { x: 15, y: 10, size: 600, color: "rgba(102,51,153,0.16)", dur: 9 },
    { x: 80, y: 70, size: 440, color: "rgba(124,58,237,0.10)", dur: 12 },
    { x: 5,  y: 60, size: 320, color: "rgba(155,89,182,0.09)", dur: 15 },
    { x: 92, y: 18, size: 260, color: "rgba(102,51,153,0.07)", dur: 10 },
    { x: 50, y: 92, size: 220, color: "rgba(167,139,250,0.06)", dur: 14 },
    { x: 68, y: 40, size: 180, color: "rgba(139,92,246,0.08)", dur: 11 },
];

const PARTICLES = [
    { x: 15, y: 20, s: 3, d: 8,  delay: 0   }, { x: 80, y: 10, s: 2, d: 11, delay: 1   },
    { x: 60, y: 75, s: 4, d: 9,  delay: 2   }, { x: 25, y: 60, s: 2, d: 13, delay: 0.5 },
    { x: 90, y: 45, s: 3, d: 7,  delay: 3   }, { x: 45, y: 88, s: 2, d: 10, delay: 1.5 },
    { x: 5,  y: 35, s: 2, d: 12, delay: 0.8 }, { x: 70, y: 30, s: 3, d: 8,  delay: 2.5 },
    { x: 35, y: 5,  s: 2, d: 15, delay: 1.2 }, { x: 95, y: 70, s: 2, d: 9,  delay: 3.5 },
    { x: 18, y: 80, s: 3, d: 10, delay: 0.3 }, { x: 62, y: 48, s: 2, d: 11, delay: 2.1 },
    { x: 42, y: 92, s: 3, d: 7,  delay: 1.7 }, { x: 83, y: 58, s: 2, d: 13, delay: 0.9 },
    { x: 28, y: 42, s: 2, d: 9,  delay: 4   }, { x: 72, y: 15, s: 3, d: 12, delay: 2.8 },
    { x: 55, y: 22, s: 2, d: 8,  delay: 1.4 }, { x: 12, y: 55, s: 2, d: 14, delay: 3.2 },
    { x: 92, y: 85, s: 3, d: 10, delay: 0.6 }, { x: 38, y: 68, s: 2, d: 11, delay: 2.3 },
    { x: 22, y: 33, s: 2, d: 9,  delay: 1.8 }, { x: 77, y: 52, s: 3, d: 13, delay: 0.4 },
    { x: 48, y: 17, s: 2, d: 8,  delay: 3.7 }, { x: 65, y: 82, s: 2, d: 10, delay: 1.1 },
];

// Neural network connecting lines
const NEURAL_LINKS = [
    { x1: 15, y1: 20, x2: 35, y2: 5,  opacity: 0.06 },
    { x1: 35, y1: 5,  x2: 55, y2: 22, opacity: 0.05 },
    { x1: 80, y1: 10, x2: 62, y2: 48, opacity: 0.04 },
    { x1: 62, y1: 48, x2: 83, y2: 58, opacity: 0.05 },
    { x1: 25, y1: 60, x2: 42, y2: 92, opacity: 0.04 },
    { x1: 90, y1: 45, x2: 95, y2: 70, opacity: 0.05 },
    { x1: 72, y1: 15, x2: 80, y2: 10, opacity: 0.04 },
    { x1: 18, y1: 80, x2: 28, y2: 42, opacity: 0.03 },
    { x1: 5,  y1: 35, x2: 15, y2: 20, opacity: 0.04 },
    { x1: 48, y1: 17, x2: 55, y2: 22, opacity: 0.05 },
    { x1: 60, y1: 75, x2: 38, y2: 68, opacity: 0.04 },
    { x1: 77, y1: 52, x2: 65, y2: 82, opacity: 0.05 },
];

const SHOOTING_STARS = [
    { startX: 85, startY: 5,  angle: 45, delay: 0,   dur: 3.5 },
    { startX: 95, startY: 15, angle: 40, delay: 1.2, dur: 4   },
    { startX: 75, startY: 2,  angle: 50, delay: 2.8, dur: 3   },
    { startX: 90, startY: 25, angle: 42, delay: 0.7, dur: 5   },
    { startX: 70, startY: 8,  angle: 48, delay: 3.5, dur: 3.5 },
    { startX: 98, startY: 35, angle: 44, delay: 1.9, dur: 4.2 },
    { startX: 82, startY: 18, angle: 46, delay: 4.5, dur: 3.8 },
    { startX: 65, startY: 3,  angle: 52, delay: 2.1, dur: 4.5 },
];

const CODE_SNIPPETS = [
    { text: "const ai = new CareerIQ();",  x: 2,  y: 15, dur: 16 },
    { text: "resume.analyze()",            x: 75, y: 8,  dur: 20 },
    { text: "skills.match(jobs)",          x: 3,  y: 70, dur: 18 },
    { text: "await interview.start()",     x: 68, y: 82, dur: 22 },
    { text: "XP += 150;",                  x: 85, y: 42, dur: 14 },
    { text: "model.predict(career)",       x: 1,  y: 42, dur: 19 },
    { text: "ats_score: 94%",              x: 55, y: 3,  dur: 17 },
    { text: "jobs.filter(remote)",         x: 40, y: 93, dur: 21 },
    { text: "career.optimize()",           x: 88, y: 62, dur: 16 },
    { text: "skills.upskill('react')",     x: 10, y: 90, dur: 20 },
];

const HEX_CHARS = ["01", "FF", "A3", "7F", "C2", "4E", "92", "B1", "0x2A", "NaN", "404", "200"];

const TIPS = [
    "💡 Upload your resume to unlock AI-powered insights",
    "🎯 Practice mock interviews daily to boost your score",
    "🏆 Earn XP by completing games and learning paths",
    "🌍 Explore 15+ countries' job markets in Global Scanner",
    "🤖 HelixAI chatbot gives real, personalized career advice",
    "📊 Your resume score updates every time you re-upload",
    "⚡ Complete all 10 games to reach Specialist level",
    "🔐 OTP verification keeps your account secure",
];

const STATS = [
    { label: "Active Users", value: "12K+" },
    { label: "Resumes Scored", value: "85K+" },
    { label: "Countries", value: "15+" },
    { label: "Avg ATS Score", value: "78%" },
];

function nameFromEmail(email: string): string {
    const local = email.split("@")[0];
    return local.replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function hashPwd(pwd: string): string { return btoa(pwd + "_ciq_salt"); }
function saveEmailUser(email: string, pwd: string, name: string) {
    if (typeof window === "undefined") return;
    const db: Record<string, { name: string; pwd: string }> = JSON.parse(localStorage.getItem("ciq-email-db") || "{}");
    db[email.toLowerCase()] = { name, pwd: hashPwd(pwd) };
    localStorage.setItem("ciq-email-db", JSON.stringify(db));
}
function verifyEmailUser(email: string, pwd: string): { ok: boolean; name: string } {
    if (typeof window === "undefined") return { ok: false, name: "" };
    const db: Record<string, { name: string; pwd: string }> = JSON.parse(localStorage.getItem("ciq-email-db") || "{}");
    const entry = db[email.toLowerCase()];
    if (!entry) return { ok: false, name: "" };
    return { ok: entry.pwd === hashPwd(pwd), name: entry.name };
}

type Mode = "email" | "admin";

export default function LoginPage() {
    const [mode, setMode] = useState<Mode>("email");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [adminPhone, setAdminPhone] = useState("");
    const [adminOtp, setAdminOtp] = useState(["", "", "", ""]);
    const [step, setStep] = useState<"input" | "otp">("input");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [tipIdx, setTipIdx] = useState(0);
    const [tipVisible, setTipVisible] = useState(true);
    const expectedRef = useRef(ADMIN_OTP);
    const router = useRouter();
    const { loginUser, loginAdmin } = useAppStore();

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTipVisible(false);
            setTimeout(() => { setTipIdx(i => (i + 1) % TIPS.length); setTipVisible(true); }, 400);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    // Read stored redirect target and clear it
    const getPostLoginRedirect = (): string => {
        if (typeof window === "undefined") return "/dashboard";
        const redirect = localStorage.getItem("ciq-redirect-after-login");
        if (redirect) { localStorage.removeItem("ciq-redirect-after-login"); return `/${redirect}`; }
        return "/dashboard";
    };

    const handleEmailLogin = async () => {
        if (!email.includes("@")) { setError("Enter a valid email address"); return; }
        if (password.length < 4) { setError("Password must be at least 4 characters"); return; }
        setError(""); setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier: email, password }),
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem("ciq-jwt", data.access_token);
                const meRes = await fetch(`${API_BASE}/auth/me`, {
                    headers: { Authorization: `Bearer ${data.access_token}` },
                });
                let displayName = nameFromEmail(email);
                if (meRes.ok) { const me = await meRes.json(); displayName = me.name || displayName; }
                loginUser("", displayName, email);
                router.push(getPostLoginRedirect());
                return;
            }

            if (res.status === 401) {
                const regRes = await fetch(`${API_BASE}/auth/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: nameFromEmail(email), email, password }),
                });
                if (regRes.ok) {
                    const loginRes = await fetch(`${API_BASE}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ identifier: email, password }),
                    });
                    if (loginRes.ok) {
                        const data = await loginRes.json();
                        localStorage.setItem("ciq-jwt", data.access_token);
                        loginUser("", nameFromEmail(email), email);
                        router.push(getPostLoginRedirect());
                        return;
                    }
                }
            }
        } catch { /* Backend offline – fallback */ }

        // Fallback: localStorage auth
        setTimeout(() => {
            setLoading(false);
            const { ok, name } = verifyEmailUser(email, password);
            const displayName = nameFromEmail(email);
            if (ok) { loginUser("", name || displayName, email); router.push(getPostLoginRedirect()); }
            else { saveEmailUser(email, password, displayName); loginUser("", displayName, email); router.push(getPostLoginRedirect()); }
        }, 900);
    };

    const handleAdminPhoneContinue = () => {
        if (adminPhone !== ADMIN_PHONE) { setError("Not a valid admin phone number"); return; }
        setError(""); setLoading(true);
        setAdminOtp(["", "", "", ""]);
        setTimeout(() => { setLoading(false); setStep("otp"); }, 700);
    };

    const handleAdminOtpChange = (i: number, v: string) => {
        const digit = v.replace(/\D/g, "").slice(-1);
        const nd = [...adminOtp]; nd[i] = digit; setAdminOtp(nd);
        if (digit && i < 3) { const next = document.getElementById(`adm-otp-${i + 1}`); if (next) (next as HTMLInputElement).focus(); }
    };

    const handleAdminVerify = () => {
        const entered = adminOtp.join("");
        if (entered.length < 4) { setError("Enter all 4 digits"); return; }
        setError(""); setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (entered === expectedRef.current) { loginAdmin(); router.push("/admin"); }
            else { setError("Wrong OTP. Admin OTP is fixed."); }
        }, 700);
    };

    const inputStyle: React.CSSProperties = {
        width: "100%", background: "rgba(20,10,40,0.55)", border: "1px solid rgba(155,89,182,0.22)",
        borderRadius: 10, padding: "13px 16px", color: "#f0e8ff", fontSize: "0.92rem", outline: "none",
        transition: "border-color 0.2s, box-shadow 0.2s", backdropFilter: "blur(8px)",
    };
    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = "rgba(155,89,182,0.7)";
        e.target.style.boxShadow = "0 0 0 3px rgba(102,51,153,0.18), 0 0 20px rgba(102,51,153,0.25)";
    };
    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = "rgba(155,89,182,0.22)";
        e.target.style.boxShadow = "none";
    };

    return (
        <div style={{
            minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
            background: "radial-gradient(ellipse at 15% 45%, #200840 0%, #130626 35%, #0c0418 65%, #060210 100%)",
            padding: 24, position: "relative", overflow: "hidden",
        }}>
            {/* Deep space secondary glow */}
            <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at 85% 20%, rgba(102,51,153,0.09) 0%, transparent 55%)", pointerEvents: "none" }} />

            {/* Animated conic gradient mesh */}
            <div style={{
                position: "fixed", inset: 0, pointerEvents: "none",
                background: "conic-gradient(from 180deg at 50% 70%, rgba(102,51,153,0.05) 0deg, transparent 60deg, rgba(155,89,182,0.03) 120deg, transparent 180deg, rgba(102,51,153,0.05) 240deg, transparent 300deg, rgba(155,89,182,0.03) 360deg)",
                animation: "meshSpin 30s linear infinite",
            }} />

            {/* Subtle scanlines — professional tech feel */}
            <div style={{
                position: "fixed", inset: 0, pointerEvents: "none",
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(102,51,153,0.010) 3px, rgba(102,51,153,0.010) 4px)",
            }} />

            {/* Fine grid */}
            <div style={{
                position: "fixed", inset: 0,
                backgroundImage: "linear-gradient(rgba(163,119,157,0.032) 1px,transparent 1px),linear-gradient(90deg,rgba(163,119,157,0.032) 1px,transparent 1px)",
                backgroundSize: "52px 52px", pointerEvents: "none",
            }} />

            {/* Glowing orbs */}
            {ORBS.map((o, i) => (
                <div key={i} style={{
                    position: "fixed", borderRadius: "50%", width: o.size, height: o.size,
                    left: `${o.x}%`, top: `${o.y}%`, transform: "translate(-50%,-50%)",
                    background: `radial-gradient(circle,${o.color} 0%,transparent 70%)`,
                    animation: `orbFloat ${o.dur}s ease-in-out infinite`,
                    animationDelay: `${i * 1.4}s`, pointerEvents: "none",
                }} />
            ))}

            {/* Neural network SVG lines */}
            <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                {NEURAL_LINKS.map((l, i) => (
                    <line key={i}
                        x1={`${l.x1}%`} y1={`${l.y1}%`} x2={`${l.x2}%`} y2={`${l.y2}%`}
                        stroke="rgba(155,89,182,1)" strokeWidth="0.5" opacity={l.opacity}
                        style={{ animation: `fadeInOut ${7 + i * 1.5}s ease-in-out infinite`, animationDelay: `${i * 0.7}s` }}
                    />
                ))}
            </svg>

            {/* Floating particles */}
            {PARTICLES.map((p, i) => (
                <div key={i} style={{
                    position: "fixed", borderRadius: "50%", width: p.s, height: p.s,
                    left: `${p.x}%`, top: `${p.y}%`,
                    background: i % 3 === 0 ? "rgba(167,139,250,0.65)" : "rgba(163,119,157,0.50)",
                    boxShadow: `0 0 ${p.s * 4}px ${i % 3 === 0 ? "rgba(167,139,250,0.4)" : "rgba(163,119,157,0.35)"}`,
                    animation: `particleFloat ${p.d}s ease-in-out infinite`,
                    animationDelay: `${p.delay}s`, pointerEvents: "none",
                }} />
            ))}

            {/* Shooting stars */}
            {SHOOTING_STARS.map((s, i) => (
                <div key={i} style={{
                    position: "fixed", left: `${s.startX}%`, top: `${s.startY}%`,
                    width: 140, height: 2,
                    background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(200,160,255,0.95) 50%, rgba(255,255,255,0) 100%)",
                    borderRadius: 99, transform: `rotate(${s.angle}deg)`,
                    animation: `shootingStar ${s.dur}s ease-in-out ${s.delay}s infinite`,
                    pointerEvents: "none", boxShadow: "0 0 8px rgba(180,130,255,0.7)",
                }} />
            ))}

            {/* Floating code snippets */}
            {CODE_SNIPPETS.map((c, i) => (
                <div key={i} style={{
                    position: "fixed", left: `${c.x}%`, top: `${c.y}%`,
                    fontFamily: "monospace", fontSize: "0.60rem", color: "rgba(163,119,157,0.17)",
                    animation: `codeFloat ${c.dur}s ease-in-out infinite`,
                    animationDelay: `${i * 1.6}s`, pointerEvents: "none", whiteSpace: "nowrap", userSelect: "none",
                }}>{c.text}</div>
            ))}

            {/* Hex rain */}
            {HEX_CHARS.map((h, i) => (
                <div key={i} style={{
                    position: "fixed",
                    left: i % 2 === 0 ? `${(i % 6) * 1.2}%` : `${95 - (i % 5) * 1.5}%`,
                    top: `${(i * 8) % 90}%`,
                    fontFamily: "monospace", fontSize: "0.52rem", color: "rgba(102,51,153,0.16)",
                    animation: `hexFall ${8 + i * 0.7}s linear infinite`,
                    animationDelay: `${i * 0.6}s`, pointerEvents: "none", userSelect: "none",
                }}>{h}</div>
            ))}

            {/* ── Main Card ── */}
            <div style={{
                width: "100%", maxWidth: 460, position: "relative", zIndex: 10,
                animation: mounted ? "cardSlideIn 0.65s cubic-bezier(0.34,1.56,0.64,1) both" : "none",
            }}>
                {/* Logo / Brand */}
                <div style={{ textAlign: "center", marginBottom: 36 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: 16,
                            background: "linear-gradient(135deg,rgba(102,51,153,0.55),rgba(155,89,182,0.85))",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 10px 40px rgba(102,51,153,0.60), 0 0 0 1px rgba(155,89,182,0.3)",
                        }}>
                            <img src="/logo.png" alt="CareerIQ" style={{ width: 56, height: 56, borderRadius: 16 }} />
                        </div>
                        <h1 style={{
                            fontSize: "2.4rem", fontWeight: 800, margin: 0, letterSpacing: "-0.02em",
                            background: "linear-gradient(135deg,#f5eeff 10%,#d4b8ff 60%,#9b59b6 100%)",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                        }}>Career<span style={{ WebkitTextFillColor: "#9b59b6" }}>IQ</span></h1>
                    </div>
                    <div style={{ overflow: "hidden", height: "1.15em" }}>
                        <p style={{
                            color: "rgba(163,119,157,0.58)", fontSize: "0.72rem",
                            letterSpacing: "0.12em", margin: 0, textTransform: "uppercase",
                            animation: "typeIn 1.8s steps(28,end) forwards",
                            width: 0, whiteSpace: "nowrap", overflow: "hidden", display: "inline-block",
                        }}>AI Career Growth Engine · v3.0</p>
                    </div>
                </div>

                {/* Glass login card */}
                <div style={{
                    borderRadius: 24, padding: "38px 36px",
                    background: "rgba(18,8,36,0.82)",
                    backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
                    boxShadow: [
                        "0 40px 90px rgba(6,2,16,0.78)",
                        "0 0 0 1px rgba(155,89,182,0.36)",
                        "inset 0 1px 0 rgba(255,255,255,0.06)",
                        "inset 0 -1px 0 rgba(102,51,153,0.12)",
                        "0 0 55px rgba(102,51,153,0.20)",
                        "0 0 110px rgba(155,89,182,0.07)",
                    ].join(", "),
                    animation: "neonPulse 4s ease-in-out infinite",
                }}>
                    {/* Mode toggle */}
                    {step === "input" && (
                        <div style={{ display: "flex", gap: 5, marginBottom: 26, background: "rgba(102,51,153,0.10)", borderRadius: 12, padding: 5, border: "1px solid rgba(102,51,153,0.12)" }}>
                            {([["email", "📧 Sign In"], ["admin", "🔐 Admin"]] as [Mode, string][]).map(([m, label]) => (
                                <button key={m} onClick={() => { setMode(m as Mode); setError(""); }} style={{
                                    flex: 1, padding: "9px 0", borderRadius: 9, border: "none", cursor: "pointer",
                                    fontSize: "0.82rem", fontWeight: 700,
                                    background: mode === m ? "linear-gradient(135deg,#663399,#9b59b6)" : "transparent",
                                    color: mode === m ? "white" : "rgba(163,119,157,0.70)",
                                    transition: "all 0.22s",
                                    boxShadow: mode === m ? "0 4px 18px rgba(102,51,153,0.45)" : "none",
                                }}>{label}</button>
                            ))}
                        </div>
                    )}

                    <h2 style={{ fontSize: "1.18rem", fontWeight: 700, marginBottom: 6, color: "#f0e8ff", letterSpacing: "-0.01em" }}>
                        {mode === "email" ? "Welcome back" : step === "input" ? "🔐 Admin Access" : "📱 Admin OTP"}
                    </h2>
                    <p style={{ color: "rgba(163,119,157,0.58)", fontSize: "0.78rem", marginBottom: 26 }}>
                        {mode === "email"
                            ? "Sign in to your CareerIQ account. New users are auto-registered."
                            : step === "input" ? "Enter admin phone number to receive OTP"
                            : "Enter the 4-digit admin OTP"}
                    </p>

                    {/* EMAIL LOGIN */}
                    {mode === "email" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <div style={{ position: "relative" }}>
                                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: "0.9rem", opacity: 0.45, pointerEvents: "none" }}>📧</span>
                                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" type="email"
                                    onKeyDown={e => e.key === "Enter" && handleEmailLogin()}
                                    style={{ ...inputStyle, paddingLeft: 38 }} onFocus={onFocus} onBlur={onBlur} />
                            </div>
                            <div style={{ position: "relative" }}>
                                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: "0.9rem", opacity: 0.45, pointerEvents: "none" }}>🔒</span>
                                <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (min 4 chars)" type="password"
                                    onKeyDown={e => e.key === "Enter" && handleEmailLogin()}
                                    style={{ ...inputStyle, paddingLeft: 38 }} onFocus={onFocus} onBlur={onBlur} />
                            </div>
                            {email && email.includes("@") && (
                                <div style={{ fontSize: "0.7rem", color: "rgba(86,227,160,0.75)", marginTop: -6, display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#56e3a0", display: "inline-block", boxShadow: "0 0 6px rgba(86,227,160,0.6)" }} />
                                    Username: <strong>{nameFromEmail(email)}</strong> · New users are auto-registered
                                </div>
                            )}
                            {error && (
                                <div style={{ color: "#f87171", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: 6, background: "rgba(248,113,113,0.07)", borderRadius: 8, padding: "8px 12px", border: "1px solid rgba(248,113,113,0.15)" }}>
                                    ⚠ {error}
                                </div>
                            )}
                            <button onClick={handleEmailLogin} disabled={loading} style={{
                                width: "100%", padding: "14px 0", fontWeight: 700, borderRadius: 12, border: "none",
                                cursor: loading ? "not-allowed" : "pointer",
                                background: "linear-gradient(135deg,#5a2d91,#9b59b6,#b57bee)",
                                color: "white", opacity: loading ? 0.75 : 1, fontSize: "0.95rem",
                                boxShadow: "0 8px 28px rgba(102,51,153,0.50)", letterSpacing: "0.01em",
                                transition: "transform 0.15s, box-shadow 0.15s, opacity 0.15s",
                            }}
                                onMouseEnter={e => { if (!loading) { (e.currentTarget).style.transform = "translateY(-2px)"; (e.currentTarget).style.boxShadow = "0 12px 36px rgba(102,51,153,0.65)"; } }}
                                onMouseLeave={e => { (e.currentTarget).style.transform = ""; (e.currentTarget).style.boxShadow = "0 8px 28px rgba(102,51,153,0.50)"; }}
                            >
                                {loading ? "⏳ Signing in..." : "Sign In / Register →"}
                            </button>
                        </div>
                    )}

                    {/* ADMIN PHONE */}
                    {mode === "admin" && step === "input" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <div style={{ display: "flex", gap: 8 }}>
                                <div style={{ background: "rgba(102,51,153,0.18)", border: "1px solid rgba(163,119,157,0.22)", borderRadius: 10, padding: "13px 14px", color: "#E6C7E6", fontSize: "0.85rem", fontWeight: 600, flexShrink: 0, backdropFilter: "blur(8px)" }}>🇮🇳 +91</div>
                                <input value={adminPhone} onChange={e => setAdminPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                    placeholder="Admin phone number" maxLength={10}
                                    onKeyDown={e => e.key === "Enter" && handleAdminPhoneContinue()}
                                    style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                            </div>
                            {error && <div style={{ color: "#f87171", fontSize: "0.78rem" }}>⚠ {error}</div>}
                            <button onClick={handleAdminPhoneContinue} disabled={loading} style={{
                                width: "100%", padding: "14px 0", fontWeight: 700, borderRadius: 12, border: "none",
                                cursor: loading ? "not-allowed" : "pointer", background: "linear-gradient(135deg,#5a2d91,#9b59b6)",
                                color: "white", opacity: loading ? 0.75 : 1, fontSize: "0.95rem",
                                boxShadow: "0 8px 28px rgba(102,51,153,0.50)",
                            }}>
                                {loading ? "⏳ Verifying..." : "Get Admin OTP →"}
                            </button>
                        </div>
                    )}

                    {/* ADMIN OTP */}
                    {mode === "admin" && step === "otp" && (
                        <div>
                            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
                                {[0, 1, 2, 3].map(i => (
                                    <input key={i} id={`adm-otp-${i}`} maxLength={1} value={adminOtp[i]}
                                        onChange={e => handleAdminOtpChange(i, e.target.value)}
                                        onKeyDown={e => { if (e.key === "Backspace" && !adminOtp[i] && i > 0) { const prev = document.getElementById(`adm-otp-${i - 1}`); if (prev) (prev as HTMLInputElement).focus(); } }}
                                        autoFocus={i === 0}
                                        style={{
                                            width: 62, height: 68, textAlign: "center", fontSize: "1.7rem", fontWeight: 800,
                                            background: adminOtp[i] ? "rgba(102,51,153,0.25)" : "rgba(10,4,22,0.6)",
                                            border: `2px solid ${adminOtp[i] ? "#9b59b6" : "rgba(163,119,157,0.18)"}`,
                                            borderRadius: 14, color: "#f0e8ff", outline: "none", transition: "all 0.2s",
                                            boxShadow: adminOtp[i] ? "0 0 16px rgba(102,51,153,0.35)" : "none",
                                            backdropFilter: "blur(8px)",
                                        }}
                                    />
                                ))}
                            </div>
                            {error && <div style={{ color: "#f87171", fontSize: "0.78rem", textAlign: "center", marginBottom: 12 }}>⚠ {error}</div>}
                            <button onClick={handleAdminVerify} disabled={loading} style={{
                                width: "100%", padding: "14px 0", fontWeight: 700, borderRadius: 12, border: "none",
                                cursor: loading ? "not-allowed" : "pointer", background: "linear-gradient(135deg,#5a2d91,#9b59b6)",
                                color: "white", opacity: loading ? 0.75 : 1, fontSize: "0.95rem",
                                boxShadow: "0 8px 28px rgba(102,51,153,0.50)",
                            }}>
                                {loading ? "⏳ Verifying..." : "Verify & Enter Admin →"}
                            </button>
                            <button onClick={() => { setStep("input"); setAdminOtp(["", "", "", ""]); setError(""); }}
                                style={{ width: "100%", padding: "10px 0", marginTop: 8, background: "none", border: "none", color: "rgba(163,119,157,0.55)", fontSize: "0.8rem", cursor: "pointer" }}>
                                ← Back
                            </button>
                        </div>
                    )}
                </div>

                {/* Terminal tip banner */}
                <div style={{
                    marginTop: 14, padding: "10px 18px",
                    background: "rgba(8,4,18,0.72)", backdropFilter: "blur(10px)",
                    border: "1px solid rgba(102,51,153,0.18)", borderRadius: 12,
                    fontFamily: "monospace", fontSize: "0.72rem", color: "rgba(163,119,157,0.85)",
                    display: "flex", alignItems: "center", gap: 10,
                    transition: "opacity 0.4s ease", opacity: tipVisible ? 1 : 0,
                }}>
                    <span style={{ color: "rgba(155,89,182,0.8)", fontWeight: 700 }}>$&gt;</span>
                    <span style={{ flex: 1 }}>{TIPS[tipIdx]}</span>
                    <span style={{ animation: "cursorBlink 1s step-end infinite", color: "#9b59b6" }}>▌</span>
                </div>

                {/* Stats tiles */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 12 }}>
                    {STATS.map((s, i) => (
                        <div key={i} style={{
                            textAlign: "center", padding: "10px 6px",
                            background: "rgba(8,4,18,0.55)", backdropFilter: "blur(8px)",
                            border: "1px solid rgba(102,51,153,0.14)", borderRadius: 10,
                            animation: `badgeFadeIn 0.4s ${0.4 + i * 0.1}s both`,
                        }}>
                            <div style={{ fontSize: "0.92rem", fontWeight: 800, color: "#c4b5fd" }}>{s.value}</div>
                            <div style={{ fontSize: "0.58rem", color: "rgba(163,119,157,0.52)", marginTop: 2 }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Feature pills */}
                <div style={{ display: "flex", gap: 7, marginTop: 12, justifyContent: "center", flexWrap: "wrap" }}>
                    {["🧠 AI Resume", "🎤 VR Interview", "🌍 15 Countries", "🏆 XP Games", "📊 Analytics"].map((f, i) => (
                        <span key={f} style={{
                            fontSize: "0.65rem", color: "rgba(163,119,157,0.52)",
                            background: "rgba(20,10,40,0.5)", border: "1px solid rgba(163,119,157,0.10)",
                            borderRadius: 20, padding: "3px 12px",
                            animation: `badgeFadeIn 0.4s ${0.8 + i * 0.1}s both`,
                            backdropFilter: "blur(6px)",
                        }}>{f}</span>
                    ))}
                </div>
            </div>

            <style>{`
        @keyframes orbFloat{0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.5}33%{transform:translate(-50%,-58%) scale(1.1);opacity:.85}66%{transform:translate(-54%,-45%) scale(.93);opacity:.65}}
        @keyframes particleFloat{0%,100%{transform:translateY(0) scale(1)}25%{transform:translateY(-22px) scale(1.4)}50%{transform:translateY(-11px) scale(.82)}75%{transform:translateY(-30px) scale(1.18)}}
        @keyframes codeFloat{0%,100%{transform:translateY(0);opacity:.14}40%{transform:translateY(-16px);opacity:.26}70%{transform:translateY(-8px);opacity:.07}}
        @keyframes hexFall{0%{transform:translateY(-20px);opacity:0.10}50%{opacity:0.20}100%{transform:translateY(22px);opacity:0.05}}
        @keyframes meshSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        @keyframes cardSlideIn{0%{transform:translateY(44px) scale(0.95);opacity:0}100%{transform:translateY(0) scale(1);opacity:1}}
        @keyframes typeIn{from{width:0}to{width:18em}}
        @keyframes badgeFadeIn{0%{opacity:0;transform:translateY(8px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes neonPulse{
          0%,100%{box-shadow:0 40px 90px rgba(6,2,16,0.78),0 0 0 1px rgba(155,89,182,0.36),inset 0 1px 0 rgba(255,255,255,0.06),0 0 55px rgba(102,51,153,0.20),0 0 110px rgba(155,89,182,0.07);}
          33%{box-shadow:0 40px 90px rgba(6,2,16,0.78),0 0 0 1px rgba(180,100,255,0.62),inset 0 1px 0 rgba(255,255,255,0.08),0 0 72px rgba(140,60,220,0.34),0 0 145px rgba(155,89,182,0.17);}
          66%{box-shadow:0 40px 90px rgba(6,2,16,0.78),0 0 0 1px rgba(220,80,255,0.42),inset 0 1px 0 rgba(255,255,255,0.07),0 0 62px rgba(180,40,220,0.26),0 0 125px rgba(200,89,220,0.11);}
        }
        @keyframes shootingStar{
          0%{transform:rotate(var(--angle,45deg)) translateX(0);opacity:0;}
          5%{opacity:1;}
          40%{opacity:0.85;}
          100%{transform:rotate(var(--angle,45deg)) translateX(-380px);opacity:0;}
        }
        @keyframes cursorBlink{0%,100%{opacity:1;}50%{opacity:0;}}
        @keyframes fadeInOut{0%,100%{opacity:0.25}50%{opacity:1}}
      `}</style>
        </div>
    );
}
