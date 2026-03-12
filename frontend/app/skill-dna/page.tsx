const suggestions = [
    { name: "GraphQL", relation: "Extends REST API skills" },
    { name: "Vector DB (Pinecone)", relation: "Enables AI/ML features" },
    { name: "Redis", relation: "Pairs with PostgreSQL" },
    { name: "FastAPI", relation: "Python backend mastery" },
    { name: "Kubernetes", relation: "Beyond Docker basics" },
];

const nodes = [
    { name: "React.js", x: 50, y: 30, size: 52, color: "#61dafb", connected: ["TypeScript", "Node.js", "GraphQL"] },
    { name: "TypeScript", x: 25, y: 55, size: 46, color: "#3178c6", connected: ["React.js", "Node.js"] },
    { name: "Node.js", x: 72, y: 58, size: 44, color: "#68a063", connected: ["React.js", "PostgreSQL"] },
    { name: "Python", x: 15, y: 25, size: 38, color: "#ffd43b", connected: ["FastAPI", "ML"] },
    { name: "PostgreSQL", x: 80, y: 30, size: 36, color: "#336791", connected: ["Node.js"] },
    { name: "Docker", x: 40, y: 75, size: 34, color: "#2496ed", connected: [] },
    { name: "SQL", x: 60, y: 80, size: 32, color: "#60a5fa", connected: ["PostgreSQL"] },
];

export default function SkillDNAPage() {
    return (
        <div>
            <h1 style={{ marginBottom: 4 }}>Skill DNA Graph</h1>
            <p style={{ color: "#6b7280", fontSize: "0.85rem", marginBottom: 24 }}>Visualize how your skills interconnect — discover core strengths and suggested branches.</p>

            <div className="card" style={{ marginBottom: 20, minHeight: 360, position: "relative", overflow: "hidden" }}>
                <p style={{ fontSize: "0.78rem", color: "#6b7280", marginBottom: 16 }}>Click any node in the graph to see skill details and connections.</p>
                {/* SVG skill graph */}
                <svg width="100%" height="320" viewBox="0 0 500 280" style={{ display: "block" }}>
                    {/* Connections */}
                    <line x1="250" y1="84" x2="125" y2="154" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                    <line x1="250" y1="84" x2="360" y2="162" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                    <line x1="125" y1="154" x2="360" y2="162" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
                    <line x1="75" y1="70" x2="125" y2="154" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                    <line x1="360" y1="162" x2="400" y2="84" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                    <line x1="200" y1="210" x2="300" y2="224" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
                    {/* Nodes */}
                    {nodes.map(n => (
                        <g key={n.name} style={{ cursor: "pointer" }}>
                            <circle cx={n.x * 5} cy={n.y * 2.8} r={n.size / 2} fill={`${n.color}22`} stroke={n.color} strokeWidth="1.5" />
                            <text x={n.x * 5} y={n.y * 2.8 + 1} textAnchor="middle" dominantBaseline="middle" fill={n.color} fontSize="9" fontWeight="600">{n.name}</text>
                        </g>
                    ))}
                </svg>
            </div>

            <div className="card">
                <h3>Top Skill Suggestions</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {suggestions.map((s, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#a78bfa", flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: "0.83rem", color: "#e2e8f0" }}>{s.name}</div>
                                <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>{s.relation}</div>
                            </div>
                            <button className="btn-ghost" style={{ padding: "5px 12px", fontSize: "0.75rem" }}>+ Add</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}



