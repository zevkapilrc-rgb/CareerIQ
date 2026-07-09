/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Info, BrainCircuit, Zap, Target, TrendingUp, Shield, RefreshCw, Trash2, Plus } from "lucide-react";
import { useAppStore } from "@/src/state/useAppStore";
import ResumeGate from "@/src/components/ResumeGate";
import GlassCard from "@/src/components/ui/GlassCard";
import KPICard from "@/src/components/ui/KPICard";
import Badge from "@/src/components/ui/Badge";
import PremiumButton from "@/src/components/ui/PremiumButton";
import AnimatedCounter from "@/src/components/ui/AnimatedCounter";
import { PremiumLoader } from "@/src/components/ui/PremiumLoader";

// ── Fallback skill relationship mapping ─────────────────────────
const STATIC_SKILL_RELATIONS: Record<string, string[]> = {
    "React": ["TypeScript", "Next.js", "HTML/CSS", "Node.js", "JavaScript"],
    "Node.js": ["React", "TypeScript", "MongoDB", "REST API", "JavaScript"],
    "TypeScript": ["React", "Node.js", "Next.js", "JavaScript"],
    "JavaScript": ["React", "TypeScript", "Node.js", "HTML/CSS"],
    "Python": ["Machine Learning", "TensorFlow", "Data Analysis", "Django", "FastAPI"],
    "MongoDB": ["Node.js", "REST API", "PostgreSQL"],
    "PostgreSQL": ["SQL", "Node.js", "MongoDB", "Data Analysis"],
    "SQL": ["PostgreSQL", "MongoDB", "Data Analysis"],
    "Docker": ["Kubernetes", "AWS", "CI/CD", "Linux"],
    "AWS": ["Docker", "Kubernetes", "CI/CD", "Cloud"],
    "Git": ["CI/CD", "GitHub Actions"],
    "HTML/CSS": ["React", "JavaScript", "TypeScript"],
    "REST API": ["Node.js", "MongoDB", "GraphQL"],
    "GraphQL": ["REST API", "Node.js", "React"],
    "Redis": ["Node.js", "PostgreSQL", "MongoDB"],
    "Kubernetes": ["Docker", "AWS", "CI/CD"],
    "CI/CD": ["Docker", "Git", "AWS", "Kubernetes"],
    "TensorFlow": ["Python", "Machine Learning", "Deep Learning"],
    "PyTorch": ["Python", "Machine Learning", "Deep Learning"],
    "Machine Learning": ["Python", "TensorFlow", "Data Analysis"],
    "Deep Learning": ["TensorFlow", "PyTorch", "Machine Learning"],
    "Data Analysis": ["Python", "SQL", "PostgreSQL"],
    "Linux": ["Docker", "AWS", "CI/CD"],
    "Next.js": ["React", "TypeScript", "Node.js"],
    "Spring Boot": ["Java", "Microservices", "REST API"],
    "Java": ["Spring Boot", "Microservices"],
    "Microservices": ["Docker", "Kubernetes", "REST API", "Spring Boot"],
    "Flutter": ["React Native", "Firebase"],
    "React Native": ["React", "Flutter", "JavaScript"],
    "Firebase": ["React", "Flutter", "MongoDB"],
    "System Design": ["Microservices", "AWS", "Database"],
    "Agile": ["Git", "CI/CD"],
    "C++": ["C#", "System Design"],
    "C#": ["C++", ".NET"],
};

const COLORS = ["#6D001A", "#FFFFFF", "#C0506A", "#71717A", "#FFFFFF", "#52525B", "#3F3F46", "#8B0025", "#FFFFFF", "#78716C"];

function getNodeColor(index: number): string {
    return COLORS[index % COLORS.length];
}

// ── Build graph from resume skills and dynamic relations ────────
function buildGraph(skills: string[], dynamicRelations?: Record<string, string[]>, descriptions?: Record<string, string>, layoutType: "orbit" | "grid" | "circle" = "orbit") {
    const nodeMap = new Map<string, { id: string; name: string; x: number; y: number; size: number; color: string; connections: string[]; desc: string; level: number }>();
    const relations = dynamicRelations || STATIC_SKILL_RELATIONS;

    // Place core skills from resume
    skills.forEach((skill, i) => {
        let x = 50;
        let y = 50;
        if (layoutType === "circle") {
            const angle = (i / skills.length) * 2 * Math.PI - Math.PI / 2;
            const radius = 32;
            x = 50 + radius * Math.cos(angle);
            y = 50 + radius * Math.sin(angle);
        } else if (layoutType === "orbit") {
            // Concentric circles
            let radius = 20;
            let indexInOrbit = i;
            let totalInOrbit = skills.length;
            if (skills.length > 5) {
                if (i < 3) {
                    radius = 16;
                    indexInOrbit = i;
                    totalInOrbit = 3;
                } else if (i < 8) {
                    radius = 30;
                    indexInOrbit = i - 3;
                    totalInOrbit = 5;
                } else {
                    radius = 42;
                    indexInOrbit = i - 8;
                    totalInOrbit = skills.length - 8;
                }
            }
            const angle = (indexInOrbit / totalInOrbit) * 2 * Math.PI - Math.PI / 2;
            x = 50 + radius * Math.cos(angle);
            y = 50 + radius * Math.sin(angle);
        } else {
            // Grid layout
            const cols = Math.ceil(Math.sqrt(skills.length || 1));
            const rows = Math.ceil(skills.length / cols);
            const colWidth = cols > 1 ? 70 / (cols - 1) : 0;
            const rowHeight = rows > 1 ? 70 / (rows - 1) : 0;
            x = 15 + (i % cols) * colWidth;
            y = 15 + Math.floor(i / cols) * rowHeight;
        }

        nodeMap.set(skill, {
            id: skill.toLowerCase().replace(/[^a-z0-9]/g, ""),
            name: skill,
            x: Math.max(10, Math.min(90, x)),
            y: Math.max(10, Math.min(90, y)),
            size: Math.max(25, 52 - i * 2),
            color: getNodeColor(i),
            connections: [],
            desc: descriptions?.[skill] || "Simulated Skill Node",
            level: 3
        });
    });

    // Build connections
    skills.forEach(skill => {
        const related = relations[skill] || [];
        const node = nodeMap.get(skill);
        if (!node) return;
        related.forEach(rel => {
            const match = skills.find(s => s.toLowerCase() === rel.toLowerCase());
            if (match && !node.connections.includes(match)) {
                node.connections.push(match);
            }
        });
    });

    const nodes = Array.from(nodeMap.values());

    // Build links
    const links: { source: string; target: string; x1: number; y1: number; x2: number; y2: number; color: string; weight: number }[] = [];
    nodes.forEach(n => {
        n.connections.forEach(targetName => {
            const target = nodes.find(t => t.name === targetName);
            if (target && !links.some(l => (l.source === n.name && l.target === targetName) || (l.source === targetName && l.target === n.name))) {
                const sharedCount = n.connections.filter(c => target.connections.includes(c)).length;
                const weight = Math.max(1, 1 + sharedCount);
                links.push({ source: n.name, target: targetName, x1: n.x, y1: n.y, x2: target.x, y2: target.y, color: n.color, weight });
            }
        });
    });

    return { nodes, links };
}

// ── Seed calculation fallback ───────────────────────────────────
function computeMetricsFallback(skills: string[], experience: number) {
    const today = new Date();
    const seed = today.getDate() + today.getMonth() * 31 + today.getFullYear() * 365;
    const offset1 = (seed % 7) - 3;
    const offset2 = ((seed >> 2) % 9) - 4;
    const offset3 = ((seed >> 3) % 5) - 2;
    const offset4 = ((seed >> 4) % 7) - 3;

    const totalConnections = skills.reduce((acc, s) => acc + (STATIC_SKILL_RELATIONS[s] || []).filter(r => skills.includes(r)).length, 0);
    const density = skills.length > 1 ? Math.max(0, Math.min(100, Math.round((totalConnections / (skills.length * (skills.length - 1))) * 100) + offset1)) : 0;
    const versatility = Math.max(10, Math.min(98, 40 + skills.length * 5 + experience * 4 + offset2));
    const depthScore = Math.max(10, Math.min(95, 35 + skills.length * 4 + experience * 6 + offset3));
    const breadthScore = Math.max(10, Math.min(92, 30 + skills.length * 6 + offset4));
    
    return {
        metrics: { density, versatility, depthScore, breadthScore },
        skillRelations: STATIC_SKILL_RELATIONS,
        suggestions: [
            { name: "Rust", relation: "Emerging systems programming standard with low memory footprint", priority: "high" as const },
            { name: "Vector Databases", relation: "Critical for modern LLM and RAG integrations", priority: "medium" as const },
            { name: "System Design", relation: "Essential for scaling services and application deployment", priority: "low" as const }
        ],
        skillDescriptions: {}
    };
}

export default function SkillDNAPage() {
    const { profile } = useAppStore();
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [lockedNode, setLockedNode] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [dnaData, setDnaData] = useState<any>(null);
    const [layoutType, setLayoutType] = useState<"orbit" | "grid" | "circle">("orbit");

    // Sandbox Local Skills Mutation State
    const [localSkills, setLocalSkills] = useState<string[]>([]);
    const [mutationInput, setMutationInput] = useState("");

    // Synergy States
    const [synergySource, setSynergySource] = useState("");
    const [synergyTarget, setSynergyTarget] = useState("");
    const [synergyResult, setSynergyResult] = useState<any>(null);

    const experience = profile?.experience || 0;
    const domain = profile?.domain || "Engineering";

    useEffect(() => {
        if (profile?.skills) {
            setLocalSkills(profile.skills);
        }
    }, [profile?.skills]);

    useEffect(() => {
        if (typeof window !== "undefined" && profile?.skills) {
            const cacheKey = `ciq-gemini-skill-dna-${profile?.name || "guest"}`;
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    if (parsed && typeof parsed === "object" && parsed.timestamp && Date.now() - parsed.timestamp < 60000) {
                        setDnaData(parsed.data);
                    } else {
                        fetchLiveDna();
                    }
                } catch {
                    fetchLiveDna();
                }
            } else if (profile.skills.length > 0) {
                fetchLiveDna();
            }
        }
    }, [profile?.name, profile?.skills?.length]);

    const fetchLiveDna = async () => {
        if (!profile?.skills || profile.skills.length === 0) return;
        setLoading(true);
        try {
            const res = await fetch("/api/skill-dna/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ skills: profile.skills, experience, domain }),
            });
            const result = await res.json();
            if (result.success && result.data) {
                setDnaData(result.data);
                const cacheKey = `ciq-gemini-skill-dna-${profile?.name || "guest"}`;
                localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: result.data }));
            } else {
                throw new Error(result.error || "Failed payload extraction");
            }
        } catch (err) {
            console.error("Failed to load Gemini analysis. Falling back to local data.", err);
            const fallback = computeMetricsFallback(profile.skills, experience);
            setDnaData(fallback);
        } finally {
            setLoading(false);
        }
    };

    const handleInjectMutation = () => {
        if (!mutationInput) return;
        const normalized = mutationInput.trim();
        const exists = localSkills.some(s => s.toLowerCase() === normalized.toLowerCase());
        if (exists) return;
        setLocalSkills([...localSkills, normalized]);
        setMutationInput("");
    };

    const handlePruneNode = (skillName: string) => {
        setLocalSkills(localSkills.filter(s => s !== skillName));
        if (lockedNode === skillName) setLockedNode(null);
        if (hoveredNode === skillName) setHoveredNode(null);
    };

    const calculateSynergy = () => {
        if (!synergySource || !synergyTarget) return;
        if (synergySource === synergyTarget) {
            setSynergyResult({ compatibility: 100, bridge: "Self-explanatory alignment", desc: "These are the same skill node. Internal cohesion is absolute." });
            return;
        }

        let compatibility = 45;
        let bridge = "API Connectors / Standard Interfaces";
        let desc = "Common design practices apply. Connect components via standard REST architectures or utility modules.";

        const key = `${synergySource.toLowerCase()}+${synergyTarget.toLowerCase()}`;

        if (key.includes("react") && key.includes("typescript")) {
            compatibility = 98;
            bridge = "Strict TSX Generic Props";
            desc = "Absolute compiler-level coordination. Prevents UI state rendering exceptions at build-time.";
        } else if (key.includes("react") && key.includes("node.js")) {
            compatibility = 88;
            bridge = "Next.js Server Actions / API Handlers";
            desc = "Standard full-stack web paradigm. Allows seamless server-client state updates without custom boilerplate.";
        } else if (key.includes("python") && (key.includes("pytorch") || key.includes("tensorflow"))) {
            compatibility = 96;
            bridge = "Pybind11 bindings / CUDA acceleration";
            desc = "Standard AI/ML workspace configuration. Runs optimized C++ libraries via developer-friendly Python scripting.";
        } else if (key.includes("docker") && key.includes("kubernetes")) {
            compatibility = 95;
            bridge = "Helm Charts / Pod configs";
            desc = "Elite microservices pipeline. Orchestrates replication, scaling, and load-balancing of isolated container binaries.";
        } else {
            let combinedLength = synergySource.length + synergyTarget.length;
            compatibility = 40 + (combinedLength % 48);
            if (compatibility > 80) {
                bridge = "Advanced Integration Pipelines";
                desc = "High synergy. Deep overlap in system engineering allows high scalability when deployed in unison.";
            } else if (compatibility > 60) {
                bridge = "Standard Broker Layer (e.g. RabbitMQ, REST)";
                desc = "Moderate synergy. Requires standard middle-tier routing components to correctly translate state matrices.";
            } else {
                bridge = "Scripted bridges / Event webhooks";
                desc = "Divergent layers. Bridges must use loose integration endpoints, CLI task schedules, or basic file pipelines.";
            }
        }

        setSynergyResult({ compatibility, bridge, desc });
    };

    const parsedData = dnaData || computeMetricsFallback(profile?.skills || [], experience);
    const { nodes, links } = buildGraph(localSkills, parsedData.skillRelations, parsedData.skillDescriptions, layoutType);
    const suggestions = parsedData.suggestions || [];
    const totalConnections = links.length;

    const activeFocusNode = lockedNode || hoveredNode;

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
    };

    return (
        <ResumeGate pageName="Skill DNA" pageIcon={<Network size={64} />}>
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-[1280px] mx-auto pb-16 pt-2 relative animate-fade"
                onClick={() => setLockedNode(null)}
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 border-b border-white/[0.05] pb-6 mb-8 mt-2">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-[#C0506A] font-display">Competency Mapping</span>
                            <Badge label="Skill DNA Engine" variant="purple" size="sm" dot={true} />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-none font-display">
                            Skill DNA Explorer
                        </h1>
                        <p className="text-xs text-zinc-550 mt-2.5 leading-relaxed font-semibold">
                            {localSkills.length} active nodes · {totalConnections} relationships mapped · {domain} sector
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <PremiumButton
                            onClick={(e) => { e.stopPropagation(); fetchLiveDna(); }}
                            disabled={loading}
                        >
                            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                            Sync Gemini DNA
                        </PremiumButton>
                    </div>
                </div>

                <div className="relative">
                    <AnimatePresence>
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-50 bg-[#09090B]/90 backdrop-blur-md flex flex-col items-center justify-center rounded-2xl"
                            >
                                <PremiumLoader 
                                    message="Gemini AI is parsing core skills connections"
                                    submessage="Reconstructing taxonomy dependencies..."
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Metrics Cards Grid */}
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                    >
                        {[
                            { label: "Network Density", value: parsedData.metrics.density, suffix: "%", icon: Network, color: "#6D001A", highlighted: true },
                            { label: "Versatility Index", value: parsedData.metrics.versatility, suffix: "", icon: Zap, color: "#FFFFFF", highlighted: false },
                            { label: "Skill Depth", value: parsedData.metrics.depthScore, suffix: "", icon: Target, color: "#C0506A", highlighted: false },
                            { label: "Breadth Score", value: parsedData.metrics.breadthScore, suffix: "", icon: TrendingUp, color: "#6D001A", highlighted: false },
                        ].map((m, idx) => {
                            const Icon = m.icon;
                            return (
                                <KPICard
                                    key={idx}
                                    title={m.label}
                                    value={<AnimatedCounter value={m.value} suffix={m.suffix} />}
                                    icon={<Icon size={16} />}
                                    sparklineColor={m.color}
                                    sparklineData={idx % 2 === 0 ? [35, 45, 52, 48, 60, 68] : [55, 42, 60, 48, 70, 65]}
                                />
                            );
                        })}
                    </motion.div>

                    {/* SVG Map Canvas */}
                    <GlassCard className="p-0 border-white/[0.06] mb-8 min-h-[520px] relative overflow-hidden bg-[#0C0C0E]/45">
                        <style dangerouslySetInnerHTML={{ __html: `
                            @keyframes pulse-dash {
                                to {
                                    stroke-dashoffset: -20;
                                }
                            }
                        ` }} />

                        <div className="absolute top-5 left-6 flex items-center gap-2 z-10">
                            <BrainCircuit size={16} className="text-[#C0506A]" />
                            <span className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase font-display">
                                {lockedNode ? `LOCKED: ${lockedNode.toUpperCase()} FOCUS` : `INTERACTIVE SKILL MAP — ${localSkills.length} NODES`}
                            </span>
                        </div>

                        <div className="absolute top-5 right-6 flex gap-2 z-10 text-[9px] text-zinc-500 font-bold uppercase tracking-widest items-center font-display">
                            <span className="mr-1 text-zinc-600">Layout:</span>
                            {(["orbit", "circle", "grid"] as const).map(l => (
                                <button
                                    key={l}
                                    onClick={(e) => { e.stopPropagation(); setLayoutType(l); }}
                                    className={`px-2.5 py-0.5 rounded border text-[9px] font-bold uppercase transition-all duration-200 outline-none ${layoutType === l ? "bg-[#6D001A] border-transparent text-white" : "bg-black/45 border-white/[0.05] text-zinc-500 hover:text-white"}`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                        
                        <svg width="100%" height="520" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="block">
                            <defs>
                                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                                {links.map((l, i) => (
                                    <linearGradient key={`grad-${i}`} id={`grad-${i}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} gradientUnits="userSpaceOnUse">
                                        <stop offset="0%" stopColor={l.color} stopOpacity={0.6} />
                                        <stop offset="100%" stopColor="#6D001A" stopOpacity={0.15} />
                                    </linearGradient>
                                ))}
                            </defs>

                            {/* Background Connections */}
                            {links.map((l, i) => {
                                const isFocused = activeFocusNode === l.source || activeFocusNode === l.target;
                                const isDimmed = activeFocusNode && !isFocused;
                                return (
                                    <motion.line 
                                        key={`line-${l.source}-${l.target}-${localSkills.length}`} 
                                        x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} 
                                        stroke={`url(#grad-${i})`} 
                                        strokeWidth={isFocused ? 1.0 + l.weight * 0.15 : 0.35 + l.weight * 0.08}
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: isDimmed ? 0.04 : 0.7 }}
                                        transition={{ duration: 0.8, ease: "easeInOut" }}
                                    />
                                );
                            })}

                            {/* Animated Pulse Link Layer */}
                            {links.map((l, i) => {
                                const isFocused = activeFocusNode === l.source || activeFocusNode === l.target;
                                const isDimmed = activeFocusNode && !isFocused;
                                return (
                                    <line 
                                        key={`pulse-${l.source}-${l.target}-${localSkills.length}`} 
                                        x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} 
                                        stroke={l.color} 
                                        strokeWidth={isFocused ? 0.6 : 0.3}
                                        strokeDasharray="4, 12"
                                        opacity={isDimmed ? 0.05 : 0.95}
                                        style={{
                                            animation: "pulse-dash 1.2s linear infinite",
                                            pointerEvents: "none"
                                        }}
                                    />
                                );
                            })}

                            {/* Nodes */}
                            {nodes.map((n, i) => {
                                const isHovered = activeFocusNode === n.name;
                                const isConnected = activeFocusNode && (n.connections.includes(activeFocusNode) || nodes.find(node => node.name === activeFocusNode)?.connections.includes(n.name));
                                const isDimmed = activeFocusNode && !isHovered && !isConnected;
                                
                                return (
                                    <g key={`node-${n.name}-${localSkills.length}`} 
                                       className="cursor-pointer transition-opacity duration-300"
                                       opacity={isDimmed ? 0.15 : 1}
                                       onMouseEnter={() => !lockedNode && setHoveredNode(n.name)}
                                       onMouseLeave={() => !lockedNode && setHoveredNode(null)}
                                       onClick={(e) => {
                                           e.stopPropagation();
                                           setLockedNode(lockedNode === n.name ? null : n.name);
                                           setHoveredNode(null);
                                       }}
                                    >
                                        {/* Pulsing Outer Aura Halo */}
                                        <motion.circle 
                                            cx={n.x} cy={n.y} r={n.size / 10} 
                                            fill="none" stroke={n.color} strokeWidth={0.12}
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: isHovered ? 1.7 : 1.25, opacity: isHovered ? 0.5 : 0.12 }}
                                            transition={{ duration: 1.8, repeat: Infinity, repeatType: "reverse" }}
                                        />
                                        
                                        {/* Core Node */}
                                        <motion.circle 
                                            cx={n.x} cy={n.y} r={n.size / 17} 
                                            fill={lockedNode === n.name ? "#ffffff" : isHovered ? n.color : `${n.color}25`} 
                                            stroke={lockedNode === n.name || isHovered ? "#ffffff" : n.color} 
                                            strokeWidth={isHovered ? 0.75 : 0.35}
                                            filter={isHovered ? "url(#glow)" : undefined}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 150, damping: 14 }}
                                        />

                                        {/* Label Pill */}
                                        <rect 
                                            x={n.x - (n.name.length * 1.05)} 
                                            y={n.y + (n.size/17) + 1.2} 
                                            width={n.name.length * 2.1} 
                                            height="3.6" 
                                            fill="#121214" 
                                            stroke={isHovered ? "#ffffff" : "rgba(109, 0, 26, 0.2)"}
                                            strokeWidth={0.12}
                                            rx="1.5" 
                                        />
                                        <text 
                                            x={n.x} 
                                            y={n.y + (n.size/17) + 3.8} 
                                            textAnchor="middle" 
                                            fill={isHovered ? "#ffffff" : "#F4F4F5"} 
                                            fontSize="2.1" 
                                            fontWeight="600" 
                                            style={{ pointerEvents: "none", fontFamily: "'Inter', sans-serif" }}
                                        >
                                            {n.name}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>

                        {/* Focus Tooltip Detail Panel */}
                        <AnimatePresence>
                            {activeFocusNode && (() => {
                                const node = nodes.find(n => n.name === activeFocusNode);
                                if (!node) return null;
                                const allConnections = [
                                    ...node.connections,
                                    ...nodes.filter(n => n.connections.includes(activeFocusNode)).map(n => n.name)
                                ].filter((v, i, a) => a.indexOf(v) === i);
                                
                                return (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 6 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute bottom-5 left-5 right-5 bg-[#09090B]/90 backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-2xl z-12 animate-enter"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div style={{ background: `${node.color}15`, borderColor: `${node.color}35` }} className="w-10 h-10 rounded-xl flex items-center justify-center border">
                                                <BrainCircuit size={20} style={{ color: node.color }} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <div className="text-sm font-bold text-white font-display uppercase tracking-wider">{node.name}</div>
                                                    {lockedNode === node.name && (
                                                        <Badge label="LOCKED" variant="red" size="sm" />
                                                    )}
                                                </div>
                                                <div className="text-xs text-zinc-400 mt-1 font-semibold">{node.desc}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 flex-wrap">
                                            <div className="flex flex-col items-start sm:items-end gap-1.5">
                                                <div className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest font-display">Connected Nodes</div>
                                                <div className="flex gap-1.5 flex-wrap">
                                                    {allConnections.slice(0, 4).map(c => (
                                                        <span key={c} className="bg-[#6D001A]/10 border border-[#6D001A]/20 rounded-lg px-2.5 py-0.5 text-xs text-zinc-350 font-bold font-mono">
                                                            {c}
                                                        </span>
                                                    ))}
                                                    {allConnections.length === 0 && <span className="text-xs text-zinc-500 font-semibold">No connections</span>}
                                                    {allConnections.length > 4 && <span className="text-[10px] text-zinc-500 font-bold self-center font-mono">+{allConnections.length - 4}</span>}
                                                </div>
                                            </div>
                                            <PremiumButton 
                                                onClick={() => handlePruneNode(node.name)}
                                                variant="secondary" 
                                                className="text-red-400 border-red-950 hover:bg-red-950/20 hover:text-red-300 h-9"
                                            >
                                                <Trash2 size={13} />
                                                Prune Node
                                            </PremiumButton>
                                        </div>
                                    </motion.div>
                                );
                            })()}
                        </AnimatePresence>
                    </GlassCard>

                    {/* DNA Mutation & Synergy Analyzer Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Local DNA Mutation Controller */}
                        <GlassCard className="p-6 border-[#6D001A]/30 bg-[#6D001A]/5">
                            <div className="flex items-center gap-2 mb-4">
                                <Plus size={18} className="text-[#C0506A]" />
                                <h3 className="text-xs font-bold text-white uppercase tracking-widest font-display">DNA Mutation Control Panel</h3>
                            </div>
                            <p className="text-xs text-zinc-450 mb-5 leading-relaxed font-semibold">
                                Inject a mock custom emerging skill into your workspace to automatically recalculate node coordinate distributions and trigger spatial SVG grid transitions.
                            </p>
                            <div className="flex gap-3">
                                <div className="flex-1 flex items-center bg-black/45 border border-white/[0.08] rounded-xl px-3.5 h-10 focus-within:border-[#6D001A]/60">
                                    <input 
                                        type="text"
                                        value={mutationInput}
                                        onChange={(e) => setMutationInput(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleInjectMutation()}
                                        placeholder="Inject node (e.g., Rust, PyTorch, LangChain)..."
                                        className="bg-transparent border-none text-white text-xs outline-none w-full font-semibold"
                                    />
                                </div>
                                <PremiumButton onClick={handleInjectMutation} className="text-xs flex items-center gap-1">
                                    Inject Node
                                </PremiumButton>
                            </div>
                            {/* Reset Local Mutation Cache */}
                            <div className="mt-5 pt-4 border-t border-white/[0.05] flex justify-between items-center text-[10px] text-zinc-550 font-bold uppercase tracking-wider font-display">
                                <span>Sandbox simulation state active.</span>
                                <button 
                                    onClick={() => profile?.skills && setLocalSkills(profile.skills)} 
                                    className="text-[#C0506A] font-bold hover:underline flex items-center gap-1 cursor-pointer outline-none"
                                >
                                    <RefreshCw size={10} /> Reset Coordinates
                                </button>
                            </div>
                        </GlassCard>

                        {/* Skill Synergy Analyzer */}
                        <GlassCard className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Zap size={18} className="text-[#C0506A]" />
                                <h3 className="text-xs font-bold text-white uppercase tracking-widest font-display">Skill Synergy Analyzer</h3>
                            </div>
                            <p className="text-xs text-zinc-450 mb-4 leading-relaxed font-semibold">
                                Select two mapping nodes within your skill clusters to calculate synergy compatibility index and suggest target bridge modules.
                            </p>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <select 
                                    value={synergySource}
                                    onChange={(e) => setSynergySource(e.target.value)}
                                    className="bg-black/45 border border-white/[0.08] rounded-xl p-2.5 text-xs text-zinc-300 focus:outline-none focus:border-[#6D001A]/60 font-semibold outline-none"
                                >
                                    <option value="" className="bg-[#09090B]">Select node A...</option>
                                    {localSkills.map(s => <option key={s} value={s} className="bg-[#09090B]">{s}</option>)}
                                </select>
                                <select 
                                    value={synergyTarget}
                                    onChange={(e) => setSynergyTarget(e.target.value)}
                                    className="bg-black/45 border border-white/[0.08] rounded-xl p-2.5 text-xs text-zinc-300 focus:outline-none focus:border-[#6D001A]/60 font-semibold outline-none"
                                >
                                    <option value="" className="bg-[#09090B]">Select node B...</option>
                                    {localSkills.map(s => <option key={s} value={s} className="bg-[#09090B]">{s}</option>)}
                                </select>
                            </div>
                            <PremiumButton 
                                onClick={calculateSynergy} 
                                disabled={!synergySource || !synergyTarget}
                                className="w-full text-xs h-10"
                            >
                                Calculate Synergy Compatibility
                            </PremiumButton>
                            
                            <AnimatePresence mode="wait">
                                {synergyResult && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="mt-4 p-4 bg-white/[0.005] border border-white/[0.05] rounded-xl flex gap-4 items-center justify-between font-sans"
                                    >
                                        <div className="flex-grow min-w-0">
                                            <div className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest font-display mb-1">Bridging Interface</div>
                                            <div className="text-xs font-bold text-white uppercase tracking-wider font-display">{synergyResult.bridge}</div>
                                            <p className="text-[11px] text-zinc-450 mt-1 leading-relaxed font-semibold">{synergyResult.desc}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest font-display mb-1">Index</div>
                                            <div className="text-xl font-bold font-mono text-[#C0506A]">{synergyResult.compatibility}%</div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </GlassCard>
                    </div>

                    {/* Skill Suggestions (Blueprint) */}
                    {suggestions.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4 }}
                            className="mb-8"
                        >
                            <GlassCard className="p-6 border-[#6D001A]/30">
                                <div className="flex items-center gap-2.5 mb-6 border-b border-white/[0.05] pb-4">
                                    <Shield size={18} className="text-[#C0506A]" />
                                    <h3 className="text-xs font-bold text-white uppercase tracking-widest font-display">AI-Powered Skill DNA Blueprint</h3>
                                    <span className="text-[9px] text-zinc-500 bg-white/[0.03] border border-white/[0.08] rounded-full px-2.5 py-0.5 font-bold uppercase tracking-widest ml-auto font-display">Gemini Insights</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {suggestions.map((s: any, i: number) => {
                                        const isHigh = s.priority === "high";
                                        const bgBdr = isHigh ? "bg-[#6D001A]/5 border-[#6D001A]/20" : "bg-black/45 border-white/[0.04]";
                                        return (
                                            <div 
                                                key={i}
                                                className={`flex items-start gap-3 p-4 rounded-xl border ${bgBdr} transition-all duration-300 hover:border-white/[0.1]`}
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 animate-pulse bg-[#C0506A]" />
                                                <div className="flex-grow">
                                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                                        <div className="font-bold text-xs text-white uppercase tracking-wider font-display">{s.name}</div>
                                                        <Badge label={s.priority} variant={isHigh ? "red" : "gray"} size="sm" />
                                                    </div>
                                                    <div className="text-[11px] text-zinc-450 leading-relaxed font-semibold">{s.relation}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {/* Detected Resume Gaps Card */}
                    {(() => {
                        const skillInt = profile?.resumeAnalysis?.skill_intelligence || profile?.resumeAnalysis?.skillIntelligence || {};
                        const weak = skillInt.weak_skills || profile?.resumeAnalysis?.weakSkills || [];
                        const missing = skillInt.missing_skills || profile?.resumeAnalysis?.missingSkills || [];
                        
                        if (weak.length === 0 && missing.length === 0) return null;

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4 }}
                                className="mb-8"
                            >
                                <GlassCard className="p-6 border-red-900/30 bg-red-950/5">
                                    <div className="flex items-center gap-2.5 mb-6 border-b border-red-900/10 pb-4">
                                        <Info size={18} className="text-red-400" />
                                        <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest font-display">AI Identified Gaps & Vulnerabilities</h3>
                                        <span className="text-[9px] text-red-405 bg-red-950/20 border border-red-900/30 rounded-full px-2.5 py-0.5 font-bold uppercase tracking-widest ml-auto font-display">Vulnerabilities Detected</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Weak Skills */}
                                        <div>
                                            <h4 className="text-[10px] font-bold text-zinc-350 uppercase tracking-widest mb-3 font-display">Weak Skills (Needs Upgrade)</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {weak.map((s: string, idx: number) => (
                                                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#6D001A]/10 text-[#C0506A] border border-[#6D001A]/20 rounded-lg text-xs font-bold uppercase tracking-wider font-display">
                                                        {s}
                                                    </span>
                                                ))}
                                                {weak.length === 0 && <span className="text-xs text-zinc-550 italic font-semibold">No weak skills flagged.</span>}
                                            </div>
                                        </div>
                                        {/* Missing Skills */}
                                        <div>
                                            <h4 className="text-[10px] font-bold text-zinc-350 uppercase tracking-widest mb-3 font-display">Missing Skills (Critical Gaps)</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {missing.map((s: string, idx: number) => (
                                                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/25 text-red-400 border border-red-900/30 rounded-lg text-xs font-bold uppercase tracking-wider font-display">
                                                        {s}
                                                    </span>
                                                ))}
                                                {missing.length === 0 && <span className="text-xs text-zinc-555 italic font-semibold">No missing skills flagged.</span>}
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        );
                    })()}

                    {/* Skill Clusters Grid */}
                    <GlassCard className="p-6">
                        <div className="flex items-center gap-2 mb-6 border-b border-white/[0.05] pb-4">
                            <Info size={18} className="text-[#C0506A]" />
                            <h3 className="text-xs font-bold text-white uppercase tracking-widest font-display">Dynamic Skill Cluster Breakdown</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {localSkills.map((skill, i) => {
                                const relMap = parsedData.skillRelations || STATIC_SKILL_RELATIONS;
                                const connections = (relMap[skill] || []).filter(r => localSkills.some(s => s.toLowerCase() === r.toLowerCase()));
                                return (
                                    <div 
                                        key={`${skill}-${i}`} 
                                        className="p-4 bg-black/45 border border-white/[0.05] rounded-xl transition-all duration-200 hover:border-white/[0.1] flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div style={{ background: getNodeColor(i) }} className="w-2 h-2 rounded-full" />
                                                <span className="font-bold text-xs text-white uppercase tracking-wider font-display truncate">{skill}</span>
                                            </div>
                                            <div className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest mb-3 font-mono">
                                                {connections.length} active links
                                            </div>
                                            <div className="flex flex-wrap gap-1.5 mb-4 font-mono">
                                                {connections.map(c => (
                                                    <span key={c} className="text-[9px] bg-[#6D001A]/10 border border-[#6D001A]/20 rounded-md px-2 py-0.5 text-zinc-300 font-bold uppercase tracking-widest">{c}</span>
                                                ))}
                                                {connections.length === 0 && <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest italic">Standalone node</span>}
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handlePruneNode(skill)}
                                            className="text-[9px] text-zinc-550 hover:text-red-400 font-bold uppercase tracking-widest border-t border-white/[0.04] pt-2.5 text-left w-full cursor-pointer flex items-center justify-between outline-none font-display"
                                        >
                                            <span>Remove Node</span>
                                            <Trash2 size={11} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </GlassCard>
                </div>
            </motion.div>
        </ResumeGate>
    );
}
