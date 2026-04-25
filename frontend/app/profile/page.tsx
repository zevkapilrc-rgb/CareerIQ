"use client";
import React, { useState, useEffect } from "react";
import { useAppStore } from "@/src/state/useAppStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Pencil, Save, LogOut, Check, FileText, Briefcase, Zap, GraduationCap, MapPin, Mail, Phone, ExternalLink } from "lucide-react";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";

const AVATARS = ["🧑", "👩", "🧑‍💻", "👨‍🎓", "👩‍💼", "🧑‍🚀", "🦸", "🧙", "🎯", "🚀", "👑", "🦊"];
const SKILL_SUGGESTIONS = ["React", "TypeScript", "Python", "Node.js", "Machine Learning", "AWS", "Docker", "System Design", "SQL", "GraphQL", "Next.js", "TensorFlow", "Kubernetes", "Go", "Rust", "Java", "C++", "Swift", "Flutter", "FastAPI"];

export default function ProfilePage() {
    const { profile, updateProfile, role, logout } = useAppStore();
    const router = useRouter();
    const [editing, setEditing] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);
    const [form, setForm] = useState({
        name: profile?.name || "",
        bio: profile?.bio || "",
        email: profile?.email || "",
        phone: profile?.phone || "",
        experience: profile?.experience?.toString() || "0",
        education: profile?.education || "",
        domain: profile?.domain || "",
        avatar: profile?.avatar || "🧑",
        skills: profile?.skills || [],
    });
    const [skillInput, setSkillInput] = useState("");
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("ciq-resume-analysis");
            if (stored) {
                const parsed = JSON.parse(stored);
                setAnalysis(parsed);
                // Auto-fill from resume if current profile fields are empty or generic
                setForm(prev => ({
                    ...prev,
                    bio: prev.bio || parsed.personalBranding?.shortBio || "",
                    education: prev.education || parsed.personalBranding?.linkedInHeadline || "",
                    domain: prev.domain || parsed.detectedDomain || "",
                    experience: prev.experience !== "0" ? prev.experience : (parsed.experience?.length || 2).toString(),
                    skills: prev.skills.length > 0 ? prev.skills : (parsed.coreSkills || []),
                }));
            }
        }
    }, []);

    if (role === "guest" || !profile) {
        return (
            <div className="page-enter" style={{ maxWidth: 500, margin: "0 auto", textAlign: "center", paddingTop: 60 }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, color: "var(--accent)" }}><Lock size={48} /></div>
                <h2 style={{ marginBottom: 8 }}>Sign in to view your profile</h2>
                <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>Login to access your personalized career profile</p>
                <Link href="/login" className="btn-primary" style={{ textDecoration: "none" }}>Sign In →</Link>
            </div>
        );
    }

    const handleSave = () => {
        updateProfile({
            name: form.name,
            bio: form.bio,
            email: form.email,
            phone: form.phone,
            experience: parseInt(form.experience) || 0,
            education: form.education,
            domain: form.domain,
            avatar: form.avatar,
            skills: form.skills,
        });
        setSaved(true);
        setEditing(false);
        setTimeout(() => setSaved(false), 2500);
    };

    const addSkill = (s: string) => {
        const sk = s.trim();
        if (sk && !form.skills.includes(sk)) setForm({ ...form, skills: [...form.skills, sk] });
        setSkillInput("");
    };
    const removeSkill = (s: string) => setForm({ ...form, skills: form.skills.filter(x => x !== s) });

    const stats = [
        ["Total XP", `${profile.xp} pts`, "var(--accent)"],
        ["Level", profile.level, "var(--yellow)"],
        ["Skills", `${form.skills.length}`, "var(--green)"],
        ["Experience", `${form.experience} yr`, "var(--blue)"],
    ];

    const radarData = form.skills.slice(0, 6).map((s, i) => ({
        skill: s.length > 10 ? s.slice(0, 10) : s,
        value: Math.min(100, 60 + i * 5 + parseInt(form.experience) * 5)
    }));

    return (
        <div className="page-enter" style={{ maxWidth: 1000, margin: "0 auto", paddingBottom: 40 }}>
            {/* Header */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 28, flexWrap: "wrap", justifyContent: "space-between" }}>
                <div>
                    <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Advanced Profile</h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Manage your identity and career footprint.</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                    {!editing && <button className="btn-primary" onClick={() => setEditing(true)} style={{ display: "flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg, #7c3aed, #a78bfa)" }}><Pencil size={16} /> Edit Profile</button>}
                    {editing && <><button className="btn-primary" onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: 8 }}><Save size={16} /> Save Changes</button><button className="btn-ghost" onClick={() => setEditing(false)}>Cancel</button></>}
                    <button className="btn-ghost" onClick={() => { router.push("/login"); setTimeout(() => logout(), 100); }} style={{ color: "var(--red)", borderColor: "rgba(248,113,113,0.3)", display: "flex", alignItems: "center", gap: 8 }}><LogOut size={16} /> Sign Out</button>
                </div>
            </div>

            {saved && <div className="card animate-fade" style={{ marginBottom: 20, background: "rgba(86,227,160,0.1)", borderColor: "rgba(86,227,160,0.3)", color: "var(--green)", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}><Check size={18} /> Profile successfully updated and synced with AI modules!</div>}

            <div className="grid-2" style={{ gap: 24, alignItems: "start" }}>
                {/* Left Column: Identity & Details */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {/* Hero Card */}
                    <div className="card liquid-glass" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(0,0,0,0.2))", borderColor: "rgba(167,139,250,0.25)", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: -50, right: -50, width: 150, height: 150, background: "radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
                        <div style={{ display: "flex", gap: 22, alignItems: "center", flexWrap: "wrap" }}>
                            {editing ? (
                                <div>
                                    <div style={{ fontSize: "3.5rem", marginBottom: 12, textAlign: "center", background: "rgba(255,255,255,0.05)", borderRadius: "50%", width: 90, height: 90, display: "flex", alignItems: "center", justifyContent: "center" }}>{form.avatar}</div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxWidth: 220 }}>
                                        {AVATARS.map(a => (
                                            <button key={a} onClick={() => setForm({ ...form, avatar: a })} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${form.avatar === a ? "var(--accent)" : "rgba(255,255,255,0.1)"}`, background: form.avatar === a ? "rgba(102,51,153,0.2)" : "transparent", fontSize: "1.1rem", cursor: "pointer", transition: "all 0.2s" }}>{a}</button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div style={{ width: 90, height: 90, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.8rem", boxShadow: "0 8px 24px rgba(124,58,237,0.4)" }}>{form.avatar || "🧑"}</div>
                            )}
                            <div style={{ flex: 1 }}>
                                {editing ? (
                                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 10, width: "100%", padding: "8px 12px" }} placeholder="Your Name" />
                                ) : (
                                    <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>{form.name}</div>
                                )}
                                
                                {editing ? (
                                    <input value={form.domain} onChange={e => setForm({ ...form, domain: e.target.value })} className="input-field" style={{ fontSize: "0.85rem", marginBottom: 10, width: "100%", padding: "8px 12px" }} placeholder="Domain (e.g. AI Engineer)" />
                                ) : (
                                    <div style={{ fontSize: "0.9rem", color: "var(--accent)", fontWeight: 600, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><Briefcase size={14} /> {form.domain || "Role not set"}</div>
                                )}

                                {editing ? (
                                    <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="input-field" rows={3} placeholder="Tell us about yourself..." style={{ resize: "none", width: "100%", padding: "10px" }} />
                                ) : (
                                    <div style={{ fontSize: "0.85rem", color: "var(--text-sub)", lineHeight: 1.6 }}>{form.bio || <span style={{ fontStyle: "italic", opacity: 0.6 }}>No bio provided. Auto-fill by uploading a resume.</span>}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contact & Professional Info */}
                    <div className="card">
                        <h3 style={{ marginBottom: 18, fontSize: "1rem", display: "flex", alignItems: "center", gap: 8 }}><FileText size={18} color="var(--accent)" /> Professional Details</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {[
                                { icon: <Mail size={16} />, label: "Email", field: "email", type: "email", placeholder: "your@email.com", val: form.email },
                                { icon: <Phone size={16} />, label: "Phone", field: "phone", type: "text", placeholder: "+91 xxxxx xxxxx", val: form.phone },
                                { icon: <GraduationCap size={16} />, label: "Education / Headline", field: "education", type: "text", placeholder: "B.Tech Computer Science", val: form.education },
                                { icon: <Zap size={16} />, label: "Years of Experience", field: "experience", type: "number", placeholder: "0", val: form.experience },
                            ].map((item) => (
                                <div key={item.field} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <div style={{ color: "var(--text-muted)", width: 24, display: "flex", justifyContent: "center" }}>{item.icon}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.label}</div>
                                        {editing ? (
                                            <input type={item.type} className="input-field" value={(form as any)[item.field]} onChange={e => setForm({ ...form, [item.field]: e.target.value })} placeholder={item.placeholder} style={{ width: "100%", padding: "6px 12px", fontSize: "0.85rem" }} />
                                        ) : (
                                            <div style={{ fontSize: "0.9rem", color: "var(--text)", fontWeight: 500 }}>{item.val || <span style={{ color: "var(--text-muted)" }}>Not set</span>}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid-2">
                        {stats.map(([l, v, c]) => (
                            <div key={l} className="card" style={{ padding: "16px", textAlign: "center", background: "rgba(255,255,255,0.02)" }}>
                                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: c as string, marginBottom: 4 }}>{v}</div>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Skills & Insights */}
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {/* Skills Management */}
                    <div className="card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <h3 style={{ display: "flex", alignItems: "center", gap: 8, margin: 0 }}><Zap size={18} color="var(--yellow)" /> Skills ({form.skills.length})</h3>
                            {analysis && !editing && <span style={{ fontSize: "0.65rem", background: "rgba(52,211,153,0.1)", color: "#34d399", padding: "4px 8px", borderRadius: 12, border: "1px solid rgba(52,211,153,0.2)" }}>Auto-synced from Resume</span>}
                        </div>
                        
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                            {form.skills.map(s => (
                                <span key={s} className="skill-tag" style={{ display: "flex", alignItems: "center", gap: 6, padding: editing ? "6px 12px" : undefined, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)" }}>
                                    {s}
                                    {editing && <button onClick={() => removeSkill(s)} style={{ background: "rgba(248,113,113,0.1)", border: "none", color: "var(--red)", cursor: "pointer", fontSize: "0.7rem", width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>}
                                </span>
                            ))}
                        </div>

                        {editing && (
                            <div style={{ background: "rgba(0,0,0,0.1)", padding: 16, borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 8 }}>Add New Skills</div>
                                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                                    <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addSkill(skillInput)} placeholder="Type a skill..." className="input-field" style={{ flex: 1, padding: "8px 12px", fontSize: "0.85rem" }} />
                                    <button onClick={() => addSkill(skillInput)} className="btn-primary" style={{ padding: "0 16px" }}>Add</button>
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                    {SKILL_SUGGESTIONS.filter(s => skillInput ? s.toLowerCase().includes(skillInput.toLowerCase()) && !form.skills.includes(s) : !form.skills.includes(s)).slice(0, 8).map(s => (
                                        <button key={s} onClick={() => addSkill(s)} style={{ fontSize: "0.7rem", padding: "4px 10px", borderRadius: 20, background: "transparent", border: "1px dashed rgba(167,139,250,0.5)", color: "rgba(167,139,250,0.8)", cursor: "pointer" }}>+ {s}</button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!editing && form.skills.length > 0 && (
                            <div style={{ marginTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 20 }}>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 12, textAlign: "center" }}>Skill Distribution Profile</div>
                                <ResponsiveContainer width="100%" height={200}>
                                    <RadarChart data={radarData}>
                                        <PolarGrid stroke="rgba(255,255,255,0.08)" />
                                        <PolarAngleAxis dataKey="skill" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                                        <Radar name="Proficiency" dataKey="value" stroke="#a78bfa" fill="#a78bfa" fillOpacity={0.25} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* Resume Insights Sync */}
                    {analysis && !editing && (
                        <div className="card" style={{ background: "linear-gradient(135deg, rgba(52,211,153,0.05), rgba(0,0,0,0))", borderColor: "rgba(52,211,153,0.2)" }}>
                            <h3 style={{ marginBottom: 16, fontSize: "1rem", display: "flex", alignItems: "center", gap: 8, color: "#34d399" }}>
                                <FileText size={18} /> AI Resume Insights
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <div style={{ background: "rgba(255,255,255,0.02)", padding: 12, borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
                                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 4 }}>ATS MATCH SCORE</div>
                                    <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text)" }}>{analysis.atsScore}% <span style={{ fontSize: "0.8rem", color: "var(--green)", fontWeight: 500 }}>Excellent</span></div>
                                </div>
                                <div style={{ background: "rgba(255,255,255,0.02)", padding: 12, borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
                                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 4 }}>DETECTED TRAJECTORY</div>
                                    <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--accent)" }}>{analysis.careerInsights?.suggestedPath}</div>
                                </div>
                                <Link href="/resume" style={{ textDecoration: "none" }}>
                                    <div style={{ marginTop: 8, fontSize: "0.8rem", color: "#60a5fa", display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontWeight: 500 }}>
                                        View full resume analysis <ExternalLink size={12} />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
