/* eslint-disable */
"use client";

import { useState, useMemo, useEffect } from "react";
import {
    Globe, MapPin, Sparkles, TrendingUp, Search, Briefcase,
    DollarSign, ExternalLink, ChevronLeft, ArrowUpRight, Building2,
    Users, BarChart3, Filter, Zap, Star, RefreshCw, StarHalf
} from "lucide-react";
import {
    countryStats, jobListings, formatSalary, formatAvgSalary,
    type CountryStat, type JobListing
} from "./globalJobsData";
import { useAppStore } from "@/src/state/useAppStore";
import { motion, AnimatePresence } from "framer-motion";
import ResumeGate from "@/src/components/ResumeGate";
import GlassCard from "@/src/components/ui/GlassCard";
import KPICard from "@/src/components/ui/KPICard";
import Badge from "@/src/components/ui/Badge";
import PremiumButton from "@/src/components/ui/PremiumButton";
import { PremiumLoader } from "@/src/components/ui/PremiumLoader";

function postedLabel(daysAgo: number): string {
    if (daysAgo === 0) return "Today";
    if (daysAgo === 1) return "Yesterday";
    return `${daysAgo} days ago`;
}

export default function GlobalScannerPage() {
    const [selectedCountry, setSelectedCountry] = useState<CountryStat | null>(null);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [remoteFilter, setRemoteFilter] = useState(false);
    const [sortBy, setSortBy] = useState<"newest" | "salary">("newest");

    const { profile } = useAppStore();
    const domain = profile?.domain || "Software Engineering";
    const skills = profile?.skills || [];

    const [loading, setLoading] = useState<boolean>(false);
    const [scannerData, setScannerData] = useState<{ countryStats: CountryStat[], jobListings: JobListing[] }>({
        countryStats: countryStats,
        jobListings: jobListings
    });

    const fetchLiveScanner = async () => {
        setLoading(true);
        try {
            const resumeUploaded = !!localStorage.getItem("ciq-resume-analysis");

            const res = await fetch("/api/global-scanner", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    skills,
                    domain,
                    resumeUploaded,
                    resumeAnalysis: resumeUploaded ? (() => {
                        try {
                            return JSON.parse(localStorage.getItem("ciq-resume-analysis") || "null");
                        } catch {
                            return null;
                        }
                    })() : null,
                }),
            });

            const result = await res.json();
            if (result.success && result.data) {
                setScannerData(result.data);
                const cacheKey = `ciq-gemini-scanner-${profile?.name || "guest"}`;
                localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: result.data }));
            }
        } catch (err) {
            console.error("Failed to fetch global scanner data:", err);
            setScannerData({ countryStats, jobListings });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const cacheKey = `ciq-gemini-scanner-${profile?.name || "guest"}`;
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    if (parsed && typeof parsed === "object" && parsed.timestamp && Date.now() - parsed.timestamp < 60000) {
                        setScannerData(parsed.data);
                    } else {
                        fetchLiveScanner();
                    }
                } catch {
                    fetchLiveScanner();
                }
            } else {
                fetchLiveScanner();
            }
        }
    }, [profile?.name, skills.length]);

    const globalMetrics = useMemo(() => {
        let totalJobs = 0;
        const stats = scannerData.countryStats || [];
        stats.forEach(s => {
            totalJobs += s.totalJobs;
        });
        return {
            totalJobs,
            avgSalaryUSD: (() => {
                let totalSalUSD = 0;
                let count = 0;
                const usdRates: Record<string, number> = {
                    USD: 1, GBP: 1.27, EUR: 1.08, CAD: 0.74, AUD: 0.65,
                    INR: 0.012, SGD: 0.74, JPY: 0.0067, AED: 0.27, SEK: 0.095,
                };
                stats.forEach(s => {
                    const rate = usdRates[s.currency] || 1;
                    totalSalUSD += s.avgSalary * rate;
                    count++;
                });
                return count > 0 ? Math.round(totalSalUSD / count) : 0;
            })(),
            countriesCovered: stats.length,
            totalCompanies: new Set((scannerData.jobListings || []).map(j => j.company)).size,
        };
    }, [scannerData]);

    const userSkills = useMemo(() => {
        const skillsFromProfile = profile?.skills || [];
        const skillsFromAnalysis = profile?.resumeAnalysis?.skill_intelligence?.core_skills || [];
        const merged = new Set<string>();
        skillsFromProfile.forEach(s => {
            if (s && typeof s === "string") merged.add(s.trim().toLowerCase());
        });
        skillsFromAnalysis.forEach((s: any) => {
            if (typeof s === "string") {
                merged.add(s.trim().toLowerCase());
            } else if (s && typeof s === "object" && s.name) {
                merged.add(s.name.trim().toLowerCase());
            }
        });
        return Array.from(merged);
    }, [profile]);

    const calculateCompatibility = (job: JobListing, uSkills: string[]): { score: number; matchedSkills: string[] } => {
        if (uSkills.length === 0) return { score: 0, matchedSkills: [] };
        const textToSearch = `${job.title} ${job.description} ${job.category}`.toLowerCase();
        const matchedSkills: string[] = [];
        uSkills.forEach(skill => {
            if (!skill) return;
            try {
                const escapedSkill = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                let pattern = escapedSkill.length <= 3 
                    ? new RegExp(`\\b${escapedSkill}\\b`, 'i') 
                    : new RegExp(`(?:\\b|\\s|^)${escapedSkill}(?:\\b|\\s|$|\\.)`, 'i');
                if (pattern.test(textToSearch)) {
                    matchedSkills.push(skill);
                }
            } catch {
                if (textToSearch.includes(skill.toLowerCase())) {
                    matchedSkills.push(skill);
                }
            }
        });
        const score = uSkills.length > 0 ? Math.round((matchedSkills.length / Math.min(5, uSkills.length)) * 100) : 0;
        return { score: Math.min(100, score), matchedSkills };
    };

    const jobsWithCompatibility = useMemo(() => {
        return (scannerData.jobListings || []).map(job => {
            const { score, matchedSkills } = calculateCompatibility(job, userSkills);
            return { ...job, compatibilityScore: score, matchedSkills };
        });
    }, [scannerData.jobListings, userSkills]);

    const allCategories = useMemo(() => {
        const cats = new Set<string>();
        (scannerData.jobListings || []).forEach(j => {
            if (j.category) cats.add(j.category);
        });
        return Array.from(cats);
    }, [scannerData.jobListings]);

    const countryCategories = useMemo(() => {
        if (!selectedCountry) return [];
        const cats = new Set<string>();
        (scannerData.jobListings || []).forEach(j => {
            if (j.country === selectedCountry.country && j.category) {
                cats.add(j.category);
            }
        });
        return Array.from(cats).sort();
    }, [selectedCountry, scannerData.jobListings]);

    const countryJobsGrouped = useMemo(() => {
        if (!selectedCountry) return { matched: [], others: [] };
        let jobs = jobsWithCompatibility.filter(j => j.country === selectedCountry.country);

        if (categoryFilter !== "All") jobs = jobs.filter(j => j.category === categoryFilter);
        if (remoteFilter) jobs = jobs.filter(j => j.isRemote);
        if (search.trim()) {
            const q = search.toLowerCase();
            jobs = jobs.filter(j =>
                j.title.toLowerCase().includes(q) ||
                j.company.toLowerCase().includes(q) ||
                j.description.toLowerCase().includes(q)
            );
        }

        const matched = jobs.filter(j => j.compatibilityScore > 0);
        const others = jobs.filter(j => j.compatibilityScore === 0);

        matched.sort((a, b) => {
            if (b.compatibilityScore !== a.compatibilityScore) return b.compatibilityScore - a.compatibilityScore;
            return sortBy === "salary" ? b.salaryMax - a.salaryMax : a.postedDaysAgo - b.postedDaysAgo;
        });

        if (sortBy === "salary") others.sort((a, b) => b.salaryMax - a.salaryMax);
        else others.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);

        return { matched, others };
    }, [selectedCountry, categoryFilter, remoteFilter, search, sortBy, jobsWithCompatibility]);

    const globalJobsGrouped = useMemo(() => {
        let jobs = [...jobsWithCompatibility];
        if (categoryFilter !== "All") jobs = jobs.filter(j => j.category === categoryFilter);
        if (remoteFilter) jobs = jobs.filter(j => j.isRemote);
        if (search.trim()) {
            const q = search.toLowerCase();
            jobs = jobs.filter(j =>
                j.title.toLowerCase().includes(q) ||
                j.company.toLowerCase().includes(q) ||
                j.description.toLowerCase().includes(q) ||
                j.country.toLowerCase().includes(q)
            );
        }

        const matched = jobs.filter(j => j.compatibilityScore > 0);
        const others = jobs.filter(j => j.compatibilityScore === 0);

        matched.sort((a, b) => {
            if (b.compatibilityScore !== a.compatibilityScore) return b.compatibilityScore - a.compatibilityScore;
            return sortBy === "salary" ? b.salaryMax - a.salaryMax : a.postedDaysAgo - b.postedDaysAgo;
        });

        if (sortBy === "salary") others.sort((a, b) => b.salaryMax - a.salaryMax);
        else others.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);

        return { matched, others };
    }, [categoryFilter, remoteFilter, search, sortBy, jobsWithCompatibility]);

    const globalFilteredJobs = useMemo(() => {
        const { matched, others } = globalJobsGrouped;
        return [...matched, ...others];
    }, [globalJobsGrouped]);

    const renderJobCard = (job: any) => (
        <GlassCard key={job.id} className="p-6 transition-all duration-300 border-white/[0.05] hover:border-white/[0.12] hover:bg-white/[0.02]">
            <div className="flex flex-col md:flex-row justify-between items-start gap-5">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <h3 className="text-base font-bold text-white leading-tight font-display">{job.title}</h3>
                        <div className="flex items-center gap-1.5 bg-black/40 border border-white/[0.08] px-2 py-0.5 rounded-lg">
                            <img
                                src={`https://flagcdn.com/w20/${job.countryCode?.toLowerCase() || 'un'}.png`}
                                alt={job.country}
                                className="w-4 h-2.5 rounded-sm object-cover"
                            />
                            <span className="text-[9px] text-zinc-300 font-bold uppercase tracking-wider font-display">{job.country}</span>
                        </div>
                        {job.isRemote && (
                            <Badge label="Remote" variant="purple" size="sm" />
                        )}
                        {job.postedDaysAgo <= 1 && (
                            <Badge label="New" variant="blue" size="sm" />
                        )}
                        {job.compatibilityScore > 0 && (
                            <span className="bg-[var(--teal)]/20 border border-[var(--teal)]/40 text-[var(--accent)] px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 font-display">
                                <Sparkles size={11} className="animate-pulse" /> {job.compatibilityScore}% Match
                            </span>
                        )}
                    </div>

                    <div className="flex gap-4 flex-wrap mb-3 text-xs text-zinc-400 font-semibold">
                        <span className="text-zinc-300 flex items-center gap-1.5 font-bold">
                            <Building2 size={13} className="text-zinc-500" /> {job.company}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <MapPin size={13} className="text-zinc-500" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1.5 font-bold text-[var(--accent)]">
                            <DollarSign size={13} className="text-zinc-500" /> {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                        </span>
                    </div>

                    <p className="text-xs text-zinc-405 leading-relaxed max-w-3xl mb-4 font-semibold">
                        {job.description}
                    </p>

                    {job.matchedSkills && job.matchedSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest self-center mr-1 font-display">Matched:</span>
                            {job.matchedSkills.map((skill: string) => (
                                <span key={skill} className="bg-white/[0.03] border border-white/[0.08] px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-zinc-300 uppercase tracking-wide font-mono">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start w-full md:w-auto gap-4 md:gap-3.5 flex-shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/[0.05]">
                    <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center h-9 px-4 text-xs font-bold rounded-xl bg-[var(--teal)] text-white hover:bg-[var(--accent-dark)] transition-colors gap-1.5 uppercase tracking-wider font-display"
                    >
                        Apply <ExternalLink size={12} />
                    </a>
                    <div className="flex flex-col items-end gap-1">
                        <div className="text-[10px] text-zinc-500 font-semibold">
                            Posted {postedLabel(job.postedDaysAgo)}
                        </div>
                        <span className="bg-black/40 border border-white/[0.08] px-2.5 py-0.5 rounded-lg text-[9px] text-zinc-450 font-bold uppercase tracking-widest font-display">
                            {job.category}
                        </span>
                    </div>
                </div>
            </div>
        </GlassCard>
    );

    // â”€â”€ COUNTRY DETAIL VIEW â”€â”€
    if (selectedCountry) {
        const countryJobs = (scannerData.jobListings || []).filter(j => j.country === selectedCountry.country);
        const remoteCount = countryJobs.filter(j => j.isRemote).length;
        const { matched: countryMatched, others: countryOthers } = countryJobsGrouped;

        return (
            <ResumeGate pageName="Global Scanner" pageIcon={<Globe size={64} />}>
                <div className="max-w-[1280px] mx-auto px-4 pb-16 pt-2 animate-fade">
                    <AnimatePresence>
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 bg-[#0A0A0B]/85 backdrop-blur-md flex items-center justify-center"
                            >
                                <div className="bg-[#121214]/90 border border-white/[0.05] rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl flex flex-col items-center text-center">
                                    <PremiumLoader 
                                        message="Scanning Global Markets"
                                        submessage="Compiling matching job positions worldwide..."
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="mb-6">
                        <button
                            onClick={() => {
                                setSelectedCountry(null);
                                setSearch("");
                                setCategoryFilter("All");
                                setRemoteFilter(false);
                            }}
                            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white outline-none transition-colors"
                        >
                            <ChevronLeft size={14} className="mr-1" /> Back to Global Markets
                        </button>
                    </div>

                    <GlassCard className="mb-8 p-6 md:p-8 border-[var(--teal)]/20">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex items-center gap-4">
                                <img
                                    src={`https://flagcdn.com/w80/${selectedCountry.countryCode}.png`}
                                    alt={selectedCountry.country}
                                    className="w-16 rounded shadow border border-white/[0.08]"
                                />
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-extrabold text-white font-display mb-1">
                                        {selectedCountry.country}
                                    </h1>
                                    <p className="text-[10px] text-zinc-450 font-bold uppercase tracking-widest">
                                        {selectedCountry.totalJobs.toLocaleString()} live opportunities â€¢ {selectedCountry.topCompanies.length} top companies
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4 flex-wrap">
                                <div className="text-center px-5 py-3 bg-[var(--teal)]/5 rounded-xl border border-[var(--teal)]/20">
                                    <div className="text-xl font-bold text-[var(--accent)]">+{selectedCountry.growthRate}%</div>
                                    <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Growth</div>
                                </div>
                                <div className="text-center px-5 py-3 bg-white/[0.01] rounded-xl border border-white/[0.05]">
                                    <div className="text-xl font-bold text-white font-mono">
                                        {formatAvgSalary(selectedCountry.avgSalary, selectedCountry.currency)}
                                    </div>
                                    <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Avg Salary</div>
                                </div>
                                <div className="text-center px-5 py-3 bg-white/[0.01] rounded-xl border border-white/[0.05]">
                                    <div className="text-xl font-bold text-white font-mono">{remoteCount}</div>
                                    <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Remote</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6 flex-wrap">
                            {selectedCountry.topCompanies.map(c => (
                                <span key={c} className="bg-black/40 border border-white/[0.08] px-3.5 py-1 rounded-full text-xs text-zinc-300 font-semibold flex items-center gap-1.5">
                                    <Building2 size={12} className="text-zinc-500" /> {c}
                                </span>
                            ))}
                        </div>
                    </GlassCard>

                    <div className="flex flex-col sm:flex-row gap-3 mb-6 items-stretch sm:items-center">
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-3.5 top-3 text-zinc-500 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search jobs, companies, skills..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full h-10 bg-black/45 border border-white/[0.08] focus:border-[var(--teal)] text-white text-xs rounded-xl pl-10 pr-3.5 placeholder:text-zinc-700 outline-none transition-colors font-semibold"
                            />
                        </div>
                        <select
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                            className="h-10 bg-black/45 border border-white/[0.08] focus:border-[var(--teal)] text-white text-xs font-bold uppercase tracking-wider rounded-xl px-3.5 outline-none transition-colors cursor-pointer"
                        >
                            <option value="All">All Categories</option>
                            {countryCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <select
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as "newest" | "salary")}
                            className="h-10 bg-black/45 border border-white/[0.08] focus:border-[var(--teal)] text-white text-xs font-bold uppercase tracking-wider rounded-xl px-3.5 outline-none transition-colors cursor-pointer"
                        >
                            <option value="newest">Newest First</option>
                            <option value="salary">Highest Salary</option>
                        </select>
                        <button
                            onClick={() => setRemoteFilter(!remoteFilter)}
                            className={`h-10 border rounded-xl px-4 text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 ${
                                remoteFilter 
                                    ? "bg-[var(--teal)]/10 border-[var(--teal)]/35 text-[var(--accent)]" 
                                    : "bg-transparent border-white/[0.08] text-zinc-400 hover:text-white"
                            }`}
                        >
                            <Zap size={13} /> Remote Only
                        </button>
                    </div>

                    {countryMatched.length === 0 && countryOthers.length === 0 ? (
                        <GlassCard className="text-center py-16 border-dashed border-white/[0.06]">
                            <Search size={40} className="text-zinc-650 mx-auto mb-4" />
                            <h3 className="text-white font-display text-base font-bold mb-1">No matching jobs found</h3>
                            <p className="text-xs text-zinc-500 font-semibold">Try adjusting your search or filters.</p>
                        </GlassCard>
                    ) : (
                        <div className="flex flex-col gap-8">
                            {countryMatched.length > 0 && (
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-2 border-b border-white/[0.05] pb-2">
                                        <Sparkles className="text-[var(--accent)]" size={16} />
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">Profile Matches</h3>
                                        <Badge label={`${countryMatched.length} Match${countryMatched.length > 1 ? 'es' : ''}`} variant="red" size="sm" />
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {countryMatched.map(job => renderJobCard(job))}
                                    </div>
                                </div>
                            )}

                            {countryOthers.length > 0 && (
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-2 border-b border-white/[0.05] pb-2">
                                        <Briefcase className="text-zinc-400" size={16} />
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">More Opportunities</h3>
                                        <span className="bg-white/[0.02] border border-white/[0.06] text-zinc-450 text-[10px] font-bold px-2 py-0.5 rounded-lg font-mono">
                                            {countryOthers.length} POSITIONS
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {countryOthers.map(job => renderJobCard(job))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </ResumeGate>
        );
    }

    const { matched: globalMatched, others: globalOthers } = globalJobsGrouped;

    return (
        <ResumeGate pageName="Global Scanner" pageIcon={<Globe size={64} />}>
            <div className="max-w-[1280px] mx-auto px-4 pb-16 pt-2 animate-fade">
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-[#0A0A0B]/85 backdrop-blur-md flex items-center justify-center"
                        >
                            <div className="bg-[#121214]/90 border border-white/[0.05] rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl flex flex-col items-center text-center">
                                <PremiumLoader 
                                    message="Scanning Global Markets"
                                    submessage="Compiling matching job positions worldwide..."
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Hero header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 border-b border-white/[0.05] pb-6 mb-8 mt-2">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--accent)] font-display">Market Intelligence</span>
                            <Badge label="Live Scanner" variant="green" size="sm" dot={true} />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-none font-display">
                            Global Scanner
                        </h1>
                        <p className="text-xs text-zinc-550 mt-2.5 leading-relaxed font-semibold">
                            Real-time job market intelligence across {globalMetrics.countriesCovered} countries. Discover salaries, trends, and top opportunities worldwide.
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <PremiumButton onClick={fetchLiveScanner} disabled={loading}>
                            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                            Sync Gemini Scanner
                        </PremiumButton>
                    </div>
                </div>

                {/* Global stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <KPICard
                        title="GLOBAL JOBS"
                        value={globalMetrics.totalJobs.toLocaleString()}
                        icon={<Briefcase size={16} />}
                        sparklineData={[40, 50, 48, 55, 62, 70]}
                        sparklineColor="var(--teal)"
                    />
                    <KPICard
                        title="AVG SALARY (USD)"
                        value={`$${globalMetrics.avgSalaryUSD.toLocaleString()}`}
                        icon={<DollarSign size={16} />}
                        sparklineData={[30, 40, 38, 48, 52, 60]}
                        sparklineColor="#A1A1AA"
                    />
                    <KPICard
                        title="COUNTRIES"
                        value={globalMetrics.countriesCovered.toString()}
                        icon={<Globe size={16} />}
                        sparklineData={[10, 12, 11, 14, 15, 16]}
                        sparklineColor="var(--teal)"
                    />
                    <KPICard
                        title="TOP COMPANIES"
                        value={globalMetrics.totalCompanies.toString()}
                        icon={<Building2 size={16} />}
                        sparklineData={[20, 25, 24, 28, 30, 35]}
                        sparklineColor="#A1A1AA"
                    />
                </div>

                {/* Explore Markets Section */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                        <Globe className="text-[var(--accent)]" size={18} /> Explore Markets
                    </h2>
                    <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-widest font-display">
                        Click a country to explore jobs
                    </span>
                </div>

                {/* Country grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {(scannerData.countryStats || []).map((stat, idx) => (
                        <GlassCard
                            key={stat.countryCode}
                            onClick={() => setSelectedCountry(stat)}
                            className="cursor-pointer relative overflow-hidden transition-all duration-300 group hover:border-white/[0.12] hover:bg-white/[0.02]"
                        >
                            {/* Header row */}
                            <div className="flex justify-between items-center mb-5">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={`https://flagcdn.com/w40/${stat.countryCode}.png`}
                                        alt={stat.country}
                                        className="w-9 rounded border border-white/[0.08] shadow-sm"
                                    />
                                    <div>
                                        <h3 className="text-sm font-bold text-white font-display group-hover:text-[var(--accent)] transition-colors">{stat.country}</h3>
                                        <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider block mt-0.5">{stat.topCompanies.slice(0, 2).join(" Â· ")}</span>
                                    </div>
                                </div>
                                <div className="bg-[var(--teal)]/5 border border-[var(--teal)]/15 px-2.5 py-0.5 rounded-lg text-[9px] font-bold text-[var(--accent)] flex items-center gap-1 font-display uppercase tracking-widest">
                                    <TrendingUp size={11} /> +{stat.growthRate}%
                                </div>
                            </div>

                            {/* Jobs count */}
                            <div className="mb-4">
                                <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1.5 font-display">Live Positions</div>
                                <div className="text-xl font-bold font-mono text-white leading-none">
                                    {stat.totalJobs.toLocaleString()}
                                </div>
                            </div>

                            {/* Bottom stats */}
                            <div className="flex justify-between border-t border-white/[0.05] pt-3.5 mt-2.5">
                                <div>
                                    <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1 font-display">Avg Salary</div>
                                    <div className="text-xs text-zinc-300 font-bold font-mono">
                                        {formatAvgSalary(stat.avgSalary, stat.currency)}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-1 font-display">Top Skill</div>
                                    <div className="text-xs text-zinc-400 font-semibold uppercase tracking-wide font-display">
                                        {stat.topCategories[0]}
                                    </div>
                                </div>
                            </div>

                            {/* View arrow */}
                            <div className="absolute bottom-4 right-4 text-zinc-700 group-hover:text-[var(--accent)] transition-all duration-350 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                                <ArrowUpRight size={16} />
                            </div>
                        </GlassCard>
                    ))}
                </div>

                {/* Global Jobs Feed Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">
                        <Briefcase className="text-[var(--accent)]" size={18} /> Active Opportunities
                    </h2>
                    <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-widest font-display">
                        {globalFilteredJobs.length} MATCHES WORLDWIDE
                    </span>
                </div>

                {/* Global Filters Bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6 items-stretch sm:items-center">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3.5 top-3 text-zinc-500 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search global jobs, companies, skills, countries..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full h-10 bg-black/45 border border-white/[0.08] focus:border-[var(--teal)] text-white text-xs rounded-xl pl-10 pr-3.5 placeholder:text-zinc-700 outline-none transition-colors font-semibold"
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={e => setCategoryFilter(e.target.value)}
                        className="h-10 bg-black/45 border border-white/[0.08] focus:border-[var(--teal)] text-white text-xs font-bold uppercase tracking-wider rounded-xl px-3.5 outline-none transition-colors cursor-pointer"
                    >
                        <option value="All">All Categories</option>
                        {allCategories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value as "newest" | "salary")}
                        className="h-10 bg-black/45 border border-white/[0.08] focus:border-[var(--teal)] text-white text-xs font-bold uppercase tracking-wider rounded-xl px-3.5 outline-none transition-colors cursor-pointer"
                    >
                        <option value="newest">Newest First</option>
                        <option value="salary">Highest Salary</option>
                    </select>
                    <button
                        onClick={() => setRemoteFilter(!remoteFilter)}
                        className={`h-10 border rounded-xl px-4 text-xs font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 ${
                            remoteFilter 
                                ? "bg-[var(--teal)]/10 border-[var(--teal)]/35 text-[var(--accent)]" 
                                : "bg-transparent border-white/[0.08] text-zinc-400 hover:text-white"
                        }`}
                    >
                        <Zap size={13} /> Remote Only
                    </button>
                </div>

                {/* Global Job Results */}
                {globalMatched.length === 0 && globalOthers.length === 0 ? (
                    <GlassCard className="text-center py-16 border-dashed border-white/[0.06] mb-8">
                        <Search size={40} className="text-zinc-650 mx-auto mb-4" />
                        <h3 className="text-white font-display text-base font-bold mb-1">No matching global jobs found</h3>
                        <p className="text-xs text-zinc-500 font-semibold">Try adjusting your search or filters.</p>
                    </GlassCard>
                ) : (
                    <div className="flex flex-col gap-8 mb-8">
                        {globalMatched.length > 0 && (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2 border-b border-white/[0.05] pb-2">
                                    <Sparkles className="text-[var(--accent)]" size={16} />
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">Profile Matches</h3>
                                    <Badge label={`${globalMatched.length} Matches`} variant="red" size="sm" />
                                </div>
                                <div className="flex flex-col gap-4">
                                    {globalMatched.map(job => renderJobCard(job))}
                                </div>
                            </div>
                        )}

                        {globalOthers.length > 0 && (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2 border-b border-white/[0.05] pb-2">
                                    <Briefcase className="text-zinc-400" size={16} />
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">More Opportunities</h3>
                                    <span className="bg-white/[0.02] border border-white/[0.06] text-zinc-450 text-[10px] font-bold px-2 py-0.5 rounded-lg font-mono">
                                        {globalOthers.length} POSITIONS
                                    </span>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {globalOthers.map(job => renderJobCard(job))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Bottom insight */}
                <GlassCard className="p-6 border-emerald-500/10 bg-emerald-500/[0.008]">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-[var(--teal)]/10 border border-[var(--teal)]/20 text-[var(--accent)] p-2.5 rounded-xl"><Sparkles size={18} /></div>
                            <div>
                                <div className="text-xs font-bold text-white uppercase tracking-wider font-display">AI Market Insight</div>
                                <div className="text-xs text-zinc-400 mt-1 leading-relaxed font-semibold">
                                    India and UAE show the highest growth rates at +18.5% and +16.3% respectively â€” driven by fintech and AI adoption.
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                            <Star size={13} className="text-[#F59E0B] fill-[#F59E0B]" />
                            <Star size={13} className="text-[#F59E0B] fill-[#F59E0B]" />
                            <Star size={13} className="text-[#F59E0B] fill-[#F59E0B]" />
                            <Star size={13} className="text-[#F59E0B] fill-[#F59E0B]" />
                            <StarHalf size={13} className="text-[#F59E0B] fill-[#F59E0B]" />
                        </div>
                    </div>
                </GlassCard>
            </div>
        </ResumeGate>
    );
}

