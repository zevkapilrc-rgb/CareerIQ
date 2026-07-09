"use client";

import React from "react";

interface PremiumLoaderProps {
  message?: string;
  submessage?: string;
  className?: string;
}

export function PremiumLoader({
  message = "CALIBRATING COGNITIVE CORE",
  submessage = "Synchronizing environment workspace...",
  className = "",
}: PremiumLoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center min-h-[260px] w-full relative overflow-hidden ${className}`} style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Spinner Container */}
      <div style={{ width: "96px", height: "96px", position: "relative", marginBottom: "20px" }}>
        
        {/* Outer dashed ring (clockwise) */}
        <div style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: "1.5px dashed var(--color-primary-light)",
          opacity: 0.5,
          animation: "premiumSpinCw 8s linear infinite"
        }} />
        
        {/* Mid double ring (counter-clockwise) */}
        <div style={{
          position: "absolute",
          inset: "10px",
          borderRadius: "50%",
          border: "2px double var(--color-primary-light)",
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          opacity: 0.8,
          animation: "premiumSpinCcw 5s linear infinite"
        }} />
        
        {/* Center glowing indicator (pulsing) */}
        <div style={{
          position: "absolute",
          inset: "24px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(122, 23, 48, 0.15) 0%, transparent 80%)",
          border: "1px solid rgba(122, 23, 48, 0.3)",
          animation: "premiumPulse 2s ease-in-out infinite"
        }} />
        
        {/* Logo/Icon */}
        <div style={{
          position: "absolute",
          inset: "28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            width: "38px",
            height: "38px",
            borderRadius: "6px",
            backgroundColor: "rgba(122, 23, 48, 0.1)",
            border: "1px solid rgba(122, 23, 48, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-primary-light)",
            fontFamily: "Sora, sans-serif",
            fontWeight: "bold",
            fontSize: "11px",
            letterSpacing: "-0.05em"
          }}>
            HV
          </div>
        </div>
      </div>

      {/* Message Label */}
      <h3 style={{
        fontFamily: "Sora, sans-serif",
        fontSize: "12px",
        color: "var(--text)",
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        margin: "0 0 6px 0",
        animation: "premiumPulseText 1.5s ease-in-out infinite"
      }}>
        {message}
      </h3>
      {submessage && (
        <p style={{
          fontFamily: "Space Mono, monospace",
          fontSize: "9px",
          color: "var(--text-muted)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          margin: 0
        }}>
          {submessage}
        </p>
      )}

      {/* Keyframe Styles via standard HTML style block to prevent styled-jsx compile dependency */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes premiumSpinCw {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes premiumSpinCcw {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes premiumPulse {
          0%, 100% { transform: scale(0.95); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes premiumPulseText {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}} />
    </div>
  );
}

export default PremiumLoader;

