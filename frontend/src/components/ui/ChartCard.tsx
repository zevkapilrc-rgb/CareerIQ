"use client";

import React from "react";
import GlassCard from "./GlassCard";

interface ChartCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  extra,
  children,
  className = "",
  ...props
}) => {
  return (
    <GlassCard hoverLift={false} className={`flex flex-col gap-4 ${className}`} {...props}>
      <div className="flex items-center justify-between w-full border-b border-white/[0.04] pb-3">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-sm font-bold text-[var(--text)] tracking-tight font-display">
            {title}
          </h3>
          {subtitle && (
            <span className="text-xs text-zinc-400">
              {subtitle}
            </span>
          )}
        </div>
        {extra && <div className="flex items-center">{extra}</div>}
      </div>
      <div className="w-full relative flex items-center justify-center min-h-[220px]">
        {children}
      </div>
    </GlassCard>
  );
};

export default ChartCard;
