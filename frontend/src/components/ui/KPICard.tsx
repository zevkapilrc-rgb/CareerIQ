"use client";

import React from "react";
import GlassCard from "./GlassCard";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface KPICardProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  title?: string; // Alias for label
  value: React.ReactNode;
  suffix?: string; // Optional value suffix
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
  subtext?: React.ReactNode;
  footer?: React.ReactNode; // Alias for subtext
  glow?: boolean;
  sparklineData?: number[];
  sparklineColor?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  title,
  value,
  suffix = "",
  icon,
  trend,
  subtext,
  footer,
  glow = false,
  sparklineData,
  sparklineColor = "var(--color-primary)",
  className = "",
  ...props
}) => {
  const displayLabel = label || title || "";
  const displaySubtext = subtext || footer;

  const renderSparkline = (data?: number[], color?: string) => {
    if (!data || data.length < 2) return null;
    const width = 100;
    const height = 30;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min === 0 ? 1 : max - min;
    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2; // Add some padding
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg width="70" height="22" viewBox={`0 0 ${width} ${height}`} className="opacity-80 flex-shrink-0">
        <polyline
          fill="none"
          stroke={color || "var(--color-primary)"}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <GlassCard glow={glow} className={`flex flex-col justify-between gap-2 p-5 ${className}`} {...props}>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] font-medium tracking-wide text-zinc-400 font-sans">
            {displayLabel}
          </span>
          {icon && (
            <div className="p-1.5 rounded-lg bg-white/[0.02] text-zinc-400 border border-white/[0.05] flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-2xl font-bold tracking-tight font-mono text-[var(--text)]" style={{ fontVariantNumeric: "tabular-nums" }}>
            {value}
          </span>
          {suffix && (
            <span className="text-sm font-medium text-zinc-400 ml-0.5 font-mono">
              {suffix}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mt-1 pt-1 border-t border-white/[0.02]">
        <div className="flex-1 min-w-0">
          {trend && (
            <div
              className={`inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                trend.isPositive
                  ? "bg-emerald-500/10 text-emerald-450 border border-emerald-900/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="w-2.5 h-2.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-2.5 h-2.5 mr-0.5" />
              )}
              {trend.value}
            </div>
          )}
          {displaySubtext && !trend && (
            <div className="text-[9px] text-zinc-500 font-semibold truncate leading-relaxed">
              {displaySubtext}
            </div>
          )}
        </div>
        {sparklineData && renderSparkline(sparklineData, sparklineColor)}
      </div>
      
      {trend && displaySubtext && (
        <div className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider mt-0.5">
          {displaySubtext}
        </div>
      )}
    </GlassCard>
  );
};

export default KPICard;

