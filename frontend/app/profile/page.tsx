"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/src/state/useAppStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Lock, Pencil, Save, LogOut, Check, FileText, Briefcase, 
    Zap, GraduationCap, Mail, Phone, ExternalLink, Award, 
    Sparkles, ArrowRight, User, TrendingUp, AlertTriangle, ShieldAlert, Plus, Trash2,
    Globe, Calendar, Book, Terminal, ShieldCheck, Settings, AlertCircle,
    Download, Eye, RefreshCw, UploadCloud, MapPin, Camera, Sliders, EyeOff
} from "lucide-react";
import GlassCard from "@/src/components/ui/GlassCard";
import KPICard from "@/src/components/ui/KPICard";
import ProgressRing from "@/src/components/ui/ProgressRing";
import Badge from "@/src/components/ui/Badge";
import PremiumButton from "@/src/components/ui/PremiumButton";
import TabBar from "@/src/components/ui/TabBar";

export default function ProfilePage() {
    const { profile, updateProfile, role, logout } = useAppStore();
    const router = useRouter();
    
    const [editing, setEditing] = useState(false);
    const [saved, setSaved] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [activeSection, setActiveSection] = useState<string>("personal");

    // Resume uploading mock states
    const [loadingResume, setLoadingResume] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            useAppStore.getState().addNotification(`Selected ${e.target.files[0].name} for upload`, "info");
        }
    };

    const [form, setForm] = useState({
        name: "Kapil Dev",
        photoUrl: "", // custom uploaded base64 or URL
        avatar: "🧑",
        bio: "AI & Data Science Student",
        email: "kapil@hirevix.ai",
        phone: "9360097924",
        location: "Coimbatore, India",
        dob: "2006-03-24",
        college: "PSG College of Technology",
        degree: "B.Tech — Artificial Intelligence & Data Science",
        gradYear: "2026",
        prefJob: "AI Research Engineer",
        experience: "0",
        website: "https://kapildev.ai",
        linkedin: "https://linkedin.com/in/kapil-dev",
        github: "https://github.com/kapildev",
        
        // Section 3: Career
        dreamRole: "Staff AI Research Engineer",
        prefSalary: "$130,000/yr",
        prefCountry: "United States / Remote",
        workMode: "Remote" as "Remote" | "Hybrid" | "Onsite",
        prefIndustries: "AI Lab, Autonomous Agents, FinTech",
        
        // Section 4: Skills
        skills: ["Python", "SQL", "React", "Docker", "Communication"],
        skillRatings: {
            "Python": 10,
            "SQL": 8,
            "React": 6,
            "Docker": 7,
            "Communication": 8
        } as Record<string, number>,
        
        // Section 6: Connected Accounts
        connectedAccounts: {
            github: true,
            linkedin: true,
            google: true,
            kaggle: true,
            leetcode: true,
            hackerrank: true
        },
        
        // Section 7: Security
        twoFactorEnabled: false,
        
        // Section 8: Preferences
        theme: "dark",
        language: "english",
        notifications: true,
        privacy: true,
        autoResumeAnalysis: true,
        autoJobAlerts: true
    });

    const [skillInput, setSkillInput] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (profile) {
            const custom = profile.resumeAnalysis?.customProfileFields || {};
            setForm({
                name: profile.name || "Kapil Dev",
                photoUrl: custom.photoUrl || "",
                avatar: profile.avatar || "🧑",
                bio: profile.bio || "AI & Data Science Student",
                email: profile.email || "kapil@hirevix.ai",
                phone: profile.phone || "9360097924",
                location: custom.location || "Coimbatore, India",
                dob: custom.dob || "2006-03-24",
                college: custom.college || "PSG College of Technology",
                degree: custom.degree || "B.Tech — Artificial Intelligence & Data Science",
                gradYear: custom.gradYear || "2026",
                prefJob: custom.prefJob || "AI Research Engineer",
                experience: profile.experience?.toString() || "0",
                website: custom.website || "https://kapildev.ai",
                linkedin: custom.linkedin || "https://linkedin.com/in/kapil-dev",
                github: custom.github || "https://github.com/kapildev",
                
                dreamRole: custom.dreamRole || "Staff AI Research Engineer",
                prefSalary: custom.prefSalary || "$130,000/yr",
                prefCountry: custom.prefCountry || "United States / Remote",
                workMode: custom.workMode || "Remote",
                prefIndustries: custom.prefIndustries || "AI Lab, Autonomous Agents, FinTech",
                
                skills: profile.skills && profile.skills.length > 0 ? profile.skills : ["Python", "SQL", "React", "Docker", "Communication"],
                skillRatings: custom.skillRatings || {
                    "Python": 10,
                    "SQL": 8,
                    "React": 6,
                    "Docker": 7,
                    "Communication": 8
                },
                
                connectedAccounts: custom.connectedAccounts || {
                    github: true,
                    linkedin: true,
                    google: true,
                    kaggle: true,
                    leetcode: true,
                    hackerrank: true
                },
                
                twoFactorEnabled: custom.twoFactorEnabled || false,
                theme: custom.theme || "dark",
                language: custom.language || "english",
                notifications: custom.notifications !== undefined ? custom.notifications : true,
                privacy: custom.privacy !== undefined ? custom.privacy : true,
                autoResumeAnalysis: custom.autoResumeAnalysis !== undefined ? custom.autoResumeAnalysis : true,
                autoJobAlerts: custom.autoJobAlerts !== undefined ? custom.autoJobAlerts : true
            });
        }
    }, [profile]);

    if (!mounted) return null;

    if (role === "guest" || !profile) {
        return (
            <div className="max-w-[450px] mx-auto my-24 px-4 animate-fade">
                <GlassCard className="text-center p-8 flex flex-col items-center border-[#6D001A]/20">
                    <div className="text-red-400 mb-4 animate-pulse">
                        <Lock size={44} />
                    </div>
                    <h2 className="text-lg font-bold text-white font-display mb-2">Sign in to view your profile</h2>
                    <p className="text-xs text-zinc-450 font-semibold leading-relaxed max-w-sm mb-6">
                        Login to access your personalized career profile and AI competency command center.
                    </p>
                    <Link href="/login">
                        <PremiumButton variant="primary">
                            Sign In <ArrowRight size={14} className="ml-1" />
                        </PremiumButton>
                    </Link>
                </GlassCard>
            </div>
        );
    }

    const calcIntegrityScore = () => {
        let score = 0;
        if (form.name.trim()) score += 10;
        if (form.email.trim()) score += 10;
        if (form.phone.trim()) score += 10;
        if (form.location.trim()) score += 10;
        if (form.dob.trim()) score += 10;
        if (form.college.trim()) score += 10;
        if (form.degree.trim()) score += 10;
        if (form.skills.length > 0) score += 10;
        if (form.photoUrl || form.github || form.linkedin) score += 10;
        if (form.dreamRole.trim() && form.prefSalary.trim()) score += 10;
        return score;
    };

    const integrity = calcIntegrityScore();

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const uploadFile = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setForm(prev => ({ ...prev, photoUrl: base64String }));
                
                const analysisData = profile?.resumeAnalysis || {};
                const updatedAnalysis = {
                    ...analysisData,
                    customProfileFields: {
                        ...(analysisData.customProfileFields || {}),
                        photoUrl: base64String
                    }
                };
                updateProfile({ resumeAnalysis: updatedAnalysis });
                useAppStore.getState().addNotification("Profile picture updated successfully!", "success");
            };
            reader.readAsDataURL(uploadFile);
        }
    };

    const handleSave = () => {
        const analysisData = profile?.resumeAnalysis || {};
        const updatedAnalysis = {
            ...analysisData,
            customProfileFields: {
                photoUrl: form.photoUrl,
                location: form.location,
                dob: form.dob,
                college: form.college,
                degree: form.degree,
                gradYear: form.gradYear,
                prefJob: form.prefJob,
                website: form.website,
                linkedin: form.linkedin,
                github: form.github,
                dreamRole: form.dreamRole,
                prefSalary: form.prefSalary,
                prefCountry: form.prefCountry,
                workMode: form.workMode,
                prefIndustries: form.prefIndustries,
                skillRatings: form.skillRatings,
                connectedAccounts: form.connectedAccounts,
                twoFactorEnabled: form.twoFactorEnabled,
                theme: form.theme,
                language: form.language,
                notifications: form.notifications,
                privacy: form.privacy,
                autoResumeAnalysis: form.autoResumeAnalysis,
                autoJobAlerts: form.autoJobAlerts
            }
        };

        updateProfile({
            name: form.name,
            bio: form.bio,
            email: form.email,
            phone: form.phone,
            avatar: form.avatar,
            experience: parseInt(form.experience) || 0,
            skills: form.skills,
            education: form.degree,
            resumeAnalysis: updatedAnalysis
        });
        
        setEditing(false);
        setSaved(true);
        useAppStore.getState().addNotification("Profile changes saved successfully", "success");
        setTimeout(() => setSaved(false), 2000);
    };

    const addSkill = (s: string) => {
        const sk = s.trim();
        if (sk && !form.skills.includes(sk)) {
            const updatedSkills = [...form.skills, sk];
            setForm({
                ...form,
                skills: updatedSkills,
                skillRatings: { ...form.skillRatings, [sk]: 7 }
            });
        }
        setSkillInput("");
    };

    const removeSkill = (s: string) => {
        setForm({
            ...form,
            skills: form.skills.filter(x => x !== s)
        });
    };

    const handleSkillRatingChange = (skill: string, rating: number) => {
        setForm({
            ...form,
            skillRatings: { ...form.skillRatings, [skill]: rating }
        });
    };

    const renderProgressBar = (rating: number) => {
        return (
            <div className="flex gap-1 items-center h-1.5 flex-1 max-w-[200px]">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div 
                        key={i} 
                        className={`h-full flex-1 rounded-sm transition-all duration-300 ${
                            i < rating 
                                ? "bg-[#C0506A]" 
                                : "bg-white/[0.04]"
                        }`} 
                    />
                ))}
            </div>
        );
    };

    const toggleAccount = (key: keyof typeof form.connectedAccounts) => {
        setForm({
            ...form,
            connectedAccounts: {
                ...form.connectedAccounts,
                [key]: !form.connectedAccounts[key]
            }
        });
    };

    const detailFields = [
        { key: "name", label: "Name", type: "text", icon: <User size={14} /> },
        { key: "email", label: "Email", type: "email", icon: <Mail size={14} /> },
        { key: "phone", label: "Phone", type: "text", icon: <Phone size={14} /> },
        { key: "location", label: "Location", type: "text", icon: <MapPin size={14} /> },
        { key: "dob", label: "Date of Birth", type: "date", icon: <Calendar size={14} /> },
        { key: "college", label: "College", type: "text", icon: <GraduationCap size={14} /> },
        { key: "degree", label: "Degree", type: "text", icon: <Book size={14} /> },
        { key: "gradYear", label: "Graduation Year", type: "text", icon: <Calendar size={14} /> },
        { key: "prefJob", label: "Preferred Job", type: "text", icon: <Briefcase size={14} /> },
        { key: "experience", label: "Experience (Years)", type: "number", icon: <Zap size={14} /> },
        { key: "website", label: "Website", type: "text", icon: <Globe size={14} /> },
        { key: "linkedin", label: "LinkedIn URL", type: "text", icon: <ExternalLink size={14} /> },
        { key: "github", label: "GitHub URL", type: "text", icon: <Terminal size={14} /> }
    ];

    const tabs = [
        { id: "personal", label: "Personal Info" },
        { id: "career", label: "Career Targets" },
        { id: "skills", label: "Skills Matrix" },
        { id: "resume", label: "Resumes Sandbox" },
        { id: "accounts", label: "Integrations" },
        { id: "security", label: "Security & Keys" },
        { id: "preferences", label: "Preferences" },
        { id: "danger", label: "Danger Zone" }
    ];

    return (
        <div className="max-w-[1280px] mx-auto px-4 pb-20 pt-4 animate-fade">
            <div className="grid grid-cols-1 gap-8">
                
                {/* HEADER HERO */}
                <GlassCard className="p-6 md:p-8 relative overflow-hidden border-[#6D001A]/20">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="flex flex-col sm:flex-row gap-6 items-center">
                            
                            {/* Photo upload frame */}
                            <div className="relative group cursor-pointer" onClick={() => document.getElementById("profilePicInput")?.click()}>
                                <div className="absolute inset-0 bg-gradient-to-br from-[#6D001A] to-[#C0506A] rounded-full blur opacity-40 group-hover:opacity-75 transition-opacity duration-300" />
                                <div className="relative w-24 h-24 bg-black/40 border border-white/[0.08] rounded-full flex items-center justify-center overflow-hidden">
                                    {form.photoUrl ? (
                                        <img src={form.photoUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-3xl font-bold text-white font-display">
                                            {form.name ? form.name.trim().charAt(0).toUpperCase() : "U"}
                                        </span>
                                    )}
                                    <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[9px] text-zinc-300 font-bold tracking-widest uppercase transition-opacity">
                                        <Camera size={16} className="mb-1 text-white" />
                                        Upload
                                    </div>
                                </div>
                                <input type="file" id="profilePicInput" accept="image/*" style={{ display: "none" }} onChange={handlePhotoUpload} />
                            </div>

                            <div className="text-center sm:text-left">
                                <div className="flex items-center gap-2.5 justify-center sm:justify-start">
                                    <h2 className="text-xl font-bold text-white font-display leading-none">{form.name}</h2>
                                    <Badge label={role} variant="red" size="sm" />
                                </div>
                                
                                {editing ? (
                                    <div className="mt-2 space-y-2">
                                        <input 
                                            value={form.bio} 
                                            onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                            placeholder="Tagline bio"
                                            className="w-64 h-8 text-xs bg-black/45 border border-white/[0.08] text-white rounded-lg px-2.5 outline-none font-semibold focus:border-[#6D001A]"
                                        />
                                        <input 
                                            value={form.location} 
                                            onChange={(e) => setForm({ ...form, location: e.target.value })}
                                            placeholder="Coimbatore, India"
                                            className="w-64 h-8 text-xs bg-black/45 border border-white/[0.08] text-white rounded-lg px-2.5 outline-none font-semibold focus:border-[#6D001A]"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-xs text-[#C0506A] font-bold font-display mt-2 uppercase tracking-wide">{form.bio}</p>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1.5 flex items-center justify-center sm:justify-start gap-1 font-display">
                                            <Globe size={11} className="text-zinc-650" /> {form.location}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Completion and Actions */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto border-t lg:border-t-0 border-white/[0.05] pt-6 lg:pt-0">
                            <div className="flex items-center gap-3">
                                <ProgressRing progress={integrity} size={54} strokeWidth={4.5} color="#C0506A" glow={true} />
                                <div>
                                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block font-display">Profile Integrity</span>
                                    <span className="text-[9px] text-[#C0506A] font-extrabold uppercase tracking-wide font-display mt-0.5">{integrity === 100 ? "Fully verified" : `${integrity}% complete`}</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-center sm:items-end gap-3 w-full sm:w-auto">
                                <div className="text-right">
                                    <div className="flex gap-0.5 text-amber-500 justify-center sm:justify-end mb-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span key={i}>★</span>
                                        ))}
                                    </div>
                                    <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest font-display block">HIREVIX INDEX 92</span>
                                </div>

                                <div>
                                    {editing ? (
                                        <div className="flex gap-2">
                                            <PremiumButton onClick={handleSave} className="h-8 px-4 text-xs font-bold font-display">
                                                <Save size={12} className="mr-1" /> Save Details
                                            </PremiumButton>
                                            <PremiumButton onClick={() => setEditing(false)} variant="ghost" className="h-8 px-4 text-xs font-bold font-display">
                                                Cancel
                                            </PremiumButton>
                                        </div>
                                    ) : (
                                        <PremiumButton onClick={() => setEditing(true)} variant="secondary" className="h-8 px-4 text-xs font-bold font-display">
                                            <Pencil size={12} className="mr-1" /> Edit Profile
                                        </PremiumButton>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* TABS */}
                <TabBar
                    tabs={tabs}
                    activeTab={activeSection}
                    onChange={(id) => setActiveSection(id)}
                />

                {/* TAB WINDOWS */}
                <div className="transition-all duration-300">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeSection === "personal" && (
                                <GlassCard className="p-6">
                                    <div className="flex items-center gap-2.5 mb-6 border-b border-white/[0.05] pb-4">
                                        <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[#C0506A]"><User size={16} /></div>
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-white font-display">Personal Identity</h3>
                                            <p className="text-[10px] text-zinc-550 font-semibold font-sans mt-0.5">Standard contact credentials and identity verification metrics.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {detailFields.map((f) => (
                                            <div key={f.key} className="space-y-1.5">
                                                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block font-display">{f.label}</label>
                                                {editing ? (
                                                    <div className="flex items-center gap-2 bg-black/45 border border-white/[0.08] rounded-xl px-3.5 h-10 focus-within:border-[#6D001A]/60">
                                                        <div className="text-zinc-500 flex-shrink-0">
                                                            {f.icon}
                                                        </div>
                                                        <input
                                                            type={f.type}
                                                            value={(form as any)[f.key]}
                                                            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                                                            className="bg-transparent border-none text-white text-xs outline-none w-full font-semibold"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.005] hover:bg-white/[0.015] hover:border-white/[0.08] transition-colors">
                                                        <div className="text-zinc-400 flex-shrink-0">
                                                            {f.icon}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <span className="text-xs font-semibold text-zinc-300 block truncate select-all font-mono">
                                                                {(form as any)[f.key] || <span className="text-zinc-650 italic">Not Specified</span>}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            )}

                            {activeSection === "career" && (
                                <GlassCard className="p-6">
                                    <div className="flex items-center gap-2.5 mb-6 border-b border-white/[0.05] pb-4">
                                        <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[#C0506A]"><TrendingUp size={16} /></div>
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-white font-display">Career Targets</h3>
                                            <p className="text-[10px] text-zinc-550 font-semibold font-sans mt-0.5">Desired target roles, salary bands, and environmental settings.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                                        {[
                                            { key: "dreamRole", label: "Dream Role", icon: <Briefcase size={14} /> },
                                            { key: "prefSalary", label: "Preferred Salary Target", icon: <Zap size={14} /> },
                                            { key: "prefCountry", label: "Preferred Country", icon: <Globe size={14} /> },
                                            { key: "prefIndustries", label: "Preferred Sectors", icon: <Sliders size={14} /> }
                                        ].map((c) => (
                                            <div key={c.key} className="space-y-1.5">
                                                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block font-display">{c.label}</label>
                                                {editing ? (
                                                    <div className="flex items-center gap-2 bg-black/45 border border-white/[0.08] rounded-xl px-3.5 h-10 focus-within:border-[#6D001A]/60">
                                                        <div className="text-zinc-500 flex-shrink-0">
                                                            {c.icon}
                                                        </div>
                                                        <input
                                                            value={(form as any)[c.key]}
                                                            onChange={(e) => setForm({ ...form, [c.key]: e.target.value })}
                                                            className="bg-transparent border-none text-white text-xs outline-none w-full font-semibold"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.005] hover:bg-white/[0.015] hover:border-white/[0.08] transition-colors">
                                                        <div className="text-zinc-400 flex-shrink-0">
                                                            {c.icon}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <span className="text-xs font-semibold text-zinc-300 block truncate">
                                                                {(form as any)[c.key] || <span className="text-zinc-655 italic">Not Specified</span>}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block font-display mb-1.5">Work Mode Preference</label>
                                        <div className="flex gap-2">
                                            {["Remote", "Hybrid", "Onsite"].map((modeOpt) => {
                                                const active = form.workMode === modeOpt;
                                                return (
                                                    <button
                                                        key={modeOpt}
                                                        disabled={!editing}
                                                        onClick={() => setForm({ ...form, workMode: modeOpt as any })}
                                                        className={`flex-1 max-w-[120px] py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 outline-none ${
                                                            active 
                                                                ? "bg-[#6D001A] border-[#C0506A] text-white shadow-md" 
                                                                : "bg-transparent border-white/[0.08] text-zinc-400 hover:text-zinc-200"
                                                        } ${!editing ? "cursor-not-allowed" : "cursor-pointer"}`}
                                                    >
                                                        {modeOpt}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </GlassCard>
                            )}

                            {activeSection === "skills" && (
                                <GlassCard className="p-6">
                                    <div className="flex items-center gap-2.5 mb-6 border-b border-white/[0.05] pb-4">
                                        <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[#C0506A]"><Sliders size={16} /></div>
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-white font-display">Skills Matrix</h3>
                                            <p className="text-[10px] text-zinc-550 font-semibold font-sans mt-0.5">Verify competency level ratings and customize visual indicator sliders.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 max-w-[550px]">
                                        {form.skills.map((skill) => {
                                            const rating = form.skillRatings[skill] || 7;
                                            return (
                                                <div key={skill} className="flex items-center justify-between gap-4 p-3 bg-white/[0.01] border border-white/[0.05] rounded-xl">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-zinc-250 font-mono tracking-wide capitalize">{skill}</span>
                                                        {editing && (
                                                            <span className="text-[9px] text-zinc-550 font-semibold uppercase tracking-wider mt-0.5">Slide to mutate</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        {renderProgressBar(rating)}
                                                        {editing ? (
                                                            <input
                                                                type="range"
                                                                min="1"
                                                                max="10"
                                                                value={rating}
                                                                onChange={(e) => handleSkillRatingChange(skill, parseInt(e.target.value))}
                                                                className="w-20 cursor-ew-resize accent-[#C0506A]"
                                                            />
                                                        ) : (
                                                            <span className="text-xs font-bold font-mono text-[#C0506A]">{rating}/10</span>
                                                        )}
                                                        {editing && (
                                                            <button
                                                                onClick={() => removeSkill(skill)}
                                                                className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                                                            >
                                                                <Trash2 size={12} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {editing && (
                                        <div className="flex items-center gap-2 mt-6 max-w-[400px]">
                                            <input
                                                value={skillInput}
                                                onChange={(e) => setSkillInput(e.target.value)}
                                                placeholder="Add skill node (e.g. Kubernetes)"
                                                className="flex-1 h-9 bg-black/45 border border-white/[0.08] text-white text-xs rounded-xl px-3 outline-none font-semibold focus:border-[#6D001A]"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        addSkill(skillInput);
                                                    }
                                                }}
                                            />
                                            <PremiumButton onClick={() => addSkill(skillInput)} className="h-9 px-4 text-xs">
                                                <Plus size={12} className="mr-1" /> Add
                                            </PremiumButton>
                                        </div>
                                    )}
                                </GlassCard>
                            )}

                            {activeSection === "resume" && (
                                <GlassCard className="p-6">
                                    <div className="flex items-center gap-2.5 mb-6 border-b border-white/[0.05] pb-4">
                                        <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[#C0506A]"><FileText size={16} /></div>
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-white font-display">Resumes Sandbox</h3>
                                            <p className="text-[10px] text-zinc-550 font-semibold font-sans mt-0.5">Manage active PDFs, upload revisions, and trace historical evaluations.</p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl border border-white/[0.06] bg-black/40 max-w-[650px] mb-6">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-[#6D001A]/10 border border-[#6D001A]/20 flex items-center justify-center">
                                                    <FileText size={18} className="text-[#C0506A]" />
                                                </div>
                                                <div>
                                                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block font-display">Active Blueprint File</span>
                                                    <span className="text-xs font-bold text-zinc-300 font-mono">resume.pdf</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                                                <Link href="/resume">
                                                    <PremiumButton variant="ghost" className="h-8 text-xs">
                                                        <Eye size={12} className="mr-1" /> View Scanner
                                                    </PremiumButton>
                                                </Link>
                                                <PremiumButton variant="secondary" className="h-8 text-xs" onClick={() => useAppStore.getState().addNotification("Downloading document...", "info")}>
                                                    <Download size={12} className="mr-1" /> Download
                                                </PremiumButton>
                                                <button onClick={() => useAppStore.getState().addNotification("Resume configuration cleared.", "warning")} className="h-8 px-3.5 rounded-xl border border-red-500/10 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-bold transition-colors">
                                                    Clear
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block font-display">Upload Sandbox</label>
                                        <div className="border border-dashed border-white/[0.08] hover:border-[#6D001A]/50 bg-black/15 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors max-w-[500px]" onClick={() => document.getElementById("profileResumeInput")?.click()}>
                                            <UploadCloud size={28} className="text-[#C0506A] mb-2" />
                                            <span className="text-xs text-zinc-400 font-semibold mb-1">Drag file here or click to scan</span>
                                            <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider font-mono">PDF, DOCX, DOC (MAX 10MB)</span>
                                            <input id="profileResumeInput" type="file" onChange={handleFileChange} style={{ display: "none" }} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest block font-display mb-3">Historical Reports</label>
                                        <div className="space-y-2 max-w-[650px]">
                                            {[
                                                { ver: "v4.0 (Active)", date: "2026-07-03", score: 92, status: "Evaluated" },
                                                { ver: "v3.2", date: "2026-05-18", score: 85, status: "Archived" },
                                                { ver: "v2.0", date: "2026-02-12", score: 72, status: "Archived" }
                                            ].map((hist) => (
                                                <div key={hist.ver} className="flex justify-between items-center p-3 rounded-xl border border-white/[0.05] bg-white/[0.005] text-xs font-mono">
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold text-white">{hist.ver}</span>
                                                        <span className="text-zinc-700">|</span>
                                                        <span className="text-zinc-500">{hist.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="font-bold text-[#C0506A]">{hist.score} Score</span>
                                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/[0.02] border border-white/[0.06] text-zinc-500 uppercase tracking-widest">{hist.status}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </GlassCard>
                            )}

                            {activeSection === "accounts" && (
                                <GlassCard className="p-6">
                                    <div className="flex items-center gap-2.5 mb-6 border-b border-white/[0.05] pb-4">
                                        <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[#C0506A]"><ShieldCheck size={16} /></div>
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-white font-display">Sandbox Integrations</h3>
                                            <p className="text-[10px] text-zinc-550 font-semibold font-sans mt-0.5">Integrate third-party portfolio networks to verify developer metrics.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                                        {[
                                            { key: "github" as const, label: "GitHub" },
                                            { key: "linkedin" as const, label: "LinkedIn" },
                                            { key: "google" as const, label: "Google" },
                                            { key: "kaggle" as const, label: "Kaggle" },
                                            { key: "leetcode" as const, label: "LeetCode" },
                                            { key: "hackerrank" as const, label: "HackerRank" }
                                        ].map((acc) => {
                                            const connected = form.connectedAccounts[acc.key];
                                            return (
                                                <button
                                                    key={acc.key}
                                                    disabled={!editing}
                                                    onClick={() => toggleAccount(acc.key)}
                                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-300 outline-none ${
                                                        connected 
                                                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                                                            : "bg-transparent border-white/[0.08] text-zinc-650 hover:text-zinc-350"
                                                    } ${!editing ? "cursor-not-allowed" : "cursor-pointer"}`}
                                                >
                                                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center mb-2.5 transition-colors ${
                                                        connected ? "border-emerald-500/20 bg-emerald-500/10" : "border-white/[0.08] bg-black/40"
                                                    }`}>
                                                        {connected ? <Check size={13} className="text-emerald-450" /> : <Plus size={13} />}
                                                    </div>
                                                    <span className="text-xs font-bold font-mono uppercase tracking-wider">{acc.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </GlassCard>
                            )}

                            {activeSection === "security" && (
                                <GlassCard className="p-6">
                                    <div className="flex items-center gap-2.5 mb-6 border-b border-white/[0.05] pb-4">
                                        <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[#C0506A]"><Lock size={16} /></div>
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-white font-display">Security Configurations</h3>
                                            <p className="text-[10px] text-zinc-550 font-semibold font-sans mt-0.5">Reset developer credentials, activate 2FA shield, and audit devices.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4 md:border-r md:border-white/[0.05] md:pr-8">
                                            <label className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest block font-display">Credential Validation</label>
                                            <div className="space-y-1.5">
                                                <span className="text-[9px] text-zinc-500 font-bold uppercase block tracking-wider">Account Email</span>
                                                <input value={form.email} disabled className="w-full h-10 bg-black/20 border border-white/[0.05] text-zinc-500 text-xs rounded-xl px-3.5 cursor-not-allowed font-semibold" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <span className="text-[9px] text-zinc-500 font-bold uppercase block tracking-wider">Update Password</span>
                                                <input type="password" placeholder="••••••••••••" className="w-full h-10 bg-black/45 border border-white/[0.08] text-white text-xs rounded-xl px-3.5 outline-none focus:border-[#6D001A]" />
                                            </div>
                                            <PremiumButton variant="secondary" className="h-9 px-4 text-xs">
                                                Confirm Reset
                                            </PremiumButton>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest block font-display mb-2">Two-Factor Authentication (2FA)</label>
                                                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.005] border border-white/[0.05]">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-xs font-bold text-zinc-300">2FA Authenticator Shield</span>
                                                        <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">Adds verification check during logins</span>
                                                    </div>
                                                    <button
                                                        disabled={!editing}
                                                        onClick={() => setForm({ ...form, twoFactorEnabled: !form.twoFactorEnabled })}
                                                        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 relative outline-none ${
                                                            form.twoFactorEnabled ? "bg-[#C0506A]" : "bg-white/[0.08]"
                                                        } ${!editing ? "cursor-not-allowed" : "cursor-pointer"}`}
                                                    >
                                                        <motion.div 
                                                            animate={{ x: form.twoFactorEnabled ? 16 : 0 }} 
                                                            className="w-3.5 h-3.5 rounded-full bg-white shadow-md"
                                                        />
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest block font-display mb-2.5">Logged-In Devices</label>
                                                <div className="space-y-2 text-xs font-mono">
                                                    <div className="flex justify-between items-center p-3 rounded-xl bg-black/40 border border-white/[0.06]">
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="font-bold text-zinc-300">Chrome (Desktop Windows) — Active</span>
                                                            <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Coimbatore, India · 127.0.0.1</span>
                                                        </div>
                                                        <span className="text-[9px] font-bold text-emerald-450 uppercase tracking-widest font-display">Current</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            )}

                            {activeSection === "preferences" && (
                                <GlassCard className="p-6">
                                    <div className="flex items-center gap-2.5 mb-6 border-b border-white/[0.05] pb-4">
                                        <div className="p-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[#C0506A]"><Settings size={16} /></div>
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-white font-display">Preferences</h3>
                                            <p className="text-[10px] text-zinc-550 font-semibold font-sans mt-0.5">Configure system-wide setups, automation parameters, and privacy modes.</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <span className="text-[9px] font-bold text-zinc-500 uppercase block tracking-widest font-display">Interface Theme</span>
                                                <select 
                                                    disabled={!editing}
                                                    value={form.theme}
                                                    onChange={(e) => setForm({ ...form, theme: e.target.value })}
                                                    className="w-full max-w-[200px] h-9 bg-black/45 border border-white/[0.08] text-white text-xs font-bold uppercase tracking-wider rounded-xl px-3 outline-none cursor-pointer"
                                                >
                                                    <option value="dark">Dark Mode (Default)</option>
                                                    <option value="light">Light Mode</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1.5">
                                                <span className="text-[9px] font-bold text-zinc-500 uppercase block tracking-widest font-display">System Language</span>
                                                <select 
                                                    disabled={!editing}
                                                    value={form.language}
                                                    onChange={(e) => setForm({ ...form, language: e.target.value })}
                                                    className="w-full max-w-[200px] h-9 bg-black/45 border border-white/[0.08] text-white text-xs font-bold uppercase tracking-wider rounded-xl px-3 outline-none cursor-pointer"
                                                >
                                                    <option value="english">English (US)</option>
                                                    <option value="tamil">Tamil (தமிழ்)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-3.5">
                                            {[
                                                { key: "notifications" as const, label: "In-App Notification Alerts", desc: "Triggers sidebar signals & inbox notices" },
                                                { key: "privacy" as const, label: "Search Engine Privacy Mode", desc: "Hides resume credentials from public index tools" },
                                                { key: "autoResumeAnalysis" as const, label: "Auto Document Evaluation", desc: "Runs instant parser diagnostics upon uploading files" },
                                                { key: "autoJobAlerts" as const, label: "Realtime Opportunity Alert", desc: "Notifies matching listings in system ticker instantly" }
                                            ].map((pref) => (
                                                <div key={pref.key} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.005] border border-white/[0.05]">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-xs font-bold text-zinc-300">{pref.label}</span>
                                                        <span className="text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">{pref.desc}</span>
                                                    </div>
                                                    <button
                                                        disabled={!editing}
                                                        onClick={() => setForm({ ...form, [pref.key]: !form[pref.key] })}
                                                        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 relative outline-none ${
                                                            form[pref.key] ? "bg-[#C0506A]" : "bg-white/[0.08]"
                                                        } ${!editing ? "cursor-not-allowed" : "cursor-pointer"}`}
                                                    >
                                                        <motion.div 
                                                            animate={{ x: form[pref.key] ? 16 : 0 }} 
                                                            className="w-3.5 h-3.5 rounded-full bg-white shadow-md"
                                                        />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </GlassCard>
                            )}

                            {activeSection === "danger" && (
                                <GlassCard className="p-6 border-red-500/10 bg-red-500/[0.005]">
                                    <div className="flex items-center gap-2.5 mb-6 border-b border-red-500/10 pb-4">
                                        <div className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400"><AlertCircle size={16} /></div>
                                        <div>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-red-200 font-display">Danger Zone</h3>
                                            <p className="text-[10px] text-red-400/70 font-semibold font-sans mt-0.5">Irreversible data purge operations & profile termination workflows.</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-5 justify-between items-start sm:items-center">
                                        <div className="space-y-1">
                                            <span className="text-xs font-bold text-zinc-350 block">Terminate Profile & Backups</span>
                                            <p className="text-[10px] text-zinc-500 leading-relaxed font-semibold max-w-md">
                                                Deleting your active resume or terminating the account deletes all verified credentials, DNA records, and search matching pipelines permanently.
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                                            <button 
                                                onClick={() => {
                                                    if (confirm("Delete resume configuration completely?")) {
                                                        useAppStore.getState().addNotification("Active resume deleted", "warning");
                                                    }
                                                }}
                                                className="h-9 px-4 text-xs font-bold bg-white/[0.02] border border-white/[0.08] hover:border-red-500/20 text-zinc-400 hover:text-red-400 rounded-xl transition-all font-display uppercase tracking-wider"
                                            >
                                                Delete Resume
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    if (confirm("Warning! This deletes your complete Hirevix account data. This action is irreversible. Proceed?")) {
                                                        logout();
                                                        router.push("/login");
                                                    }
                                                }}
                                                className="h-9 px-4 text-xs font-bold bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-xl transition-all font-display uppercase tracking-wider"
                                            >
                                                Delete Account
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    logout();
                                                    router.push("/login");
                                                }}
                                                className="h-9 px-4 text-xs font-bold bg-[#6D001A] hover:bg-[#8B0025] text-white rounded-xl transition-all font-display uppercase tracking-wider"
                                            >
                                                <LogOut size={12} className="mr-1.5 inline" /> Logout
                                            </button>
                                        </div>
                                    </div>
                                </GlassCard>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}
