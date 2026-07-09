"use client";

import React from "react";
import GlassCard from "./GlassCard";
import { CheckCircle } from "lucide-react";

interface SuccessStateProps {
  title: string;
  message: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  title,
  message,
  action,
  icon = <CheckCircle className="w-6 h-6 text-emerald-400" />,
  className = "",
}) => {
  return (
    <GlassCard hoverLift={false} className={`flex flex-col items-center justify-center text-center p-8 border-emerald-950/20 bg-emerald-950/[0.01] ${className}`}>
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 shadow-sm">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-[var(--text)] tracking-tight font-display mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-zinc-400 max-w-sm leading-relaxed mb-6">
        {message}
      </p>
      {action && <div className="flex items-center justify-center">{action}</div>}
    </GlassCard>
  );
};

export default SuccessState;
