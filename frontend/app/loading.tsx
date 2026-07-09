"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Loading() {
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "#050506",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                overflow: "hidden",
                fontFamily: "Inter, sans-serif"
            }}
        >
            {/* Ambient Tech Grid Background */}
            <div style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "linear-gradient(rgba(109, 0, 26, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(109, 0, 26, 0.03) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
                zIndex: 0,
                pointerEvents: "none"
            }} />

            {/* Glowing Accent Spotlights */}
            <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "600px",
                height: "600px",
                background: "radial-gradient(circle, rgba(109, 0, 26, 0.08) 0%, transparent 70%)",
                zIndex: 0,
                pointerEvents: "none"
            }} />

            {/* Main Interactive Load Unit */}
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                
                {/* Custom Tech Rotating Calibrator */}
                <div style={{ position: "relative", width: "120px", height: "120px", marginBottom: "30px" }}>
                    
                    {/* Outer clockwise ring */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: "50%",
                            border: "1.5px dashed rgba(109, 0, 26, 0.4)",
                        }}
                    />

                    {/* Mid counter-clockwise ring with gaps */}
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                        style={{
                            position: "absolute",
                            inset: "10px",
                            borderRadius: "50%",
                            border: "2px double #FCA5A5",
                            borderLeftColor: "transparent",
                            borderRightColor: "transparent",
                            opacity: 0.8
                        }}
                    />

                    {/* Inner glowing pulse ring */}
                    <motion.div
                        animate={{ scale: [0.95, 1.05, 0.95] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        style={{
                            position: "absolute",
                            inset: "24px",
                            borderRadius: "50%",
                            background: "radial-gradient(circle, rgba(109, 0, 26, 0.15) 0%, transparent 80%)",
                            border: "1px solid rgba(109, 0, 26, 0.2)"
                        }}
                    />

                    {/* Center Logo Icon */}
                    <div style={{
                        position: "absolute",
                        inset: "30px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <Image
                            src="/logo.png"
                            alt="HIREVIX Logo"
                            width={40}
                            height={40}
                            style={{ borderRadius: "8px", boxShadow: "0 4px 20px rgba(109, 0, 26, 0.3)" }}
                            priority
                        />
                    </div>
                </div>

                {/* Typography Labels */}
                <div style={{ textAlign: "center" }}>
                    <h2 style={{
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        color: "#F4F4F5",
                        fontFamily: "Sora, sans-serif",
                        margin: 0
                    }}>
                        HIREVIX
                    </h2>
                    <p style={{
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        letterSpacing: "0.2em",
                        color: "#52525B",
                        textTransform: "uppercase",
                        margin: "4px 0 0 0"
                    }}>
                        Loading Workspace...
                    </p>
                </div>
            </div>
        </div>
    );
}
