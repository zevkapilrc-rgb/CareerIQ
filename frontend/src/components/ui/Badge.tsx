"use client";

import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "success" | "warning" | "danger" | "info" | "secondary" | "purple" | "green" | "red" | "blue" | "gray" | string;
  label?: React.ReactNode;
  size?: "sm" | "md" | "lg" | string;
  dot?: boolean;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "primary",
  label,
  size = "sm",
  dot = false,
  children,
  className = "",
  ...props
}) => {
  let styleClasses = "";
  
  const normalizedVariant = variant.toLowerCase();
  
  if (normalizedVariant === "primary" || normalizedVariant === "purple") {
    styleClasses = "bg-[var(--color-primary)]/10 text-[var(--color-accent)] border border-[var(--color-primary)]/20";
  } else if (normalizedVariant === "success" || normalizedVariant === "green") {
    styleClasses = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15";
  } else if (normalizedVariant === "warning" || normalizedVariant === "yellow") {
    styleClasses = "bg-yellow-500/10 text-yellow-400 border border-yellow-500/15";
  } else if (normalizedVariant === "danger" || normalizedVariant === "red") {
    styleClasses = "bg-red-500/10 text-red-400 border border-red-500/15";
  } else if (normalizedVariant === "info" || normalizedVariant === "blue") {
    styleClasses = "bg-[var(--color-primary)]/10 text-[var(--color-primary-light)] border border-[var(--color-primary)]/15";
  } else {
    // default/gray/secondary
    styleClasses = "bg-white/[0.04] text-zinc-400 border border-white/[0.08]";
  }

  const sizeClasses = size === "sm" ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-0.5 text-[10px]";
  const content = label || children;

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold font-sans uppercase tracking-wide rounded-md ${styleClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse opacity-80" />
      )}
      {content}
    </span>
  );
};

export default Badge;

