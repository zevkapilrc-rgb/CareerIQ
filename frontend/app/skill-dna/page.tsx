"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Plus, Info, BrainCircuit } from "lucide-react";

const suggestions = [
    { name: "GraphQL", relation: "Extends REST API skills" },
    { name: "Vector DB (Pinecone)", relation: "Enables AI/ML features" },
    { name: "Redis", relation: "Pairs with PostgreSQL" },
    { name: "FastAPI", relation: "Python backend mastery" },
    { name: "Kubernetes", relation: "Beyond Docker basics" },
];

const nodes = [
    { id: "react", name: "React.js", x: 50, y: 30, size: 56, color: "#61dafb", connections: ["ts", "node", "graphql"], desc: "Frontend Framework" },
    { id: "ts", name: "TypeScript", x: 25, y: 55, size: 48, color: "#3178c6", connections: ["react", "node"], desc: "Typed JavaScript" },
    { id: "node", name: "Node.js", x: 72, y: 58, size: 50, color: "#68a063", connections: ["react", "pg"], desc: "Backend Runtime" },
    { id: "py", name: "Python", x: 15, y: 25, size: 42, color: "#ffd43b", connections: ["fastapi", "ml"], desc: "Data & Scripts" },
    { id: "pg", name: "PostgreSQL", x: 80, y: 30, size: 40, color: "#336791", connections: ["node", "sql"], desc: "Relational DB" },
    { id: "docker", name: "Docker", x: 40, y: 75, size: 38, color: "#2496ed", connections: [], desc: "Containerization" },
    { id: "sql", name: "SQL", x: 60, y: 80, size: 36, color: "#60a5fa", connections: ["pg"], desc: "Database Query" },
];

// Map connections to line coordinates
const links: any[] = [];
nodes.forEach(n => {
    n.connections.forEach(targetId => {
        const target = nodes.find(t => t.id === targetId);
        if (target && !links.some(l => (l.source === n.id && l.target === targetId) || (l.source === targetId && l.target === n.id))) {
            links.push({ source: n.id, target: targetId, x1: n.x, y1: n.y, x2: target.x, y2: target.y, color: n.color });
        }
    });
});

export default function SkillDNAPage() {
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);

    return (
        <div className="page-enter" style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ padding: 10, background: "rgba(167,139,250,0.15)", borderRadius: 12, color: "#a78bfa" }}>
                    <Network size={28} />
                </div>
                <div>
                    <h1 style={{ marginBottom: 4 }}>Skill DNA Graph</h1>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse 1.5s infinite' }}></span>
                        <span>LIVE Network Sync · Visualize how your skills interconnect and discover core strengths.</span>
                    </div>
                </div>
            </div>

            <div className="card" style={{ 
                marginTop: 24, marginBottom: 24, minHeight: 460, position: "relative", overflow: "hidden",
                background: "radial-gradient(circle at center, rgba(30,30,40,0.6) 0%, rgba(10,10,15,0.8) 100%)",
                border: "1px solid rgba(255,255,255,0.05)", padding: 0
            }}>
                <div style={{ position: "absolute", top: 20, left: 24, display: "flex", alignItems: "center", gap: 8, zIndex: 10 }}>
                    <BrainCircuit size={16} color="#a78bfa" />
                    <span style={{ fontSize: "0.8rem", color: "var(--text-sub)", fontWeight: 600, letterSpacing: "0.05em" }}>INTERACTIVE SKILL MAP</span>
                </div>
                
                {/* SVG Graph Layer */}
                <svg width="100%" height="460" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ display: "block" }}>
                    {/* Define Gradients */}
                    <defs>
                        {links.map((l, i) => (
                            <linearGradient key={`grad-${i}`} id={`grad-${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor={l.color} stopOpacity={0.5} />
                                <stop offset="100%" stopColor="rgba(255,255,255,0.1)" stopOpacity={0.1} />
                            </linearGradient>
                        ))}
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Links */}
                    {links.map((l, i) => {
                        const isHovered = hoveredNode === l.source || hoveredNode === l.target;
                        const isDimmed = hoveredNode && !isHovered;
                        return (
                            <motion.line 
                                key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} 
                                stroke={`url(#grad-${i})`} 
                                strokeWidth={isHovered ? 0.8 : 0.4}
                                strokeDasharray="2 1"
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: isDimmed ? 0.1 : 1 }}
                                transition={{ duration: 1.5, delay: i * 0.1 }}
                            />
                        );
                    })}

                    {/* Nodes */}
                    {nodes.map((n, i) => {
                        const isHovered = hoveredNode === n.id;
                        const isDimmed = hoveredNode && !isHovered && !n.connections.includes(hoveredNode) && !nodes.find(node => node.id === hoveredNode)?.connections.includes(n.id);
                        
                        return (
                            <g key={n.id} 
                               style={{ cursor: "pointer", transition: "opacity 0.3s" }} 
                               opacity={isDimmed ? 0.2 : 1}
                               onMouseEnter={() => setHoveredNode(n.id)}
                               onMouseLeave={() => setHoveredNode(null)}
                            >
                                {/* Glowing outer ring */}
                                <motion.circle 
                                    cx={n.x} cy={n.y} r={n.size / 15} 
                                    fill="none" stroke={n.color} strokeWidth={0.2}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: isHovered ? 1.5 : 1.1, opacity: isHovered ? 0.4 : 0.1 }}
                                    transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                                />
                                {/* Main Node Circle */}
                                <motion.circle 
                                    cx={n.x} cy={n.y} r={n.size / 18} 
                                    fill={`${n.color}22`} stroke={n.color} strokeWidth={isHovered ? 0.8 : 0.4}
                                    filter="url(#glow)"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: i * 0.1 }}
                                />
                                {/* Label background for readability */}
                                <rect x={n.x - (n.name.length * 1.2)} y={n.y + (n.size/18) + 1} width={n.name.length * 2.4} height="3.5" fill="rgba(0,0,0,0.6)" rx="1.5" />
                                <text x={n.x} y={n.y + (n.size/18) + 3} textAnchor="middle" fill={isHovered ? "#fff" : n.color} fontSize="2.4" fontWeight="600" style={{ pointerEvents: "none", transition: "fill 0.3s" }}>
                                    {n.name}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* HTML Tooltip Overlay */}
                <AnimatePresence>
                    {hoveredNode && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            style={{ 
                                position: "absolute", bottom: 24, left: 24, right: 24, 
                                background: "rgba(15,15,20,0.85)", backdropFilter: "blur(12px)", 
                                border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, 
                                padding: "16px 20px", display: "flex", gap: 16, alignItems: "center",
                                boxShadow: "0 12px 40px rgba(0,0,0,0.5)"
                            }}
                        >
                            <div style={{ 
                                width: 48, height: 48, borderRadius: "50%", 
                                background: `${nodes.find(n => n.id === hoveredNode)?.color}22`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                border: `1px solid ${nodes.find(n => n.id === hoveredNode)?.color}55`
                            }}>
                                <BrainCircuit size={24} color={nodes.find(n => n.id === hoveredNode)?.color} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: 2 }}>{nodes.find(n => n.id === hoveredNode)?.name}</div>
                                <div style={{ fontSize: "0.85rem", color: "var(--text-sub)" }}>{nodes.find(n => n.id === hoveredNode)?.desc}</div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 4 }}>Connections</div>
                                <div style={{ display: "flex", gap: 6 }}>
                                    {nodes.find(n => n.id === hoveredNode)?.connections.map(c => (
                                        <span key={c} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "2px 8px", fontSize: "0.7rem", color: "var(--text)" }}>
                                            {nodes.find(t => t.id === c)?.name}
                                        </span>
                                    ))}
                                    {nodes.filter(n => n.connections.includes(hoveredNode)).map(n => (
                                        <span key={`rev-${n.id}`} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "2px 8px", fontSize: "0.7rem", color: "var(--text)" }}>
                                            {n.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="card">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <Info size={18} color="var(--accent)" />
                    <h3 style={{ margin: 0, fontSize: "1.05rem" }}>Top Skill Suggestions to Grow Your Node</h3>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
                    {suggestions.map((s, i) => (
                        <div key={i} style={{ 
                            display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", 
                            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", 
                            borderRadius: 12, transition: "background 0.2s" 
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(167,139,250,0.05)"}
                        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                        >
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#a78bfa", flexShrink: 0, boxShadow: "0 0 10px #a78bfa" }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#e2e8f0", marginBottom: 2 }}>{s.name}</div>
                                <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{s.relation}</div>
                            </div>
                            <button className="btn-ghost" style={{ padding: "6px 14px", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: 4 }}>
                                <Plus size={14} /> Add
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}



