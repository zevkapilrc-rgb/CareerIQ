"use client";

import React from "react";
import GlassCard from "./GlassCard";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className = "",
}) => {
  return (
    <GlassCard hoverLift={false} className={`flex flex-col items-center justify-center text-center p-8 md:p-12 border-dashed border-white/[0.06] ${className}`}>
      {icon && (
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/[0.02] border border-white/[0.04] text-zinc-400 mb-4 shadow-inner">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-[var(--text)] tracking-tight font-display mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-zinc-400 max-w-sm leading-relaxed mb-6">
        {description}
      </p>
      {action && <div className="flex items-center justify-center">{action}</div>}
    </GlassCard>
  );
};

export default EmptyState;
