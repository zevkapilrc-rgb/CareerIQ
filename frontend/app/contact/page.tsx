"use client";
import { useState } from "react";

const founders = [
    { name: "KAPILDEV", role: "Founder & Visionary 👑", edu: "Artificial Intelligence & Data Science", ph: "9360097924", icon: "👑", color: "#fbbf24", main: true },
    { name: "Mahamood Majin S", role: "Co-Founder & AI Lead", edu: "B.Tech — Artificial Intelligence & Data Science", ph: "7826831126", icon: "🤖", color: "#a78bfa" },
    { name: "Mukesh C", role: "Co-Founder & Engineering Lead", edu: "B.Tech — Artificial Intelligence & Data Science", ph: "9003427989", icon: "💻", color: "#60a5fa" },
    { name: "Ramkumar R", role: "Co-Founder & Product Lead", edu: "B.Tech — Artificial Intelligence & Data Science", ph: "63836455646", icon: "🚀", color: "#34d399" },
];

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", subject: "Feature Request", message: "" });

    const handleSubmit = () => {
        if (!form.name || !form.email || !form.message) { alert("Please fill all fields"); return; }
        setSubmitted(true);
        if (typeof window !== "undefined") localStorage.setItem("ciq-contact-sent", "1");
    };

    return (
        <div className="page-enter" style={{ maxWidth: 900, margin: "0 auto" }}>
            <h1 style={{ marginBottom: 4 }}>Contact Us</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 32 }}>Built with ❤️ by a team of AI & Data Science engineers</p>

            {/* Main founder — KAPILDEV */}
            {(() => {
                const main = founders.find(f => (f as any).main);
                return main ? (
                    <div className="card animate-glow" style={{ borderColor: "#fbbf2466", background: "linear-gradient(135deg,rgba(251,191,36,0.08),rgba(251,191,36,0.04))", marginBottom: 24, padding: 32 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#fbbf24,#f59e0b)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", boxShadow: "0 0 30px #fbbf2466", flexShrink: 0 }}>👑</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                    <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#fbbf24" }}>{main.name}</div>
                                    <span style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 20, padding: "2px 10px", fontSize: "0.7rem", fontWeight: 700 }}>FOUNDER</span>
                                </div>
                                <div style={{ color: "#fbbf24", fontWeight: 600, fontSize: "0.85rem", marginBottom: 4 }}>{main.role}</div>
                                <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginBottom: 12 }}>Department: {main.edu}</div>
                                <a href={`tel:+91${main.ph}`} style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 8, padding: "8px 16px" }}>
                                    <span>📞</span><span style={{ color: "#fbbf24", fontWeight: 600, fontSize: "0.85rem" }}>+91 {main.ph}</span>
                                </a>
                            </div>
                        </div>
                    </div>
                ) : null;
            })()}
            {/* Co-founders */}
            <div className="grid-3 stagger" style={{ marginBottom: 40 }}>
                {founders.filter(f => !(f as any).main).map(f => (
                    <div key={f.name} className="card" style={{ borderColor: `${f.color}33`, textAlign: "center", padding: 28 }}>
                        <div style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg,${f.color}44,${f.color}22)`, border: `2px solid ${f.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", margin: "0 auto 16px" }}>{f.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: 4 }}>{f.name}</div>
                        <div style={{ fontSize: "0.75rem", color: f.color, fontWeight: 600, marginBottom: 8 }}>{f.role}</div>
                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 12, lineHeight: 1.5 }}>{f.edu}</div>
                        <a href={`tel:+91${f.ph}`} style={{ textDecoration: "none" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: `${f.color}11`, border: `1px solid ${f.color}33`, borderRadius: 8, padding: "8px 12px", cursor: "pointer" }}>
                                <span style={{ fontSize: "0.9rem" }}>📞</span>
                                <span style={{ fontSize: "0.8rem", color: f.color, fontWeight: 600 }}>+91 {f.ph}</span>
                            </div>
                        </a>
                    </div>
                ))}
            </div>

            {/* Contact form */}
            <div className="grid-2" style={{ gap: 24 }}>
                <div className="card">
                    <h2 style={{ marginBottom: 20 }}>Send a Message</h2>
                    {!submitted ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <div>
                                <label style={{ fontSize: "0.78rem", color: "var(--text-sub)", display: "block", marginBottom: 6 }}>Your Name</label>
                                <input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter your name" />
                            </div>
                            <div>
                                <label style={{ fontSize: "0.78rem", color: "var(--text-sub)", display: "block", marginBottom: 6 }}>Email Address</label>
                                <input type="email" className="input-field" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                            </div>
                            <div>
                                <label style={{ fontSize: "0.78rem", color: "var(--text-sub)", display: "block", marginBottom: 6 }}>Subject</label>
                                <select className="input-field" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                                    <option>Feature Request</option>
                                    <option>Bug Report</option>
                                    <option>Career Advice</option>
                                    <option>Partnership</option>
                                    <option>General Inquiry</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: "0.78rem", color: "var(--text-sub)", display: "block", marginBottom: 6 }}>Message</label>
                                <textarea className="input-field" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" style={{ resize: "vertical" }} />
                            </div>
                            <button className="btn-primary" onClick={handleSubmit}>Send Message →</button>
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "32px 0" }}>
                            <div style={{ fontSize: "3rem", marginBottom: 12 }} className="animate-float">✅</div>
                            <h2 style={{ color: "var(--green)", marginBottom: 8 }}>Message Sent!</h2>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>We'll get back to you within 24 hours.</p>
                            <button className="btn-ghost" style={{ marginTop: 16 }} onClick={() => setSubmitted(false)}>Send Another</button>
                        </div>
                    )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div className="card">
                        <h3>🕐 Support Hours</h3>
                        <div style={{ fontSize: "0.82rem", color: "var(--text-sub)", lineHeight: 2 }}>Monday – Friday: 9AM – 6PM IST<br />Saturday: 10AM – 2PM IST<br />Response time: within 24 hours</div>
                    </div>
                    <div className="card">
                        <h3>🎓 About CareerIQ v3</h3>
                        <p style={{ fontSize: "0.81rem", color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>CareerIQ v3 is an AI-powered career intelligence platform built by AI & Data Science engineers. Our mission is to democratize career mentorship using cutting-edge ML techniques.</p>
                    </div>
                    <div className="card" style={{ background: "rgba(167,139,250,0.06)", borderColor: "rgba(167,139,250,0.2)" }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>🚀</div>
                            <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text)", marginBottom: 4 }}>Built with Purpose</div>
                            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>Empowering the next generation of AI & tech professionals to achieve their career dreams.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



