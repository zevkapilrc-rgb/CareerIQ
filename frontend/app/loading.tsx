"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const LOADING_STEPS = [
    "Initializing AI Engine…",
    "Loading Career Intelligence…",
    "Preparing your workspace…",
];

export default function Loading() {
    const [stepIdx, setStepIdx] = useState(0);

    useEffect(() => {
        const iv = setInterval(() => {
            setStepIdx(i => (i + 1) % LOADING_STEPS.length);
        }, 900);
        return () => clearInterval(iv);
    }, []);

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "#080810",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                overflow: "hidden",
            }}
        >
            {/* ── Advanced Ambient Background (Optimized) ── */}
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", background: "#05050A" }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, #0f172a 0%, #000000 100%)" }} />
                
                {/* Deep space grid */}
                <div 
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.15,
                        backgroundImage: "linear-gradient(rgba(167,139,250,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(167,139,250,0.15) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                        transform: "perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(-200px)",
                        transformOrigin: "top center",
                    }}
                />

                {/* Dynamic Orbs (Optimized - No Blur Filter) */}
                <motion.div
                    animate={{ x: [-50, 50, -50], y: [-30, 30, -30], scale: [1, 1.1, 1] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: "absolute", top: "15%", left: "15%",
                        width: "50vw", height: "50vw", maxWidth: 600, maxHeight: 600, borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%)",
                    }}
                />
                <motion.div
                    animate={{ x: [50, -50, 50], y: [30, -30, 30], scale: [1, 1.1, 1] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: "absolute", bottom: "15%", right: "15%",
                        width: "50vw", height: "50vw", maxWidth: 600, maxHeight: 600, borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(147,51,234,0.1) 0%, transparent 70%)",
                    }}
                />
            </div>

            {/* ── Favicon Logo + Wordmark ── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 48, position: "relative", zIndex: 1 }}
            >
                {/* Favicon Q icon with glow */}
                <div style={{ position: "relative", marginBottom: 20 }}>
                    <motion.div
                        animate={{ opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            position: "absolute", inset: -16, borderRadius: "50%",
                            background: "radial-gradient(circle, rgba(99,102,241,0.4), transparent 70%)",
                            filter: "blur(14px)",
                        }}
                    />
                    <motion.img
                        src="/logo-favicon.png"
                        alt="CareerIQ"
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            width: 42, height: 42, objectFit: "contain", position: "relative", zIndex: 1,
                            filter: "drop-shadow(0 4px 20px rgba(99,102,241,0.5))",
                        }}
                    />
                </div>

                {/* CSS Wordmark */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
                    style={{
                        fontSize: "2rem",
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                        background: "linear-gradient(135deg, #ffffff 40%, #a78bfa 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        lineHeight: 1,
                    }}
                >
                    CareerIQ
                </motion.div>

                {/* Tagline */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    style={{
                        fontSize: "0.58rem",
                        fontWeight: 700,
                        letterSpacing: "0.22em",
                        color: "#a78bfa",
                        marginTop: 6,
                    }}
                >
                    NAVIGATE YOUR FUTURE
                </motion.div>
            </motion.div>

            {/* ── Progress bar ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ width: 220, position: "relative", zIndex: 1 }}
            >
                {/* Track */}
                <div style={{
                    width: "100%", height: 2, borderRadius: 4,
                    background: "rgba(255,255,255,0.07)",
                    overflow: "hidden",
                    marginBottom: 14,
                }}>
                    {/* Animated fill */}
                    <motion.div
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            width: "60%", height: "100%",
                            background: "linear-gradient(90deg, transparent, #7c3aed, #a78bfa, transparent)",
                            borderRadius: 4,
                        }}
                    />
                </div>

                {/* Step text */}
                <motion.div
                    key={stepIdx}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        textAlign: "center",
                        fontSize: "0.72rem",
                        color: "rgba(255,255,255,0.35)",
                        letterSpacing: "0.04em",
                    }}
                >
                    {LOADING_STEPS[stepIdx]}
                </motion.div>
            </motion.div>

            {/* ── Dot pulse indicator ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{ display: "flex", gap: 8, marginTop: 28, position: "relative", zIndex: 1 }}
            >
                {[0, 1, 2].map(i => (
                    <motion.div
                        key={i}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                        style={{
                            width: 5, height: 5, borderRadius: "50%",
                            background: "linear-gradient(135deg,#7c3aed,#a78bfa)",
                        }}
                    />
                ))}
            </motion.div>
        </div>
    );
}
