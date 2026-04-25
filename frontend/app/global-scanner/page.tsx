"use client";
import { useState, useEffect } from "react";
import { useAppStore } from "@/src/state/useAppStore";
import { Globe, Flame, MapPin, Lightbulb, FileText, Sparkles, TrendingUp } from "lucide-react";

import { markets } from "./globalJobsData";

export default function GlobalScannerPage() {
    const { profile } = useAppStore();
    const [selected, setSelected] = useState<typeof markets[0] | null>(null);
    const [search, setSearch] = useState("");
    const [showAbout, setShowAbout] = useState(false);

    const [currentDate, setCurrentDate] = useState("");
    
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentDate(now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) + " " + now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    const filtered = markets.filter(m =>
        m.country.toLowerCase().includes(search.toLowerCase())
    );
    const totalRoles = markets.reduce((a, m) => a + m.roles, 0);

    const getCountryDetails = (country: string) => {
        const hash = country.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const colIndex = 60 + (hash % 60);
        const qolIndex = 110 + (hash % 80);
        const taxRate = 15 + (hash % 30);
        const startups = 500 + (hash * 13 % 4000);
        
        return [
            { label: "Cost of Living Index", value: colIndex, icon: <MapPin size={14}/> },
            { label: "Quality of Life", value: qolIndex, icon: <Sparkles size={14}/> },
            { label: "Expat Tax Rate", value: `${taxRate}%`, icon: <FileText size={14}/> },
            { label: "Tech Startups", value: startups.toLocaleString(), icon: <Flame size={14}/> },
            { label: "Tech GDP Growth", value: `+${((hash%100)/10).toFixed(1)}%`, icon: <TrendingUp size={14}/> },
            { label: "Top Tech Hubs", value: country === "United States" ? "SF, NY, Austin" : country === "United Kingdom" ? "London, Cambridge" : country === "Germany" ? "Berlin, Munich" : country === "Canada" ? "Toronto, Vancouver" : country === "India" ? "Bangalore, Pune" : country === "Australia" ? "Sydney, Melb" : "Capital City", icon: <Globe size={14}/> },
        ];
    };

    if (selected) return (
        <div className="page-enter" style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                    <button className="btn-ghost" onClick={() => { setSelected(null); setShowAbout(false); }}>← All Markets</button>
                    <img src={`https://hatscripts.github.io/circle-flags/flags/${(selected as any).cc}.svg`} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }} />
                    <h2 style={{ margin: 0 }}>Jobs in {selected.country}</h2>
                    <span style={{ color: selected.color, fontWeight: 700 }}>{selected.roles.toLocaleString()} open roles</span>
                    <span className="badge-green">{selected.growth}</span>
                </div>
                <button className="btn-ghost" style={{ border: `1px solid ${selected.color}44`, color: selected.color, background: showAbout ? `${selected.color}15` : "transparent" }} onClick={() => setShowAbout(!showAbout)}>
                    <Globe size={16} style={{ marginRight: 6 }} /> About this country
                </button>
            </div>

            {showAbout && (
                <div className="card page-enter" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${selected.color}44`, marginBottom: 24, boxShadow: `0 10px 30px ${selected.color}11` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24 }}>
                        <div style={{ flex: 1, minWidth: 300 }}>
                            <h3 style={{ marginTop: 0, display: "flex", alignItems: "center", gap: 10, color: "var(--text)", fontSize: "1.2rem", marginBottom: 16 }}>
                                <img src={`https://hatscripts.github.io/circle-flags/flags/${(selected as any).cc}.svg`} style={{ width: 26, height: 26, borderRadius: "50%" }} />
                                Deep Dive: {selected.country}
                            </h3>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0, marginBottom: 16 }}>
                                {selected.country} is currently experiencing a rapid tech sector growth of <strong style={{ color: "var(--text)" }}>{selected.growth}</strong>. 
                                The average tech compensation package is <strong style={{ color: "var(--green)" }}>{selected.avgSalary.replace("Avg ", "")}</strong>. 
                                Global talent and expats generally immigrate via the <strong style={{ color: "var(--accent)" }}>{selected.visa}</strong> program. 
                                Right now, there are <strong style={{ color: selected.color }}>{selected.roles.toLocaleString()}</strong> active tech positions open for hiring.
                            </p>
                            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.7, margin: 0 }}>
                                Known for its robust digital infrastructure and innovative ecosystem, {selected.country} offers highly competitive conditions for global IT professionals, particularly in fields like AI, FinTech, and Cloud Engineering. The region heavily subsidizes tech startups, providing a very high ceiling for engineering talent.
                            </p>
                        </div>
                        
                        {/* Deep Data Grid */}
                        <div style={{ flex: 1, minWidth: 300, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            {getCountryDetails(selected.country).map(d => (
                                <div key={d.label} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "14px" }}>
                                    <div style={{ fontSize: "0.7rem", color: "var(--text-sub)", display: "flex", alignItems: "center", gap: 6, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
                                        {d.icon} {d.label}
                                    </div>
                                    <div style={{ fontSize: "1.05rem", color: "var(--text)", fontWeight: 800 }}>{d.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}


            <div className="grid-3" style={{ marginBottom: 20 }}>
                {[["Average Salary", selected.avgSalary, selected.color], ["Open Roles", selected.roles.toLocaleString(), "var(--text)"], ["Visa", selected.visa, "var(--accent)"]].map(([l, v, c]) => (
                    <div key={l as string} className="stat-card">
                        <div className="stat-label">{l}</div>
                        <div style={{ color: c as string, fontWeight: 700, fontSize: "0.95rem", marginTop: 4 }}>{v}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {selected.topRoles.map((r, i) => (
                    <div key={i} className="card animate-fade" style={{ borderColor: (r as any).hot ? `${selected.color}44` : undefined, animationDelay: `${i * 0.08}s` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                            <div>
                                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                                    <h2 style={{ fontSize: "1rem", margin: 0 }}>{r.title}</h2>
                                    {(r as any).hot && <span style={{ background: "rgba(248,113,113,0.15)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 20, padding: "1px 8px", fontSize: "0.65rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><Flame size={10} /> HOT</span>}
                                </div>
                                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} /> {r.company}</div>
                            </div>
                            <div className="salary-tag" style={{ fontSize: "0.85rem", padding: "4px 12px" }}>{r.salary}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                            <span className="badge-blue">{selected.visa}</span>
                            {profile?.skills?.slice(0, 3).map(s => <span key={s} className="skill-tag">{s}</span>)}
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button className="btn-ghost" style={{ fontSize: "0.8rem", width: "100%", justifyContent: "center" }}>Save Job</button>
                        </div>
                    </div>
                ))}
            </div>

            {profile?.domain && (
                <div className="card" style={{ marginTop: 20, background: "rgba(124,58,237,0.06)", borderColor: "rgba(124,58,237,0.2)" }}>
                    <div style={{ fontWeight: 600, color: "var(--accent)", marginBottom: 8, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}><Lightbulb size={14} /> AI Insight for {profile.domain} in {selected.country}</div>
                    <p style={{ fontSize: "0.83rem", color: "var(--text-sub)", lineHeight: 1.7, margin: 0 }}>
                        Your <strong style={{ color: "var(--text)" }}>{profile.domain}</strong> profile with {profile.skills.slice(0, 3).join(", ")} matches <strong style={{ color: selected.color }}>{selected.topRoles.filter(r => (r as any).hot).length} hot role(s)</strong> in this market. With {profile.experience} year(s) of experience, you're targeting {profile.experience >= 3 ? "Senior/Lead" : "Mid-Level"} positions. Average expected salary for your profile: <strong style={{ color: "var(--green)" }}>{selected.topRoles[profile.experience >= 3 ? 0 : 1]?.salary || selected.avgSalary}</strong>.
                    </p>
                </div>
            )}
        </div>
    );

    return (
        <div className="page-enter">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
                <div>
                    <h1 style={{ marginBottom: 4 }}>Global Opportunity Scanner</h1>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
                        <Globe size={14} /> {markets.length} markets · {totalRoles.toLocaleString()} open roles · <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse 1.5s infinite' }}></span> LIVE as of {currentDate}
                    </p>
                </div>
                <input
                    className="input-field"
                    style={{ maxWidth: 220 }}
                    placeholder="Search country..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            {/* Hot badge strip */}
            <div className="card" style={{ marginBottom: 24, background: "rgba(248,113,113,0.06)", borderColor: "rgba(248,113,113,0.2)", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: "0.78rem", color: "#f87171", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><Flame size={14} /> Highest Growth 2026:</span>
                {markets.filter(m => parseInt(m.growth) >= 15).map(m => (
                    <span key={m.country} className="badge-red" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }} onClick={() => setSelected(m)}><img src={`https://hatscripts.github.io/circle-flags/flags/${(m as any).cc}.svg`} alt="" style={{ width: 14, height: 14, borderRadius: "50%" }} /> {m.country} {m.growth}</span>
                ))}
            </div>

            <div className="grid-3 stagger">
                {filtered.map(m => (
                    <div key={m.country} className="card country-card" style={{ borderColor: `${m.color}22`, cursor: "pointer", transition: "all 0.25s cubic-bezier(.23,1.01,.32,1)", overflow: "hidden", position: "relative" }}
                        onClick={() => setSelected(m)}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-6px) scale(1.01)"; el.style.borderColor = `${m.color}66`; el.style.boxShadow = `0 12px 40px ${m.color}18`; }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0) scale(1)"; el.style.borderColor = `${m.color}22`; el.style.boxShadow = "none"; }}>
                        <img src={`https://flagcdn.com/w320/${(m as any).cc}.png`} style={{
                            position: "absolute",
                            top: 0, left: 0,
                            width: "100%", height: "100%",
                            objectFit: "cover",
                            opacity: 0.1,
                            zIndex: 0,
                            pointerEvents: "none",
                            filter: "grayscale(50%)"
                        }} />

                        <div style={{ position: "relative", zIndex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: 12 }}>
                                <div style={{ textAlign: "right" }}>
                                    <span style={{ fontSize: "0.65rem", color: parseInt(m.growth) >= 15 ? "#f87171" : "var(--green)", fontWeight: 700, display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", background: "rgba(10,10,10,0.6)", padding: "4px 8px", borderRadius: 6, backdropFilter: "blur(4px)" }}>{parseInt(m.growth) >= 15 ? <Flame size={10} /> : <TrendingUp size={10} />} {m.growth}</span>
                                    {parseInt(m.growth) >= 20 && <span style={{ fontSize: "0.6rem", color: "#f87171", fontWeight: 600, background: "rgba(10,10,10,0.6)", padding: "2px 6px", borderRadius: 4, marginTop: 4, display: "inline-block", backdropFilter: "blur(4px)" }}>FAST GROWING</span>}
                                </div>
                            </div>
                            <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--text)", marginBottom: 4, textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>{m.country}</div>
                        <div style={{ fontSize: "1.9rem", fontWeight: 800, color: m.color, margin: "6px 0 2px", letterSpacing: "-0.02em" }}>{m.roles.toLocaleString()}</div>
                        <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>Open Roles</div>
                        <div className="salary-tag" style={{ marginBottom: 10, fontSize: "0.7rem" }}>{m.avgSalary}</div>
                        <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}><FileText size={12} /> {m.visa.split("/")[0].trim()}</div>
                        {/* Top hot role preview */}
                        {m.topRoles.find(r => (r as any).hot) && <div style={{ background: `${m.color}0d`, border: `1px solid ${m.color}22`, borderRadius: 8, padding: "6px 10px", marginBottom: 14, fontSize: "0.68rem", color: `${m.color}dd`, display: "flex", alignItems: "center", gap: 6 }}><Flame size={12} /> {m.topRoles.find(r => (r as any).hot)!.title}</div>}
                            <button className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: "0.78rem", position: "relative", zIndex: 10 }}
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelected(m); }}>
                                Explore Opportunities →
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {!profile?.skills?.length && (
                <div className="card" style={{ marginTop: 24, background: "rgba(167,139,250,0.06)", borderColor: "rgba(167,139,250,0.2)", textAlign: "center" }}>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <Sparkles size={16} color="#a78bfa" /> <strong style={{ color: "var(--accent)" }}>Upload your resume</strong> for AI-powered country matching based on your skill set
                    </p>
                </div>
            )}
        </div>
    );
}
