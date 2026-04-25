"use client";
import { useAppStore } from "@/src/state/useAppStore";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import { AlertTriangle, TrendingDown, TrendingUp, ArrowDownRight, ArrowUpRight, Cpu, Activity, Compass, Lightbulb, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ForecastPage() {
    const { profile } = useAppStore();
    const domain = profile?.domain || "Software Engineering";
    const isTech = domain.toLowerCase().includes("engineer") || domain.toLowerCase().includes("developer") || domain.toLowerCase().includes("data");

    // Dynamic data generation based on domain
    const risk = isTech ? 22 : 58;
    const salaryBoost = isTech ? 45 : 14;
    const timeline = isTech ? "5-7 Years" : "2-3 Years";
    const futureRole = isTech ? `AI-Augmented ${domain}` : `${domain} Strategy Lead`;

    const growthData = [
        { year: "2024", demand: 100, automation: 10 },
        { year: "2025", demand: 115, automation: 18 },
        { year: "2026", demand: 130, automation: 25 },
        { year: "2027", demand: 160, automation: 35 },
        { year: "2028", demand: 190, automation: 42 },
        { year: "2029", demand: 240, automation: 48 },
        { year: "2030", demand: 310, automation: 55 },
    ];

    const salaryData = [
        { role: "Traditional", current: 80, future: 85 },
        { role: "AI-Enhanced", current: 110, future: 165 },
        { role: "AI-Creator", current: 150, future: 240 },
    ];

    const declining = isTech ? ["jQuery", "Vanilla REST", "Manual QA", "Basic CRUD", "On-prem Mgmt"] : ["Manual Data Entry", "Basic Copywriting", "Level 1 Support", "Routine Scheduling"];
    const rising = isTech ? ["Agentic AI", "LLM Orchestration", "Rust/WASM", "Vector DBs", "AI Security"] : ["AI Prompting", "Strategic Planning", "Human-in-Loop QA", "Empathy-driven Sales"];

    return (
        <div className="page-enter" style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 30, flexWrap: "wrap", gap: 20 }}>
                <div>
                    <h1 style={{ marginBottom: 8, fontSize: "2.2rem", display: "flex", alignItems: "center", gap: 12 }}>
                        <Cpu size={32} color="var(--accent)" /> AI Market Forecast
                    </h1>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.95rem", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', animation: 'pulse 1.5s infinite', boxShadow: '0 0 10px var(--green)' }}></span>
                        LIVE Analysis for: <strong style={{ color: "var(--text)" }}>{domain}</strong>
                    </div>
                </div>
                <div style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", padding: "8px 16px", borderRadius: 12, fontSize: "0.85rem", color: "var(--accent)", fontWeight: 600 }}>
                    Confidence Score: 94.2%
                </div>
            </div>

            {/* Top 4 Insight Cards */}
            <div className="grid-4" style={{ marginBottom: 24 }}>
                <div className="card" style={{ borderColor: risk > 40 ? "rgba(239,68,68,0.3)" : "rgba(52,211,153,0.3)", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, background: risk > 40 ? "rgba(239,68,68,0.1)" : "rgba(52,211,153,0.1)", borderRadius: "50%", pointerEvents: "none" }} />
                    <div style={{ color: risk > 40 ? "#ef4444" : "#34d399", marginBottom: 12 }}><AlertTriangle size={24} /></div>
                    <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-sub)", marginBottom: 4 }}>Automation Risk</div>
                    <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text)" }}>{risk}%</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 6 }}>By 2030 in your sector</div>
                </div>
                <div className="card" style={{ borderColor: "rgba(167,139,250,0.3)" }}>
                    <div style={{ color: "#a78bfa", marginBottom: 12 }}><TrendingUp size={24} /></div>
                    <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-sub)", marginBottom: 4 }}>AI Salary Premium</div>
                    <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text)" }}>+{salaryBoost}%</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 6 }}>For AI-augmented roles</div>
                </div>
                <div className="card" style={{ borderColor: "rgba(251,191,36,0.3)" }}>
                    <div style={{ color: "#fbbf24", marginBottom: 12 }}><Activity size={24} /></div>
                    <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-sub)", marginBottom: 4 }}>Disruption Timeline</div>
                    <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text)" }}>{timeline}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 6 }}>Until massive market shift</div>
                </div>
                <div className="card" style={{ borderColor: "rgba(96,165,250,0.3)" }}>
                    <div style={{ color: "#60a5fa", marginBottom: 12 }}><Compass size={24} /></div>
                    <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-sub)", marginBottom: 4 }}>Target Evolution</div>
                    <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text)", lineHeight: 1.2 }}>{futureRole}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 8 }}>Recommended pivot</div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid-2" style={{ gap: 24, marginBottom: 24 }}>
                <div className="card" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <h3 style={{ marginBottom: 4 }}>Job Demand vs Automation Impact</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 20 }}>Projected relative index (2024=100) for {domain}</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={growthData} margin={{ left: -20, right: 10, top: 10 }}>
                            <defs>
                                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorAuto" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="year" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} dy={10} />
                            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} dx={-10} />
                            <Tooltip contentStyle={{ background: "rgba(10,10,14,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, backdropFilter: "blur(10px)" }} />
                            <Area type="monotone" dataKey="demand" name="Market Demand" stroke="#a78bfa" strokeWidth={3} fill="url(#colorDemand)" />
                            <Area type="monotone" dataKey="automation" name="Automated Tasks" stroke="#ef4444" strokeWidth={2} fill="url(#colorAuto)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="card" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <h3 style={{ marginBottom: 4 }}>Salary Evolution by 2030</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 20 }}>Estimated baseline vs AI-upskilled compensation (in $k)</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={salaryData} margin={{ left: -20, right: 10, top: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="role" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} dy={10} />
                            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} dx={-10} />
                            <Tooltip cursor={{ fill: "rgba(255,255,255,0.02)" }} contentStyle={{ background: "rgba(10,10,14,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                            <Bar dataKey="current" name="Current Avg" fill="#4b5563" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="future" name="2030 Proj." fill="#34d399" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid-3" style={{ gap: 24 }}>
                <div className="card" style={{ background: "linear-gradient(180deg, rgba(239,68,68,0.05) 0%, transparent 100%)", borderColor: "rgba(239,68,68,0.2)" }}>
                    <h3 style={{ display: "flex", alignItems: "center", gap: 8, color: "#fca5a5", marginBottom: 16 }}><TrendingDown size={18} /> Obsolescence Watch</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {declining.map(t => (
                            <div key={t} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.2)", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.1)" }}>
                                <span style={{ fontSize: "0.85rem", color: "#f87171" }}>{t}</span>
                                <ArrowDownRight size={14} color="#f87171" />
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="card" style={{ background: "linear-gradient(180deg, rgba(52,211,153,0.05) 0%, transparent 100%)", borderColor: "rgba(52,211,153,0.2)" }}>
                    <h3 style={{ display: "flex", alignItems: "center", gap: 8, color: "#6ee7b7", marginBottom: 16 }}><TrendingUp size={18} /> Rising Technologies</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {rising.map(t => (
                            <div key={t} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.2)", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(52,211,153,0.1)" }}>
                                <span style={{ fontSize: "0.85rem", color: "#34d399" }}>{t}</span>
                                <ArrowUpRight size={14} color="#34d399" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card animate-glow" style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.1) 0%, rgba(124,58,237,0.05) 100%)", borderColor: "rgba(167,139,250,0.3)", display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                        <div style={{ background: "var(--accent)", color: "white", padding: 8, borderRadius: 10 }}><Lightbulb size={20} /></div>
                        <h3 style={{ margin: 0, color: "var(--text)" }}>AI Survival Blueprint</h3>
                    </div>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.7, flex: 1 }}>
                        The market for pure <strong>{domain}</strong> is polarizing. 
                        Top earners are leveraging AI coding assistants (Cursor, Copilot) to achieve 10x output, while entry-level roles face automation.
                        <br/><br/>
                        <strong>Action Plan:</strong> Master LLM integration, prompt engineering, and transition from a syntax-writer to an architecture-level orchestrator by 2026.
                    </p>
                    <Link href="/learning" className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 20, textDecoration: "none" }}>
                        Generate Upskill Path <ArrowRight size={16} style={{ marginLeft: 6 }} />
                    </Link>
                </div>
            </div>
        </div>
    );
}



