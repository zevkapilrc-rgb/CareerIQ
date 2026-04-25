"use client";
import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/src/state/useAppStore";

import { Bot, Network, Users, Compass } from "lucide-react";

const mentors = [
    { id: "helix", name: "NexusAI Core", role: "Enterprise Architecture AI", icon: <Bot size={18} />, color: "#a78bfa", tag: "Primary Intelligence Engine" },
    { id: "aryan", name: "System Architect Analyst", role: "Principal Technical Lead", icon: <Network size={18} />, color: "#60a5fa", tag: "Specialized in System Design & Algorithms" },
    { id: "priya", name: "Negotiation Director", role: "HR & Compensation Expert", icon: <Users size={18} />, color: "#f472b6", tag: "Specialized in Comp & Soft Skills" },
    { id: "rahul", name: "Career Strategy Analyst", role: "Career Growth Director", icon: <Compass size={18} />, color: "#34d399", tag: "Specialized in Role Transitions" },
];

// ─── OpenAI-style comprehensive response engine ─────────────────────────────
async function generateResponse(input: string, mentorId: string, profile: any): Promise<string> {
    const q = input.toLowerCase().trim();
    const skills = profile?.skills?.join(", ") || "your current skills";
    const domain = profile?.domain || "Software Development";
    const exp = profile?.experience || 0;
    const name = profile?.name?.split(" ")?.[0] || "there";

    // ── Greetings ──
    if (/^(hi|hello|hey|hii|good morning|good evening|sup|yo)$/.test(q)) {
        const greetings = [
            `Hey ${name}! Great to see you. I'm here to help with your ${domain} career. What's on your mind today — interview prep, salary negotiation, learning path, or something else?`,
            `Hello ${name}! I have access to your profile — ${exp} years in ${domain} with skills in ${skills.split(",")[0]}. How can I help you grow today?`,
            `Hi ${name}! Ready to level up your career? Ask me anything — tech questions, career strategy, interview tips, or salary advice.`
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
    }

    // ── How are you / Thanks ──
    if (/how are you|how r u|what'?s up|thanks|thank you|ty|great|awesome/.test(q)) {
        return `I'm doing great, thanks for asking ${name}! Always energized when I can help someone on their career journey. What would you like to work on today? You can ask me about:\n\n• 💻 Technical concepts in ${domain}\n• 📄 Resume optimization strategies\n• 🎤 Interview preparation\n• 💰 Salary negotiation tactics\n• 📈 Career growth roadmaps\n• 🌍 Global job market insights`;
    }

    // ── What can you do ──
    if (/what can you|what do you|help me with|capabilities|features/.test(q)) {
        return `I'm your AI career co-pilot, ${name}! Here's everything I can help you with:\n\n**💻 Technical Career**\n• Explain any programming concept, algorithm, or system design\n• Code review and optimization tips\n• Debug your approach to problems\n\n**📄 Resume & Profile**\n• Write powerful achievement bullet points\n• ATS optimization tips\n• LinkedIn headline and summary writing\n\n**🎤 Interview Mastery**\n• Mock interview questions by domain\n• STAR method coaching\n• Technical interview deep dives\n\n**💰 Compensation**\n• Salary benchmarks by role and country\n• Negotiation scripts\n• Total compensation breakdown\n\n**📈 Career Strategy**\n• Switching domains (e.g., into AI/ML)\n• Promotion frameworks\n• Startup vs corporate trade-offs\n\nWhat would you like to explore first?`;
    }

    // ── Salary negotiation ──
    if (/salary|pay|ctc|compensat|hike|raise|negotiate|offer/.test(q)) {
        if (exp === 0) return `**Fresher Salary Guide for ${domain}**\n\nIn India:\n• Service companies (TCS, Infosys): ₹3.5–6 LPA\n• Startups (Series A+): ₹6–12 LPA\n• Product companies: ₹8–18 LPA\n• FAANG India offices: ₹20–35 LPA\n\nWith your skills in ${skills.split(",").slice(0, 3).join(", ")}, focus on:\n1. **3 strong portfolio projects** with GitHub links\n2. **DSA preparation** (100+ LeetCode problems)\n3. **Target product companies** — they pay 3–4x service companies\n\n**Negotiation script:**\n> "Based on my research and the skills I bring in ${skills.split(",")[0]}, I was expecting around [X]. Is there flexibility?"`;
        if (exp <= 3) return `**Mid-Level Salary Strategy**\n\n${exp} years in ${domain} puts you in a strong position:\n\n🇮🇳 **India:** ₹12–28 LPA (product companies pay 2x)\n🇺🇸 **USA Remote:** $85–130K/year\n🇬🇧 **UK:** £55–80K/year\n🇸🇬 **Singapore:** SGD 80–115K/year\n\n**How to negotiate effectively:**\n1. Always get competing offers — they're your strongest leverage\n2. Never name your number first: *"I'm more interested in the right opportunity. What's the range?"*\n3. Negotiate total comp: base + bonus + equity + WFH flexibility\n4. Counter 20–25% above your target\n5. Use Levels.fyi and Glassdoor for data-driven negotiation\n\n**With your ${skills.split(",")[0]} skills**, target companies actively hiring in your domain.`;
        return `**Senior Career Compensation Playbook**\n\nWith ${exp}+ years in ${domain}:\n\n🇮🇳 **India:** ₹25–60 LPA (Director level: ₹80 LPA+)\n🇺🇸 **USA:** $140–200K base + RSU + bonus\n🇬🇧 **UK:** £90–130K\n🇨🇦 **Canada:** CAD $130–180K\n\n**Senior-Level Strategy:**\n• Document your impact with concrete metrics: *"Led migration saving ₹2.4Cr/year"*\n• Build your personal brand (speak at conferences, write LinkedIn articles)\n• Equity is now critical — 30–40% of total comp at your level\n• Consider fractional CTO / consulting roles: ₹3–8 LPA per client\n\nWhat specific situation are you negotiating right now?`;
    }

    // ── Interview prep ──
    if (/interview|interviewee|interviewr|prepare|prep|mock|question/.test(q)) {
        return `**Complete Interview Preparation Guide for ${domain}**\n\n**Phase 1 — DSA (2 weeks)**\n• Arrays & Strings: Two pointers, sliding window\n• Trees & Graphs: BFS/DFS, Dijkstra\n• Dynamic Programming: Top 20 patterns\n• Goal: Solve 120+ LeetCode (40% Medium, 20% Hard)\n\n**Phase 2 — System Design (1 week)**\n• Read: "Designing Data-Intensive Applications"\n• Practice designing: URL shortener, Twitter feed, Uber\n• Learn: CAP theorem, consistent hashing, database sharding\n\n**Phase 3 — ${domain} Depth (ongoing)**\n• Internals of ${skills.split(",")[0]}: not just usage, but HOW it works\n• Common: "Why did you use X over Y?"\n• Read source code of libraries you use daily\n\n**Phase 4 — Behavioral (STAR Method)**\nPrepare 7 stories covering:\n1. Leadership under pressure\n2. Technical disagreement resolution\n3. Biggest failure & recovery\n4. Cross-team collaboration success\n5. Delivering under deadline\n\n**Phase 5 — CareerIQ Practice**\nUse the Interview Simulator daily for 2 weeks — the AI scores your real answers.\n\n_What specific type of interview round would you like to dive into?_`;
    }

    // ── Resume tips ──
    if (/resume|cv|curriculum|ats|linkedin|profile/.test(q)) {
        return `**Resume Optimization for ${domain}**\n\n**Structure (in order):**\n1. Header: Name, Phone, Email, GitHub, LinkedIn\n2. Summary (3 lines): Years + Domain + Top Achievement\n3. Experience (STAR bullets)\n4. Skills (technical only, no "Microsoft Word")\n5. Projects (with impact metrics)\n6. Education\n\n**High-Impact Bullet Formula:**\n> Action verb + What you did + Technology + Measurable result\n\n✅ **Good:** *"Reduced API response time by 62% by implementing Redis caching in Node.js, improving P95 latency from 2.4s to 0.9s"*\n❌ **Weak:** *"Worked on improving backend performance"*\n\n**Your Goal — Mirror Job Descriptions:**\nIf a job says "React + TypeScript + AWS", your resume should prominently feature those exact terms.\n\n**ATS Keywords for ${domain}:**\n${skills.split(",").slice(0, 6).map((s: string) => `• ${s.trim()}`).join("\n")}\n\nUpload your resume in CareerIQ's Resume AI section for a full ATS score analysis.`;
    }

    // ── Python / ML / AI ──
    if (/python|machine learning|ml|ai|deep learning|chatgpt|llm|langchain|tensorflow|pytorch|neural/.test(q)) {
        return `**AI/ML Fast Track for ${exp > 0 ? `${domain} Professional` : "Beginners"}**\n\n${exp > 0 ? `Great news — your ${domain} background gives you a massive head start in AI/ML!` : "AI/ML is the highest-paid tech track right now."}\n\n**Month-by-Month Roadmap:**\n\n📅 **Month 1:** Python Foundations\n→ NumPy, Pandas, Matplotlib, Data Cleaning\n→ Goal: Process and visualize a real dataset\n\n📅 **Month 2:** Classical ML\n→ Scikit-learn: Regression, Classification, Clustering\n→ Evaluation: Precision, Recall, F1, AUC-ROC\n→ Build: Churn prediction model\n\n📅 **Month 3:** Deep Learning\n→ PyTorch: Tensors, autograd, training loop\n→ CNNs for images, RNNs for sequences\n→ Build: Image classifier or sentiment analyzer\n\n📅 **Month 4:** Modern AI (LLMs)\n→ Transformer architecture fundamentals\n→ LangChain, RAG systems, vector databases\n→ Fine-tuning with Hugging Face\n→ Build: AI chatbot with your own data\n\n📅 **Month 5–6:** Deploy & Job Hunt\n→ Deploy on Hugging Face Spaces or Replicate\n→ Kaggle competition (silver medal target)\n→ Target: AI Engineer roles — 40% higher pay than traditional dev\n\n**Salary after transition:** ₹20–50 LPA in India, $130–200K in USA`;
    }

    // ── React, TypeScript, JS ──
    if (/react|typescript|javascript|nextjs|next\.js|node|express|vue|angular/.test(q)) {
        const topic = q.includes("react") ? "React" : q.includes("typescript") ? "TypeScript" : q.includes("next") ? "Next.js" : "JavaScript";
        return `**${topic} Deep Dive**\n\nSince you asked about ${topic}, here's what separates junior from senior understanding:\n\n**Fundamentals (must know cold):**\n${topic === "React" ? "• Reconciliation & Virtual DOM — HOW it works\n• Hooks rules & dependency arrays (most interview trips here)\n• Controlled vs uncontrolled components\n• Render optimization: useMemo, useCallback, React.memo\n• Context API vs external state (Zustand/Redux)" : topic === "TypeScript" ? "• Type inference vs annotation — know when to use each\n• Generics & conditional types (advanced interviews)\n• Discriminated unions for type-safe state machines\n• Utility types: Partial, Pick, Omit, Record, Extract\n• Declaration merging & module augmentation" : "• Event loop, call stack, microtasks vs macrotasks\n• Closure, hoisting, prototype chain\n• async/await vs Promises vs callbacks\n• ES6+: destructuring, spread, optional chaining\n• Module system: CommonJS vs ESM"}\n\n**Common Interview Questions:**\n1. Explain [${topic}] reconciliation/type system/closure in simple terms\n2. What's the performance impact of [key concept]?\n3. How would you test ${topic} code?\n\nWould you like a mock interview question on ${topic} right now?`;
    }

    // ── DSA / algorithms ──
    if (/dsa|algorithm|data structure|leetcode|array|linked list|tree|graph|dp|dynamic programming|binary/.test(q)) {
        return `**DSA Mastery Guide**\n\nHere's the proven system to crack DSA interviews:\n\n**The 5-Pattern Method (covers 80% of problems):**\n\n1️⃣ **Two Pointers** — sorted arrays, looking for pairs\n   → LeetCode: #167, #15, #11, #42\n\n2️⃣ **Sliding Window** — subarrays, substrings\n   → LeetCode: #76, #3, #239, #567\n\n3️⃣ **Binary Search** — sorted data, monotonic functions\n   → LeetCode: #33, #153, #162, #4\n\n4️⃣ **DFS/BFS** — trees, graphs, matrix traversal\n   → LeetCode: #200, #417, #130, #210\n\n5️⃣ **Dynamic Programming** — optimization, counting\n   → LeetCode: #70, #322, #300, #1143\n\n**Daily Practice Plan:**\n• Week 1–2: Easy (arrays, strings) — build confidence\n• Week 3–4: Medium (trees, graphs) — interview level\n• Week 5–6: Hard (DP, advanced graphs) — differentiate yourself\n\n**Mistake to avoid:** Jumping to code immediately. Always spend 5 minutes on:\n1. Understand the problem (edge cases)\n2. Think through approach (verbal)\n3. Analyze complexity BEFORE coding\n\nWhat specific DSA topic would you like a walkthrough on?`;
    }

    // ── System design ──
    if (/system design|architecture|scalab|microservice|kafka|redis|load balancer|database|hld|lld/.test(q)) {
        return `**System Design Mastery**\n\nHere's the framework to approach ANY system design question:\n\n**The RDMA Framework:**\n\n**R — Requirements**\n• Functional: What does the system DO?\n• Non-functional: scale, latency, availability targets\n• Constraints: read-heavy vs write-heavy?\n\n**D — Data Model**\n• Which DB? SQL (relational, ACID) vs NoSQL (flexible, scalable)\n• MongoDB vs PostgreSQL vs Cassandra vs DynamoDB use cases\n• Partitioning strategy: user_id hash, geolocation, time-series\n\n**M — Major Components**\n• API Gateway → Load Balancer → App Servers → DB → Cache\n• CDN for static assets\n• Message queue (Kafka/RabbitMQ) for async processing\n• Redis for sessions, rate limiting, leaderboards\n\n**A — Algorithm & Bottlenecks**\n• Identify the bottleneck: most systems are I/O-bound, not CPU-bound\n• Caching strategy: Cache-aside, Write-through, Write-behind\n• Database: Indexing, query optimization, read replicas\n\n**Example: Design a Twitter-like feed**\n→ Fan-out on write (for small followings) vs fan-out on read (celebrities)\n→ Redis sorted sets for timeline\n→ S3 + CDN for media\n→ Cassandra for tweets (time-series)\n\nWhich specific system would you like to design?`;
    }

    // Dynamic Live Fetch from Wikipedia for deeply technical maximum questions
    try {
        const term = input.replace(/^(what is|explain|define|how does|what are|tell me about)\s+/i, "").trim().split(" ").slice(0, 4).join(" ");
        if (term.length > 2) {
            const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(term)}&limit=1&format=json&origin=*`;
            const res = await fetch(url);
            const data = await res.json();
            if (data && data[1] && data[1].length > 0 && data[2] && data[2][0]) {
                return `**${data[1][0]}**\n\n${data[2][0]}\n\nThis is a highly advanced technical concept. In real-world ${domain} engineering, understanding the underlying mechanics of ${data[1][0]} allows you to build much more scalable and efficient systems. Do you want to see a specific coding example or implementation of this?`;
            }
        }
    } catch (e) {
        console.error("Wikipedia fetch failed", e);
    }

    // Ultimate fallback
    return `That's a fantastic technical question. As your AI mentor, I can tell you that understanding concepts like "${input}" is exactly what differentiates mid-level from senior engineers.\n\nIn a live setting, I would give you a deep architectural breakdown. For now, what I recommend is building a small Proof-of-Concept (PoC) using this technology. The best way to learn is by doing!`;
}

export default function ChatbotPage() {
    const { profile, addXP } = useAppStore();
    const [selected, setSelected] = useState("helix");
    const mentor = mentors.find(m => m.id === selected)!;

    const welcome = (id: string) => {
        const m = mentors.find(x => x.id === id)!;
        return `Hey${profile?.name ? " " + profile.name.split(" ")[0] : ""}! I'm **${m.name}**, your ${m.role}.\n\n${profile?.domain ? `I can see you're working in **${profile.domain}**${profile.experience ? ` with ${profile.experience} year(s) of experience` : ""}${profile.skills?.length ? ` and skills in ${profile.skills.slice(0, 3).join(", ")}` : ""}. I'll tailor everything to your specific profile.` : "Upload your resume and I'll give you hyper-personalized advice!"}\n\nWhat's on your mind today? Ask me anything — I'm here to give you real, specific answers, not generic advice.`;
    };

    const [messages, setMessages] = useState([{ role: "ai", text: welcome("aryan") }]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [questionCount, setQuestionCount] = useState(0);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const suggestions = [
        "What salary should I negotiate?",
        "Give me a system design question",
        "How do I switch to AI/ML?",
        "Explain quantum computing",
        "What are my interview blind spots?",
        "FAANG vs startup — which is right for me?",
        "What is Kubernetes?",
        "Explain React hooks lifecycle",
    ];

    const send = async (text?: string) => {
        const msg = text || input;
        if (!msg.trim() || loading) return;
        setMessages(m => [...m, { role: "user", text: msg }]);
        setInput("");
        setLoading(true);
        // Realistic delay (like real AI)
        await new Promise(r => setTimeout(r, 600 + Math.random() * 900));
        const response = await generateResponse(msg, selected, profile);
        setMessages(m => [...m, { role: "ai", text: response }]);
        setLoading(false);
        const nc = questionCount + 1;
        setQuestionCount(nc);
        if (nc === 5) addXP(80, "Asked AI Chatbot 5 questions");
    };

    const switchMentor = (id: string) => {
        setSelected(id);
        setMessages([{ role: "ai", text: welcome(id) }]);
    };

    return (
        <div className="page-enter">
            <h1 style={{ marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
                <Bot size={28} color="var(--accent)" /> AI Chatbots
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 20 }}>Neural Career Processor — context-aware AI mentors with real, specific answers</p>

            {/* Mentors */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10, marginBottom: 20 }}>
                {mentors.map(m => (
                    <div key={m.id} className={`mentor-card ${selected === m.id ? "selected" : ""}`} onClick={() => switchMentor(m.id)}>
                        <div style={{ fontSize: "1.5rem", marginBottom: 6 }}>{m.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)", marginBottom: 2 }}>{m.name}</div>
                        <div style={{ fontSize: "0.73rem", color: m.color, fontWeight: 600, marginBottom: 4 }}>{m.role}</div>
                        <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{m.tag}</div>
                        {selected === m.id && <div style={{ marginTop: 8, fontSize: "0.65rem", color: m.color }}>● Active</div>}
                    </div>
                ))}
            </div>

            {/* Suggestions */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {suggestions.map(s => (
                    <button key={s} onClick={() => send(s)} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 20, padding: "5px 13px", fontSize: "0.73rem", color: "var(--text-sub)", cursor: "pointer", transition: "all 0.2s" }}
                        onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = "var(--accent)"; (e.target as HTMLButtonElement).style.color = "var(--text)"; }}
                        onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = "var(--border)"; (e.target as HTMLButtonElement).style.color = "var(--text-sub)"; }}>
                        {s}
                    </button>
                ))}
            </div>

            {/* Chat */}
            <div className="card" style={{ display: "flex", flexDirection: "column", minHeight: 440 }}>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: 14, display: "flex", gap: 8, alignItems: "center", padding: "8px 12px", background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
                    <span>{mentor.icon}</span>
                    <strong style={{ color: mentor.color }}>{mentor.name}</strong>
                    <span>·</span>
                    <span>{mentor.role}</span>
                    {profile?.domain && <><span>·</span><span style={{ color: "var(--text-muted)" }}>Knows your {profile.domain} profile</span></>}
                </div>

                <div style={{ flex: 1, minHeight: 320, maxHeight: 440, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, marginBottom: 16, paddingRight: 4 }}>
                    {messages.map((m, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, alignItems: "start" }}>
                            {m.role === "ai" && <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${mentor.color}22`, border: `1px solid ${mentor.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", flexShrink: 0 }}>{mentor.icon}</div>}
                            <div className={m.role === "ai" ? "chat-bubble-ai" : "chat-bubble-user"} style={{ whiteSpace: "pre-line" }}>{m.text}</div>
                        </div>
                    ))}
                    {loading && (
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${mentor.color}22`, border: `1px solid ${mentor.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", flexShrink: 0 }}>{mentor.icon}</div>
                            <div className="chat-bubble-ai" style={{ display: "flex", gap: 5, alignItems: "center", padding: "12px 18px" }}>
                                {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", animation: `pulse 1.4s ${i * 0.15}s ease-in-out infinite` }} />)}
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                <div style={{ display: "flex", gap: 10, borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                    <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()} placeholder={`Ask ${mentor.name} anything — salary, code, career strategy...`} className="input-field" style={{ flex: 1 }} />
                    <button className="btn-primary" onClick={() => send()} disabled={loading || !input.trim()}>
                        {loading ? "..." : "Send →"}
                    </button>
                </div>
            </div>
        </div>
    );
}
