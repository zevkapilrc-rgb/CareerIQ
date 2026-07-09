"use client";

import React from "react";
import GlassCard from "./GlassCard";
import PremiumButton from "./PremiumButton";
import { AlertCircle, RotateCcw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "An Error Occurred",
  message,
  onRetry,
  icon = <AlertCircle className="w-6 h-6 text-red-400" />,
  className = "",
}) => {
  return (
    <GlassCard hoverLift={false} className={`flex flex-col items-center justify-center text-center p-8 border-red-950/20 bg-red-950/[0.02] ${className}`}>
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mb-4 shadow-sm">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-[var(--text)] tracking-tight font-display mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-zinc-400 max-w-sm leading-relaxed mb-6">
        {message}
      </p>
      {onRetry && (
        <PremiumButton variant="secondary" size="sm" onClick={onRetry}>
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Retry Request
        </PremiumButton>
      )}
    </GlassCard>
  );
};

export default ErrorState;
