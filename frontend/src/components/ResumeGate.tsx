"use client";
import { useAppStore } from "@/src/state/useAppStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface ResumeGateProps {
    children: ReactNode;
    pageName?: string;
    pageIcon?: string;
}

export default function ResumeGate({ children, pageName = "this page", pageIcon = "🔒" }: ResumeGateProps) {
    const { profile, role } = useAppStore();
    const router = useRouter();

    // Not logged in → redirect to login
    if (role === "guest") {
        return (
            <div className="page-enter" style={{ maxWidth: 560, margin: "80px auto", textAlign: "center" }}>
                <div style={{ fontSize: "3rem", marginBottom: 20 }}>🔐</div>
                <h1 style={{ marginBottom: 8 }}>Sign In Required</h1>
                <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: 28, lineHeight: 1.7 }}>
                    You need to be signed in to access {pageName}. Create a free account to unlock all AI features.
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                    <Link href="/login" className="btn-primary" style={{ textDecoration: "none", padding: "12px 28px" }}>
                        🚀 Sign In / Register
                    </Link>
                    <Link href="/" className="btn-ghost" style={{ textDecoration: "none", padding: "12px 28px" }}>
                        ← Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    // Logged in but no resume uploaded
    if (!profile || !profile.skills || profile.skills.length === 0) {
        return (
            <div className="page-enter" style={{ maxWidth: 640, margin: "0 auto" }}>
                {/* Header */}
                <div style={{ textAlign: "center", padding: "48px 0 40px" }}>
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)",
                        borderRadius: 20, padding: "5px 16px", fontSize: "0.75rem", color: "#fbbf24", marginBottom: 24
                    }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fbbf24", display: "inline-block" }} />
                        Resume Required to Unlock {pageName}
                    </div>

                    <div style={{ fontSize: "4rem", marginBottom: 16 }} className="animate-float">{pageIcon}</div>

                    <h1 style={{ fontSize: "1.8rem", marginBottom: 12, background: "linear-gradient(135deg,#f1f5f9,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        Unlock {pageName}
                    </h1>

                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.8, maxWidth: 480, margin: "0 auto 32px" }}>
                        Upload your resume to unlock <strong style={{ color: "var(--text)" }}>{pageName}</strong> and get personalized AI-powered insights based on your actual skills, experience, and career goals.
                    </p>

                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/resume" className="btn-primary" style={{
                            textDecoration: "none", padding: "14px 36px", fontSize: "1rem",
                            background: "linear-gradient(135deg,#7c3aed,#a78bfa)",
                            boxShadow: "0 8px 24px rgba(124,58,237,0.35)"
                        }}>
                            📄 Upload Resume — Unlock Now
                        </Link>
                        <Link href="/dashboard" className="btn-ghost" style={{ textDecoration: "none", padding: "14px 28px" }}>
                            ← Dashboard
                        </Link>
                    </div>
                </div>

                {/* What you unlock */}
                <div className="card animate-glow" style={{
                    marginBottom: 24,
                    background: "linear-gradient(135deg,rgba(124,58,237,0.08),rgba(167,139,250,0.04))",
                    borderColor: "rgba(124,58,237,0.25)"
                }}>
                    <h2 style={{ marginBottom: 16 }}>✨ What You Unlock</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                        {[
                            { icon: "📊", title: "Career Dashboard", desc: "Skill radar, health score & analytics" },
                            { icon: "🎤", title: "Interview Sim", desc: "Resume-based questions + aptitude" },
                            { icon: "🗺️", title: "Career Path AI", desc: "Personalized 6-month roadmap" },
                            { icon: "🧩", title: "Skill Gap Analysis", desc: "Compare your skills vs market" },
                            { icon: "📚", title: "Learning Path", desc: "Recommended courses for YOUR gaps" },
                            { icon: "🧬", title: "Skill DNA Graph", desc: "Visual skill connection map" },
                        ].map(item => (
                            <div key={item.title} style={{
                                display: "flex", gap: 10, alignItems: "flex-start",
                                padding: "12px 14px", borderRadius: 10,
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(167,139,250,0.1)"
                            }}>
                                <div style={{ fontSize: "1.4rem", flexShrink: 0 }}>{item.icon}</div>
                                <div>
                                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>{item.title}</div>
                                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{item.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Steps */}
                <div className="card" style={{ marginBottom: 24 }}>
                    <h3 style={{ marginBottom: 14 }}>How it works</h3>
                    {[
                        { n: "1", text: "Upload your resume (PDF, DOCX, or PNG)", color: "#a78bfa" },
                        { n: "2", text: "AI extracts your skills, domain & experience in seconds", color: "#60a5fa" },
                        { n: "3", text: "All pages instantly personalize to your profile", color: "#34d399" },
                    ].map(s => (
                        <div key={s.n} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                            <div style={{
                                width: 28, height: 28, borderRadius: "50%",
                                background: `linear-gradient(135deg,${s.color}66,${s.color})`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "0.75rem", fontWeight: 800, color: "white", flexShrink: 0
                            }}>{s.n}</div>
                            <span style={{ fontSize: "0.83rem", color: "var(--text-sub)" }}>{s.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
