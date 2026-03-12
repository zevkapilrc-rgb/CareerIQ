"use client";
import { useState } from "react";
import { useAppStore } from "@/src/state/useAppStore";

const markets = [
    {
        country: "United States",
        flag: "🇺🇸", cc: "us",
        roles: 38420,
        avgSalary: "$105,000 – $185,000/yr",
        growth: "+18% YoY",
        color: "#a78bfa",
        visa: "H-1B, O-1, EB-1",
        topRoles: [
            { title: "Senior AI/ML Engineer", salary: "$155K – $220K/yr", company: "OpenAI, Google DeepMind, Anthropic", hot: true },
            { title: "Staff Full-Stack Engineer", salary: "$145K – $185K/yr", company: "Meta, Stripe, Airbnb" },
            { title: "Principal Backend Engineer", salary: "$140K – $175K/yr", company: "Netflix, Uber, Databricks" },
            { title: "DevOps / SRE", salary: "$130K – $165K/yr", company: "AWS, Cloudflare, Microsoft" },
            { title: "Data Scientist", salary: "$115K – $155K/yr", company: "Apple, Palantir, IBM" },
        ],
    },
    {
        country: "United Kingdom",
        flag: "🇬🇧", cc: "gb",
        roles: 12830,
        avgSalary: "£55,000 – £110,000/yr",
        growth: "+12% YoY",
        color: "#60a5fa",
        visa: "Skilled Worker Visa",
        topRoles: [
            { title: "AI Research Engineer", salary: "£90K – £130K/yr", company: "DeepMind, Wayve, Synthesia", hot: true },
            { title: "Senior Software Engineer", salary: "£75K – £100K/yr", company: "Revolut, Monzo, ARM" },
            { title: "Data Engineer", salary: "£65K – £88K/yr", company: "Sky, HSBC, BT" },
            { title: "Cloud Architect", salary: "£80K – £110K/yr", company: "Deloitte, PwC, Capgemini" },
        ],
    },
    {
        country: "Germany",
        flag: "🇩🇪", cc: "de",
        roles: 8210,
        avgSalary: "€60,000 – €105,000/yr",
        growth: "+11% YoY",
        color: "#fbbf24",
        visa: "Opportunity Card / EU Blue Card",
        topRoles: [
            { title: "Machine Learning Engineer", salary: "€85K – €115K/yr", company: "Aleph Alpha, DeepL, Celonis", hot: true },
            { title: "Backend Engineer", salary: "€72K – €95K/yr", company: "SAP, Zalando, Siemens" },
            { title: "DevOps Engineer", salary: "€70K – €92K/yr", company: "Deutsche Telekom, Bosch, BMW Tech" },
        ],
    },
    {
        country: "Canada",
        flag: "🇨🇦", cc: "ca",
        roles: 11740,
        avgSalary: "CAD $95,000 – $160,000/yr",
        growth: "+15% YoY",
        color: "#34d399",
        visa: "Global Talent Stream, Express Entry",
        topRoles: [
            { title: "AI/ML Researcher", salary: "CAD $130K – $185K/yr", company: "Mila, Vector Institute, Cohere", hot: true },
            { title: "Senior Full-Stack Engineer", salary: "CAD $110K – $150K/yr", company: "Shopify, Wealthsimple, Hootsuite" },
            { title: "Data Scientist", salary: "CAD $100K – $135K/yr", company: "RBC, Scotiabank, TELUS" },
        ],
    },
    {
        country: "Australia",
        flag: "🇦🇺", cc: "au",
        roles: 7920,
        avgSalary: "AUD $95,000 – $155,000/yr",
        growth: "+10% YoY",
        color: "#f87171",
        visa: "TSS 482 / Skilled Independent (189)",
        topRoles: [
            { title: "Full-Stack Developer", salary: "AUD $110K – $145K/yr", company: "Atlassian, Canva, WiseTech", hot: true },
            { title: "Data Engineer", salary: "AUD $105K – $140K/yr", company: "Commonwealth Bank, Xero, REA" },
            { title: "Cloud / SRE", salary: "AUD $115K – $150K/yr", company: "NAB, Seek, Afterpay" },
        ],
    },
    {
        country: "Singapore",
        flag: "🇸🇬", cc: "sg",
        roles: 6840,
        avgSalary: "SGD $78,000 – $148,000/yr",
        growth: "+20% YoY",
        color: "#c084fc",
        visa: "Employment Pass / Tech Pass",
        topRoles: [
            { title: "AI Product Engineer", salary: "SGD $110K – $165K/yr", company: "ByteDance, Grab, Sea Group", hot: true },
            { title: "Software Engineer", salary: "SGD $90K – $125K/yr", company: "Google SG, DBS, Shopee" },
            { title: "Quantitative Developer", salary: "SGD $120K – $180K/yr", company: "Jane Street, Citadel, Jump" },
        ],
    },
    {
        country: "Netherlands",
        flag: "🇳🇱", cc: "nl",
        roles: 4320,
        avgSalary: "€62,000 – €98,000/yr",
        growth: "+13% YoY",
        color: "#fb923c",
        visa: "Highly Skilled Migrant (HSM)",
        topRoles: [
            { title: "Platform Engineer", salary: "€80K – €110K/yr", company: "Booking.com, Adyen, ASML", hot: true },
            { title: "ML Engineer", salary: "€82K – €108K/yr", company: "Elastic, Mollie, TomTom" },
        ],
    },
    {
        country: "France",
        flag: "🇫🇷", cc: "fr",
        roles: 3940,
        avgSalary: "€48,000 – €90,000/yr",
        growth: "+9% YoY",
        color: "#38bdf8",
        visa: "Talent Passport",
        topRoles: [
            { title: "AI Research Scientist", salary: "€75K – €120K/yr", company: "Mistral AI, Hugging Face, INRIA", hot: true },
            { title: "Backend Engineer", salary: "€55K – €80K/yr", company: "Criteo, Deezer, BlaBlaCar" },
        ],
    },
    {
        country: "Ireland",
        flag: "🇮🇪", cc: "ie",
        roles: 3210,
        avgSalary: "€55,000 – €105,000/yr",
        growth: "+14% YoY",
        color: "#4ade80",
        visa: "Critical Skills Employment Permit",
        topRoles: [
            { title: "Senior SWE", salary: "€90K – €130K/yr", company: "Google EMEA, Meta EMEA, Stripe EU", hot: true },
            { title: "Cloud Engineer", salary: "€72K – €95K/yr", company: "AWS Dublin, Microsoft, Salesforce" },
        ],
    },
    {
        country: "UAE / Dubai",
        flag: "🇦🇪", cc: "ae",
        roles: 5430,
        avgSalary: "AED 180,000 – 480,000/yr (Tax-Free)",
        growth: "+25% YoY",
        color: "#facc15",
        visa: "Golden Visa / Work Permit",
        topRoles: [
            { title: "Full-Stack / AI Engineer", salary: "AED 250K – 480K/yr tax-free", company: "G42, Careem, Noon", hot: true },
            { title: "Data Scientist", salary: "AED 180K – 360K/yr tax-free", company: "ADNOC, Emirates, FAB" },
        ],
    },
    {
        country: "Japan",
        flag: "🇯🇵", cc: "jp",
        roles: 4120,
        avgSalary: "¥7,000,000 – ¥16,000,000/yr",
        growth: "+16% YoY",
        color: "#f472b6",
        visa: "Highly Skilled Professional Visa",
        topRoles: [
            { title: "Software Engineer", salary: "¥10M – ¥18M/yr", company: "Sony, Rakuten, DeNA", hot: false },
            { title: "AI/ML Engineer", salary: "¥12M – ¥20M/yr", company: "SoftBank, Preferred Networks, Mercari", hot: true },
        ],
    },
    {
        country: "Sweden",
        flag: "🇸🇪", cc: "se",
        roles: 2980,
        avgSalary: "SEK 600,000 – 1,000,000/yr",
        growth: "+11% YoY",
        color: "#67e8f9",
        visa: "Work Permit / EU Residency",
        topRoles: [
            { title: "Senior Engineer", salary: "SEK 750K – 1.1M/yr", company: "Spotify, Klarna, King", hot: true },
            { title: "Data Engineer", salary: "SEK 680K – 920K/yr", company: "Ericsson, H&M Group, Voi" },
        ],
    },
    {
        country: "Brazil (Remote)",
        flag: "🇧🇷", cc: "br",
        roles: 8640,
        avgSalary: "$35,000 – $80,000/yr (USD Remote)",
        growth: "+28% YoY",
        color: "#86efac",
        visa: "Remote / Digital Nomad Visa",
        topRoles: [
            { title: "Full-Stack (Remote, USD)", salary: "$45K – $85K/yr USD", company: "iFood, Nubank, Hotmart", hot: true },
            { title: "React / Node Developer", salary: "$40K – $70K/yr USD", company: "US Startups (Remote)" },
        ],
    },
    {
        country: "India (Top Cos)",
        flag: "🇮🇳", cc: "in",
        roles: 85400,
        avgSalary: "₹8L – ₹80L/yr",
        growth: "+22% YoY",
        color: "#fda4af",
        visa: "N/A (domestic)",
        topRoles: [
            { title: "AI/ML Engineer (Product)", salary: "₹25L – ₹80L/yr", company: "OpenAI India, Google, Meta, Zepto", hot: true },
            { title: "Full-Stack Engineer (Senior)", salary: "₹20L – ₹50L/yr", company: "Razorpay, CRED, Meesho, Swiggy" },
            { title: "Data Scientist", salary: "₹15L – ₹45L/yr", company: "Flipkart, Paytm, PhonePe, Zomato" },
            { title: "DevOps / SRE", salary: "₹18L – ₹44L/yr", company: "Atlassian, Twilio, Freshworks" },
        ],
    },
    {
        country: "Portugal",
        flag: "🇵🇹", cc: "pt",
        roles: 2140,
        avgSalary: "€32,000 – €72,000/yr",
        growth: "+18% YoY",
        color: "#a5b4fc",
        visa: "Tech Visa / D3 Visa",
        topRoles: [
            { title: "Remote Full-Stack (EUR)", salary: "€45K – €75K/yr", company: "Unbabel, Remote.com, Farfetch", hot: true },
            { title: "Frontend Engineer", salary: "€38K – €60K/yr", company: "Landing.jobs ecosystem" },
        ],
    },
];

export default function GlobalScannerPage() {
    const { profile } = useAppStore();
    const [selected, setSelected] = useState<typeof markets[0] | null>(null);
    const [search, setSearch] = useState("");

    const filtered = markets.filter(m =>
        m.country.toLowerCase().includes(search.toLowerCase())
    );
    const totalRoles = markets.reduce((a, m) => a + m.roles, 0);

    if (selected) return (
        <div className="page-enter" style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
                <button className="btn-ghost" onClick={() => setSelected(null)}>← All Markets</button>
                <img src={`https://flagcdn.com/48x36/${(selected as any).cc}.png`} alt="" style={{ width: 48, height: 36, borderRadius: 4, objectFit: "cover" }} />
                <h2 style={{ margin: 0 }}>Jobs in {selected.country}</h2>
                <span style={{ color: selected.color, fontWeight: 700 }}>{selected.roles.toLocaleString()} open roles</span>
                <span className="badge-green">{selected.growth}</span>
            </div>

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
                                    {(r as any).hot && <span style={{ background: "rgba(248,113,113,0.15)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 20, padding: "1px 8px", fontSize: "0.65rem", fontWeight: 600 }}>🔥 HOT</span>}
                                </div>
                                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>📍 {r.company}</div>
                            </div>
                            <div className="salary-tag" style={{ fontSize: "0.85rem", padding: "4px 12px" }}>{r.salary}</div>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                            <span className="badge-blue">{selected.visa}</span>
                            {profile?.skills?.slice(0, 3).map(s => <span key={s} className="skill-tag">{s}</span>)}
                        </div>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button className="btn-primary" style={{ fontSize: "0.8rem" }}>Apply Now →</button>
                            <button className="btn-ghost" style={{ fontSize: "0.8rem" }}>Save Job</button>
                        </div>
                    </div>
                ))}
            </div>

            {profile?.domain && (
                <div className="card" style={{ marginTop: 20, background: "rgba(124,58,237,0.06)", borderColor: "rgba(124,58,237,0.2)" }}>
                    <div style={{ fontWeight: 600, color: "var(--accent)", marginBottom: 8, fontSize: "0.85rem" }}>💡 AI Insight for {profile.domain} in {selected.country}</div>
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
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                        🌍 {markets.length} markets · {totalRoles.toLocaleString()} open roles · Updated March 2025
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
                <span style={{ fontSize: "0.78rem", color: "#f87171", fontWeight: 600 }}>🔥 Highest Growth 2025:</span>
                {markets.filter(m => parseInt(m.growth) >= 15).map(m => (
                    <span key={m.country} className="badge-red" style={{ cursor: "pointer" }} onClick={() => setSelected(m)}>{(m as any).flag} {m.country} {m.growth}</span>
                ))}
            </div>

            <div className="grid-3 stagger">
                {filtered.map(m => (
                    <div key={m.country} className="card country-card" style={{ borderColor: `${m.color}22`, cursor: "pointer", transition: "all 0.25s cubic-bezier(.23,1.01,.32,1)", overflow: "hidden", position: "relative" }}
                        onClick={() => setSelected(m)}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(-6px) scale(1.01)"; el.style.borderColor = `${m.color}66`; el.style.boxShadow = `0 12px 40px ${m.color}18`; }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translateY(0) scale(1)"; el.style.borderColor = `${m.color}22`; el.style.boxShadow = "none"; }}>
                        {/* Flag banner */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                            <img src={`https://flagcdn.com/48x36/${(m as any).cc}.png`} alt={(m as any).flag} style={{ width: 48, height: 36, borderRadius: 4, objectFit: "cover", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))" }} />
                            <div style={{ textAlign: "right" }}>
                                <span style={{ fontSize: "0.65rem", color: parseInt(m.growth) >= 15 ? "#f87171" : "var(--green)", fontWeight: 700, display: "block" }}>{parseInt(m.growth) >= 15 ? "🔥" : "📈"} {m.growth}</span>
                                {parseInt(m.growth) >= 20 && <span style={{ fontSize: "0.6rem", color: "#f87171", fontWeight: 600 }}>FAST GROWING</span>}
                            </div>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", marginBottom: 4 }}>{m.country}</div>
                        <div style={{ fontSize: "1.9rem", fontWeight: 800, color: m.color, margin: "6px 0 2px", letterSpacing: "-0.02em" }}>{m.roles.toLocaleString()}</div>
                        <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>Open Roles</div>
                        <div className="salary-tag" style={{ marginBottom: 10, fontSize: "0.7rem" }}>{m.avgSalary}</div>
                        <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginBottom: 14 }}>🛂 {m.visa.split("/")[0].trim()}</div>
                        {/* Top hot role preview */}
                        {m.topRoles.find(r => (r as any).hot) && <div style={{ background: `${m.color}0d`, border: `1px solid ${m.color}22`, borderRadius: 8, padding: "6px 10px", marginBottom: 14, fontSize: "0.68rem", color: `${m.color}dd` }}>🔥 {m.topRoles.find(r => (r as any).hot)!.title}</div>}
                        <button className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: "0.78rem" }}
                            onClick={e => { e.stopPropagation(); setSelected(m); }}>
                            Explore Opportunities →
                        </button>
                    </div>
                ))}
            </div>

            {!profile?.skills?.length && (
                <div className="card" style={{ marginTop: 24, background: "rgba(167,139,250,0.06)", borderColor: "rgba(167,139,250,0.2)", textAlign: "center" }}>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                        ✨ <strong style={{ color: "var(--accent)" }}>Upload your resume</strong> for AI-powered country matching based on your skill set
                    </p>
                </div>
            )}
        </div>
    );
}
