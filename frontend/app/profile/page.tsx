"use client";
import { useState } from "react";
import { useAppStore } from "@/src/state/useAppStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AVATARS = ["🧑", "👩", "🧑‍💻", "👨‍🎓", "👩‍💼", "🧑‍🚀", "🦸", "🧙", "🎯", "🚀", "👑", "🦊"];
const SKILL_SUGGESTIONS = ["React", "TypeScript", "Python", "Node.js", "Machine Learning", "AWS", "Docker", "System Design", "SQL", "GraphQL", "Next.js", "TensorFlow", "Kubernetes", "Go", "Rust", "Java", "C++", "Swift", "Flutter", "FastAPI"];

export default function ProfilePage() {
    const { profile, updateProfile, role, logout } = useAppStore();
    const router = useRouter();
    const [editing, setEditing] = useState(false);
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

    if (role === "guest" || !profile) {
        return (
            <div className="page-enter" style={{ maxWidth: 500, margin: "0 auto", textAlign: "center", paddingTop: 60 }}>
                <div style={{ fontSize: "3rem", marginBottom: 16 }}>🔐</div>
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
        ["Skills", `${profile.skills.length}`, "var(--green)"],
        ["Experience", `${profile.experience} yr`, "var(--blue)"],
    ];

    return (
        <div className="page-enter" style={{ maxWidth: 700, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 28, flexWrap: "wrap", justifyContent: "space-between" }}>
                <h1>My Profile</h1>
                <div style={{ display: "flex", gap: 10 }}>
                    {!editing && <button className="btn-primary" onClick={() => setEditing(true)}>✏️ Edit Profile</button>}
                    {editing && <><button className="btn-primary" onClick={handleSave}>💾 Save Changes</button><button className="btn-ghost" onClick={() => setEditing(false)}>Cancel</button></>}
                    <button className="btn-ghost" onClick={() => { logout(); router.push("/login"); }} style={{ color: "var(--red)", borderColor: "rgba(248,113,113,0.3)" }}>🚪 Sign Out</button>
                </div>
            </div>

            {saved && <div className="card" style={{ marginBottom: 16, background: "rgba(86,227,160,0.06)", borderColor: "rgba(86,227,160,0.25)", color: "var(--green)", fontWeight: 600 }}>✓ Profile saved successfully!</div>}

            {/* Avatar + Name Hero */}
            <div className="card liquid-glass" style={{ marginBottom: 20, background: "linear-gradient(135deg, rgba(102,51,153,0.15), rgba(46,26,71,0.3))", borderColor: "rgba(163,119,157,0.25)", padding: 32 }}>
                <div style={{ display: "flex", gap: 22, alignItems: "center", flexWrap: "wrap" }}>
                    {editing ? (
                        <div>
                            <div style={{ fontSize: "3.5rem", marginBottom: 8, textAlign: "center" }}>{form.avatar}</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxWidth: 240 }}>
                                {AVATARS.map(a => (
                                    <button key={a} onClick={() => setForm({ ...form, avatar: a })} style={{ width: 36, height: 36, borderRadius: 8, border: `2px solid ${form.avatar === a ? "var(--accent)" : "transparent"}`, background: form.avatar === a ? "rgba(102,51,153,0.2)" : "transparent", fontSize: "1.3rem", cursor: "pointer" }}>{a}</button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#663399,#9b59b6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", boxShadow: "0 4px 20px rgba(102,51,153,0.5)" }}>{profile.avatar || "🧑"}</div>
                    )}
                    <div style={{ flex: 1 }}>
                        {editing ? (
                            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 10, width: "100%" }} placeholder="Your name" />
                        ) : (
                            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>{profile.name}</div>
                        )}
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 8 }}>{profile.email || "No email"} {profile.phone && `· +91 ${profile.phone}`}</div>
                        {editing ? (
                            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="input-field" rows={2} placeholder="Tell us about yourself..." style={{ resize: "none" }} />
                        ) : (
                            <div style={{ fontSize: "0.85rem", color: "var(--text-sub)", lineHeight: 1.6 }}>{profile.bio || "No bio yet — click Edit to add one"}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid-4" style={{ marginBottom: 20 }}>
                {stats.map(([l, v, c]) => (
                    <div key={l} className="stat-card liquid-glass">
                        <div className="stat-label">{l}</div>
                        <div style={{ fontSize: "1.5rem", fontWeight: 800, color: c as string, marginTop: 4 }}>{v}</div>
                    </div>
                ))}
            </div>

            {/* XP Progress */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontWeight: 600 }}>XP Progress</span>
                    <span style={{ color: "var(--accent)", fontWeight: 700 }}>{profile.xp} XP · {profile.level}</span>
                </div>
                <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${Math.min(100, (profile.xp % 1000) / 10)}%` }} />
                </div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 6 }}>
                    {profile.xp < 500 ? 500 - profile.xp : profile.xp < 1500 ? 1500 - profile.xp : profile.xp < 3000 ? 3000 - profile.xp : profile.xp < 6000 ? 6000 - profile.xp : 0} XP to next level
                </div>
            </div>

            {/* Details */}
            <div className="card" style={{ marginBottom: 20 }}>
                <h3 style={{ marginBottom: 18 }}>Career Details</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    {[
                        ["Domain", "domain", "text", "e.g. Full-Stack Developer"],
                        ["Education", "education", "text", "e.g. B.Tech Computer Science"],
                        ["Years of Experience", "experience", "number", "0"],
                        ["Email", "email", "email", "your@email.com"],
                    ].map(([label, field, type, placeholder]) => (
                        <div key={field}>
                            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 5 }}>{label}</div>
                            {editing ? (
                                <input type={type} className="input-field" value={(form as any)[field]} onChange={e => setForm({ ...form, [field]: e.target.value })} placeholder={placeholder} />
                            ) : (
                                <div style={{ fontSize: "0.88rem", color: "var(--text)", fontWeight: 500 }}>{(profile as any)[field] || <span style={{ color: "var(--text-muted)" }}>Not set</span>}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Skills */}
            <div className="card">
                <h3 style={{ marginBottom: 12 }}>Skills ({form.skills.length})</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                    {(editing ? form.skills : profile.skills).map(s => (
                        <span key={s} className="skill-tag" style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            {s}
                            {editing && <button onClick={() => removeSkill(s)} style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", fontSize: "0.8rem", lineHeight: 1, padding: 0 }}>×</button>}
                        </span>
                    ))}
                    {editing && (
                        <>
                            <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addSkill(skillInput)} placeholder="Add skill..." className="input-field" style={{ width: 140, padding: "4px 10px", fontSize: "0.8rem" }} />
                            {skillInput && SKILL_SUGGESTIONS.filter(s => s.toLowerCase().includes(skillInput.toLowerCase()) && !form.skills.includes(s)).slice(0, 5).map(s => (
                                <button key={s} onClick={() => addSkill(s)} className="skill-tag" style={{ cursor: "pointer", border: "1px dashed var(--accent)", color: "var(--accent)" }}>{s} +</button>
                            ))}
                        </>
                    )}
                </div>
                {!editing && profile.skills.length === 0 && <div style={{ color: "var(--text-muted)", fontSize: "0.83rem" }}>No skills yet — upload your resume or edit your profile to add skills.</div>}
            </div>
        </div>
    );
}
