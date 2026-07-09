/* eslint-disable */
"use client";
import { useState } from "react";
import { Mail, Phone, Clock, GraduationCap, Rocket, ExternalLink, Users, MessageCircle, CheckCircle, AlertTriangle, Loader2, Lock, ArrowRight, Building2, Activity, Crown, Send } from "lucide-react";
import GlassCard from "@/src/components/ui/GlassCard";
import Badge from "@/src/components/ui/Badge";
import PremiumButton from "@/src/components/ui/PremiumButton";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", subject: "General Inquiry", message: "" });
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errMsg, setErrMsg] = useState("");

    const handleSubmit = async () => {
        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            setErrMsg("Please fill in all required fields.");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(form.email)) {
            setErrMsg("Please enter a valid email address.");
            return;
        }
        
        setErrMsg("");
        setStatus("loading");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const result = await res.json();
            
            if (result.success) {
                setStatus("success");
                setForm({ name: "", email: "", subject: "General Inquiry", message: "" });
            } else {
                throw new Error(result.error || "Failed to submit message");
            }
        } catch (err: any) {
            console.error("Contact form submit error:", err);
            setStatus("error");
            setErrMsg(err.message || "Failed to send message. Please try again or email zevkapilrc@gmail.com directly.");
        }
    };

    return (
        <div className="max-w-[1100px] mx-auto px-4 pb-16 pt-4 space-y-10 animate-fade font-sans">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5 border-b border-white/[0.05] pb-6 mt-2">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#C0506A] font-display">Communication Port</span>
                        <Badge label="Direct Route" variant="red" size="sm" dot={true} />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-none font-display">
                        Get in Touch
                    </h1>
                    <p className="text-xs text-zinc-550 mt-2.5 leading-relaxed font-semibold">
                        Have questions, integration requests, or want to collaborate? Submit a message and it will be routed directly to the admin inbox.
                    </p>
                </div>
            </div>

            {/* Main Grid — Form centered, info beside */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

                {/* Left Column — Contact Info */}
                <div className="lg:col-span-2 flex flex-col gap-5">
                    {/* Quick Contact */}
                    <GlassCard className="p-6">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2 font-display border-b border-white/[0.05] pb-3">
                            <Send size={14} className="text-[#C0506A]" /> Direct Channels
                        </h3>
                        <div className="flex flex-col gap-3 font-sans">
                            <a href="tel:+919360097924" className="no-underline flex items-center justify-between bg-black/45 hover:bg-white/[0.02] border border-white/[0.06] hover:border-[#6D001A]/30 rounded-xl px-4 py-3 text-xs text-zinc-305 transition-all">
                                <span className="flex items-center gap-2">
                                    <Phone size={13} className="text-[#C0506A]" />
                                    <span className="font-semibold">+91 9360097924</span>
                                </span>
                                <span className="text-[9px] text-[#C0506A] font-bold uppercase tracking-wider font-display">Call</span>
                            </a>
                            <a href="mailto:zevkapilrc@gmail.com" className="no-underline flex items-center justify-between bg-black/45 hover:bg-white/[0.02] border border-white/[0.06] hover:border-[#6D001A]/30 rounded-xl px-4 py-3 text-xs text-zinc-305 transition-all">
                                <span className="flex items-center gap-2">
                                    <Mail size={13} className="text-[#C0506A]" />
                                    <span className="font-semibold">zevkapilrc@gmail.com</span>
                                </span>
                                <span className="text-[9px] text-[#C0506A] font-bold uppercase tracking-wider font-display">Email</span>
                            </a>
                        </div>
                    </GlassCard>

                    {/* Support SLAs */}
                    <GlassCard className="p-6">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2 font-display border-b border-white/[0.05] pb-3">
                            <Clock size={14} className="text-[#C0506A]" /> Support SLAs
                        </h3>
                        <div className="text-xs text-zinc-400 space-y-3 leading-relaxed font-semibold">
                            <div className="flex justify-between items-center">
                                <span>Monday – Friday</span>
                                <span className="text-white">9AM – 6PM IST</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Saturday</span>
                                <span className="text-white">10AM – 2PM IST</span>
                            </div>
                            <div className="pt-2">
                                <Badge label="Live Response within 24 Hours" variant="green" size="sm" dot={true} />
                            </div>
                        </div>
                    </GlassCard>

                    {/* Enterprise */}
                    <GlassCard className="p-6">
                        <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-2 flex items-center gap-2 font-display">
                            <Building2 size={14} className="text-[#C0506A]" /> Enterprise License
                        </h3>
                        <p className="text-xs text-zinc-450 leading-relaxed mb-4 font-semibold">
                            Bring HIREVIX to your university, boot camp, or hiring team with single sign-on (SSO), custom models, and ATS integration.
                        </p>
                        <button 
                            onClick={() => setForm(prev => ({ ...prev, subject: "Enterprise Licensing & Corporate Integration Inquiry" }))}
                            className="bg-transparent border-none p-0 cursor-pointer text-[10px] font-bold text-[#C0506A] hover:text-white inline-flex items-center gap-1.5 transition-colors uppercase tracking-widest font-display outline-none"
                        >
                            Request licensing blueprint <ArrowRight size={12} />
                        </button>
                    </GlassCard>

                    {/* System Pulse */}
                    <GlassCard className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center">
                                <Activity size={14} className="text-emerald-400 animate-pulse" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-white uppercase tracking-wider font-display">Services Status</div>
                                <div className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest font-mono mt-0.5">Nodemailer / Resend Active</div>
                            </div>
                        </div>
                        <Badge label="ONLINE" variant="green" size="sm" />
                    </GlassCard>
                </div>

                {/* Right Column — Message Form */}
                <div className="lg:col-span-3">
                    <GlassCard className="p-8">
                        <h2 className="text-lg font-bold text-white uppercase tracking-wider font-display mb-1.5">Send a Direct Message</h2>
                        <p className="text-xs text-zinc-450 mb-6 leading-relaxed font-semibold">
                            Your message is saved to the database and emailed to the admin in real-time.
                        </p>

                        {status === "success" ? (
                            <div className="text-center py-10 space-y-4">
                                <div className="flex justify-center">
                                    <CheckCircle size={48} className="text-emerald-400" />
                                </div>
                                <h3 className="text-sm font-bold text-emerald-450 uppercase tracking-widest font-display">Inquiry Received!</h3>
                                <p className="text-xs text-zinc-400 font-semibold">Your message was saved and dispatched. We will get back to you shortly.</p>
                                <PremiumButton onClick={() => setStatus("idle")} className="mt-4">
                                    Send Another Message
                                </PremiumButton>
                            </div>
                        ) : (
                            <div className="space-y-5 font-sans">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-zinc-450 font-bold uppercase tracking-widest font-display">Your Name *</label>
                                        <div className="flex items-center bg-black/45 border border-white/[0.08] rounded-xl px-3.5 h-10 focus-within:border-[#6D001A]/60">
                                            <input 
                                                value={form.name} 
                                                onChange={e => setForm({ ...form, name: e.target.value })} 
                                                placeholder="Full Name" 
                                                className="bg-transparent border-none text-white text-xs outline-none w-full font-semibold"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-zinc-450 font-bold uppercase tracking-widest font-display">Email Address *</label>
                                        <div className="flex items-center bg-black/45 border border-white/[0.08] rounded-xl px-3.5 h-10 focus-within:border-[#6D001A]/60">
                                            <input 
                                                type="email" 
                                                value={form.email} 
                                                onChange={e => setForm({ ...form, email: e.target.value })} 
                                                placeholder="name@domain.com" 
                                                className="bg-transparent border-none text-white text-xs outline-none w-full font-semibold"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-zinc-450 font-bold uppercase tracking-widest font-display">Subject</label>
                                    <div className="flex items-center bg-black/45 border border-white/[0.08] rounded-xl px-3.5 h-10 focus-within:border-[#6D001A]/60">
                                        <input 
                                            type="text" 
                                            value={form.subject} 
                                            onChange={e => setForm({ ...form, subject: e.target.value })} 
                                            placeholder="What is this regarding?" 
                                            className="bg-transparent border-none text-white text-xs outline-none w-full font-semibold"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-zinc-450 font-bold uppercase tracking-widest font-display">Message *</label>
                                    <textarea 
                                        rows={5} 
                                        value={form.message} 
                                        onChange={e => setForm({ ...form, message: e.target.value })} 
                                        placeholder="Tell us details..." 
                                        className="bg-black/45 border border-white/[0.08] rounded-xl p-3.5 text-xs text-white placeholder-zinc-650 resize-none outline-none leading-relaxed font-semibold w-full"
                                    />
                                </div>

                                {errMsg && (
                                    <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-3.5 text-xs text-red-405 flex gap-2 items-center font-semibold">
                                        <AlertTriangle size={14} className="flex-shrink-0" /> 
                                        <span>{errMsg}</span>
                                    </div>
                                )}

                                <PremiumButton
                                    onClick={handleSubmit}
                                    disabled={status === "loading"}
                                    className="w-full h-11 justify-center"
                                >
                                    {status === "loading" ? (
                                        <><Loader2 size={14} className="animate-spin mr-1.5" /> Dispatching...</>
                                    ) : (
                                        <><Mail size={14} className="mr-1.5" /> Send Direct Message <ArrowRight size={14} className="ml-1.5" /></>
                                    )}
                                </PremiumButton>

                                <div className="text-[9px] text-zinc-550 text-center flex items-center justify-center gap-1.5 font-bold uppercase tracking-widest font-display">
                                    <Lock size={10} /> Securely encrypted submission routed via HIREVIX nodes.
                                </div>
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>

            {/* Ecosystem Features */}
            <div className="pt-8 border-t border-white/[0.05]">
                <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
                    <div className="inline-flex items-center gap-1.5">
                        <Badge label="PLATFORM FEATURES" variant="purple" size="sm" />
                    </div>
                    <h2 className="text-2xl font-serif text-white">An Integrated Platform of Intelligence</h2>
                    <p className="text-xs text-zinc-450 leading-relaxed font-semibold">
                        HIREVIX operates a complete mesh network of analysis features to optimize your career path.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { icon: <Rocket size={18} className="text-[#C0506A]" />, title: "Resume Intelligence", desc: "Multi-format parsing that extracts, validates, and automatically powers all other modules with your true capabilities." },
                        { icon: <MessageCircle size={18} className="text-[#C0506A]" />, title: "Interview Simulator", desc: "Highly realistic, customizable mock interviews with difficulty scaling, timers, and comprehensive performance history." },
                        { icon: <Crown size={18} className="text-[#C0506A]" />, title: "Skill Gap Analyzer", desc: "Detailed breakdown of your competencies against domain benchmarks, featuring dynamic radar charts and missing-skill detection." },
                        { icon: <ExternalLink size={18} className="text-zinc-305" />, title: "Career Path & Learning AI", desc: "Generates a dynamic 6-month roadmap and curates exact courses based on the skill gaps identified in your resume." },
                        { icon: <Users size={18} className="text-[#C0506A]" />, title: "Advanced Analytics", desc: "Real-time synergy across all your data, predicting your market demand, ATS match scores, and skill mastery velocity." }
                    ].map((feat, i) => (
                        <GlassCard key={i} className="flex flex-col gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center flex-shrink-0 text-zinc-300">
                                {feat.icon}
                            </div>
                            <div className="space-y-1.5">
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">{feat.title}</h4>
                                <p className="text-[11px] text-zinc-450 leading-relaxed font-semibold">{feat.desc}</p>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </div>
    );
}
