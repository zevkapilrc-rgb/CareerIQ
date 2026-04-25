"use client";
import { useState, useEffect } from "react";
import { Mail, Crown, Phone, Clock, GraduationCap, Rocket, ExternalLink, Users, MessageCircle, CheckCircle, AlertTriangle, Loader2, Lock, ArrowRight, Globe2, Building2, Activity } from "lucide-react";

// ─── EmailJS config (replace these with your real IDs from emailjs.com) ───
const EMAILJS_SERVICE_ID  = "service_careeriq";   // your Service ID
const EMAILJS_TEMPLATE_ID = "template_contact";   // your Template ID
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";    // your Public Key

declare global { interface Window { emailjs: any } }

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");
    const [errMsg, setErrMsg] = useState("");

    // Load EmailJS SDK from CDN
    useEffect(() => {
        if (document.getElementById("emailjs-cdn")) return;
        const s = document.createElement("script");
        s.id = "emailjs-cdn";
        s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
        s.onload = () => window.emailjs?.init({ publicKey: EMAILJS_PUBLIC_KEY });
        document.head.appendChild(s);
    }, []);

    const handleSubmit = async () => {
        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            setErrMsg("Please fill in all fields."); return;
        }
        if (!/\S+@\S+\.\S+/.test(form.email)) {
            setErrMsg("Enter a valid email address."); return;
        }
        setErrMsg(""); setStatus("loading");

        try {
            await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                from_name:    form.name,
                from_email:   form.email,
                subject:      form.subject,
                message:      form.message,
                to_email:     "zevkapilrc@gmail.com",
            });
            setStatus("success");
            setForm({ name: "", email: "", subject: "Feature Request", message: "" });
        } catch (err: any) {
            console.error("EmailJS error:", err);
            setStatus("error");
            setErrMsg("Failed to send message. Please try again or email us directly.");
        }
    };

    return (
        <div className="page-enter" style={{ maxWidth: 960, margin: "0 auto" }}>
            {/* ── Hero ── */}
            <div style={{
                borderRadius: 20, padding: "48px 40px", marginBottom: 40,
                background: "linear-gradient(135deg, rgba(124,58,237,0.14) 0%, rgba(96,165,250,0.08) 100%)",
                border: "1px solid rgba(167,139,250,0.2)", position: "relative", overflow: "hidden",
            }}>
                <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
                <div style={{ position: "relative" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", borderRadius: 20, padding: "5px 16px", fontSize: "0.73rem", color: "#a78bfa", fontWeight: 600, marginBottom: 20, letterSpacing: "0.08em" }}>
                        <Mail size={14} /> CONTACT US
                    </div>
                    <h1 style={{ fontSize: "2.4rem", fontWeight: 800, marginBottom: 12, background: "linear-gradient(135deg, #f1f5f9 30%, #a78bfa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        Get In Touch
                    </h1>
                    <p style={{ color: "#94a3b8", fontSize: "1rem", maxWidth: 520, lineHeight: 1.8, margin: 0 }}>
                        Have a question, feature request, or want to collaborate? We'd love to hear from you. Messages are delivered directly to our team.
                    </p>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 28, alignItems: "start" }}>
                {/* ── Left: Founder + Info ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    {/* Premium Founder Card */}
                    <div className="card animate-glow" style={{ position: "relative", overflow: "hidden", borderColor: "rgba(167,139,250,0.3)", background: "linear-gradient(135deg,rgba(167,139,250,0.06),rgba(0,0,0,0.4))", padding: 28, boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}>
                        <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, background: "radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
                        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                            <div style={{ width: 64, height: 64, borderRadius: "16px", background: "linear-gradient(135deg,#c4b5fd,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(167,139,250,0.3)", flexShrink: 0 }}><Crown size={28} color="white" /></div>
                            <div>
                                <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 4 }}>
                                    <span style={{ fontWeight: 900, fontSize: "1.1rem", color: "#f8fafc", letterSpacing: "0.02em" }}>KAPILDEV</span>
                                    <span style={{ background: "rgba(167,139,250,0.15)", color: "#c4b5fd", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 6, padding: "2px 8px", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.05em" }}>FOUNDER</span>
                                </div>
                                <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 500 }}>AI & Data Science Engineering</div>
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <a href="tel:+919360097924" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 16px", transition: "all 0.2s ease" }}>
                                <span><Phone size={16} color="#c4b5fd" /></span><span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "0.85rem", letterSpacing: "0.02em" }}>+91 9360097924</span>
                            </a>
                            <a href="mailto:zevkapilrc@gmail.com" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: "12px 16px", transition: "all 0.2s ease" }}>
                                <span><Mail size={16} color="#c4b5fd" /></span><span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "0.85rem", letterSpacing: "0.02em" }}>zevkapilrc@gmail.com</span>
                            </a>
                        </div>
                    </div>

                    {/* Support Hours */}
                    <div className="card" style={{ padding: 24, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <h3 style={{ fontSize: "0.95rem", marginBottom: 14, display: "flex", alignItems: "center", gap: 8, color: "var(--text)", fontWeight: 700 }}><Clock size={16} color="#c4b5fd" /> Support Hours</h3>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-sub)", lineHeight: 2 }}>
                            Monday – Friday: <span style={{ color: "var(--text)" }}>9AM – 6PM IST</span><br />
                            Saturday: <span style={{ color: "var(--text)" }}>10AM – 2PM IST</span><br />
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, color: "var(--green)", fontWeight: 600, background: "rgba(16,185,129,0.1)", width: "fit-content", padding: "4px 10px", borderRadius: 6 }}><CheckCircle size={14} /> Guaranteed 24h Response</div>
                        </div>
                    </div>

                    {/* Enterprise Inquiries */}
                    <div className="card" style={{ padding: 24, background: "rgba(167,139,250,0.03)", border: "1px solid rgba(167,139,250,0.15)" }}>
                        <h3 style={{ fontSize: "0.95rem", marginBottom: 8, display: "flex", alignItems: "center", gap: 8, color: "var(--text)", fontWeight: 700 }}><Building2 size={16} color="#c4b5fd" /> Enterprise & B2B</h3>
                        <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.6, margin: 0, marginBottom: 12 }}>
                            Interested in bringing CareerIQ to your university or corporation? We offer custom API integrations and bulk licensing.
                        </p>
                        <button 
                            onClick={() => {
                                setForm(prev => ({ ...prev, subject: "Enterprise & B2B Integration Inquiry" }));
                                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                            }}
                            style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", fontSize: "0.8rem", fontWeight: 700, color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: 4 }}
                        >
                            Contact Enterprise Team <ArrowRight size={14} />
                        </button>
                    </div>

                    {/* System Status */}
                    <div className="card" style={{ padding: "16px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Activity size={18} color="var(--green)" />
                            </div>
                            <div>
                                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text)" }}>System Status</div>
                                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>All AI Modules Operational</div>
                            </div>
                        </div>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--green)" }}>99.9%</div>
                    </div>
                </div>

                {/* ── Right: Premium Contact Form ── */}
                <div className="card" style={{ padding: 40, background: "rgba(10,10,14,0.6)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
                    <h2 style={{ marginBottom: 8, fontSize: "1.4rem", fontWeight: 800, color: "var(--text)" }}>Send a Direct Message</h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 32, lineHeight: 1.6 }}>Your inquiry will bypass general support and be routed directly to the founder's inbox.</p>

                    {status === "success" ? (
                        <div style={{ textAlign: "center", padding: "40px 0" }}>
                            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><CheckCircle size={48} color="var(--green)" /></div>
                            <h2 style={{ color: "var(--green)", marginBottom: 8 }}>Message Sent!</h2>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 24 }}>We'll get back to you within 24 hours.</p>
                            <button className="btn-ghost" onClick={() => setStatus("idle")}>Send Another Message</button>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                                <div>
                                    <label style={{ fontSize: "0.75rem", color: "var(--text-sub)", display: "block", marginBottom: 6, fontWeight: 600 }}>Your Name *</label>
                                    <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="" />
                                </div>
                                <div>
                                    <label style={{ fontSize: "0.75rem", color: "var(--text-sub)", display: "block", marginBottom: 6, fontWeight: 600 }}>Email Address *</label>
                                    <input type="email" className="input-field" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="" />
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: "0.75rem", color: "var(--text-sub)", display: "block", marginBottom: 6, fontWeight: 600 }}>Subject</label>
                                <input className="input-field" type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="" />
                            </div>

                            <div>
                                <label style={{ fontSize: "0.75rem", color: "var(--text-sub)", display: "block", marginBottom: 6, fontWeight: 600 }}>Message *</label>
                                <textarea className="input-field" rows={6} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="" style={{ resize: "vertical", lineHeight: 1.7 }} />
                                <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 4 }}>{form.message.length} characters</div>
                            </div>

                            {errMsg && (
                                <div style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", borderRadius: 10, padding: "10px 14px", fontSize: "0.78rem", color: "#f87171", display: "flex", gap: 8, alignItems: "center" }}>
                                    <AlertTriangle size={14} /> {errMsg}
                                </div>
                            )}

                            <button
                                className="btn-primary"
                                onClick={handleSubmit}
                                disabled={status === "loading"}
                                style={{ padding: "13px 0", fontSize: "0.95rem", opacity: status === "loading" ? 0.75 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                            >
                                {status === "loading" ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : <><Mail size={16} /> Send Message <ArrowRight size={16} /></>}
                            </button>

                            <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", textAlign: "center", margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                                <Lock size={12} /> Your message is sent securely. We never share your information.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Bottom Section: About CareerIQ Comprehensive Features ── */}
            <div style={{ marginTop: 60, marginBottom: 60 }}>
                <div style={{ textAlign: "center", marginBottom: 40 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", borderRadius: 20, padding: "5px 16px", fontSize: "0.73rem", color: "#a78bfa", fontWeight: 600, marginBottom: 16, letterSpacing: "0.08em" }}>
                        <GraduationCap size={14} /> ABOUT CAREERIQ
                    </div>
                    <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 16, color: "var(--text)" }}>An Entire Ecosystem of Intelligence</h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: 700, margin: "0 auto", lineHeight: 1.8 }}>
                        CareerIQ is a next-generation AI career intelligence platform. Our mission is to democratize elite career mentorship using bleeding-edge machine learning and real-time market data. We provide an ecosystem of tools to accelerate your growth:
                    </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
                    {[
                        { icon: <Rocket size={20} color="#a78bfa" />, title: "Resume Intelligence", desc: "Multi-format parsing that extracts, validates, and automatically powers all other modules with your true capabilities." },
                        { icon: <MessageCircle size={20} color="#60a5fa" />, title: "Interview Simulator", desc: "Highly realistic, customizable mock interviews with difficulty scaling, timers, and comprehensive performance history." },
                        { icon: <Crown size={20} color="#fbbf24" />, title: "Skill Gap Analyzer", desc: "Detailed breakdown of your competencies against domain benchmarks, featuring dynamic radar charts and missing-skill detection." },
                        { icon: <ExternalLink size={20} color="#34d399" />, title: "Career Path & Learning AI", desc: "Generates a dynamic 6-month roadmap and curates exact courses based on the skill gaps identified in your resume." },
                        { icon: <Users size={20} color="#c084fc" />, title: "Advanced Analytics", desc: "Real-time synergy across all your data, predicting your market demand, ATS match scores, and skill mastery velocity." },
                        { icon: <Globe2 size={20} color="#38bdf8" />, title: "Global Job Scanner", desc: "Scans 15+ countries and 85,000+ roles to match your unique profile with the best international opportunities." },
                        { icon: <Crown size={20} color="#f43f5e" />, title: "Gamification & XP", desc: "Levels, badges, and real-time XP accumulation. Complete coding challenges and modules to climb the global leaderboard." },
                        { icon: <MessageCircle size={20} color="#facc15" />, title: "HelixAI Career Chatbot", desc: "A context-aware AI mentor with 15+ specialized modules (salary negotiation, technical doubt-solving, profile building) tailored directly to your resume." },
                        { icon: <AlertTriangle size={20} color="#f97316" />, title: "AI Career Forecast", desc: "Macro-level predictions for your specific domain, calculating layoff risks, salary trendlines, and emerging tech stacks." },
                        { icon: <ExternalLink size={20} color="#14b8a6" />, title: "Skill DNA Graph", desc: "An interactive, visual node network mapping out exactly how your technical and soft skills interconnect." }
                    ].map((feat, i) => (
                        <div key={i} className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.3s ease" }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {feat.icon}
                            </div>
                            <div>
                                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>{feat.title}</h3>
                                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.6, margin: 0 }}>{feat.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
